import urllib.request
import json
import base64
import os
import ssl

ctx = ssl.create_default_context()
api_key = "LLM_29113079324991578_IebtE8tuHW8zjuPH9e4ZDlSgcwU"
output_dir = "/home/lenovo/hackathon/musemeet/frontend/assets/meta_journey"
os.makedirs(output_dir, exist_ok=True)

prompts = [
    {
        "id": "frame1_profiling",
        "title": "On-Device Persona Profiling",
        "prompt": (
            "A charming, round, expressive 3D clay-style AI companion mascot with warm terracotta and amber accents, "
            "sitting happily on a wooden desk next to a vintage 35mm film camera and architectural blueprints. "
            "The mascot has glowing friendly eyes and holds a tiny glowing holographic notebook, learning in a cozy sunlit studio. "
            "Pixar claymation style, soft warm volumetric lighting, adorable, tactile 3D render."
        )
    },
    {
        "id": "frame2_pingpong_banter",
        "title": "Autonomous Match & Ping-Pong Banter",
        "prompt": (
            "Two adorable, stylized 3D clay AI companion mascots—one terracotta-orange and one emerald-green—playing an energetic, "
            "playful ping-pong table tennis match inside a glowing retro-futuristic digital lounge. They are laughing and volleying "
            "a glowing neon pulse ball over a sleek table with light dotted connection beams in the air. Playful, whimsical, Pixar 3D aesthetic."
        )
    },
    {
        "id": "frame3_synthesis_highfive",
        "title": "Resonance Verification & High-Five",
        "prompt": (
            "Two cute 3D companion mascots, terracotta and emerald green, joyfully jumping in the air and giving each other a high-five "
            "under a warm glowing neon sign showing '92% Resonance Verified'. Floating glowing particles and sparkles. "
            "Whimsical claymation aesthetic, celebratory, heartwarming, cinematic depth of field."
        )
    },
    {
        "id": "frame4_human_date",
        "title": "Curated Offline First Date",
        "prompt": (
            "In the sharp foreground, two small cute 3D companion mascots smile proudly and peek over a rustic wooden table. "
            "In the cozy, warm-lit background, a smiling stylish woman and a man are happily talking over coffee and vinyl records "
            "at an intimate Brooklyn listening bar. Warm amber lighting, heartwarming, cinematic Pixar meets film photography."
        )
    }
]

print("Generating 4 frames via Meta API (muse-image-1.0)...")
for p in prompts:
    print(f"\nRequesting {p['id']}...")
    payload = {
        "model": "muse-image-1.0",
        "prompt": p["prompt"],
        "n": 1,
        "size": "1024x1024"
    }
    data_bytes = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        "https://api.meta.ai/v1/images/generations",
        data=data_bytes,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            res = json.loads(resp.read().decode())
            b64 = res["data"][0]["b64_json"]
            out_file = os.path.join(output_dir, f"{p['id']}.jpg")
            with open(out_file, "wb") as f_img:
                f_img.write(base64.b64decode(b64))
            print(f"Saved: {out_file} ({os.path.getsize(out_file)} bytes)")
    except Exception as e:
        print(f"Error on {p['id']}: {e}")

print("\nAll Meta API generations finished!")

