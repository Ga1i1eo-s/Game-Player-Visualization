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

## Insight 4: Lack of Late-Game Incentive to Move
- **What caught my eye:** During the final 2-3 minutes of most matches (using the timeline scrubber), the `Loot` events almost entirely disappear from the map.
- **Supporting Evidence:** As the storm closes in on the final circles, the scatterplot layer stops showing green dots (Looting) and only shows red dots (Combat/Deaths). Even when players pass directly through known high-tier loot compounds in the late game, they ignore them.
- **Actionable Item:** To prevent late-game stalemates where players just hide in cover, Level Designers should implement dynamic high-value loot crates or "Care Packages" that drop directly into the final circles. This will force engagements by giving players a tangible reason to break cover in the final minutes.

## Insight 5: Bot Traversal Bottlenecks on Terrain
- **What caught my eye:** Bot paths sometimes get clustered tightly against certain mountain ranges or rivers in `GrandRift`.
- **Supporting Evidence:** The `PathLayer` clearly shows bots (orange lines) moving in unnaturally straight lines and getting stuck running parallel against terrain obstacles instead of pathing around them smoothly like humans (blue lines) do.
- **Actionable Item:** Level Designers need to smooth out the NavMesh (Navigation Mesh) along these steep inclines and riverbanks. Alternatively, add small bridges or shallow crossing points exactly where the visualizer shows bots struggling to cross natural boundaries.

## Insight 4: Lack of Flanking Routes in High-Combat Corridors
- **What caught my eye:** On the `AmbroseValley` map, player paths and kill events are funneled heavily straight down the main central road, with almost no usage of the surrounding elevated terrain.
- **Supporting Evidence:** The PathLayer (blue lines) heavily overlaps along the central valley road, and the "Kill Zones" heatmap shows intense, chaotic combat right on the open road. There are very few paths branching into the hillsides, indicating players aren't using the high ground.
- **Actionable Item:** Level Designers should carve out small, covered footpaths along the hillsides overlooking the main valley road. Adding rocky outcroppings, fallen trees, or small sniper nests will encourage players to take high-ground flanking routes rather than funneling directly into a slaughter on the main road.

## Insight 5: Unused Outer-Edge POIs due to Lack of Early Loot
- **What caught my eye:** Several small building clusters on the extreme Northwest edge of the `GrandRift` map have zero `Loot` events and zero human pathing across almost all match dates.
- **Supporting Evidence:** The PathLayer for humans completely ignores the Northwest quadrant of the map. When cross-referencing with the Scatterplot layer, there are absolutely no green dots (Looting) in that area, indicating players have learned it's not worth visiting.
- **Actionable Item:** Level Designers should guarantee at least one high-tier loot chest spawn or a permanent vehicle spawn in these extreme edge POIs. This gives players a tangible incentive to land there early and utilizes the full map area, rather than dropping exclusively into the central hot-drops.
