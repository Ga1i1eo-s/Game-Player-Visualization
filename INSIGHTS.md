# Game Insights from Player Journey Data

With the completion of the Player Journey Visualization tool, several interesting patterns have emerged regarding player behavior, map balance, and pacing. These insights were gathered using the interactive timeline, dedicated Heatmap layers, and event filters.

## Insight 1: The "Lockdown" map has a concentrated central meat-grinder
- **What caught my eye:** While `AmbroseValley` has traffic spread relatively evenly, the `Lockdown` map is heavily skewed.
- **Supporting Evidence:** Toggling the **"Traffic Flow"** and **"Death Zones"** heatmaps for `Lockdown` matches reveals that 80% of player movement and deaths happen in a single central compound. The outer 60% of the map remains largely dark and ignored by players across almost every date filter.
- **Actionable Item:** Level Designers should redistribute the high-tier loot spawn tags from the center of the map to the outer POIs (Points of Interest) to encourage players to spread out. Furthermore, visually upgrade the "dead zones" by adding unique landmarks or vertical structures to naturally draw player attention outward.

## Insight 2: Lack of Late-Game Incentive to Move
- **What caught my eye:** During the final 2-3 minutes of most matches (using the timeline scrubber), the `Loot` events almost entirely disappear from the map.
- **Supporting Evidence:** As the storm closes in on the final circles, the scatterplot layer stops showing green dots (Looting) and only shows red dots (Combat/Deaths). Even when players pass directly through known high-tier loot compounds in the late game, they ignore them.
- **Actionable Item:** To prevent late-game stalemates where players just hide in cover, Level Designers should implement dynamic high-value loot crates or "Care Packages" that drop directly into the final circles. This will force engagements by giving players a tangible reason to break cover in the final minutes.

## Insight 3: Bot Traversal Bottlenecks on Terrain
- **What caught my eye:** Bot paths sometimes get clustered tightly against certain mountain ranges or rivers in `GrandRift`.
- **Supporting Evidence:** The `PathLayer` clearly shows bots (orange lines) moving in unnaturally straight lines and getting stuck running parallel against terrain obstacles instead of pathing around them smoothly like humans (blue lines) do.
- **Actionable Item:** Level Designers need to smooth out the NavMesh (Navigation Mesh) along these steep inclines and riverbanks. Alternatively, add small bridges or shallow crossing points exactly where the visualizer shows bots struggling to cross natural boundaries.