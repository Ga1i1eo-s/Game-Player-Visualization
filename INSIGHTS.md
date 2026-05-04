# Game Insights from Player Journey Data

With the completion of the Player Journey Visualization tool, several interesting patterns have emerged regarding player behavior, map balance, and pacing. These insights were gathered using the interactive timeline, dedicated Heatmap layers, and event filters.

## Insight 1: Spawn Zones Lack Sufficient Line-of-Sight Blockers
- **What caught my eye:** During timeline scrubbing, I noticed that `BotKill` and `BotKilled` events spike heavily within the first 3-5 minutes of matches, especially near the outer edges of the maps.
- **Supporting Evidence:** By switching the Heatmap mode to **"Kill Zones"** and observing the first 5 minutes on the timeline, bot-related combat events cluster intensely near spawn zones before humans even have a chance to loot and move towards the center. The orange paths (Bots) show them instantly detecting and pathing towards the nearest human spawn.
- **Actionable Item:** Level/Game Designers should shift the initial spawn points slightly further apart. More importantly, add dense environmental cover (large buildings, thick forests, or hills) directly between these spawn zones to break line-of-sight. This forces safer engagements and allows players to loot before being sniped.

## Insight 2: Outer Terrain Chokepoints are Causing Frustrating Storm Deaths
- **What caught my eye:** The player paths show that instead of navigating between high-tier loot zones, humans take the most direct, often exposed, routes straight towards the safe zone as soon as the storm begins moving.
- **Supporting Evidence:** The `PathLayer` shows massive convergence of blue lines (human paths) cutting directly across open fields or mountains, ignoring nearby buildings. Switching the Heatmap to **"Storm Deaths"** (the purple gradient) reveals massive clusters of `KilledByStorm` events happening precisely at specific geographical bottleneck chokepoints on the map edges.
- **Actionable Item:** Level Designers should add movement-enabling level props (like ziplines, jump pads, or vehicles) near these exposed, highly-trafficked outer routes. Additionally, use the terrain tools to widen the mountain passes or create alternative pathways around the exact bottlenecks where the Storm Death heatmap clusters are brightest.

## Insight 3: The "Lockdown" map has a concentrated central meat-grinder
- **What caught my eye:** While `AmbroseValley` has traffic spread relatively evenly, the `Lockdown` map is heavily skewed.
- **Supporting Evidence:** Toggling the **"Traffic Flow"** and **"Death Zones"** heatmaps for `Lockdown` matches reveals that 80% of player movement and deaths happen in a single central compound. The outer 60% of the map remains largely dark and ignored by players across almost every date filter.
- **Actionable Item:** Level Designers should redistribute the high-tier loot spawn tags from the center of the map to the outer POIs (Points of Interest) to encourage players to spread out. Furthermore, visually upgrade the "dead zones" by adding unique landmarks or vertical structures to naturally draw player attention outward.
