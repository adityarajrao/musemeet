import asyncio
import edge_tts
from datetime import timedelta
import os
import re
import subprocess
import sys

base_dir = "/home/lenovo/hackathon/musemeet"
assets_dir = os.path.join(base_dir, "frontend/assets")
slides_dir = os.path.join(assets_dir, "demo_slides")
andrew_dir = os.path.join(assets_dir, "andrew")
os.makedirs(andrew_dir, exist_ok=True)

voice = "en-US-AndrewMultilingualNeural"
rate = "+8%"
ffmpeg = "/home/lenovo/.local/bin/ffmpeg"
temp_dir = "/tmp/musemeet_v4_clips"
os.makedirs(temp_dir, exist_ok=True)

scenes_data = [
    {
        "id": "scene1",
        "title": "Problem Hook",
        "text": (
            "Modern dating apps have devolved into a superficial numbers game. "
            "Millions of singles suffer from swiping fatigue, deceptive profiles, "
            "and repetitive, exhausting interview-style first dates that burn emotional energy."
        )
    },
    {
        "id": "scene2",
        "title": "Sovereign Agent Journey",
        "text": (
            "MuseMeet introduces Sovereign Agentic Dating. Your personal Meta Muse continuously learns "
            "your authentic conversational rhythm, emotional boundaries, and attachment values, synthesizing "
            "a private on-device behavioral vector with zero cloud egress. Inside our AirGap-protected lounge, "
            "two companion Muses meet, bantering and stress-testing mutual alignment at machine speed. "
            "Only when deep, verified compatibility is proven do the agents step aside, curating an offline "
            "rendezvous for their humans in the real world."
        )
    },
    {
        "id": "scene3",
        "title": "Autonomous Lounge",
        "text": (
            "Here inside the Autonomous Lounge, two Meta Muse mascots, Elena's creative intellectual Muse "
            "and Julian's acoustic designer Muse, test dynamic compatibility across four empirical stages. "
            "As they converse, our engine tracks real-time conversational resonance and linguistic rhythm, "
            "monitoring natural communication flow alongside emotional bid responsiveness. "
            "Every turn is visible, while private subtext monologues evaluate boundaries in the background."
        )
    },
    {
        "id": "scene4",
        "title": "AirGap Defense & 128D Moat",
        "text": (
            "Security is foundational. When an adversary attempts a prompt injection to dump raw calendar schedules "
            "or location data, our on-device AirGap guardrail blocks it at the perimeter with zero network egress. "
            "Furthermore, MuseMeet moves beyond superficial checkbox filtering to a 128-dimensional behavioral map, "
            "analyzing personality, humor, and lifestyle rhythms. Watch our multi-stage matching engine evaluate twenty-five hundred "
            "candidate profiles across 128 dimensions, filtering down to the top three authentic matches with verified emotional and communication compatibility."
        )
    },
    {
        "id": "scene5",
        "title": "Compatibility Dossier & Moodboard",
        "text": (
            "When agents verify a match, MuseMeet generates an explainable Compatibility Dossier. "
            "Rather than generic dating advice, it synthesizes an offline first-date itinerary grounded in local spatial venues. "
            "To anchor the date in tactile reality, Meta Muse Image 1.0 generates a coordinated 3-panel visual moodboard "
            "representing the atmosphere, shared activity, and intimate visual metaphor of connection."
        )
    },
    {
        "id": "scene6",
        "title": "Vision & Call to Action",
        "text": (
            "When two people do not align, whether from conflicting life goals, mismatched emotional pacing, "
            "or incompatible values, the agents execute a polite, graceful abort. This saves humans weeks of "
            "foreseeable heartbreak and awkward small talk. MuseMeet shows how Meta Muse Spark 1.3, Meta Muse Image, "
            "and sovereign agentic architecture can protect human emotional agency and build a better world for "
            "real-world connection. Thank you."
        )
    }
]

def format_time(td):
    total_seconds = int(td.total_seconds())
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    millis = int(td.microseconds / 1000)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{millis:03d}"

def split_sentence_clean(text, start_td, end_td, max_words=5):
    """Splits sentence into short 3-5 word chunks and removes all em-dashes and stray dashes."""
    cleaned = text.replace("—", " ").replace("–", " ").replace("--", " ")
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    words = cleaned.split()
    
    if len(words) <= max_words:
        return [{"start": start_td, "end": end_td, "text": cleaned}]
        
    total_duration = (end_td - start_td).total_seconds()
    total_chars = sum(len(w) for w in words)
    
    chunks = []
    current_chunk = []
    for w in words:
        current_chunk.append(w)
        ends_punct = bool(re.search(r'[,;:]$', w))
        if len(current_chunk) >= max_words or (ends_punct and len(current_chunk) >= 3):
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            
    if current_chunk:
        chunk_str = " ".join(current_chunk)
        if chunks and len(current_chunk) <= 2:
            chunks[-1] += " " + chunk_str
        else:
            chunks.append(chunk_str)
            
    result = []
    current_time = start_td
    for c in chunks:
        c_chars = sum(len(w) for w in c.split())
        c_dur = total_duration * (c_chars / total_chars)
        c_end = current_time + timedelta(seconds=c_dur)
        result.append({
            "start": current_time,
            "end": c_end,
            "text": c.strip()
        })
        current_time = c_end
        
    return result

async def generate_v4():
    print("==========================================================================")
    print("=== SYNTHESIZING REVISED AUDIO TRACKS & SUBTITLES (ZERO EM-DASHES) ===")
    print("==========================================================================")
    
    master_cues = []
    current_time_offset = timedelta(0)

    for idx, sc in enumerate(scenes_data):
        audio_path = os.path.join(andrew_dir, f"{sc['id']}_audio.mp3")
        print(f"\n[{idx+1}/6] Synthesizing {sc['id']} ({sc['title']})...")
        
        success = False
        for attempt in range(1, 5):
            try:
                comm = edge_tts.Communicate(sc["text"], voice, rate=rate)
                submaker = edge_tts.SubMaker()
                audio_data = bytearray()
                
                async for chunk in comm.stream():
                    if chunk["type"] == "audio":
                        audio_data.extend(chunk["data"])
                    elif chunk["type"] in ("WordBoundary", "SentenceBoundary"):
                        submaker.feed(chunk)
                
                if len(audio_data) > 0:
                    with open(audio_path, "wb") as f:
                        f.write(audio_data)
                    success = True
                    break
            except Exception as e:
                print(f"Attempt {attempt} failed: {e}. Retrying in 2 seconds...")
                await asyncio.sleep(2)

        if not success:
            raise RuntimeError(f"Failed to synthesize {sc['id']} after 4 attempts.")
            
        res = subprocess.run([ffmpeg, "-i", audio_path], capture_output=True, text=True)
        duration_sec = 0.0
        for line in res.stderr.splitlines():
            if "Duration:" in line:
                parts = line.strip().split("Duration:")[1].split(",")[0].strip().split(":")
                duration_sec = float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])
                sc["duration"] = duration_sec
                print(f"Duration: {duration_sec:.2f}s")
                break
                
        # Split cues cleanly into 3-5 word phrases with 0 em-dashes
        for cue in submaker.cues:
            adjusted_start = current_time_offset + cue.start
            adjusted_end = current_time_offset + cue.end
            split_cues = split_sentence_clean(cue.content, adjusted_start, adjusted_end, max_words=5)
            master_cues.extend(split_cues)
            
        current_time_offset += timedelta(seconds=duration_sec)

    # Write Master SRT File
    srt_path = os.path.join(assets_dir, "musemeet_master_demo_v4.srt")
    with open(srt_path, "w", encoding="utf-8") as f:
        for i, cue in enumerate(master_cues, 1):
            f.write(f"{i}\n")
            f.write(f"{format_time(cue['start'])} --> {format_time(cue['end'])}\n")
            f.write(f"{cue['text']}\n\n")
            
    print(f"\nGenerated Master SRT file: {srt_path} ({len(master_cues)} short, em-dash-free cues)")
    print(f"Total Video Runtime: {current_time_offset.total_seconds():.2f}s")

    # -------------------------------------------------------------
    # RENDER VIDEO SCENES WITH FRESH SLIDES
    # -------------------------------------------------------------
    master_clean = os.path.join(assets_dir, "musemeet_master_demo_v4_andrew.mp4")
    master_subtitled = os.path.join(assets_dir, "musemeet_master_demo_v4_andrew_subtitled.mp4")

    print("\n==========================================================================")
    print("=== RENDERING MASTER VIDEO V4 WITH SEPARATED MOODBOARD & FRESH SLIDES ===")
    print("==========================================================================")

    # Scene 1: Problem Hook
    print("\n[1/6] Rendering Scene 1 (Problem Hook)...")
    s1_video = os.path.join(temp_dir, "scene1_video.mp4")
    s1_dur = scenes_data[0]["duration"]
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

    # Scene 2: Sovereign Agent Journey
    print("\n[2/6] Rendering Scene 2 (Sovereign Agent Journey)...")
    s2_video = os.path.join(temp_dir, "scene2_video.mp4")
    s2_dur = scenes_data[1]["duration"]
    cmd_s2 = [
        ffmpeg, "-y",
        "-loop", "1", "-t", "9.8", "-i", os.path.join(assets_dir, "slide_journey_focus1.png"),
        "-loop", "1", "-t", "11.5", "-i", os.path.join(assets_dir, "slide_journey_focus2.png"),
        "-loop", "1", "-t", "5.7", "-i", os.path.join(assets_dir, "slide_journey_focus3.png"),
        "-loop", "1", "-t", str(s2_dur - 27.0 + 1.0), "-i", os.path.join(assets_dir, "elena_julian_offline_date.jpg"),
        "-i", os.path.join(andrew_dir, "scene2_audio.mp3"),
        "-filter_complex",
        (
            "[0:v]scale=1920:1080,setsar=1,fps=30,fade=t=out:st=9.0:d=0.8[v0];"
            "[1:v]scale=1920:1080,setsar=1,fps=30,fade=t=in:st=0:d=0.8,fade=t=out:st=10.7:d=0.8[v1];"
            "[2:v]scale=1920:1080,setsar=1,fps=30,fade=t=in:st=0:d=0.8,fade=t=out:st=4.9:d=0.8[v2];"
            "[3:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,fade=t=in:st=0:d=0.8[v3];"
            "[v0][v1][v2][v3]concat=n=4:v=1:a=0[v]"
        ),
        "-map", "[v]", "-map", "4:a",
        "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", s2_video
    ]
    subprocess.run(cmd_s2, check=True)

    # Scene 3: Autonomous Lounge (Fresh Fullscreen Slide)
    print("\n[3/6] Rendering Scene 3 (Autonomous Lounge)...")
    s3_video = os.path.join(temp_dir, "scene3_video.mp4")
    s3_dur = scenes_data[2]["duration"]
    cmd_s3 = [
        ffmpeg, "-y",
        "-loop", "1", "-t", "7.5", "-i", os.path.join(slides_dir, "slide_judge_tour.png"),
        "-loop", "1", "-t", str(s3_dur - 6.7 + 0.5), "-i", os.path.join(slides_dir, "slide_lounge_rendezvous.png"),
        "-i", os.path.join(andrew_dir, "scene3_audio.mp3"),
        "-filter_complex",
        (
            "[0:v]scale=1920:1080,setsar=1,fps=30,fade=t=out:st=6.7:d=0.8[v0];"
            "[1:v]scale=1920:1080,setsar=1,fps=30,fade=t=in:st=0:d=0.8[v1];"
            "[v0][v1]concat=n=2:v=1:a=0[v]"
        ),
        "-map", "[v]", "-map", "2:a",
        "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", s3_video
    ]
    subprocess.run(cmd_s3, check=True)

    # Scene 4: AirGap Defense & 128D Moat (Fresh Fullscreen Slides)
    print("\n[4/6] Rendering Scene 4 (AirGap Defense & 128D Moat)...")
    s4_video = os.path.join(temp_dir, "scene4_video.mp4")
    s4_dur = scenes_data[3]["duration"]
    cmd_s4 = [
        ffmpeg, "-y",
        "-loop", "1", "-t", "15.0", "-i", os.path.join(slides_dir, "slide_airgap_defense.png"),
        "-loop", "1", "-t", str(s4_dur - 14.2 + 0.5), "-i", os.path.join(slides_dir, "slide_128d_benchmark.png"),
        "-i", os.path.join(andrew_dir, "scene4_audio.mp3"),
        "-filter_complex",
        (
            "[0:v]scale=1920:1080,setsar=1,fps=30,fade=t=out:st=14.2:d=0.8[v0];"
            "[1:v]scale=1920:1080,setsar=1,fps=30,fade=t=in:st=0:d=0.8[v1];"
            "[v0][v1]concat=n=2:v=1:a=0[v]"
        ),
        "-map", "[v]", "-map", "2:a",
        "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", s4_video
    ]
    subprocess.run(cmd_s4, check=True)

    # Scene 5: Grounded Dossier & Meta Moodboard (SEPARATED INTO 2 DISTINCT 1080p SLIDES)
    print("\n[5/6] Rendering Scene 5 (Separated Dossier Itinerary + 3-Panel Moodboard)...")
    s5_video = os.path.join(temp_dir, "scene5_video.mp4")
    s5_dur = scenes_data[4]["duration"]
    # 0 - 11.5s: slide_dossier_venue.png (Itinerary & Venue Card)
    # 11.5 - 26.2s: slide_dossier_moodboard.png (3-Panel Meta Muse Image Moodboard)
    cmd_s5 = [
        ffmpeg, "-y",
        "-loop", "1", "-t", "12.0", "-i", os.path.join(slides_dir, "slide_dossier_venue.png"),
        "-loop", "1", "-t", str(s5_dur - 11.2 + 0.5), "-i", os.path.join(slides_dir, "slide_dossier_moodboard.png"),
        "-i", os.path.join(andrew_dir, "scene5_audio.mp3"),
        "-filter_complex",
        (
            "[0:v]scale=1920:1080,setsar=1,fps=30,fade=t=out:st=11.2:d=0.8[v0];"
            "[1:v]scale=1920:1080,setsar=1,fps=30,fade=t=in:st=0:d=0.8[v1];"
            "[v0][v1]concat=n=2:v=1:a=0[v]"
        ),
        "-map", "[v]", "-map", "2:a",
        "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", s5_video
    ]
    subprocess.run(cmd_s5, check=True)

    # Scene 6: Vision & Call to Action (Revised Non-Matching Story)
    print("\n[6/6] Rendering Scene 6 (Vision & Call to Action)...")
    s6_video = os.path.join(temp_dir, "scene6_video.mp4")
    cmd_s6 = [
        ffmpeg, "-y",
        "-loop", "1", "-t", str(scenes_data[5]["duration"] + 0.5), "-i", os.path.join(slides_dir, "slide_conclusion.png"),
        "-i", os.path.join(andrew_dir, "scene6_audio.mp3"),
        "-filter_complex",
        "[0:v]scale=1920:1080,setsar=1,fps=30[v]",
        "-map", "[v]", "-map", "1:a",
        "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", s6_video
    ]
    subprocess.run(cmd_s6, check=True)

    # Concatenate all 6 scenes into Master Clean Video
    print("\nStitching all 6 scenes into Master Video V4...")
    concat_list = os.path.join(temp_dir, "concat_list_v4.txt")
    with open(concat_list, "w") as f:
        for v in [s1_video, s2_video, s3_video, s4_video, s5_video, s6_video]:
            f.write(f"file '{v}'\n")

    cmd_master = [
        ffmpeg, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        master_clean
    ]
    subprocess.run(cmd_master, check=True)
    print(f"Clean Master Video complete: {master_clean} ({os.path.getsize(master_clean)/(1024*1024):.2f} MB)")

    # Burn refined subtitles with 100% transparent background, compact font, zero em-dashes
    print("\nBurning refined transparent subtitles into Master Video V4...")
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
    print(f"Subtitled Master Video V4 complete: {master_subtitled} ({os.path.getsize(master_subtitled)/(1024*1024):.2f} MB)")

    print(f"\n========================================================")
    print(f"MASTER DEMO VIDEO V4 FULLY GENERATED!")
    print(f"Subtitled Master: {master_subtitled}")
    print(f"Clean Master:     {master_clean}")
    print(f"SRT Subtitles:   {srt_path}")
    print(f"========================================================")

if __name__ == "__main__":
    asyncio.run(generate_v4())
