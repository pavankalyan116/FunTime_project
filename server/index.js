import "dotenv/config";
import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import Groq, { toFile } from "groq-sdk";

const app = express();

/* =====================
   CONFIG
===================== */
const PORT = process.env.PORT || 5002;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const MOCK_MODE = !GROQ_API_KEY;

if (MOCK_MODE) {
  console.warn("⚠️ GROQ_API_KEY missing. Server running in MOCK MODE.");
}

/* =====================
   CORS
===================== */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      try {
        const url = new URL(origin);
        const host = url.hostname;
        const isLocalhost = host === "localhost";
        const isRender = host.endsWith(".onrender.com");
        const isGithubPages = host.endsWith("github.io");
        const explicit = origin === "https://funtime-project.onrender.com" || origin === "https://pavankalyan116.github.io";
        if (isLocalhost || isRender || isGithubPages || explicit) {
          return callback(null, true);
        }
      } catch {}
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
  })
);

app.use(express.json());

/* =====================
   PREFLIGHT HANDLER
===================== */
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (origin) res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

/* =====================
   FILE UPLOAD SETUP
===================== */
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      ".flac", ".mp3", ".mp4", ".mpeg", ".mpga", ".m4a",
      ".ogg", ".opus", ".wav", ".webm"
    ];
    const name = (file.originalname || "").toLowerCase();
    const byMime = file.mimetype?.startsWith("audio/");
    const byExt = allowed.some(ext => name.endsWith(ext));
    if (byMime || byExt) cb(null, true);
    else cb(new Error("Only audio files are allowed"), false);
  }
});

/* =====================
   GROQ CLIENT
===================== */
let groq;
if (!MOCK_MODE) {
  groq = new Groq({ apiKey: GROQ_API_KEY });
}

const recentJokes = [];
const normalizeText = (t) =>
  (t || "").toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
const isDuplicateJoke = (t) => {
  const n = normalizeText(t);
  return recentJokes.some((r) => normalizeText(r) === n);
};
const rememberJoke = (t) => {
  if (!t) return;
  recentJokes.unshift(t);
  if (recentJokes.length > 50) recentJokes.pop();
};

/* =====================
   ROUTES
===================== */

// New AI Personality Generator endpoint
app.post("/api/personality", async (req, res) => {
  const { name, mood, mode } = req.body;
  
  if (!name || !mode) {
    return res.status(400).json({ error: "Name and mode are required" });
  }

  if (MOCK_MODE) {
    console.log("Mocking personality response...");
    const mockResponses = {
      roast: [
        `Oh ${name}, you're like a software update - nobody wants you, but you keep showing up anyway! 😂`,
        `Hey ${name}, I'd roast you but my AI ethics won't let me burn trash! 🔥`,
        `Listen ${name}, you're proof that even AI makes mistakes sometimes! 🤖`,
        `${name}, you're like a broken keyboard - you're just not my type! ⌨️`
      ],
      compliment: [
        `${name}, you're like perfectly optimized code - efficient, elegant, and absolutely brilliant! ✨`,
        `Hey ${name}, if you were a programming language, you'd be Python - simple, powerful, and loved by everyone! 🐍`,
        `${name}, you're the human equivalent of a successful deployment - everything just works better with you around! 🚀`,
        `Listen ${name}, you're like a well-documented API - clear, helpful, and exactly what everyone needs! 📚`
      ],
      motivation: [
        `${name}, you're not just debugging life - you're refactoring it into something amazing! 💪`,
        `Hey ${name}, every expert was once a beginner. You're not stuck, you're just loading! ⏳`,
        `${name}, your potential is like infinite recursion - it just keeps going and going! 🔄`,
        `Remember ${name}, even the best developers get bugs. The difference is they keep coding! 🐛➡️✨`
      ]
    };
    
    const responses = mockResponses[mode] || mockResponses.roast;
    const response = responses[Math.floor(Math.random() * responses.length)];
    return res.json({ content: response });
  }

  try {
    let systemPrompt = "";
    let temperature = 0.8;
    
    switch(mode) {
      case 'roast':
        systemPrompt = `You are a witty AI comedian who creates playful, light-hearted roasts. Your roasts should be:
        - Clever and creative, not mean-spirited
        - Tech/internet culture themed when possible
        - Include emojis for fun
        - Never actually hurtful or offensive
        - Maximum 2 sentences
        - Always end on a playful note
        ${mood ? `Consider their mood: ${mood}` : ''}`;
        temperature = 0.9;
        break;
        
      case 'compliment':
        systemPrompt = `You are an uplifting AI that gives genuine, creative compliments. Your compliments should be:
        - Unique and personalized
        - Tech/programming themed when possible
        - Genuinely uplifting and positive
        - Include emojis for warmth
        - Maximum 2 sentences
        - Make them feel special and valued
        ${mood ? `Consider their mood: ${mood}` : ''}`;
        temperature = 0.7;
        break;
        
      case 'motivation':
        systemPrompt = `You are an inspiring AI coach who provides powerful motivation. Your messages should be:
        - Energizing and empowering
        - Include actionable mindset shifts
        - Tech/life metaphors when possible
        - Include emojis for energy
        - Maximum 2 sentences
        - Focus on growth and potential
        ${mood ? `Consider their mood: ${mood}` : ''}`;
        temperature = 0.8;
        break;
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create a ${mode} for someone named ${name}${mood ? ` who is feeling ${mood}` : ''}.` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature,
      max_tokens: 150,
      top_p: 0.9
    });

    const content = completion.choices[0]?.message?.content || "Something went wrong, but you're still awesome!";
    res.json({ content });
    
  } catch (err) {
    console.error("❌ Personality generation error:", err);
    res.status(500).json({ error: err.message || "Personality generation failed" });
  }
});

// Enhanced mood detection endpoint
app.post("/api/mood-detect", async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  if (MOCK_MODE) {
    console.log("Mocking mood detection...");
    const moods = ['happy', 'excited', 'tired', 'stressed', 'confident', 'bored', 'creative', 'focused'];
    const mood = moods[Math.floor(Math.random() * moods.length)];
    const suggestions = {
      happy: { activity: 'Share your joy with others!', game: 'arcade', color: 'green' },
      excited: { activity: 'Channel that energy into something fun!', game: 'arcade', color: 'orange' },
      tired: { activity: 'Take it easy with something relaxing', game: 'sing-with-me', color: 'blue' },
      stressed: { activity: 'Let off some steam!', game: 'roast-me', color: 'red' },
      confident: { activity: 'Challenge yourself!', game: 'brainlock', color: 'purple' },
      bored: { activity: 'Discover something new!', game: 'destiny', color: 'pink' },
      creative: { activity: 'Express yourself!', game: 'sing-with-me', color: 'cyan' },
      focused: { activity: 'Put that focus to good use!', game: 'brainlock', color: 'indigo' }
    };
    
    return res.json({ 
      mood, 
      confidence: 0.85,
      suggestion: suggestions[mood]
    });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are an expert mood analyzer. Analyze the user's text and respond with ONLY a JSON object in this exact format:
          {
            "mood": "primary_emotion",
            "confidence": 0.85,
            "suggestion": {
              "activity": "brief suggestion text",
              "game": "recommended_game_page",
              "color": "mood_color"
            }
          }
          
          Available games: "arcade", "brainlock", "destiny", "sing-with-me", "roast-me", "jokes"
          Available colors: "red", "blue", "green", "yellow", "purple", "pink", "orange", "cyan", "indigo"
          
          Keep suggestions brief and encouraging.` 
        },
        { role: "user", content: `Analyze this text for mood: "${text}"` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 200
    });

    const content = completion.choices[0]?.message?.content || '{}';
    try {
      const result = JSON.parse(content);
      res.json(result);
    } catch {
      // Fallback if JSON parsing fails
      res.json({ 
        mood: 'neutral', 
        confidence: 0.5,
        suggestion: { activity: 'Explore something fun!', game: 'arcade', color: 'blue' }
      });
    }
    
  } catch (err) {
    console.error("❌ Mood detection error:", err);
    res.status(500).json({ error: err.message || "Mood detection failed" });
  }
});

app.post("/api/chat", async (req, res) => {
  const { messages, model = "llama-3.3-70b-versatile" } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  if (MOCK_MODE) {
    console.log("Mocking chat response...");
    const lastMsg = messages[messages.length - 1].content.toLowerCase();
    let content = "I am a mock AI. Please add a valid GROQ_API_KEY to .env to get real responses.";
    
    if (lastMsg.includes("quiz")) {
        content = JSON.stringify([
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correctAnswer: 2,
                explanation: "Paris is the capital of France."
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: 1,
                explanation: "Mars appears red due to iron oxide."
            },
            {
                question: "What is 2 + 2?",
                options: ["3", "4", "5", "22"],
                correctAnswer: 1,
                explanation: "Basic arithmetic."
            },
            {
                question: "Who wrote Romeo and Juliet?",
                options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
                correctAnswer: 1,
                explanation: "Shakespeare wrote many famous plays."
            },
             {
                question: "What is the largest ocean?",
                options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                correctAnswer: 3,
                explanation: "The Pacific Ocean is the largest."
            }
        ]);
    } else if (lastMsg.includes("astrology") || lastMsg.includes("reading") || lastMsg.includes("vedic") || lastMsg.includes("jyotish") || lastMsg.includes("rashi") || lastMsg.includes("nakshatra")) {
        const vedicResponses = [
          "The cosmic energies reveal profound insights about your destiny. Your planetary positions suggest a period of transformation and spiritual growth ahead.",
          "According to ancient Vedic wisdom, the alignment of celestial bodies in your birth chart indicates strong karmic influences guiding your path.",
          "The sacred texts of Jyotish Shastra illuminate your soul's journey. Your Rashi and Nakshatra combination brings unique blessings from the cosmic realm.",
          "Vedic astrology reveals that your birth star holds the key to understanding your dharma and life purpose in this incarnation.",
          "The ancient rishis would say your planetary configuration suggests a harmonious balance between material success and spiritual evolution."
        ];
        content = vedicResponses[Math.floor(Math.random() * vedicResponses.length)];
    } else if (lastMsg.includes("flames")) {
         content = "A connection written in the stars!";
    } else if (lastMsg.includes("joke")) {
        const jokes = [
          "I told my computer I needed a break, and it said: 'No problem, I'll go to sleep.'",
          "Why did the developer go broke? Because he used up all his cache.",
          "I asked the AI for a joke. It said: 404 humor not found. Then it found one!",
          "Why don't keyboards fight? They don't want to start a type war.",
          "My code works... until someone looks at it. Then the bugs wake up."
        ];
        content = jokes[Math.floor(Math.random() * jokes.length)];
    }

    return res.json({ role: "assistant", content });
  }

  try {
    const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
    const isJokeRequest = /joke/.test(lastMsg);
    const wantAdult = /(18\+|adult|spicy)/.test(lastMsg);
    if (!isJokeRequest) {
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model,
        temperature: 0.7,
        top_p: 0.95
      });
      return res.json(chatCompletion.choices[0]?.message || {});
    }

    const avoidList = recentJokes.slice(0, 10).join("\n");
    const baseSys = {
      role: "system",
      content:
        `You are a creative comedian. Produce a fresh, unique one-liner joke every time. Do not repeat previous jokes. Adult jokes are allowed when requested, but avoid unlawful content, slurs, and targeted hate. Return only the joke text without any preamble. Current timestamp: ${Date.now()}, Session: ${Math.random().toString(36).substring(2)}`
    };
    const avoidSys =
      avoidList.length > 0
        ? {
            role: "system",
            content: `Do not produce any joke semantically similar to:\n${avoidList}`
          }
        : null;

    const themes = [
      "unexpected office mishap",
      "zombie barista at midnight", 
      "time-traveling toaster",
      "astronaut with stage fright",
      "cat that speaks in legal terms",
      "AI trying stand-up comedy",
      "ghost stuck in a revolving door",
      "chef who only cooks with emojis",
      "pirate with gluten-free rum",
      "detective allergic to mysteries",
      "vampire dentist",
      "robot learning to dance",
      "penguin running a hot dog stand",
      "wizard with terrible WiFi",
      "superhero afraid of heights",
      "ninja with loud sneakers",
      "dragon on a diet",
      "alien trying to parallel park",
      "mummy unwrapping presents",
      "werewolf at a hair salon",
      "unicorn stuck in traffic",
      "dinosaur using social media",
      "genie with commitment issues",
      "yeti working customer service",
      "phoenix with fire insurance"
    ];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const styleSys = {
      role: "system",
      content: wantAdult
        ? `Adult one-liner with maximum spice while staying safe; no slurs or targeted hate. Use the theme: ${theme}. Be completely original and avoid clichés.`
        : `Clean, family-friendly one-liner. Use the theme: ${theme}. Be completely original and avoid clichés.`
    };

    const tokenize = (s) =>
      (s || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 3);
    const jaccard = (a, b) => {
      const sa = new Set(tokenize(a));
      const sb = new Set(tokenize(b));
      const inter = [...sa].filter((x) => sb.has(x)).length;
      const union = new Set([...sa, ...sb]).size || 1;
      return inter / union;
    };

    let attempts = 0;
    let msg = null;
    while (attempts < 3) {
      const fullMessages = avoidSys
        ? [baseSys, avoidSys, styleSys, ...messages]
        : [baseSys, styleSys, ...messages];
      const completion = await groq.chat.completions.create({
        messages: fullMessages,
        model,
        temperature: 0.95 + Math.random() * 0.05, // 0.95-1.0 for more creativity
        top_p: 0.9 + Math.random() * 0.1, // 0.9-1.0
        max_tokens: 128,
        presence_penalty: 1.0, // Increased to avoid repetition
        frequency_penalty: 0.8
      });
      msg = completion.choices[0]?.message || {};
      const txt = msg.content || "";
      const duplicate = isDuplicateJoke(txt) || recentJokes.slice(0, 10).some((r) => jaccard(r, txt) > 0.4);
      if (!duplicate) {
        rememberJoke(txt);
        break;
      }
      attempts++;
    }
    res.json(msg || {});
  } catch (err) {
    console.error("❌ Chat completion error:", err);
    res.status(500).json({ error: err.message || "Chat completion failed" });
  }
});

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  if (MOCK_MODE) {
     console.log("Mocking transcription...");
     return res.json({
         segments: [
             { start: 0, end: 5, text: "This is a mock transcription." },
             { start: 5, end: 10, text: "Because the API key is missing." },
             { start: 10, end: 15, text: "Please add your Groq API key." }
         ]
     });
  }

  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileForGroq = await toFile(fileBuffer, req.file.originalname);
    const transcription = await groq.audio.transcriptions.create({
      file: fileForGroq,
      model: "whisper-large-v3",
      response_format: "verbose_json",
      timestamp_granularity: "word"
    });

    res.json({
      segments: transcription.segments || [],
      words: transcription.words || []
    });
  } catch (err) {
    console.error("❌ Transcription error:", err);
    res.status(500).json({ error: err.message || "Transcription failed" });
  } finally {
    // Cleanup uploaded file
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
