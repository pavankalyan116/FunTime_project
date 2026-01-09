# Lyrics Karaoke Player

A modern web application that extracts synchronized lyrics from audio files using AI-powered transcription. Upload any audio file and get real-time, karaoke-style lyrics that highlight as the song plays.

## Features

- 🎵 **Audio Upload**: Drag-and-drop or click to upload audio files (MP3, WAV, M4A, etc.)
- 🎤 **AI Transcription**: Powered by Groq's Whisper API for accurate lyrics extraction
- ⏱️ **Real-time Sync**: Lyrics highlight in perfect sync with the audio playback
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 🎛️ **Audio Controls**: Custom player with progress bar, volume control, and seek functionality
- 📱 **Mobile Friendly**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework for the API
- **Groq SDK** - AI transcription service
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lyrics_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   PORT=5001
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)
   
   The application will automatically start both frontend and backend servers!

## Development Scripts

- `npm run dev` - Start both frontend and backend servers simultaneously
- `npm run server` - Start only the backend server (port 5001)
- `npm run client` - Start only the frontend development server (port 3000)
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build

## Usage

1. **Upload Audio**: Drag and drop an audio file or click to browse
2. **Processing**: Wait for the AI to transcribe the audio (may take a few moments)
3. **Play & Sing**: Use the audio controls to play the song and follow along with synchronized lyrics
4. **Reset**: Click "Upload New File" to process another song

## Supported Audio Formats

- MP3
- WAV
- M4A
- FLAC
- OGG
- And most other common audio formats

## API Endpoints

### POST /transcribe
Transcribes an uploaded audio file and returns synchronized lyrics segments.

**Request:** 
- Multipart form data with an `audio` file field

**Response:**
```json
{
  "segments": [
    {
      "text": "Lyrics text here",
      "start": 0.5,
      "end": 2.3
    }
  ]
}
```

## Project Structure

```
lyrics_project/
├── src/
│   ├── components/
│   │   ├── UploadCard.jsx     # File upload component
│   │   ├── AudioPlayer.jsx    # Custom audio player
│   │   └── KaraokeLyrics.jsx  # Lyrics display component
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.js                  # Express server
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── README.md               # This file
```

## Development Scripts

- `npm run dev` - Start both frontend and backend servers simultaneously
- `npm run server` - Start only the backend server (port 5001)
- `npm run client` - Start only the frontend development server (port 3000)
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build

## Environment Variables

- `GROQ_API_KEY` - Your Groq API key for transcription
- `PORT` - Port number for the backend server (default: 5001)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend is running on port 5000
2. **API Key Errors**: Verify your GROQ_API_KEY is correctly set in the .env file
3. **Upload Issues**: Check that the audio file format is supported
4. **Transcription Failures**: Large files may timeout; try with shorter audio first

### Getting Help

- Check the browser console for error messages
- Verify all dependencies are installed
- Ensure both frontend and backend servers are running
- Check network connectivity for API calls
