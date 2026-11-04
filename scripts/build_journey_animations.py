import os
import subprocess

ffmpeg = "/home/lenovo/.local/bin/ffmpeg"
base_dir = "/home/lenovo/hackathon/musemeet"
assets_dir = os.path.join(base_dir, "frontend/assets")
andrew_dir = os.path.join(assets_dir, "andrew")
audio_path = os.path.join(andrew_dir, "scene2_audio.mp3")

meta_dir = os.path.join(assets_dir, "meta_journey")
subagent_dir = os.path.join(assets_dir, "subagent_journey")

out_meta = os.path.join(assets_dir, "agent_journey_meta_api.mp4")
out_subagent = os.path.join(assets_dir, "agent_journey_subagent.mp4")

# -------------------------------------------------------------
# 1. RENDER SUBAGENT JOURNEY ANIMATION (Native 16:9 widescreen)
# -------------------------------------------------------------
print("=== Rendering Subagent Journey Animation (1920x1080) ===")

s1_img = os.path.join(subagent_dir, "step1_profiling.jpg")
s2_img = os.path.join(subagent_dir, "step2_pingpong.jpg")
s3_img = os.path.join(subagent_dir, "step3_date.jpg")

filter_sub = (
    # Clip 1: slow zoom-in on mascot
    "[0:v]scale=1920:1080,setsar=1,zoompan=z='min(zoom+0.0006,1.10)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=324:s=1920x1080:fps=30,"
    "drawtext=text='01 / ON-DEVICE SOVEREIGN PROFILING':font='Arial':fontsize=26:fontcolor=white:x=80:y=h-90:box=1:boxcolor=black@0.55:boxborderw=10,"
    "drawtext=text='Continuous learning of authentic rhythm and attachment values · Zero Cloud Egress':font='Arial':fontsize=16:fontcolor=white@0.85:x=80:y=h-50:box=1:boxcolor=black@0.4:boxborderw=6,"
    "fade=t=out:st=10.0:d=0.8[v0];"
    # Clip 2: slow pan across ping pong match
    "[1:v]scale=1920:1080,setsar=1,zoompan=z='1.05':x='iw/2-(iw/zoom/2)+sin(in/60)*40':y='ih/2-(ih/zoom/2)':d=360:s=1920x1080:fps=30,"
    "drawtext=text='02 / AUTONOMOUS AIRGAP PING-PONG BANTER':font='Arial':fontsize=26:fontcolor=white:x=80:y=h-90:box=1:boxcolor=black@0.55:boxborderw=10,"
    "drawtext=text='Embodied companion mascots stress-testing alignment at machine speed':font='Arial':fontsize=16:fontcolor=white@0.85:x=80:y=h-50:box=1:boxcolor=black@0.4:boxborderw=6,"
    "fade=t=in:st=0:d=0.8,fade=t=out:st=11.2:d=0.8[v1];"
    # Clip 3: slow camera reveal on high five and couple
    "[2:v]scale=1920:1080,setsar=1,zoompan=z='max(1.10-0.0007*on,1.0)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=360:s=1920x1080:fps=30,"
    "drawtext=text='03 / OFFLINE FIRST DATE · 92 PERCENT RESONANCE':font='Arial':fontsize=26:fontcolor=white:x=80:y=h-90:box=1:boxcolor=black@0.55:boxborderw=10,"
    "drawtext=text='Deep compatibility proven · Agents curate real-world Brooklyn rendezvous':font='Arial':fontsize=16:fontcolor=white@0.85:x=80:y=h-50:box=1:boxcolor=black@0.4:boxborderw=6,"
    "fade=t=in:st=0:d=0.8[v2];"
    # Concat clips
    "[v0][v1][v2]concat=n=3:v=1:a=0[vout]"
)

cmd_sub = [
    ffmpeg, "-y",
    "-loop", "1", "-t", "10.8", "-i", s1_img,
    "-loop", "1", "-t", "12.0", "-i", s2_img,
    "-loop", "1", "-t", "11.6", "-i", s3_img,
    "-i", audio_path,
    "-filter_complex", filter_sub,
    "-map", "[vout]", "-map", "3:a",
    "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    "-shortest", out_subagent
]
print("Executing subagent render...")
subprocess.run(cmd_sub, check=True)
print(f"Generated: {out_subagent} ({os.path.getsize(out_subagent)/(1024*1024):.2f} MB)")

# -------------------------------------------------------------
# 2. RENDER META API JOURNEY ANIMATION (4-Phase 1024x1024 -> 1080p)
# -------------------------------------------------------------
print("\n=== Rendering Meta API Journey Animation (1920x1080) ===")
m1_img = os.path.join(meta_dir, "frame1_profiling.jpg")
m2_img = os.path.join(meta_dir, "frame2_pingpong_banter.jpg")
m3_img = os.path.join(meta_dir, "frame3_synthesis_highfive.jpg")
m4_img = os.path.join(meta_dir, "frame4_human_date.jpg")

filter_meta = (
    # Frame 1: 0 - 10.0s (10.0s)
    "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,"
    "drawtext=text='01 / ON-DEVICE SOVEREIGN PROFILING':font='Arial':fontsize=26:fontcolor=white:x=80:y=h-90:box=1:boxcolor=black@0.55:boxborderw=10,"
    "drawtext=text='Meta Muse learning authentic rhythm with zero cloud egress':font='Arial':fontsize=16:fontcolor=white@0.85:x=80:y=h-50:box=1:boxcolor=black@0.4:boxborderw=6,"
    "fade=t=out:st=9.2:d=0.8[v0];"
    # Frame 2: 0 - 11.5s
    "[1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,"
    "drawtext=text='02 / AUTONOMOUS PING-PONG BANTER':font='Arial':fontsize=26:fontcolor=white:x=80:y=h-90:box=1:boxcolor=black@0.55:boxborderw=10,"
    "drawtext=text='Embodied companion mascots stress-testing alignment at machine speed':font='Arial':fontsize=16:fontcolor=white@0.85:x=80:y=h-50:box=1:boxcolor=black@0.4:boxborderw=6,"
    "fade=t=in:st=0:d=0.8,fade=t=out:st=10.7:d=0.8[v1];"
    # Frame 3: 0 - 6.0s
    "[2:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,"
    "drawtext=text='03 / 92 PERCENT DYADIC RESONANCE VERIFIED':font='Arial':fontsize=26:fontcolor=white:x=80:y=h-90:box=1:boxcolor=black@0.55:boxborderw=10,"
    "drawtext=text='High-resonance verification: 16 turns of empirical proof':font='Arial':fontsize=16:fontcolor=white@0.85:x=80:y=h-50:box=1:boxcolor=black@0.4:boxborderw=6,"
    "fade=t=in:st=0:d=0.8,fade=t=out:st=5.2:d=0.8[v2];"
    # Frame 4: 0 - 7.0s
    "[3:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,"
    "drawtext=text='04 / CURATED OFFLINE FIRST DATE':font='Arial':fontsize=26:fontcolor=white:x=80:y=h-90:box=1:boxcolor=black@0.55:boxborderw=10,"
    "drawtext=text='Agents step aside · Real-world Brooklyn vinyl cafe rendezvous':font='Arial':fontsize=16:fontcolor=white@0.85:x=80:y=h-50:box=1:boxcolor=black@0.4:boxborderw=6,"
    "fade=t=in:st=0:d=0.8[v3];"
    # Concat clips
    "[v0][v1][v2][v3]concat=n=4:v=1:a=0[vout]"
)

cmd_meta = [
    ffmpeg, "-y",
    "-loop", "1", "-t", "10.0", "-i", m1_img,
    "-loop", "1", "-t", "11.5", "-i", m2_img,
    "-loop", "1", "-t", "6.0", "-i", m3_img,
    "-loop", "1", "-t", "7.0", "-i", m4_img,
    "-i", audio_path,
    "-filter_complex", filter_meta,
    "-map", "[vout]", "-map", "4:a",
    "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    "-shortest", out_meta
]
print("Executing meta render...")
subprocess.run(cmd_meta, check=True)
print(f"Generated: {out_meta} ({os.path.getsize(out_meta)/(1024*1024):.2f} MB)")
