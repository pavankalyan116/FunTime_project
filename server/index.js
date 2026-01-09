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
const PORT = process.env.PORT || 5001;
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
    origin: ["https://pavankalyan116.github.io", "*"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());

/* =====================
   PREFLIGHT HANDLER
===================== */
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://pavankalyan116.github.io');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.send(200);
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

/* =====================
   ROUTES
===================== */
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
    } else if (lastMsg.includes("astrology") || lastMsg.includes("reading")) {
        content = "The stars align in your favor! A mysterious energy surrounds you today. Expect a pleasant surprise in the coming days. Your lucky number is 7.";
    } else if (lastMsg.includes("flames")) {
         content = "A connection written in the stars!";
    }

    return res.json({ role: "assistant", content });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model,
    });
    res.json(chatCompletion.choices[0]?.message || {});
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
      response_format: "verbose_json"
    });

    res.json({
      segments: transcription.segments || []
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
