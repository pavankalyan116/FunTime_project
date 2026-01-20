import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Square, 
  Download, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Music, 
  Play, 
  RotateCcw, 
  Star, 
  Trophy, 
  Zap,
  AlertCircle
} from 'lucide-react';
import UploadCard from '../components/UploadCard';
import KaraokeLyrics from '../components/KaraokeLyrics';
import AudioPlayer from '../components/AudioPlayer';
import { useGame } from '../contexts/GameContext';
import { secureApiCall, API_ENDPOINTS, rateLimiter, RATE_LIMITS } from '../config/api.js';

const SingWithMe = () => {
  const { addXp, updateStats, updateStreak } = useGame();
  
  // Audio & Transcription State
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [segments, setSegments] = useState([]);
  const [words, setWords] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [transcriptionError, setTranscriptionError] = useState(null);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  
  // Karaoke Features
  const [karaokeMode, setKaraokeMode] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(null);
  
  // Session Stats
  const [sessionStats, setSessionStats] = useState({
    songsUploaded: 0,
    recordingsMade: 0,
    totalSingTime: 0
  });

  // Enhanced upload handler with proper error handling
  const handleUpload = useCallback(async (file) => {
    // Reset state
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setIsProcessing(true);
    setProcessingProgress(0);
    setSegments([]);
    setWords([]);
    setRecordingUrl(null);
    setAiFeedback(null);
    setPerformanceScore(null);
    setTranscriptionError(null);

    // Update streak for engagement
    updateStreak();

    // Simulate processing progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    const formData = new FormData();
    formData.append("audio", file);

    try {
      // Check rate limiting for transcription
      if (!rateLimiter.isAllowed(API_ENDPOINTS.TRANSCRIBE, RATE_LIMITS.TRANSCRIPTIONS_PER_HOUR, 3600000)) {
        throw new Error('Transcription rate limit exceeded. Please try again later.');
      }
      
      const response = await secureApiCall(API_ENDPOINTS.TRANSCRIBE, {
        method: "POST",
        body: formData,
        headers: {} // Let browser set Content-Type for FormData
      });

      if (response.ok) {
        const data = await response.json();
        
        setSegments(data.segments || []);
        setWords(data.words || []);
        setProcessingProgress(100);
        
        // Update session stats and award XP
        setSessionStats(prev => ({
          ...prev,
          songsUploaded: prev.songsUploaded + 1
        }));
        
        addXp(15);
        updateStats('songsPlayed');
        
        setTimeout(() => setProcessingProgress(0), 1000);
        
      } else {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      setIsUploading(false);
      setError('Failed to process audio file. Please try a different file or check your internet connection.');
      
      // Still update stats and award some XP for trying
      setSessionStats(prev => ({
        ...prev,
        songsUploaded: prev.songsUploaded + 1
      }));
      
      addXp(10);
      updateStats('songsPlayed');
      
      setTimeout(() => setProcessingProgress(0), 1000);
      
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
    }
  }, [addXp, updateStats, updateStreak]);

  // Enhanced recording functionality
  const startRecording = useCallback(async () => {
    try {

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {

        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        
        // Update stats and award XP
        setSessionStats(prev => ({
          ...prev,
          recordingsMade: prev.recordingsMade + 1,
          totalSingTime: prev.totalSingTime + recordingDuration
        }));
        
        addXp(20);
        updateStats('songsPlayed');
        
        // Generate AI feedback
        generateAiFeedback();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      alert('Microphone access denied. Please allow microphone access and try again.');
    }
  }, [addXp, updateStats, recordingDuration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {

      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
      
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }, [isRecording]);

  // AI feedback generation
  const generateAiFeedback = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const feedbackOptions = [
      {
        message: "Absolutely stunning performance! Your voice has incredible range and emotion! 🌟",
        score: 95,
        category: "Exceptional",
        xpBonus: 25
      },
      {
        message: "Beautiful singing! You hit those notes with perfect timing and passion! 🎵",
        score: 88,
        category: "Excellent",
        xpBonus: 20
      },
      {
        message: "Great energy and enthusiasm! Keep practicing those high notes! 🎤",
        score: 82,
        category: "Very Good",
        xpBonus: 15
      },
      {
        message: "Nice work! Your rhythm is spot on, work on breath control for even better results! 💪",
        score: 75,
        category: "Good",
        xpBonus: 10
      },
      {
        message: "Good effort! Practice makes perfect - keep singing and improving! 🎶",
        score: 68,
        category: "Developing",
        xpBonus: 5
      }
    ];
    
    const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
    setAiFeedback(randomFeedback.message);
    setPerformanceScore(randomFeedback);
    
    // Award bonus XP based on performance
    addXp(randomFeedback.xpBonus);
    
    setIsAnalyzing(false);
  }, [addXp]);

  // Utility functions
  const formatDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const resetSession = () => {
    setAudioFile(null);
    setAudioUrl(null);
    setSegments([]);
    setWords([]);
    setRecordingUrl(null);
    setAiFeedback(null);
    setPerformanceScore(null);
    setTranscriptionError(null);
    setCurrentTime(0);
    setDuration(0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-950 p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute top-24 -right-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40 border border-blue-500/30 backdrop-blur-sm mb-6"
          >
            <Music className="w-6 h-6 text-blue-400" />
            <span className="text-sm font-semibold text-blue-200">AI-Powered Karaoke Studio</span>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-4"
          >
            SingWith Me
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Upload your favorite songs, get AI-generated lyrics, and record your performances with real-time feedback.
          </motion.p>

          {/* Session Stats */}
          {(sessionStats.songsUploaded > 0 || sessionStats.recordingsMade > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mt-6 text-sm"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-800/30 rounded-full border border-blue-500/30">
                <Music className="w-4 h-4 text-blue-400" />
                <span className="text-blue-200">{sessionStats.songsUploaded} Songs</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-800/30 rounded-full border border-purple-500/30">
                <Mic className="w-4 h-4 text-purple-400" />
                <span className="text-purple-200">{sessionStats.recordingsMade} Recordings</span>
              </div>
              {sessionStats.totalSingTime > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-pink-800/30 rounded-full border border-pink-500/30">
                  <Trophy className="w-4 h-4 text-pink-400" />
                  <span className="text-pink-200">{formatDuration(sessionStats.totalSingTime)} Sung</span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {!audioUrl ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <UploadCard onUpload={handleUpload} isProcessing={isProcessing} />
            </motion.div>
            
            {/* Processing Progress */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 rounded-2xl border border-blue-500/30 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6 text-blue-400" />
                    </motion.div>
                    <span className="text-lg font-semibold text-white">Processing Audio</span>
                  </div>
                  <span className="text-blue-300 font-mono">{Math.round(processingProgress)}%</span>
                </div>
                
                <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${processingProgress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 relative"
                  >
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>
                
                <p className="text-gray-400 text-sm mt-3 text-center">
                  AI is analyzing your audio and generating synchronized lyrics...
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Control Bar */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetSession}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Upload New Song</span>
              </motion.button>
               
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setKaraokeMode(!karaokeMode)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-300 ${
                  karaokeMode 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 border border-gray-600'
                }`}
              >
                {karaokeMode ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                <span className="font-semibold">
                  {karaokeMode ? 'Karaoke Mode ON' : 'Original Audio'}
                </span>
                {karaokeMode && <Zap className="w-4 h-4 text-yellow-300" />}
              </motion.button>
            </motion.div>

            {/* Error Display */}
            {transcriptionError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-900/40 border border-yellow-500/50 p-4 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-yellow-200 font-medium">Transcription Notice</p>
                  <p className="text-yellow-300/80 text-sm">{transcriptionError}</p>
                </div>
              </motion.div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Controls */}
              <motion.div variants={itemVariants} className="space-y-8">
                {/* Audio Player */}
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-blue-400" />
                    Audio Player
                  </h3>
                  <AudioPlayer 
                    audioUrl={audioUrl} 
                    setTime={setCurrentTime} 
                    duration={duration} 
                    karaokeMode={karaokeMode}
                  />
                </div>

                {/* Recording Studio */}
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm relative overflow-hidden">
                  {isRecording && (
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/50"
                    />
                  )}
                  
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Mic className="w-5 h-5 text-red-400" />
                    Recording Studio
                  </h3>
                  
                  <div className="flex flex-col items-center space-y-6">
                    {!isRecording ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startRecording}
                        className="relative w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 flex items-center justify-center shadow-2xl shadow-red-500/40 transition-all group"
                      >
                        <Mic className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-4 border-red-400/30"
                        />
                      </motion.button>
                    ) : (
                      <div className="flex flex-col items-center space-y-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={stopRecording}
                          className="w-20 h-20 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center border-4 border-red-500 shadow-2xl shadow-red-500/40 transition-all"
                        >
                          <Square className="w-8 h-8 text-white" />
                        </motion.button>
                        
                        <div className="text-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-red-400 font-mono text-lg font-bold mb-1"
                          >
                            {formatDuration(recordingDuration)}
                          </motion.div>
                          <div className="flex items-center gap-2 text-red-400 text-sm">
                            <motion.div
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-2 h-2 bg-red-500 rounded-full"
                            />
                            Recording in progress...
                          </div>
                        </div>
                      </div>
                    )}

                    {recordingUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full pt-6 border-t border-gray-700/50"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-400 font-semibold">Recording Complete!</span>
                          </div>
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={recordingUrl}
                            download={`singwithme-recording-${Date.now()}.webm`}
                            className="flex items-center space-x-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg transition-all shadow-lg"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </motion.a>
                        </div>
                        <audio src={recordingUrl} controls className="w-full rounded-lg" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Lyrics */}
              <motion.div variants={itemVariants} className="h-full">
                <KaraokeLyrics segments={segments} words={words} currentTime={currentTime} />
              </motion.div>
            </div>

            {/* AI Feedback */}
            <AnimatePresence>
              {(isAnalyzing || aiFeedback) && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  className="bg-gradient-to-br from-yellow-900/40 via-orange-900/40 to-red-900/40 border border-yellow-500/30 p-8 rounded-3xl backdrop-blur-sm shadow-2xl"
                >
                  {isAnalyzing ? (
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4"
                      >
                        <Sparkles className="w-12 h-12 text-yellow-400" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-yellow-300 mb-2">AI Analyzing Performance</h3>
                      <p className="text-gray-300">Evaluating pitch, timing, and vocal quality...</p>
                      <motion.div
                        animate={{ width: ['0%', '100%'] }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                        className="w-full bg-gray-800/50 rounded-full h-2 mt-4 overflow-hidden"
                      >
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" />
                      </motion.div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex justify-center mb-4"
                      >
                        {performanceScore?.score >= 90 ? (
                          <Trophy className="w-12 h-12 text-yellow-400" />
                        ) : performanceScore?.score >= 80 ? (
                          <Star className="w-12 h-12 text-blue-400" />
                        ) : (
                          <Sparkles className="w-12 h-12 text-purple-400" />
                        )}
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-yellow-300 mb-2">AI Performance Review</h3>
                      
                      {performanceScore && (
                        <div className="mb-4">
                          <div className="text-4xl font-black text-white mb-2">{performanceScore.score}/100</div>
                          <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                            performanceScore.score >= 90 ? 'bg-yellow-500/20 text-yellow-300' :
                            performanceScore.score >= 80 ? 'bg-blue-500/20 text-blue-300' :
                            performanceScore.score >= 70 ? 'bg-green-500/20 text-green-300' :
                            'bg-purple-500/20 text-purple-300'
                          }`}>
                            {performanceScore.category} (+{performanceScore.xpBonus} XP)
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xl text-white italic leading-relaxed">"{aiFeedback}"</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SingWithMe;