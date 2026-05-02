import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Play, Pause, FastForward } from 'lucide-react';

export const Timeline: React.FC = () => {
  const { currentTime, maxTime, isPlaying, playbackSpeed, setTime, togglePlayback, setPlaybackSpeed } = useStore();

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setTime(Math.min(currentTime + (1000 * playbackSpeed), maxTime));
        if (currentTime >= maxTime) {
          togglePlayback();
        }
      }, 50); // Update every 50ms
    }
    return () => window.clearInterval(interval);
  }, [isPlaying, currentTime, playbackSpeed, maxTime, setTime, togglePlayback]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-stone-950/90 backdrop-blur border-t border-stone-800 p-4 px-8 text-white flex items-center gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <button 
        onClick={togglePlayback}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-900/50"
      >
        {isPlaying ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} className="ml-1" />}
      </button>

      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="flex justify-between text-xs font-mono text-stone-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(maxTime)}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max={maxTime} 
          value={currentTime} 
          onChange={(e) => setTime(Number(e.target.value))}
          className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-red-500"
        />
      </div>

      <div className="flex items-center gap-2 bg-stone-900 rounded-lg p-1 border border-stone-800">
        <FastForward size={14} className="text-stone-500 ml-2" />
        {[1, 5, 10, 20].map(speed => (
          <button
            key={speed}
            onClick={() => setPlaybackSpeed(speed)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              playbackSpeed === speed 
              ? 'bg-stone-700 text-white shadow-sm' 
              : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
};
