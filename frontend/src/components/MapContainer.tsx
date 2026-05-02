import React, { useEffect, useState, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { OrthographicView } from '@deck.gl/core';
import { BitmapLayer, PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { useStore } from '../store/useStore';

const INITIAL_VIEW_STATE = {
  target: [512, 512, 0] as [number, number, number],
  zoom: 0.8,
  minZoom: -1,
  maxZoom: 4,
};

const MAP_IMAGES: Record<string, string> = {
  "AmbroseValley": "/minimaps/AmbroseValley_Minimap.png",
  "GrandRift": "/minimaps/GrandRift_Minimap.png",
  "Lockdown": "/minimaps/Lockdown_Minimap.jpg",
};

export const MapContainer: React.FC = () => {
  const { selectedMap, selectedMatch, currentTime } = useStore();
  const [matchData, setMatchData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false); // Can be toggled

  useEffect(() => {
    if (!selectedMatch) {
      setMatchData([]);
      return;
    }
    setLoading(true);
    fetch(`/data/${selectedMatch}.json`)
      .then(res => res.json())
      .then(data => {
        setMatchData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load match data", err);
        setLoading(false);
      });
  }, [selectedMatch]);

  // Process data for DeckGL
  const { paths, events } = useMemo(() => {
    if (!matchData.length) return { paths: [], events: [] };

    // Filter by current time
    const filtered = matchData.filter(d => d.ts <= currentTime);
    
    // Group positions by user_id for paths
    const userPaths = new Map();
    const eventPoints: any[] = [];

    filtered.forEach(d => {
      if (d.event === "Position" || d.event === "BotPosition") {
        if (!userPaths.has(d.user_id)) {
          userPaths.set(d.user_id, {
            path: [],
            isBot: d.is_bot
          });
        }
        userPaths.get(d.user_id).path.push([d.pixel_x, d.pixel_y]);
      } else {
        eventPoints.push(d);
      }
    });

    return {
      paths: Array.from(userPaths.values()),
      events: eventPoints
    };
  }, [matchData, currentTime]);

  const layers = [
    // Background Minimap
    new BitmapLayer({
      id: 'bitmap-layer',
      bounds: [0, 1024, 1024, 0], // left, bottom, right, top
      image: selectedMap ? MAP_IMAGES[selectedMap] : '',
    }),
    
    // Traffic Heatmap
    showHeatmap && new HeatmapLayer({
      id: 'heatmap-layer',
      data: matchData, // show all data for heatmap to see overall traffic
      getPosition: (d: any) => [d.pixel_x, d.pixel_y],
      getWeight: (d: any) => (d.event.includes('Kill') || d.event.includes('Death')) ? 10 : 1, // Kills have higher weight
      radiusPixels: 20,
      opacity: 0.5,
    }),

    // Player Paths
    new PathLayer({
      id: 'path-layer',
      data: paths,
      pickable: true,
      widthScale: 1,
      widthMinPixels: 2,
      getPath: (d: any) => d.path,
      getColor: (d: any) => d.isBot ? [255, 140, 0, 180] : [0, 150, 255, 200], // Orange bots, Blue humans
      getWidth: () => 2,
    }),

    // Events (Kills, Deaths, Loot)
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: events,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 1,
      radiusMinPixels: 4,
      radiusMaxPixels: 15,
      lineWidthMinPixels: 1,
      getPosition: (d: any) => [d.pixel_x, d.pixel_y],
      getFillColor: (d: any) => {
        if (d.event === 'KilledByStorm') return [128, 0, 128, 255]; // Purple for storm
        if (d.event.includes('Kill')) return [255, 0, 0, 255]; // Red for combat
        if (d.event === 'Loot') return [0, 255, 0, 255]; // Green for loot
        return [255, 255, 255, 255];
      },
      getLineColor: [0, 0, 0, 200],
    }),
  ];

  return (
    <div className="flex-1 relative bg-stone-900 overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-stone-950/50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
        </div>
      )}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all ${
            showHeatmap ? 'bg-orange-500 text-white' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
          }`}
        >
          {showHeatmap ? 'Hide Traffic Heatmap' : 'Show Traffic Heatmap'}
        </button>
      </div>
      {!selectedMatch && !loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 text-stone-500 font-medium">
          Select a match from the sidebar to view the player journeys
        </div>
      )}

      {/* Legend */}
      {selectedMatch && (
        <div className="absolute bottom-4 left-4 z-10 bg-stone-900/80 backdrop-blur-md p-4 rounded-xl border border-stone-700/50 shadow-xl text-xs flex flex-col gap-2 pointer-events-none">
          <h3 className="font-bold text-stone-300 tracking-wider text-xs mb-1 uppercase">Legend</h3>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 border border-black shadow-sm"></div>
              <span className="text-stone-300 font-medium">Combat / Death</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border border-black shadow-sm"></div>
              <span className="text-stone-300 font-medium">Looting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-600 border border-black shadow-sm"></div>
              <span className="text-stone-300 font-medium">Storm Death</span>
            </div>
            <div className="h-px w-full bg-stone-700/50 my-0.5"></div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1.5 bg-blue-500 rounded-full shadow-sm"></div>
              <span className="text-stone-300 font-medium">Human Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1.5 bg-orange-500 rounded-full shadow-sm"></div>
              <span className="text-stone-300 font-medium">Bot Path</span>
            </div>
          </div>
        </div>
      )}
      <DeckGL
        views={new OrthographicView({ id: 'ortho' })}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers.filter(Boolean) as any}
        getTooltip={({object}: any) => object && {
          html: `<b>Event:</b> ${object.event || 'Path'}<br/><b>User ID:</b> ${object.user_id || 'N/A'}`
        }}
      />
    </div>
  );
};
