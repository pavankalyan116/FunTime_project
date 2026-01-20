
import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({ audioUrl, setTime, duration, karaokeMode }) {
  const ref = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  
  // Web Audio API Refs
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const karaokeNodeRef = useRef(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (!ref.current || audioContextRef.current) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const source = ctx.createMediaElementSource(ref.current);
      sourceNodeRef.current = source;

      // Create Gain Node for volume
      const gainNode = ctx.createGain();
      gainNodeRef.current = gainNode;
      
      // Normal path: Source -> Gain -> Destination
      source.connect(gainNode);
      gainNode.connect(ctx.destination);

    } catch (e) {
      // Web Audio API not supported - silently fall back to basic audio
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Handle Karaoke Mode (Center Channel Suppression)
  useEffect(() => {
    if (!audioContextRef.current || !sourceNodeRef.current || !gainNodeRef.current) return;

    const ctx = audioContextRef.current;
    const source = sourceNodeRef.current;
    const mainGain = gainNodeRef.current;

    if (karaokeMode) {
        // Disconnect normal path
        source.disconnect();
        mainGain.disconnect();
        
        // Build Karaoke Graph: L-R
        // 1. Splitter
        const splitter = ctx.createChannelSplitter(2);
        
        // 2. Inverter for Right Channel
        const inverter = ctx.createGain();
        inverter.gain.value = -1;

        // 3. Merger (mix L and -R)
        const merger = ctx.createChannelMerger(2);

        // Connect: Source -> Splitter
        source.connect(splitter);

        // Splitter L -> Merger L & R (to make it mono center)
        splitter.connect(merger, 0, 0);
        splitter.connect(merger, 0, 1);
        
        // Splitter R -> Inverter -> Merger L & R
        splitter.connect(inverter, 1);
        inverter.connect(merger, 0, 0);
        inverter.connect(merger, 0, 1);

        // Merger -> Main Gain -> Destination
        merger.connect(mainGain);
        mainGain.connect(ctx.destination);
        
        karaokeNodeRef.current = { splitter, inverter, merger };
    } else {
        // Cleanup Karaoke nodes if they exist
        if (karaokeNodeRef.current) {
            const { splitter, inverter, merger } = karaokeNodeRef.current;
            splitter.disconnect();
            inverter.disconnect();
            merger.disconnect();
            karaokeNodeRef.current = null;
        }
        
        // Restore Normal Path
        source.disconnect();
        source.connect(mainGain);
        mainGain.connect(ctx.destination);
    }
  }, [karaokeMode]);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setTime(audio.currentTime);
    };

    const updatePlayingState = () => setIsPlaying(!audio.paused);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("play", updatePlayingState);
    audio.addEventListener("pause", updatePlayingState);
    audio.addEventListener("ended", updatePlayingState);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("play", updatePlayingState);
      audio.removeEventListener("pause", updatePlayingState);
      audio.removeEventListener("ended", updatePlayingState);
    };
  }, [setTime]);

  const togglePlayPause = () => {
    if (ref.current.paused) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    ref.current.currentTime = newTime;
    setCurrentTime(newTime);
    setTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    ref.current.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-xl mt-6 bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
      <audio ref={ref} src={audioUrl} className="hidden" />
      
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || ref.current?.duration || 0)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || ref.current?.duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || ref.current?.duration || 1)) * 100}%, #475569 ${(currentTime / (duration || ref.current?.duration || 1)) * 100}%, #475569 100%)`
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #475569 ${volume * 100}%, #475569 100%)`
            }}
          />
          <span className="text-xs text-gray-400 w-8">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #1e293b;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #1e293b;
        }
      `}</style>
    </div>
  );
}
