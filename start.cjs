#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 FunTime Project Setup Helper\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📋 Setting up environment file...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
  } else {
    // Create basic .env file
    const envContent = `# Environment variables for FunTime Project
# Get your GROQ API key from https://console.groq.com/

GROQ_API_KEY=your_groq_api_key_here
PORT=5002
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created basic .env file');
  }
}

// Check if GROQ_API_KEY is set
const envContent = fs.readFileSync(envPath, 'utf8');
const hasValidApiKey = envContent.includes('GROQ_API_KEY=') && 
                      !envContent.includes('your_groq_api_key_here') &&
                      !envContent.includes('# GROQ_API_KEY=');

if (!hasValidApiKey) {
  console.log('⚠️  GROQ API Key not configured!');
  console.log('\n📋 To complete setup:');
  console.log('   1. Visit https://console.groq.com/');
  console.log('   2. Sign up/login and get your API key');
  console.log('   3. Edit .env file and set: GROQ_API_KEY=your_actual_key');
  console.log('   4. Run: npm run dev');
  console.log('\n💡 The application requires a valid API key to function.');
} else {
  console.log('✅ Environment configured correctly!');
  console.log('\n🎯 Ready to start:');
  console.log('   npm run dev    - Start development server');
  console.log('   npm run build  - Build for production');
  console.log('\n🌐 Application will be available at:');
  console.log('   Frontend: http://localhost:3000/FunTime_project/');
  console.log('   Backend:  http://localhost:5002');
}

console.log('\n📚 For more help, see SETUP.md');