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

if (!GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY is required. Server cannot start without API key.");
  console.error("📋 Setup Instructions:");
  console.error("   1. Get your API key from https://console.groq.com/");
  console.error("   2. Copy .env.example to .env");
  console.error("   3. Add your API key: GROQ_API_KEY=your_key_here");
  console.error("   4. Restart the server");
  process.exit(1);
}

/* =====================
   CORS
===================== */
/* =====================
   CORS CONFIGURATION - Enhanced Security
===================== */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://localhost:3002',
  'http://localhost:3003',
  'https://pavankalyan116.github.io',
  'https://funtime-project.onrender.com'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      try {
        const url = new URL(origin);
        const host = url.hostname;
        
        // Check against allowed origins
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        
        // Allow localhost with any port for development
        if (host === "localhost" || host === "127.0.0.1") {
          return callback(null, true);
        }
        
        // Allow render.com and github.io domains
        if (host.endsWith(".onrender.com") || host.endsWith("github.io")) {
          return callback(null, true);
        }
        
        return callback(new Error("Not allowed by CORS"), false);
      } catch (error) {
        console.error('CORS origin parsing error:', error);
        return callback(new Error("Invalid origin"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400 // 24 hours
  })
);

app.use(express.json({ limit: '10mb' })); // Add size limit for security

/* =====================
   SECURITY MIDDLEWARE
===================== */
// Rate limiting middleware
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

const rateLimitMiddleware = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(clientIP)) {
    requestCounts.set(clientIP, []);
  }
  
  const requests = requestCounts.get(clientIP);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (validRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
    });
  }
  
  validRequests.push(now);
  requestCounts.set(clientIP, validRequests);
  
  next();
};

// Apply rate limiting to API routes
app.use('/api', rateLimitMiddleware);

// Security headers middleware
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy (basic)
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  
  next();
});

// Request logging middleware (errors only)
app.use((req, res, next) => {
  // Only log errors, not all requests
  next();
});

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
const groq = new Groq({ apiKey: GROQ_API_KEY });

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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString()
  });
});

// AI Personality Generator endpoint
app.post("/api/personality", async (req, res) => {
  const { name, mood, mode, language } = req.body;
  
  if (!name || !mode) {
    return res.status(400).json({ error: "Name and mode are required" });
  }

  try {
    let systemPrompt = "";
    let userPrompt = "";
    let temperature = 0.8;
    
    // Detect language preference from name or use provided language
    const detectedLanguage = language || 'english';
    
    switch(mode) {
      case 'roast':
        if (detectedLanguage === 'teglish') {
          systemPrompt = `You are a witty Telugu-English comedian. Create playful roasts mixing Telugu and English with HEAVY Telugu usage. Be creative with formats:

FORMAT OPTIONS (choose randomly):
1. Conversation style: "Arre ${name}, nuvvu enti ra... [roast in mixed language]"
2. Story format: "Oka roju ${name} garu... [funny story]"
3. Comparison: "${name} is like... [Telugu-English comparison]"
4. Question style: "${name} enduku always... [funny observation]"

ENHANCED LANGUAGE RULES (USE MORE TELUGU):
- Use 70% Telugu and 30% English (heavily favor Telugu)
- Telugu words: enti, enduku, ela, epudu, ekkada, evaru, emi, ledu, vachindi, cheppanu, antaru, chestunte, padutaru, istam, bagundi, manchidi
- Telugu expressions: arre, aiyo, baboi, abbo, ayya, amma, anna, akka
- Telugu grammar: chestunte, antunna, vellipoyindi, vachesindi, chustunte
- Use English only for modern concepts and tech terms
- Keep it playful but can be edgy for adult humor
- Include mild profanity when it adds to the roast: "damn", "hell", "shit"
- Can include adult themes like relationships, dating, work stress
- Include emojis
- Maximum 2-3 sentences
${mood ? `Consider their mood: ${mood}` : ''}`;
        } else if (detectedLanguage === 'higlish') {
          systemPrompt = `You are a witty Hindi-English comedian. Create playful roasts mixing Hindi and English with HEAVY Hindi usage. Be creative with formats:

FORMAT OPTIONS (choose randomly):
1. Conversation style: "Arre ${name}, tu kya yaar... [roast in mixed language]"
2. Story format: "Ek baar ${name} ne... [funny story]"
3. Comparison: "${name} is like... [Hindi-English comparison]"
4. Question style: "${name} kyun always... [funny observation]"

ENHANCED LANGUAGE RULES (USE MORE HINDI):
- Use 70% Hindi and 30% English (heavily favor Hindi)
- Hindi words: kyunki, lekin, phir, kya, kaise, kahan, kab, kaun, kuch, sab, hamesha, kabhi, bilkul, bahut
- Hindi expressions: arre yaar, hai na, kya baat hai, sach mein, are bhai, yaar, boss
- Hindi grammar: kar raha hai, ho gaya, aa gaya, ja raha hai, dekh raha hai
- Use English only for modern concepts and tech terms
- Keep it playful but can be edgy for adult humor
- Include mild profanity when it adds to the roast: "damn", "hell", "shit"
- Can include adult themes like relationships, dating, work stress
- Include emojis
- Maximum 2-3 sentences
${mood ? `Consider their mood: ${mood}` : ''}`;
        } else {
          systemPrompt = `You are a witty AI comedian who creates playful, light-hearted roasts. Be creative with formats:

FORMAT OPTIONS (choose randomly):
1. Conversation style: "Hey ${name}, you know what..."
2. Story format: "Once upon a time, ${name} tried to..."
3. Comparison: "${name} is like..."
4. Character analysis: "If ${name} was a..."
5. Situation comedy: "When ${name} walks into a room..."

RULES:
- Clever and creative, can be edgy for adult humor
- Tech/internet culture themed when possible
- Include mild profanity when it enhances the roast: "damn", "hell", "shit"
- Can include adult themes like dating disasters, work stress, relationship problems
- Include emojis for fun
- Never actually hurtful or offensive to groups/communities
- Maximum 2-3 sentences
- Keep it spicy but tasteful
${mood ? `Consider their mood: ${mood}` : ''}`;
        }
        temperature = 0.9;
        break;
        
      case 'compliment':
        if (detectedLanguage === 'teglish') {
          systemPrompt = `You are an uplifting Telugu-English speaker who gives genuine compliments. Be creative with formats:

FORMAT OPTIONS (choose randomly):
1. Direct praise: "${name} garu, meeru chala..."
2. Comparison: "${name} is like... [beautiful Telugu-English comparison]"
3. Story format: "Evaru chusina ${name} gurinchi antaru..."
4. Quality focus: "${name} lo unna best quality enti ante..."

RULES:
- Mix Telugu and English naturally
- Use Telugu expressions of appreciation: chala bagundi, wonderful ga undi
- Genuinely uplifting and positive
- Include emojis for warmth
- Maximum 2-3 sentences
${mood ? `Consider their mood: ${mood}` : ''}`;
        } else if (detectedLanguage === 'higlish') {
          systemPrompt = `You are an uplifting Hindi-English speaker who gives genuine compliments. Be creative with formats:

FORMAT OPTIONS (choose randomly):
1. Direct praise: "${name} yaar, tu bahut..."
2. Comparison: "${name} is like... [beautiful Hindi-English comparison]"
3. Story format: "Sabko pata hai ki ${name} kitna..."
4. Quality focus: "${name} mein jo best quality hai woh..."

RULES:
- Mix Hindi and English naturally
- Use Hindi expressions of appreciation: bahut accha, wonderful hai
- Genuinely uplifting and positive
- Include emojis for warmth
- Maximum 2-3 sentences
${mood ? `Consider their mood: ${mood}` : ''}`;
        } else {
          systemPrompt = `You are an uplifting AI that gives genuine, creative compliments. Be creative with formats:

FORMAT OPTIONS (choose randomly):
1. Direct praise: "${name}, you are absolutely..."
2. Comparison: "${name} is like..."
3. Story format: "Everyone who meets ${name} says..."
4. Quality focus: "The best thing about ${name} is..."
5. Future vision: "${name} has the potential to..."

RULES:
- Unique and personalized
- Tech/programming themed when possible
- Genuinely uplifting and positive
- Include emojis for warmth
- Maximum 2-3 sentences
- Make them feel special and valued
${mood ? `Consider their mood: ${mood}` : ''}`;
        }
        temperature = 0.7;
        break;
        
      case 'motivation':
        if (detectedLanguage === 'teglish') {
          systemPrompt = `You are an inspiring Telugu-English motivational speaker. Be creative with formats:

FORMAT OPTIONS (choose randomly):
1. Direct motivation: "${name}, nuvvu cheyagalav..."
2. Story format: "Oka successful person laga ${name} kuda..."
3. Challenge format: "${name}, ee challenge ni face cheyyi..."
4. Vision format: "${name} future lo enti avutav ante..."

RULES:
- Mix Telugu and English naturally
- Use Telugu motivational expressions: cheyagalav, try cheyyi, success avutav
- Energizing and empowering
- Include actionable mindset shifts
- Include emojis for energy
- Maximum 2-3 sentences
${mood ? `Consider their mood: ${mood}` : ''}`;
        } else if (detectedLanguage === 'higlish') {
          systemPrompt = `You are an inspiring Hindi-English motivational speaker. Be creative with formats:

FORMAT OPTIONS (choose randomly):
1. Direct motivation: "${name}, tu kar sakta hai..."
2. Story format: "Jaise successful log karte hain, ${name} bhi..."
3. Challenge format: "${name}, is challenge ko face kar..."
4. Vision format: "${name} ka future kitna bright hai..."

RULES:
- Mix Hindi and English naturally
- Use Hindi motivational expressions: kar sakta hai, try kar, success milegi
- Energizing and empowering
- Include actionable mindset shifts
- Include emojis for energy
- Maximum 2-3 sentences
${mood ? `Consider their mood: ${mood}` : ''}`;
        } else {
          systemPrompt = `You are an inspiring AI coach who provides powerful motivation. Be creative with formats:

FORMAT OPTIONS (choose randomly):
1. Direct motivation: "${name}, you have the power to..."
2. Story format: "Just like successful people, ${name} can..."
3. Challenge format: "${name}, here's your challenge..."
4. Vision format: "${name}'s future is bright because..."
5. Action plan: "${name}, start by..."

RULES:
- Energizing and empowering
- Include actionable mindset shifts
- Tech/life metaphors when possible
- Include emojis for energy
- Maximum 2-3 sentences
- Focus on growth and potential
${mood ? `Consider their mood: ${mood}` : ''}`;
        }
        temperature = 0.8;
        break;
        
      default:
        return res.status(400).json({ error: "Invalid mode. Use 'roast', 'compliment', or 'motivation'" });
    }

    userPrompt = `Create a creative ${mode} for ${name}${mood ? ` who is feeling ${mood}` : ''}. Use one of the suggested formats and make it engaging and memorable.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature,
      max_tokens: 200,
      top_p: 0.9
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response generated");
    }
    
    res.json({ content });
    
  } catch (err) {
    console.error("❌ Personality generation error:", err);
    res.status(500).json({ error: "Failed to generate personality response. Please try again." });
  }
});

// Mood detection endpoint
app.post("/api/mood-detect", async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are an expert mood and emotion analyzer with deep understanding of human psychology. Analyze the user's text creatively and respond with ONLY a JSON object in this exact format:
          {
            "mood": "primary_emotion",
            "confidence": 0.85,
            "suggestion": {
              "activity": "creative and personalized suggestion",
              "game": "recommended_game_page",
              "color": "mood_color"
            },
            "insight": "brief psychological insight about their state",
            "energy_level": "high/medium/low"
          }
          
          MOOD ANALYSIS APPROACH:
          - Look for subtle emotional cues, not just obvious words
          - Consider context, tone, and underlying feelings
          - Detect mixed emotions and complex states
          - Identify energy levels and motivation patterns
          - Consider cultural and generational context
          
          CREATIVE SUGGESTIONS:
          - Make activity suggestions specific and actionable
          - Consider their current energy and mood state
          - Suggest complementary or balancing activities
          - Be encouraging and supportive
          
          Available games: "arcade", "brainlock", "destiny", "sing-with-me", "roast-me", "jokes"
          Available colors: "red", "blue", "green", "yellow", "purple", "pink", "orange", "cyan", "indigo"
          
          EXAMPLES OF CREATIVE INSIGHTS:
          - "You seem to be processing something important"
          - "There's a spark of curiosity in your words"
          - "You're in a reflective, growth-oriented mindset"
          - "Your energy suggests you're ready for a challenge"` 
        },
        { role: "user", content: `Analyze this text deeply for mood, emotions, and psychological state: "${text}"` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 300
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response generated");
    }
    
    try {
      const result = JSON.parse(content);
      res.json(result);
    } catch (parseError) {
      throw new Error("Invalid JSON response from AI");
    }
    
  } catch (err) {
    console.error("❌ Mood detection error:", err);
    res.status(500).json({ error: "Failed to analyze mood. Please try again." });
  }
});

app.post("/api/chat", async (req, res) => {
  const { messages, model = "llama-3.3-70b-versatile" } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  try {
    const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
    const isJokeRequest = /joke/.test(lastMsg);
    
    if (!isJokeRequest) {
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model,
        temperature: 0.7,
        top_p: 0.95
      });
      
      const response = chatCompletion.choices[0]?.message;
      if (!response || !response.content) {
        throw new Error("No response generated");
      }
      
      return res.json(response);
    }

    // For joke requests, use enhanced duplicate detection
    const avoidList = recentJokes.slice(0, 10).join("\n");
    const avoidSys = avoidList.length > 0 ? {
      role: "system",
      content: `Do not produce any joke semantically similar to:\n${avoidList}`
    } : null;

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
      const fullMessages = avoidSys ? [avoidSys, ...messages] : [...messages];
      
      const completion = await groq.chat.completions.create({
        messages: fullMessages,
        model,
        temperature: 0.95 + Math.random() * 0.05,
        top_p: 0.9 + Math.random() * 0.1,
        max_tokens: 150,
        presence_penalty: 1.0,
        frequency_penalty: 0.8
      });
      
      msg = completion.choices[0]?.message || {};
      const txt = msg.content || "";
      
      const duplicate = isDuplicateJoke(txt) || recentJokes.slice(0, 10).some((r) => jaccard(r, txt) > 0.35);
      
      if (!duplicate && txt.length > 10) {
        rememberJoke(txt);
        break;
      }
      
      attempts++;
    }
    
    if (!msg || !msg.content) {
      throw new Error("Failed to generate unique joke after multiple attempts");
    }
    
    res.json(msg);
  } catch (err) {
    console.error("❌ Chat completion error:", err);
    res.status(500).json({ error: "Failed to generate response. Please try again." });
  }
});

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileForGroq = await toFile(fileBuffer, req.file.originalname);
    
    const transcription = await groq.audio.transcriptions.create({
      file: fileForGroq,
      model: "whisper-large-v3",
      response_format: "verbose_json"
    });

    if (!transcription.segments || transcription.segments.length === 0) {
      throw new Error("No transcription segments generated");
    }

    res.json({
      segments: transcription.segments,
      words: transcription.words || []
    });
    
  } catch (err) {
    console.error("❌ Transcription error:", err.message);
    res.status(500).json({ error: "Failed to transcribe audio. Please try a different file or check the audio quality." });
    
  } finally {
    // Cleanup uploaded file
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error("⚠️ Error cleaning up file:", cleanupErr.message);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} | API: Connected`);
});
