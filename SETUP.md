# FunTime Project Setup Guide

## Quick Start

### 1. Get Your GROQ API Key
1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### 2. Configure Environment
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your GROQ API key:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   PORT=5002
   ```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Application
```bash
npm run dev
```

The application will start on:
- Frontend: http://localhost:3000/FunTime_project/
- Backend: http://localhost:5002

## Troubleshooting

### "API service is currently unavailable"
- Make sure you have set the `GROQ_API_KEY` in your `.env` file
- Verify your API key is valid at [https://console.groq.com/](https://console.groq.com/)
- Check that the server is running on port 5002

### "Network error occurred"
- Check your internet connection
- Verify the server is running (`npm run server` in a separate terminal)
- Make sure port 5002 is not blocked by firewall

### Rate Limiting
- The application has built-in rate limiting:
  - 10 jokes per minute
  - 20 transcriptions per hour
  - 5 personality requests per minute

## Production Deployment

For production deployment, set the environment variables in your hosting platform:
- `GROQ_API_KEY`: Your GROQ API key
- `PORT`: Server port (default: 5002)
- `VITE_API_URL`: Your backend URL for frontend builds

## API-Only Architecture

This application is designed to work exclusively with APIs:
- No mock data or fallbacks
- Requires valid API keys to function
- Clean error handling for users
- Professional user experience