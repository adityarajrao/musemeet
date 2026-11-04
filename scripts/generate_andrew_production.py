import asyncio
import edge_tts
from datetime import timedelta
import os
import subprocess
import sys

base_dir = "/home/lenovo/hackathon/musemeet"
assets_dir = os.path.join(base_dir, "frontend/assets")
andrew_dir = os.path.join(assets_dir, "andrew")
os.makedirs(andrew_dir, exist_ok=True)

voice = "en-US-AndrewMultilingualNeural"
rate = "+8%"

scenes = [
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
            "MuseMeet introduces Sovereign Agentic Dating. Your personal Meta Muse continuously diagnoses "
            "your authentic conversational rhythm, emotional boundaries, and attachment values—synthesizing "
            "a private on-device behavioral vector with zero cloud egress. Inside our AirGap-protected lounge, "
            "two companion Muses meet, bantering and stress-testing mutual alignment at machine speed. "
            "Only when deep, verified compatibility is proven do the agents step aside—curating an offline "
            "rendezvous for their humans in the real world."
        )
    },
    {
        "id": "scene3",
        "title": "Autonomous Lounge",
        "text": (
            "Here inside the Autonomous Lounge, two Meta Muse mascots—Elena's creative intellectual Muse "
            "and Julian's acoustic designer Muse—test dynamic compatibility across four empirical stages. "
            "As they converse, our engine tracks Ireland-Pennebaker linguistic style matching in real-time, "
            "monitoring function word synchrony alongside Gottman bidirectional bid responsiveness. "
            "Every turn is visible, while private subtext monologues evaluate emotional boundaries in the background."
        )
    },
    {
        "id": "scene4",
        "title": "AirGap Defense & 128D Moat",
        "text": (
            "Security is foundational. When an adversary attempts a prompt injection to dump raw calendar schedules "
            "or location data, our on-device AirGap guardrail blocks it at the perimeter with zero network egress. "
            "Furthermore, MuseMeet moves beyond shallow checkbox filtering to a 128-dimensional latent behavioral topology. "
            "Watch our five-stage metropolitan funnel evaluate twenty-five hundred candidate vectors across dimensions, filtering down to the top three "
            "authentic matches with verified emotional and communication compatibility."
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
            "When pairs do not align—like our nomadic filmmaker in Scenario 2 or hyper-optimized analyst in Scenario 3—"
            "the agents execute a polite, graceful abort, saving humans weeks of foreseeable heartbreak and awkward dinner small talk. "
            "MuseMeet shows how Meta Muse Spark 1.3, Meta Muse Image, and sovereign agentic architecture can protect human "
            "emotional agency and build a better world for real-world connection. Thank you."
        )
    }
]

def format_timestamp(td: timedelta) -> str:
    total_seconds = int(td.total_seconds())
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    millis = int(td.microseconds / 1000)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{millis:03d}"

async def generate_andrew_voiceovers():
    print(f"=== GENERATING ANDREW NARRATION TRACKS ({voice}, rate={rate}) ===")
    master_cues = []
    current_time_offset = timedelta(0)

    for idx, sc in enumerate(scenes):
        audio_path = os.path.join(andrew_dir, f"{sc['id']}_audio.mp3")
        print(f"\n[{idx+1}/6] Synthesizing {sc['id']} ({sc['title']})...")
        
        comm = edge_tts.Communicate(sc["text"], voice, rate=rate)
        submaker = edge_tts.SubMaker()
        audio_data = bytearray()
        
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                audio_data.extend(chunk["data"])
            elif chunk["type"] in ("WordBoundary", "SentenceBoundary"):
                submaker.feed(chunk)
                
        with open(audio_path, "wb") as f:
            f.write(audio_data)
            
        print(f"Saved audio: {audio_path} ({len(audio_data)} bytes)")
        
        # Determine exact audio duration using ffmpeg
        res = subprocess.run(["/home/lenovo/.local/bin/ffmpeg", "-i", audio_path], capture_output=True, text=True)
        duration_sec = 0.0
        for line in res.stderr.splitlines():
            if "Duration:" in line:
                parts = line.strip().split("Duration:")[1].split(",")[0].strip().split(":")
                duration_sec = float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])
                sc["duration"] = duration_sec
                print(f"Duration: {duration_sec:.2f}s")
                break
                
        # Offset cues for the master SRT
        for cue in submaker.cues:
            adjusted_start = current_time_offset + cue.start
            adjusted_end = current_time_offset + cue.end
            master_cues.append({
                "start": adjusted_start,
                "end": adjusted_end,
                "text": cue.content
            })
            
        current_time_offset += timedelta(seconds=duration_sec)

    # Build master SRT file
    srt_path = os.path.join(assets_dir, "musemeet_master_demo_v3.srt")
    with open(srt_path, "w", encoding="utf-8") as f:
        for i, cue in enumerate(master_cues, 1):
            f.write(f"{i}\n")
            f.write(f"{format_timestamp(cue['start'])} --> {format_timestamp(cue['end'])}\n")
            f.write(f"{cue['text']}\n\n")
            
    print(f"\nGenerated Master SRT file: {srt_path} ({len(master_cues)} subtitle cues)")
    print(f"Total Video Runtime: {current_time_offset.total_seconds():.2f}s")
    return scenes

if __name__ == "__main__":
    asyncio.run(generate_andrew_voiceovers())
