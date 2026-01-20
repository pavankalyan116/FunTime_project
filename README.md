# FunTime Project 🎉

A modern, interactive entertainment platform featuring AI-powered jokes, personality analysis, karaoke, games, and more!

## ⚡ Quick Start

### 1. Setup (First Time Only)
```bash
npm install
npm run setup
```

### 2. Configure API Key
1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Get your free API key
3. Edit `.env` file and add: `GROQ_API_KEY=your_actual_key`

### 3. Start the Application
```bash
npm run dev
```

Visit: http://localhost:3000/FunTime_project/

## 🚨 Important Notes

- **API-Only Architecture**: This application requires a valid GROQ API key to function
- **No Fallbacks**: All features work exclusively through APIs - no mock data or offline modes
- **Professional Experience**: Clean error handling with user-friendly messages

## 🎯 Features

### 🤣 AI Jokes Generator
- Multi-language support (English, Teglish, Higlish)
- Family-friendly and adult categories
- Real-time API status indicator
- Duplicate detection and history tracking

### 🎭 AI Personality Generator
- Roasts, compliments, and motivational messages
- Mood-aware responses
- Personalized content generation

### 🎵 Karaoke & Music
- AI-powered lyrics extraction
- Real-time synchronized playback
- Audio file upload and processing
- Recording capabilities

### 🎮 Interactive Games
- BrainLock: AI-generated quizzes
- Arcade games collection
- XP and achievement system

### 🔮 Destiny & Astrology
- Vedic astrology readings
- Personalized predictions
- Cultural authenticity

### 🎨 Modern Features
- Multi-language interface
- Responsive design
- Real-time status monitoring
- Professional error handling

## 🛠️ Tech Stack

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **GROQ API** for AI capabilities
- **Multer** for file uploads
- **CORS** for security

### APIs & Services
- **GROQ/Whisper** for transcription
- **GROQ LLaMA** for text generation
- Rate limiting and security headers

## 📋 Available Scripts

```bash
npm run setup     # First-time setup helper
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run server    # Start backend only
npm run client    # Start frontend only
```

## 🔧 Configuration

### Environment Variables
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5002
VITE_API_URL=http://localhost:5002  # For production builds
```

### Rate Limits
- Jokes: 10 per minute
- Transcriptions: 20 per hour
- Personality: 5 per minute

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run preview
```

### Environment Setup
1. Set `GROQ_API_KEY` in your hosting platform
2. Configure `VITE_API_URL` for frontend builds
3. Ensure `PORT` is set correctly

## 🔒 Security Features

- Rate limiting on all endpoints
- CORS protection
- Input validation
- Secure headers
- No sensitive data exposure

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [API Documentation](server/index.js) - Backend API reference

## 🎨 Design Philosophy

This application follows an **API-only architecture**:
- No mock data or fallback content
- Real-time status monitoring
- Professional error handling
- Clean user experience
- No technical details exposed to users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### "Service Unavailable" Error
- Check if GROQ_API_KEY is set in `.env`
- Verify API key is valid at console.groq.com
- Ensure server is running on port 5002

### Network Errors
- Check internet connection
- Verify server is running
- Check firewall settings

### Rate Limiting
- Wait for rate limit window to reset
- Check rate limit indicators in UI

For more help, run `npm run setup` or see [SETUP.md](SETUP.md).