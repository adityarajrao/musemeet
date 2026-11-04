import os
import subprocess

ffmpeg = "/home/lenovo/.local/bin/ffmpeg"
base_dir = "/home/lenovo/hackathon/musemeet"
assets_dir = os.path.join(base_dir, "frontend/assets")
andrew_dir = os.path.join(assets_dir, "andrew")
audio_path = os.path.join(andrew_dir, "scene2_audio.mp3")

subagent_dir = os.path.join(assets_dir, "subagent_journey")
out_subagent = os.path.join(assets_dir, "agent_journey_subagent.mp4")

s1_img = os.path.join(subagent_dir, "step1_profiling.jpg")
s2_img = os.path.join(subagent_dir, "step2_pingpong.jpg")
s3_img = os.path.join(subagent_dir, "step3_date.jpg")

filter_sub = (
    # Clip 1: On-Device Persona Profiling (0 - 10.8s)
    "[0:v]scale=1920:1080,setsar=1,"
    "drawtext=text='01 / ON-DEVICE SOVEREIGN PROFILING':font='Arial':fontsize=26:fontcolor=white:x=80:y=h-90:box=1:boxcolor=black@0.55:boxborderw=10,"
    "drawtext=text='Continuous learning of authentic rhythm and attachment values · Zero Cloud Egress':font='Arial':fontsize=16:fontcolor=white@0.85:x=80:y=h-50:box=1:boxcolor=black@0.4:boxborderw=6,"
    "fade=t=out:st=10.0:d=0.8[v0];"
    
    # Clip 2: Autonomous AirGap Ping-Pong Banter (10.0 - 21.5s)
    "[1:v]scale=1920:1080,setsar=1,"
    "drawtext=text='02 / AUTONOMOUS AIRGAP PING-PONG BANTER':font='Arial':fontsize=26:fontcolor=white:x=80:y=h-90:box=1:boxcolor=black@0.55:boxborderw=10,"
    "drawtext=text='Embodied companion mascots stress-testing alignment at machine speed':font='Arial':fontsize=16:fontcolor=white@0.85:x=80:y=h-50:box=1:boxcolor=black@0.4:boxborderw=6,"
    "fade=t=in:st=0:d=0.8,fade=t=out:st=10.7:d=0.8[v1];"
    
    # Clip 3: Real-World Offline First Date (20.7 - 32.8s)
    "[2:v]scale=1920:1080,setsar=1,"
    "drawtext=text='03 / OFFLINE FIRST DATE · 92 PERCENT RESONANCE':font='Arial':fontsize=26:fontcolor=white:x=80:y=h-90:box=1:boxcolor=black@0.55:boxborderw=10,"
    "drawtext=text='Deep compatibility proven · Agents curate real-world Brooklyn rendezvous':font='Arial':fontsize=16:fontcolor=white@0.85:x=80:y=h-50:box=1:boxcolor=black@0.4:boxborderw=6,"
    "fade=t=in:st=0:d=0.8[v2];"
    
    # Concat all 3 clips cleanly
    "[v0][v1][v2]concat=n=3:v=1:a=0[vout]"
)

cmd = [
    ffmpeg, "-y",
    "-loop", "1", "-t", "10.8", "-i", s1_img,
    "-loop", "1", "-t", "11.5", "-i", s2_img,
    "-loop", "1", "-t", "11.2", "-i", s3_img,
    "-i", audio_path,
    "-filter_complex", filter_sub,
    "-map", "[vout]", "-map", "3:a",
    "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    "-shortest", out_subagent
]

print("Rendering clean subagent journey animation...")
subprocess.run(cmd, check=True)
print(f"Success! Output: {out_subagent} ({os.path.getsize(out_subagent)/(1024*1024):.2f} MB)")
