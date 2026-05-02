import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Map, Users, Bot, Clock, Calendar } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { selectedMap, selectedDate, selectedMatch, setMap, setDate, setMatch, setMaxTime } = useStore();
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data/index.json')
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error("Failed to load match index", err));
  }, []);

  const maps = Array.from(new Set(matches.map(m => m.map_id)));
  const dates = Array.from(new Set(matches.map(m => m.date).filter(Boolean))).sort();
  
  const availableMatches = matches.filter(m => 
    m.map_id === selectedMap && (!selectedDate || m.date === selectedDate)
  );

  const handleMatchSelect = (matchId: string) => {
    setMatch(matchId);
    const matchData = matches.find(m => m.match_id === matchId);
    if (matchData) {
      setMaxTime(matchData.duration);
    }
  };

  return (
    <div className="w-80 bg-stone-950 text-white flex flex-col h-full border-r border-stone-800 shadow-2xl">
      <div className="p-6 pb-4 border-b border-stone-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">LILA BLACK</h1>
        <p className="text-stone-400 text-sm mt-1">Player Journey Vis</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-2">
            <Map size={14} /> Select Map
          </label>
          <div className="flex flex-col gap-2">
            {maps.map(map => (
              <button
                key={map}
                onClick={() => setMap(map)}
                className={`p-3 rounded-xl text-left font-medium transition-all ${
                  selectedMap === map 
                  ? 'bg-red-500/10 border-red-500/50 text-red-400 border' 
                  : 'bg-stone-900 border-stone-800 border hover:bg-stone-800 text-stone-300'
                }`}
              >
                {map}
              </button>
            ))}
          </div>
        </div>

        {dates.length > 0 && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} /> Filter by Date
            </label>
            <select 
              value={selectedDate || ''} 
              onChange={(e) => setDate(e.target.value || null)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-300 outline-none focus:border-red-500/50"
            >
              <option value="">All Dates</option>
              {dates.map(date => (
                <option key={date as string} value={date as string}>{date}</option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Available Matches
          </label>
          <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {availableMatches.length === 0 ? (
              <div className="text-stone-500 text-sm italic">No matches found for this map.</div>
            ) : (
              availableMatches.map(m => (
                <button
                  key={m.match_id}
                  onClick={() => handleMatchSelect(m.match_id)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    selectedMatch === m.match_id
                    ? 'bg-stone-800 border-stone-600 shadow-inner'
                    : 'bg-stone-900/50 border-transparent hover:bg-stone-800/80 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-mono text-stone-300 truncate mb-2" title={m.match_id}>
                    {m.match_id.split('-')[0]}...
                  </div>
                  <div className="flex gap-4 text-xs text-stone-400">
                    <span className="flex items-center gap-1"><Users size={12} className="text-blue-400"/> {m.human_count}</span>
                    <span className="flex items-center gap-1"><Bot size={12} className="text-orange-400"/> {m.bot_count}</span>
                    <span className="flex items-center gap-1"><Clock size={12} className="text-stone-500"/> {Math.round(m.duration / 60000)}m</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
