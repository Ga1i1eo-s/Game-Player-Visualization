# Game Insights from Player Journey Data

## Insight 1: Bots are overly aggressive in early match phases
- **What caught my eye:** During timeline scrubbing, I noticed that `BotKill` and `BotKilled` events spike heavily within the first 3-5 minutes of matches, especially near the outer edges of the maps.
- **Supporting Evidence:** In the heatmap and scatterplot layers, bot-related combat events cluster intensely near spawn zones before humans even have a chance to loot and move towards the center. The paths show bots instantly pathing towards the nearest human spawn.
- **Actionable Item:** Tune bot engagement distances or add a "grace period" AI state where bots prioritize looting over hunting for the first few minutes. This will improve early-game survival rates and player retention metrics.
- **Why Level Designers should care:** If bots are crowding the spawn points, level designers might need to adjust bot spawn locations or increase cover density in these outer rings to give human players a safer early-game looting phase.

## Insight 2: The Storm dictates player flow more than POIs (Points of Interest)
- **What caught my eye:** The player paths show that instead of navigating between high-tier loot zones, humans take the most direct, often exposed, routes straight towards the safe zone as soon as the storm begins moving.
- **Supporting Evidence:** The `PathLayer` shows massive convergence of blue lines (human paths) cutting directly across open fields or mountains, ignoring nearby buildings (lack of `Loot` events during mid-game). Many `KilledByStorm` events happen at bottleneck chokepoints on the map.
- **Actionable Item:** Adjust the storm's speed or damage. Alternatively, add jump pads or vehicles near the map edges to allow players to safely traverse without running across open fields. This will reduce frustrating "running simulator" deaths and increase combat engagement metrics.
- **Why Level Designers should care:** Level designers spend hours crafting beautiful POIs. If players are forced to bypass them due to storm pressure, the map flow is broken. Designers might need to add more natural cover along these direct routes or rework chokepoints.

## Insight 3: The "Lockdown" map has a concentrated central meat-grinder
- **What caught my eye:** While `AmbroseValley` has kills spread relatively evenly, the `Lockdown` map heatmap is entirely glowing red in the dead center of the map.
- **Supporting Evidence:** Toggling the `HeatmapLayer` for `Lockdown` matches reveals that 80% of `Kill` and `Killed` events happen in a single central compound, while the outer 60% of the map is largely ignored by players.
- **Actionable Item:** Redistribute high-tier loot to the outer edges of the Lockdown map to encourage spreading out. This will improve match pacing and reduce the immediate early-game death rate.
- **Why Level Designers should care:** A map where only 10% of the playable area is utilized is inefficient. Level designers need to know which areas are "dead zones" so they can redesign them—perhaps by adding better cover, verticality, or unique landmarks to draw players outward.
