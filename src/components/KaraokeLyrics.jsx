
import { useEffect, useRef } from "react";

export default function KaraokeLyrics({ segments, currentTime }) {
  const activeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentTime]);

  if (!segments || segments.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-12 border border-slate-700 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
          <span className="text-3xl text-slate-300" aria-hidden="true">🎤</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">No Lyrics Yet</h3>
        <p className="text-gray-400 mb-6">Upload an audio file to see synchronized lyrics here</p>
        <div className="flex justify-center space-x-4 text-sm text-gray-500">
          <span className="px-3 py-1 bg-slate-700 rounded-full">🎵</span>
          <span className="px-3 py-1 bg-slate-700 rounded-full">🎤</span>
          <span className="px-3 py-1 bg-slate-700 rounded-full">⏱️</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg" aria-hidden="true">🎵</span>
                </span>
                Live Lyrics
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {segments.length} segments • {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(segments[segments.length - 1]?.end / 60 || 0)}:{Math.floor(segments[segments.length - 1]?.end % 60 || 0).toString().padStart(2, '0')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-300 text-sm">Live Sync</span>
              </div>
              <div className="text-blue-100 text-sm">
                {Math.round((currentTime / (segments[segments.length - 1]?.end || 1)) * 100)}% Complete
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
            style={{ width: `${(currentTime / (segments[segments.length - 1]?.end || 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Lyrics Container */}
      <div 
        ref={containerRef}
        className="h-96 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)',
          backgroundSize: '100% 50px'
        }}
      >
        {segments.map((segment, index) => {
          const isActive = currentTime >= segment.start && currentTime <= segment.end;
          const isPast = currentTime > segment.end;
          const isFuture = currentTime < segment.start;
          const progress = Math.min(Math.max((currentTime - segment.start) / (segment.end - segment.start), 0), 1);
          
          return (
            <div
              key={index}
              ref={isActive ? activeRef : null}
              className={`transition-all duration-500 transform ${
                isActive 
                  ? "scale-105" 
                  : isPast 
                  ? "scale-100 opacity-60" 
                  : "scale-100 opacity-40"
              }`}
            >
              <div className={`relative p-4 rounded-xl border transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-400 shadow-2xl shadow-blue-500/30" 
                  : isPast 
                  ? "bg-slate-700/50 border-slate-600/50" 
                  : "bg-slate-800/30 border-slate-700/30"
              }`}>
                {/* Progress indicator for active segment */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                      style={{ width: `${progress * 100}%` }}
                    ></div>
                  </div>
                )}
                
                <div className="relative z-10">
                  <p className={`text-lg leading-relaxed font-medium ${
                    isActive 
                      ? "text-white" 
                      : isPast 
                      ? "text-gray-400" 
                      : "text-gray-500"
                  }`}>
                    {segment.text}
                  </p>
                  
                  {isActive && (
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <div className="flex items-center text-blue-300">
                        <span className="mr-1" aria-hidden="true">⏱️</span>
                        {formatTime(segment.start)} - {formatTime(segment.end)}
                      </div>
                      <div className="flex items-center text-green-300">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                        Now Playing
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with enhanced controls */}
      <div className="bg-slate-900/50 p-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4 text-gray-400">
            <span>Current: {formatTime(currentTime)}</span>
            <span>•</span>
            <span>Total: {formatTime(segments[segments.length - 1]?.end || 0)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-blue-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></div>
              <span>Auto-scroll Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
