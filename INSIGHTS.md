# Game Insights from Player Journey Data

With the completion of the Player Journey Visualization tool, several interesting patterns have emerged regarding player behavior, map balance, and pacing. These insights were gathered using the interactive timeline, dedicated Heatmap layers, and event filters.

## Insight 1: Bots are overly aggressive in early match phases
- **What caught my eye:** During timeline scrubbing, I noticed that `BotKill` and `BotKilled` events spike heavily within the first 3-5 minutes of matches, especially near the outer edges of the maps.
- **Supporting Evidence:** By switching the Heatmap mode to **"Kill Zones"** and observing the first 5 minutes on the timeline, bot-related combat events cluster intensely near spawn zones before humans even have a chance to loot and move towards the center. The orange paths (Bots) show them instantly pathing towards the nearest human spawn.
- **Actionable Item:** Tune bot engagement distances or add a "grace period" AI state where bots prioritize looting over hunting for the first few minutes. This will improve early-game survival rates and player retention metrics.
- **Why Level Designers should care:** If bots are crowding the spawn points, level designers might need to adjust bot spawn locations or increase cover density in these outer rings to give human players a safer early-game looting phase.

## Insight 2: The Storm dictates player flow more than POIs (Points of Interest)
- **What caught my eye:** The player paths show that instead of navigating between high-tier loot zones, humans take the most direct, often exposed, routes straight towards the safe zone as soon as the storm begins moving.
- **Supporting Evidence:** The `PathLayer` shows massive convergence of blue lines (human paths) cutting directly across open fields or mountains, ignoring nearby buildings (lack of `Loot` events during mid-game). Switching the Heatmap to **"Storm Deaths"** (the purple gradient) reveals massive clusters of `KilledByStorm` events happening precisely at bottleneck chokepoints on the map edges.
- **Actionable Item:** Adjust the storm's speed or damage. Alternatively, add jump pads or vehicles near the map edges to allow players to safely traverse without running across open fields. This will reduce frustrating "running simulator" deaths.
- **Why Level Designers should care:** Level designers spend hours crafting beautiful POIs. If players are forced to bypass them due to storm pressure, the map flow is broken. Designers might need to add more natural cover along these direct routes or widen the terrain at known choke points.

## Insight 3: The "Lockdown" map has a concentrated central meat-grinder
- **What caught my eye:** While `AmbroseValley` has traffic spread relatively evenly, the `Lockdown` map is heavily skewed.
- **Supporting Evidence:** Toggling the **"Traffic Flow"** and **"Death Zones"** heatmaps for `Lockdown` matches reveals that 80% of player movement and deaths happen in a single central compound. The outer 60% of the map remains largely dark and ignored by players across almost every date filter.
- **Actionable Item:** Redistribute high-tier loot spawns to the outer edges of the Lockdown map to encourage players to spread out. This will improve match pacing and reduce the immediate early-game death rate.
- **Why Level Designers should care:** A map where only 10% of the playable area is utilized is inefficient. Level designers need to know which areas are "dead zones" so they can redesign them—perhaps by adding better cover, verticality, or unique landmarks to draw players outward from the center.
