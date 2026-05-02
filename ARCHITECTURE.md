# Architecture Document

## Tech Stack & Rationale

- **Frontend Framework:** **React + Vite (TypeScript)**
  *Why:* It provides a fast, lightweight, and easily deployable SPA. Level Designers need a highly interactive tool, and React's component-based model is perfect for managing complex UI state (filters, timelines).
- **Visualization Library:** **Deck.gl**
  *Why:* Built for rendering large geospatial datasets using WebGL. While our dataset is relatively small (~89,000 rows across 5 days), a single match can still contain thousands of path coordinates and events. Deck.gl's `PathLayer`, `ScatterplotLayer`, and `HeatmapLayer` will render these with zero lag, providing smooth zooming and panning over the minimap images.
- **Data Processing:** **Python (Pandas/PyArrow)**
  *Why:* Fetching 1,243 individual Parquet files over the network in a browser would create massive HTTP overhead. A Python script is used offline to parse, clean, decode byte strings, and merge the fragmented Parquet files into a single optimized SQLite database or JSON payload.
- **State Management:** **Zustand**
  *Why:* Simpler and less boilerplate than Redux for managing global filters (selected map, date, match, and timeline state).

## Data Flow

1. **Ingestion & Preprocessing (Offline):** 
   A Python script reads all 1,243 parquet files across the 5 daily folders. It decodes the `event` byte strings, classifies players as bots or humans based on `user_id` formatting, and calculates the normalized X/Y pixel coordinates for the minimap. The output is a single structured JSON file (or SQLite DB) grouped by `match_id`.
2. **Serving:** 
   The processed data and minimap images are placed in the frontend's `public` directory, allowing the app to be hosted entirely statically (e.g., on Vercel or GitHub Pages) without needing a live backend server.
3. **Frontend Hydration:** 
   When the app loads, it fetches the preprocessed data. Zustand manages the active state (e.g., "Show me match X on AmbroseValley").
4. **Rendering:** 
   Deck.gl listens to the Zustand store. The minimap is rendered as a `BitmapLayer`. Player journeys are drawn using a `PathLayer` (with bots and humans colored differently), and events (kills, loot, deaths) are drawn using a `ScatterplotLayer` or `IconLayer`. As the user scrubs the timeline, the data is sliced to show only events up to that timestamp.

## Coordinate Mapping Approach

Mapping the 3D world coordinates to the 2D minimap image was handled using the scale and origin data provided for each map. The tricky part was recognizing that game engines often use different axes for verticality. 

1. **Ignoring Elevation:** The `y` column represents vertical elevation, so it is ignored. We only use `x` and `z`.
2. **Normalization:** For a given map (e.g., AmbroseValley), we subtract the map's origin from the `x` and `z` coordinates, then divide by the map's scale to get UV coordinates between 0 and 1:
   ```python
   u = (x - origin_x) / scale
   v = (z - origin_z) / scale
   ```
3. **Pixel Conversion & Inversion:** The minimap images are 1024x1024 pixels. The origin of an image is the top-left, while the game's coordinate system extends upwards. Therefore, the Y-axis must be inverted:
   ```python
   pixel_x = u * 1024
   pixel_y = (1 - v) * 1024
   ```
This math is applied during the preprocessing phase to save the client from recalculating positions on every render.

## Assumptions & Ambiguities Handled

- **Bot vs. Human Identification:** The documentation states humans have UUIDs and bots have numeric IDs. I assume that any `user_id` containing a hyphen (`-`) or exceeding 15 characters is a human, while shorter numeric strings are bots.
- **Match Timestamps:** The `ts` column is match-relative (milliseconds since the match started) and not a UNIX epoch timestamp. I assumed the timeline slider should span from `0` to the `max(ts)` of the currently selected match.
- **Event Decoding:** Events were stored as bytes. I assumed they were all valid `utf-8` and handled potential decoding errors gracefully in the preprocessing pipeline.
- **Partial Data:** Feb 14 is a partial day. The system handles matches that might have abruptly ended without causing crashes.

## Major Tradeoffs

| Tradeoff | Option A | Option B | Decision & Rationale |
|----------|----------|----------|----------------------|
| **Data Fetching Strategy** | Fetch Parquet files dynamically in the browser (e.g., via DuckDB-WASM) | Preprocess into a single JSON/SQLite file offline | **Preprocess offline.** 1,243 separate HTTP requests for small files would severely degrade initial load time. A single aggregated file is much faster to download and parse. |
| **Rendering Engine** | Standard HTML Canvas / D3.js | WebGL (Deck.gl) | **Deck.gl.** Even though the total dataset is small, rendering thousands of path segments overlapping on a map can cause stuttering in standard Canvas. WebGL ensures smooth 60fps playback during timeline scrubbing. |
| **Application Architecture** | Full-stack (Next.js API + DB) | Static Single Page App (SPA) | **Static SPA.** Since the data is immutable historical data, a dynamic backend is overkill. A static SPA is easier to host (cheaper, faster) and perfectly meets the requirements. |
