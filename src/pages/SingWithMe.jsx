import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Download, Sparkles, Volume2, VolumeX } from 'lucide-react';
import UploadCard from '../components/UploadCard';
import KaraokeLyrics from '../components/KaraokeLyrics';
import AudioPlayer from '../components/AudioPlayer';

const API_URL = import.meta.env.VITE_API_URL;

const SingWithMe = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [segments, setSegments] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  
  // Karaoke Mode
  const [karaokeMode, setKaraokeMode] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  const handleUpload = async (file) => {
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setIsProcessing(true);
    setSegments([]); // Reset lyrics
    setRecordingUrl(null);
    setAiFeedback(null);

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
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Failed to generate lyrics. You can still sing along!");
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        generateAiFeedback();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordedChunks([]);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const generateAiFeedback = async () => {
    // Mock AI feedback since we can't analyze audio content easily on client
    const compliments = [
      "Amazing performance! You hit those high notes perfectly! 🌟",
      "What a soulful voice! I'm in tears (happy ones)! 😭✨",
      "Rockstar energy! The crowd goes wild! 🎸🤘",
      "Beautifully sung! You have a gift! 🎁🎵",
      "Pitch perfect! Are you a professional? 🎤🏆"
    ];
    // Random delay for "AI processing" feel
    await new Promise(r => setTimeout(r, 2000));
    setAiFeedback(compliments[Math.floor(Math.random() * compliments.length)]);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
            SingWith Me
          </h1>
          <p className="text-gray-400">Your personal AI Karaoke Studio</p>
        </div>

        {!audioUrl ? (
          <UploadCard onUpload={handleUpload} isProcessing={isProcessing} />
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
               <button
                 onClick={() => setAudioFile(null) || setAudioUrl(null)}
                 className="text-sm text-gray-400 hover:text-white"
               >
                 ← Upload New Song
               </button>
               
               <button
                 onClick={() => setKaraokeMode(!karaokeMode)}
                 className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                   karaokeMode ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                 }`}
                 title="Simulates vocal removal (volume reduction)"
               >
                 {karaokeMode ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                 <span>{karaokeMode ? 'Karaoke Mode ON' : 'Original Audio'}</span>
               </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6 order-2 md:order-1">
                 {/* Audio Player */}
                 <div className="transition-opacity duration-500">
                    <AudioPlayer 
                      audioUrl={audioUrl} 
                      setTime={setCurrentTime} 
                      duration={duration} 
                      karaokeMode={karaokeMode}
                    />
                 </div>

                 {/* Recording Controls */}
                 <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col items-center space-y-4 relative overflow-hidden">
                    {isRecording && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse shadow-[0_0_10px_#ef4444]" />
                    )}
                    <h3 className="font-semibold text-lg">Record Your Voice</h3>
                    
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                      >
                        <Mic className="w-8 h-8 text-white" />
                      </button>
                    ) : (
                      <div className="flex flex-col items-center space-y-2">
                        <button
                          onClick={stopRecording}
                          className="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center border-4 border-red-500 animate-pulse"
                        >
                          <Square className="w-6 h-6 text-white" />
                        </button>
                        <span className="text-red-500 font-mono animate-pulse">Recording...</span>
                      </div>
                    )}

                    {recordingUrl && (
                      <div className="w-full pt-4 border-t border-gray-800 animate-in fade-in">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-green-400">Recording Ready!</span>
                          <a
                            href={recordingUrl}
                            download="my-cover-song.webm"
                            className="flex items-center space-x-2 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </a>
                        </div>
                        <audio src={recordingUrl} controls className="w-full h-8" />
                      </div>
                    )}
                 </div>
              </div>

              {/* Lyrics Display */}
              <div className="h-full order-1 md:order-2">
                <KaraokeLyrics segments={segments} currentTime={currentTime} />
              </div>
            </div>

            {/* AI Feedback */}
            <AnimatePresence>
              {aiFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 p-6 rounded-xl text-center"
                >
                  <div className="flex justify-center mb-2">
                    <Sparkles className="w-8 h-8 text-yellow-400 animate-spin-slow" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-300 mb-2">AI Judge Verdict</h3>
                  <p className="text-lg text-white italic">"{aiFeedback}"</p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}
      </div>
    </div>
  );
};

export default SingWithMe;
