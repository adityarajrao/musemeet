import os
import subprocess
import sys

base_dir = "/home/lenovo/hackathon/musemeet"
assets_dir = os.path.join(base_dir, "frontend/assets")
andrew_dir = os.path.join(assets_dir, "andrew")
temp_dir = "/tmp/musemeet_v5_clips"
ffmpeg = "/home/lenovo/.local/bin/ffmpeg"

s1_video = os.path.join(temp_dir, "scene1_video.mp4")
s1_dur = 12.74

print("Re-rendering Scene 1 with approved Sankey diagram...")
cmd_s1 = [
    ffmpeg, "-y",
    "-loop", "1", "-t", "6.2", "-i", os.path.join(assets_dir, "dating_fatigue_man.jpg"),
    "-loop", "1", "-t", str(s1_dur - 5.2 + 0.5), "-i", os.path.join(assets_dir, "sankey_frame.png"),
    "-i", os.path.join(andrew_dir, "scene1_audio.mp3"),
    "-filter_complex",
    (
        "[0:v]scale=1920:1080,setsar=1,fps=30,fade=t=out:st=5.2:d=1.0[v0];"
        "[1:v]scale=1920:1080,setsar=1,fps=30,fade=t=in:st=0:d=1.0[v1];"
        "[v0][v1]concat=n=2:v=1:a=0[v]"
    ),
    "-map", "[v]", "-map", "2:a",
    "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    "-shortest", s1_video
]
subprocess.run(cmd_s1, check=True)
print(f"Scene 1 rendered successfully: {s1_video} ({os.path.getsize(s1_video)} bytes)")

# Stitching
concat_list = os.path.join(temp_dir, "concat_list_v5.txt")
master_clean = os.path.join(assets_dir, "musemeet_master_demo_v5_andrew.mp4")
master_subtitled = os.path.join(assets_dir, "musemeet_master_demo_v5_andrew_subtitled.mp4")
srt_path = os.path.join(assets_dir, "musemeet_master_demo_v5.srt")

print("Stitching all 6 scenes...")
cmd_master = [
    ffmpeg, "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_list,
    "-c", "copy",
    master_clean
]
subprocess.run(cmd_master, check=True)
print(f"Master clean stitched: {master_clean} ({os.path.getsize(master_clean)/(1024*1024):.2f} MB)")

print("Burning refined transparent subtitles...")
cmd_sub = [
    ffmpeg, "-y",
    "-i", master_clean,
    "-vf", (
        f"subtitles={srt_path}:force_style="
        "'Fontname=Arial,Fontsize=15,Bold=1,PrimaryColour=&H00FFFFFF,"
        "OutlineColour=&H70000000,BorderStyle=1,Outline=1.2,Shadow=0.8,MarginV=28'"
    ),
    "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
    "-c:a", "copy",
    master_subtitled
]
subprocess.run(cmd_sub, check=True)
print(f"Subtitled Master Video complete: {master_subtitled} ({os.path.getsize(master_subtitled)/(1024*1024):.2f} MB)")

