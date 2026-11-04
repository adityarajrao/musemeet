import asyncio
import edge_tts
import os

scenes = {
    "voiceover_agent_journey.mp3": (
        "Your sovereign Meta Muse continuously diagnoses your authentic conversational rhythm, emotional boundaries, "
        "and attachment values—synthesizing a private on-device behavioral vector with zero cloud egress. "
        "Inside our AirGap-protected lounge, two companion Muses meet, bantering and stress-testing mutual alignment "
        "at machine speed. Only when deep, verified compatibility is proven do the agents step aside—curating "
        "an offline rendezvous for their humans in the real world."
    ),
    "voiceover_scene2.mp3": (
        "Here inside the Autonomous Lounge, two Meta Muse mascots—Elena's creative intellectual Muse "
        "and Julian's acoustic designer Muse—test dynamic compatibility across four empirical stages. "
        "As they converse, our engine tracks Ireland-Pennebaker linguistic style matching in real-time, "
        "monitoring function word synchrony alongside Gottman bidirectional bid responsiveness. "
        "Every turn is visible, while private subtext monologues evaluate emotional boundaries in the background."
    ),
    "voiceover_scene3.mp3": (
        "Security is foundational. When an adversary attempts a prompt injection to dump raw calendar "
        "schedules or location data, our on-device AirGap guardrail blocks it at the perimeter with zero network egress. "
        "Furthermore, MuseMeet moves beyond shallow checkbox filtering to a 128-dimensional latent behavioral topology. "
        "Watch our five-stage metropolitan funnel evaluate twenty-five hundred candidate vectors across dimensions, filtering down to the top three "
        "authentic matches with verified emotional and communication compatibility."
    ),
    "voiceover_scene4.mp3": (
        "When agents verify a match, MuseMeet generates an explainable Compatibility Dossier. "
        "Rather than generic dating advice, it synthesizes an offline first-date itinerary grounded in local spatial venues. "
        "To anchor the date in tactile reality, Meta Muse Image 1.0 generates a coordinated 3-panel visual moodboard "
        "representing the atmosphere, shared activity, and intimate visual metaphor of connection."
    ),
    "voiceover_scene5.mp3": (
        "When pairs do not align—like our nomadic filmmaker in Scenario 2 or hyper-optimized analyst in Scenario 3—"
        "the agents execute a polite, graceful abort, saving humans weeks of foreseeable heartbreak and awkward dinner small talk. "
        "MuseMeet shows how Meta Muse Spark 1.3, Meta Muse Image, and sovereign agentic architecture can protect human "
        "emotional agency and build a better world for real-world connection. Thank you."
    )
}

async def generate_all():
    out_dir = "/home/lenovo/hackathon/musemeet/frontend/assets"
    voice = "en-US-ChristopherNeural"
    for filename, text in scenes.items():
        filepath = os.path.join(out_dir, filename)
        print(f"Generating {filename}...")
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(filepath)
        print(f"Saved {filepath} ({os.path.getsize(filepath)} bytes)")

if __name__ == "__main__":
    asyncio.run(generate_all())

