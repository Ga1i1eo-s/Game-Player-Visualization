import os
import pandas as pd
import pyarrow.parquet as pq
import json

DATA_DIR = "player_data"
OUTPUT_DIR = "frontend/public/data"

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Map Configuration for Coordinate Conversion
MAP_CONFIG = {
    "AmbroseValley": {"scale": 900, "origin_x": -370, "origin_z": -473},
    "GrandRift": {"scale": 581, "origin_x": -290, "origin_z": -290},
    "Lockdown": {"scale": 1000, "origin_x": -500, "origin_z": -500},
}

def load_all_data():
    frames = []
    # February_10 to February_14
    for folder in os.listdir(DATA_DIR):
        if not folder.startswith("February_"): continue
        day_path = os.path.join(DATA_DIR, folder)
        if not os.path.isdir(day_path): continue
        
        for file in os.listdir(day_path):
            filepath = os.path.join(day_path, file)
            try:
                table = pq.read_table(filepath)
                df = table.to_pandas()
                frames.append(df)
            except Exception as e:
                print(f"Error reading {filepath}: {e}")
                
    if not frames:
        return pd.DataFrame()
    return pd.concat(frames, ignore_index=True)

def preprocess():
    print("Loading parquet files...")
    df = load_all_data()
    if df.empty:
        print("No data found!")
        return

    print(f"Loaded {len(df)} rows. Processing...")
    
    # Decode event column
    df['event'] = df['event'].apply(lambda x: x.decode('utf-8') if isinstance(x, bytes) else str(x))
    
    # Classify bots vs humans
    # Humans have UUIDs (len > 15), bots have short numeric IDs
    df['is_bot'] = df['user_id'].astype(str).apply(lambda x: len(x) < 15 or not '-' in x)
    
    def map_coords(row):
        map_id = row['map_id']
        if map_id not in MAP_CONFIG:
            return pd.Series({'pixel_x': 0, 'pixel_y': 0})
        
        cfg = MAP_CONFIG[map_id]
        u = (row['x'] - cfg['origin_x']) / cfg['scale']
        v = (row['z'] - cfg['origin_z']) / cfg['scale']
        
        pixel_x = u * 1024
        pixel_y = (1 - v) * 1024
        
        return pd.Series({'pixel_x': round(pixel_x, 2), 'pixel_y': round(pixel_y, 2)})

    print("Mapping coordinates...")
    coords = df.apply(map_coords, axis=1)
    df = pd.concat([df, coords], axis=1)
    
    # We don't need 'y' (elevation) for the 2D minimap
    if 'y' in df.columns:
        df = df.drop(columns=['y'])
    if 'x' in df.columns:
        df = df.drop(columns=['x'])
    if 'z' in df.columns:
        df = df.drop(columns=['z'])
    
    # Group by map_id and match_id, then save
    print("Exporting to JSON...")
    
    # Convert ts from datetime64 to integer milliseconds safely
    if pd.api.types.is_datetime64_any_dtype(df['ts']):
        if str(df['ts'].dtype) == 'datetime64[ns]':
            df['ts'] = df['ts'].astype('int64') // 10**6
        else:
            df['ts'] = df['ts'].astype('int64')
    elif pd.api.types.is_timedelta64_dtype(df['ts']):
        df['ts'] = df['ts'].dt.total_seconds() * 1000

    match_index = []
    
    grouped = df.groupby('match_id')
    for match_id, group in grouped:
        # Sort by timestamp to ensure playback order
        group = group.sort_values('ts')
        
        # Normalize timestamps so each match starts at 0, and convert SECONDS to MILLISECONDS
        # Nuance: The README says ts is milliseconds elapsed, but the raw data (e.g. 1770727161)
        # is actually the Unix epoch timestamp in SECONDS for Feb 2026.
        min_ts = group['ts'].min()
        group['ts'] = (group['ts'] - min_ts) * 1000
        
        map_id = group['map_id'].iloc[0]
        human_count = group[~group['is_bot']]['user_id'].nunique()
        bot_count = group[group['is_bot']]['user_id'].nunique()
        duration = group['ts'].max()
        
        match_info = {
            "match_id": str(match_id),
            "map_id": str(map_id),
            "human_count": int(human_count),
            "bot_count": int(bot_count),
            "duration": float(duration)
        }
        match_index.append(match_info)
        
        match_data = group[['user_id', 'is_bot', 'ts', 'event', 'pixel_x', 'pixel_y']].to_dict(orient='records')
        
        with open(os.path.join(OUTPUT_DIR, f"{match_id}.json"), 'w') as f:
            json.dump(match_data, f)
            
    with open(os.path.join(OUTPUT_DIR, "index.json"), 'w') as f:
        json.dump(match_index, f)
        
    print(f"Exported {len(match_index)} matches.")

if __name__ == "__main__":
    preprocess()
