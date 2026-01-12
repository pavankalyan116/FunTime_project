
import { useState, useCallback } from "react";

export default function UploadCard({ onUpload, isProcessing }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && isValidAudioFile(file)) {
      onUpload(file);
    } else {
      alert('Please upload a valid audio file (MP3, WAV, M4A, FLAC, OGG, etc.)');
    }
  }, [onUpload]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file && isValidAudioFile(file)) {
      onUpload(file);
    } else if (file) {
      alert('Please upload a valid audio file (MP3, WAV, M4A, FLAC, OGG, etc.)');
    }
  }, [onUpload]);

  const isValidAudioFile = (file) => {
    const validTypes = [
      'audio/flac', 'audio/mpeg', 'audio/mp4', 'audio/mp3', 
      'audio/mpga', 'audio/m4a', 'audio/ogg', 'audio/opus', 
      'audio/wav', 'audio/webm', 'audio/x-wav', 'audio/x-m4a'
    ];
    const validExtensions = ['.flac', '.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.ogg', '.opus', '.wav', '.webm'];
    
    return validTypes.includes(file.type) || 
           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 sm:p-6 lg:p-8 rounded-2xl w-full shadow-2xl border border-slate-700 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">🎵 Upload Audio</h2>
          <p className="text-gray-400 text-sm">
            Drop your music file here or click to browse
          </p>
        </div>
        
        <div
          className={`border-2 border-dashed rounded-xl p-5 sm:p-6 lg:p-8 transition-all duration-300 cursor-pointer ${
            isDragging
              ? "border-blue-400 bg-blue-400/10 scale-105 shadow-2xl shadow-blue-500/20"
              : "border-slate-600 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-900/70"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && document.getElementById("file-input").click()}
        >
          <input
            id="file-input"
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isProcessing 
                ? "bg-gradient-to-br from-orange-500 to-red-600 animate-spin" 
                : isDragging
                ? "bg-gradient-to-br from-green-500 to-blue-600 scale-110"
                : "bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105"
            }`}>
              {isProcessing ? (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : isDragging ? (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  <path d="M20.41 5.59l-1.42-1.42a2 2 0 00-2.82 0L13 7.17V3h-2v4.17l-3.17-3.17a2 2 0 00-2.82 0l-1.42 1.42a2 2 0 000 2.82L13 13.17V17h2v-3.83l3.17 3.17a2 2 0 002.82 0l1.42-1.42a2 2 0 000-2.82z"/>
                </svg>
              ) : (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-white font-medium text-base sm:text-lg">
                {isProcessing ? "Processing your music..." : isDragging ? "Drop it here!" : "Choose your music"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {isProcessing ? "AI is analyzing the audio" : isDragging ? "Release to upload" : "or drag and drop"}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
              {['MP3', 'WAV', 'M4A', 'FLAC', 'OGG'].map(format => (
                <span key={format} className="px-2 py-1 bg-slate-700 rounded text-gray-300">
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🎯 Maximum file size: 25MB • 🤖 Powered by AI transcription
          </p>
        </div>
      </div>
    </div>
  );
}
