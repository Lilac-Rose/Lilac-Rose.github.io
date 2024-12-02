import json

def parse_osu_mania_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    metadata = {}
    timing_points = []
    hit_objects = []
    section = None

    for line in lines:
        line = line.strip()
        if not line or line.startswith("//"):
            continue
        if line.startswith("["):
            section = line.strip("[]")
            continue

        if section == "Metadata":
            if ":" in line:
                key, value = map(str.strip, line.split(":", 1))
                metadata[key] = value
        elif section == "HitObjects":
            parts = line.split(",")
            lane = int(parts[0])  # x-coordinate determines the lane
            time = int(parts[2])
            type_flag = int(parts[3])
            duration = int(parts[5]) - time if type_flag & 128 else None  # Hold type flag
            hit_objects.append({
                "lane": lane,
                "time": time,
                "type": "hold" if type_flag & 128 else "normal",
                "duration": duration
            })

    # Convert x-coordinates to lanes (0-based index)
    total_lanes = int(metadata.get("CircleSize", 4))  # Default to 4 lanes
    for obj in hit_objects:
        obj["lane"] = obj["lane"] * total_lanes // 512

    # Prepare final JSON structure
    json_data = {
        "title": metadata.get("Title", "Unknown"),
        "songFile": metadata.get("AudioFilename", "Unknown.mp3"),
        "notes": hit_objects,
        "difficulty": float(metadata.get("OverallDifficulty", 1)),
        "bpm": 120,  # This can be refined by parsing [TimingPoints]
        "offset": 0  # Adjust if necessary
    }
    return json_data

# Usage
file_path = "path_to_your_osu_file.osu"
converted_data = parse_osu_mania_file(file_path)
output_path = "output.json"
with open(output_path, "w", encoding="utf-8") as out_file:
    json.dump(converted_data, out_file, indent=4)
