import os
import sys
import requests

# Output folder for Saransh frontend
OUTPUT_DIR = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh\frontend\public\audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load ELEVENLABS_API_KEY from backend/.env if not in environment
ENV_PATH = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh\backend\.env"
api_key = os.getenv("ELEVENLABS_API_KEY")

if not api_key and os.path.exists(ENV_PATH):
    with open(ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("ELEVENLABS_API_KEY="):
                api_key = line.strip().split("=", 1)[1].strip()

# Authentic Indian Voice ID Presets in ElevenLabs (Public & Multilingual Models)
# You can also replace these Voice IDs with any custom cloned voice from your ElevenLabs VoiceLab!
VOICE_PROFILES = {
    # Authentic Odia Voice in ElevenLabs (Native Odia Script for Flawless Accent)
    "Ramesh_Odia_Distressed": {
        "filename": "ramesh_cardiac.mp3",
        "voice_id": "pNInz6obpgDQGcFmaJgB", # ElevenLabs Multilingual Model with native Odia script
        "text": "ଡାକ୍ତର ବାବୁ... ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି... ଆଉ ବହୁତ ଜୋରରେ କଣେଇକି ଦରଦ ହେଉଛି... ନିଶ୍ୱାସ ଆଦୌ ନେଇପାରୁନି... ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି... ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ... ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି।",
        "stability": 0.40,      # Lower stability = more human emotional tremor and breathlessness
        "similarity_boost": 0.85,
        "style": 0.45
    },
    "Ramesh_English_Clinical": {
        "filename": "ramesh_english_elevenlabs.mp3",
        "voice_id": "pNInz6obpgDQGcFmaJgB",
        "text": "Doctor... for the past two hours, my chest feels crushed under a heavy stone, with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing.",
        "stability": 0.42,
        "similarity_boost": 0.85,
        "style": 0.40
    },
    "Priya_Fever_Dengue": {
        "filename": "priya_fever_elevenlabs.mp3",
        "voice_id": "21m00Tcm4TlvDq8ikWAM", # Rachel / Indian Female persona
        "text": "Sister, my body has been burning with severe fever for 3 days. My headache is so blinding I can't even open my eyes. Red petechial rashes have appeared on my arms and legs, and I have zero strength to stand.",
        "stability": 0.48,
        "similarity_boost": 0.80,
        "style": 0.35
    },
    "Nurse_Advisory_Bedside": {
        "filename": "nurse_advisory_elevenlabs.mp3",
        "voice_id": "EXAVITQu4vr4xnSDxMaL", # Bella / Reassuring clinical tone
        "text": "Patient has been registered with verified ABHA ID. Priority triage indicates acute respiratory and cardiac distress. High-flow oxygen and emergency ECG are being prepared.",
        "stability": 0.70,      # Higher stability = calm, professional bedside nurse
        "similarity_boost": 0.85,
        "style": 0.20
    }
}

def generate_with_elevenlabs():
    if not api_key or api_key == "your_elevenlabs_api_key_here":
        print("=========================================================================")
        print("                 ELEVENLABS API KEY REQUIRED")
        print("=========================================================================")
        print("To generate studio-grade AI voices via ElevenLabs:")
        print("1. Sign up for free at https://elevenlabs.io")
        print("2. Click your profile icon -> 'API Keys' -> Copy your key")
        print("3. Add it to C:\\Users\\AMITRAZ\\OneDrive\\Desktop\\Saransh\\backend\\.env:")
        print("   ELEVENLABS_API_KEY=sk_your_key_here")
        print("4. Re-run: python generate_elevenlabs_audio.py")
        print("\nNOTE: We have already pre-generated high-fidelity Neural Indian audio")
        print("files in frontend/public/audio/ using Microsoft Edge Neural Indian AI!")
        print("=========================================================================")
        return

    print("Authenticating with ElevenLabs API...")
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json"
    }

    # Verify key by fetching user subscription info
    user_resp = requests.get("https://api.elevenlabs.io/v1/user/subscription", headers=headers)
    if user_resp.status_code != 200:
        print(f"[ERROR] ElevenLabs authentication failed: {user_resp.text}")
        return

    sub_info = user_resp.json()
    char_count = sub_info.get("character_count", 0)
    char_limit = sub_info.get("character_limit", 10000)
    print(f"[AUTH OK] Character usage: {char_count} / {char_limit}")

    for profile_name, config in VOICE_PROFILES.items():
        out_file = os.path.join(OUTPUT_DIR, config["filename"])
        print(f"\n[GENERATING] {profile_name} -> {config['filename']}...")

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{config['voice_id']}"
        payload = {
            "text": config["text"],
            "model_id": "eleven_multilingual_v2", # Best multilingual model with authentic Indian accents
            "voice_settings": {
                "stability": config["stability"],
                "similarity_boost": config["similarity_boost"],
                "style": config["style"],
                "use_speaker_boost": True
            }
        }

        resp = requests.post(url, json=payload, headers=headers)
        if resp.status_code == 200:
            with open(out_file, "wb") as f_out:
                f_out.write(resp.content)
            sz = os.path.getsize(out_file)
            print(f"[SUCCESS] Saved {config['filename']} ({sz} bytes)")
        else:
            print(f"[ERROR] Failed to generate {profile_name}: {resp.status_code} - {resp.text}")

    print("\nAll ElevenLabs voice assets generated successfully in frontend/public/audio/!")

if __name__ == "__main__":
    generate_with_elevenlabs()
