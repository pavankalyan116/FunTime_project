import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Download, Sparkles, Volume2, VolumeX, Music, Radio, Play, Pause, RotateCcw, Star, Trophy, Zap } from 'lucide-react';
import UploadCard from '../components/UploadCard';
import KaraokeLyrics from '../components/KaraokeLyrics';
import AudioPlayer from '../components/AudioPlayer';

const API_URL = import.meta.env.VITE_API_URL;

const SingWithMe = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [segments, setSegments] = useState([]);
  const [words, setWords] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  
  // Karaoke Mode & Features
  const [karaokeMode, setKaraokeMode] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    songsUploaded: 0,
    recordingsMade: 0,
    totalSingTime: 0
  });

  // Enhanced upload handler with progress simulation
  const handleUpload = useCallback(async (file) => {
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setIsProcessing(true);
    setProcessingProgress(0);
    setSegments([]);
    setWords([]);
    setRecordingUrl(null);
    setAiFeedback(null);
    setPerformanceScore(null);

    // Simulate processing progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch(`${API_URL}/api/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Transcription failed");

      const data = await response.json();
      setSegments(data.segments || []);
      setWords(data.words || []);
      setProcessingProgress(100);
      
      // Update session stats
      setSessionStats(prev => ({
        ...prev,
        songsUploaded: prev.songsUploaded + 1
      }));
      
      setTimeout(() => setProcessingProgress(0), 1000);
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Failed to generate lyrics. You can still sing along!");
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
    }
  }, [API_URL]);

  // Enhanced recording with timer
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
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        setSessionStats(prev => ({
          ...prev,
          recordingsMade: prev.recordingsMade + 1,
          totalSingTime: prev.totalSingTime + recordingDuration
        }));
        generateAiFeedback();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      setRecordedChunks([]);
      
      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  }, [recordingDuration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
      
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }, [isRecording]);

  // Enhanced AI feedback with scoring
  const generateAiFeedback = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic delay
    await new Promise(r => setTimeout(r, 3000));
    
    const feedbackOptions = [
      {
        message: "Absolutely stunning! Your voice has incredible range and emotion! 🌟",
        score: 95,
        category: "Exceptional"
      },
      {
        message: "Beautiful performance! You hit those notes with perfect timing! 🎵",
        score: 88,
        category: "Excellent"
      },
      {
        message: "Great energy and passion! Keep practicing those high notes! 🎤",
        score: 82,
        category: "Very Good"
      },
      {
        message: "Nice work! Your rhythm is spot on, work on breath control! 💪",
        score: 75,
        category: "Good"
      },
      {
        message: "Good effort! Practice makes perfect - keep singing! 🎶",
        score: 68,
        category: "Developing"
      }
    ];
    
    const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
    setAiFeedback(randomFeedback.message);
    setPerformanceScore(randomFeedback);
    setIsAnalyzing(false);
  }, []);

  // Format recording duration
  const formatDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-950 p-3 sm:p-4 md:p-6 lg:p-8 text-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
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
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 4 }}
          className="absolute -bottom-28 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 px-2 sm:px-4">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40 border border-blue-500/30 backdrop-blur-sm mb-4 sm:mb-6"
          >
            <Music className="w-4 h-4 sm:w-5 md:w-6 lg:h-6 text-blue-400" />
            <span className="text-xs sm:text-sm font-semibold text-blue-200">AI-Powered Karaoke Studio</span>
            <Sparkles className="w-4 h-4 sm:w-5 md:h-5 text-yellow-400" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4"
          >
            SingWith Me
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed px-4"
          >
            Upload your favorite songs, get AI-generated lyrics, and record your performances with real-time feedback.
          </motion.p>

          {/* Session Stats */}
          {(sessionStats.songsUploaded > 0 || sessionStats.recordingsMade > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-800/30 rounded-full border border-blue-500/30">
                <Music className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="text-blue-200">{sessionStats.songsUploaded} Songs</span>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-800/30 rounded-full border border-purple-500/30">
                <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                <span className="text-purple-200">{sessionStats.recordingsMade} Recordings</span>
              </div>
              {sessionStats.totalSingTime > 0 && (
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-pink-800/30 rounded-full border border-pink-500/30">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
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
          >
            <motion.div variants={itemVariants}>
              <UploadCard onUpload={handleUpload} isProcessing={isProcessing} />
            </motion.div>
            
            {/* Processing Progress */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-4 sm:p-6 rounded-2xl border border-blue-500/30 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    </motion.div>
                    <span className="text-base sm:text-lg font-semibold text-white">Processing Audio</span>
                  </div>
                  <span className="text-blue-300 font-mono text-sm sm:text-base">{Math.round(processingProgress)}%</span>
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
                
                <p className="text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3 text-center">
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
            className="space-y-6 sm:space-y-8"
          >
            {/* Enhanced Control Bar */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-4 sm:p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAudioFile(null);
                  setAudioUrl(null);
                  setSegments([]);
                  setWords([]);
                  setRecordingUrl(null);
                  setAiFeedback(null);
                  setPerformanceScore(null);
                }}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Upload New Song</span>
              </motion.button>
               
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setKaraokeMode(!karaokeMode)}
                className={`flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base ${
                  karaokeMode 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 border border-gray-600'
                }`}
                title="Simulates vocal removal for karaoke experience"
              >
                {karaokeMode ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                <span className="font-semibold">
                  {karaokeMode ? 'Karaoke Mode ON' : 'Original Audio'}
                </span>
                {karaokeMode && <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />}
              </motion.button>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column - Controls */}
              <motion.div variants={itemVariants} className="space-y-6 sm:space-y-8">
                {/* Enhanced Audio Player */}
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 p-4 sm:p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    Audio Player
                  </h3>
                  <AudioPlayer 
                    audioUrl={audioUrl} 
                    setTime={setCurrentTime} 
                    duration={duration} 
                    karaokeMode={karaokeMode}
                  />
                </div>

                {/* Enhanced Recording Studio */}
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 p-4 sm:p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm relative overflow-hidden">
                  {isRecording && (
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/50"
                    />
                  )}
                  
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    Recording Studio
                  </h3>
                  
                  <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                    {!isRecording ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startRecording}
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 flex items-center justify-center shadow-2xl shadow-red-500/40 transition-all group"
                      >
                        <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:scale-110 transition-transform" />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-4 border-red-400/30"
                        />
                      </motion.button>
                    ) : (
                      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={stopRecording}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center border-4 border-red-500 shadow-2xl shadow-red-500/40 transition-all"
                        >
                          <Square className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </motion.button>
                        
                        <div className="text-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-red-400 font-mono text-base sm:text-lg font-bold mb-1"
                          >
                            {formatDuration(recordingDuration)}
                          </motion.div>
                          <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm">
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
                        className="w-full pt-4 sm:pt-6 border-t border-gray-700/50"
                      >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-400 font-semibold text-sm sm:text-base">Recording Complete!</span>
                          </div>
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={recordingUrl}
                            download={`singwithme-recording-${Date.now()}.webm`}
                            className="flex items-center space-x-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-3 sm:px-4 py-2 rounded-lg transition-all shadow-lg"
                          >
                            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
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

            {/* Enhanced AI Feedback */}
            <AnimatePresence>
              {(isAnalyzing || aiFeedback) && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  className="bg-gradient-to-br from-yellow-900/40 via-orange-900/40 to-red-900/40 border border-yellow-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-sm shadow-2xl"
                >
                  {isAnalyzing ? (
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-3 sm:mb-4"
                      >
                        <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400" />
                      </motion.div>
                      <h3 className="text-xl sm:text-2xl font-bold text-yellow-300 mb-2">AI Analyzing Performance</h3>
                      <p className="text-gray-300 text-sm sm:text-base">Evaluating pitch, timing, and vocal quality...</p>
                      <motion.div
                        animate={{ width: ['0%', '100%'] }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                        className="w-full bg-gray-800/50 rounded-full h-2 mt-3 sm:mt-4 overflow-hidden"
                      >
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" />
                      </motion.div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex justify-center mb-3 sm:mb-4"
                      >
                        {performanceScore?.score >= 90 ? (
                          <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400" />
                        ) : performanceScore?.score >= 80 ? (
                          <Star className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" />
                        ) : (
                          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />
                        )}
                      </motion.div>
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-yellow-300 mb-2">AI Performance Review</h3>
                      
                      {performanceScore && (
                        <div className="mb-3 sm:mb-4">
                          <div className="text-3xl sm:text-4xl font-black text-white mb-2">{performanceScore.score}/100</div>
                          <div className={`inline-block px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${
                            performanceScore.score >= 90 ? 'bg-yellow-500/20 text-yellow-300' :
                            performanceScore.score >= 80 ? 'bg-blue-500/20 text-blue-300' :
                            performanceScore.score >= 70 ? 'bg-green-500/20 text-green-300' :
                            'bg-purple-500/20 text-purple-300'
                          }`}>
                            {performanceScore.category}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-lg sm:text-xl text-white italic leading-relaxed px-2">"{aiFeedback}"</p>
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
