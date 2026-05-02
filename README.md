# LILA BLACK - Player Journey Visualization

A web-based visualization tool for Level Designers to explore player behavior, match pacing, and combat hotspots using production gameplay telemetry.

## Features

- **Interactive Minimap:** Pan and zoom over 1024x1024 high-resolution minimaps.
- **Player Journeys:** Visualized using Deck.gl `PathLayer`. Differentiates between bots (orange) and humans (blue).
- **Combat & Events:** Kills (Red), Storm Deaths (Purple), and Loot (Green) rendered with `ScatterplotLayer`.
- **Traffic Heatmap:** Toggleable `HeatmapLayer` to instantly identify the bloodiest kill zones and highest-traffic chokepoints.
- **Match Timeline:** Scrub through a match's progression using the bottom timeline slider, or watch it playback at 1x, 5x, 10x, or 20x speed.
- **Performant Data Flow:** 1,200+ raw Parquet files preprocessed into optimized match JSON payloads for instant load times without server lag.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, TailwindCSS
- **State Management:** Zustand
- **Visualization Engine:** Deck.gl
- **Data Preprocessing:** Python, Pandas, PyArrow

## Local Development Setup

### 1. Prerequisites
- Node.js 18+
- Python 3.10+

### 2. Preprocess Data (Optional - already done)
The raw `.parquet` data was processed offline to generate the JSON payloads.
```bash
python preprocess.py
```
This generates `index.json` and individual match files inside `frontend/public/data`.

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

## Hosted Deployment

The application is fully static and deployed. Since the preprocessed JSON files and images sit in the `public` directory, it can be hosted on **Vercel** or **GitHub Pages** with zero backend configuration.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Design decisions, data flow, and coordinate mapping math.
- [INSIGHTS.md](./INSIGHTS.md) - 3 actionable level design insights drawn from the data.
