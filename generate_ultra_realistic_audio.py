import os
import requests
import json
import base64
from dotenv import load_dotenv

load_dotenv("backend/.env")

API_KEY = os.getenv("SARVAM_API_KEY")
URL = "https://api.sarvam.ai/text-to-speech"
OUTPUT_DIR = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh\frontend\public\audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

headers = {
    "api-subscription-key": API_KEY,
    "Content-Type": "application/json"
}

# The Ultra-Realistic Clinical Voice Suite with Natural Physiological Inhalation & Distress Tokens
ULTRA_CASES = [
    # 1. Ramesh K. (62M Senior Male - Cardiac / Chest Pain Emergency)
    {
        "files": ["ramesh_cardiac.mp3", "ramesh_cardiac_odia.wav"],
        "language_code": "od-IN",
        "speaker": "ashutosh",
        "pitch": -0.12,
        "pace": 0.78,
        "sample_rate": 24000,
        "text": "ଆଃ... ଡାକ୍ତର ବାବୁ... ହଃ... ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି... କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ... ଆଦୌ ନେଇପାରୁନି... ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି! ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ... ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି।"
    },
    {
        "files": ["ramesh_hindi.mp3", "ramesh_cardiac_hindi.wav"],
        "language_code": "hi-IN",
        "speaker": "ashutosh",
        "pitch": -0.12,
        "pace": 0.78,
        "sample_rate": 24000,
        "text": "आह... डॉक्टर साहब... २ घंटे से सीने में भारी पत्थर जैसा दर्द हो रहा है... बहुत तेज चुभन महसूस हो रही है। उफ्फ... सांस बिल्कुल नहीं आ रही... पूरा शरीर पसीने से ठंडा पड़ गया है! कृपया जल्दी देखें... लग रहा है सीना फट जाएगा।"
    },
    {
        "files": ["ramesh_english.mp3"],
        "language_code": "en-IN",
        "speaker": "aditya",
        "pitch": -0.08,
        "pace": 0.80,
        "sample_rate": 24000,
        "text": "Ah... Doctor... for two hours my chest feels crushed under a heavy stone... with unbearable stabbing pain. Hah... I can barely breathe... and I am breaking into a cold sweat! Please check me quickly... it feels like my chest is tearing apart."
    },
    # 2. Priya S. (34F Adult Female - Dengue / Febrile Exhaustion)
    {
        "files": ["priya_fever.mp3", "priya_fever_odia.wav"],
        "language_code": "od-IN",
        "speaker": "priya",
        "pitch": -0.03,
        "pace": 0.83,
        "sample_rate": 24000,
        "text": "ଆଃ... ଦିଦି... ୩ ଦିନ ହେଲା ଦେହ ସାରା ନିଆଁ ଭଳି ତାତିଛି... ମୁଣ୍ଡଟା ଏତେ ଜୋରରେ ବିନ୍ଧୁଛି ଯେ ଆଖି ଖୋଲି ହେଉନି। ହାତ ଗୋଡ଼ରେ ଲାଲ୍ ଦାଗ ବାହାରି ପଡ଼ିଛି... ଆଉ ଚାଲିବାକୁ ଜମା ବଳ ପାଉନି।"
    },
    {
        "files": ["priya_hindi.mp3", "priya_fever_hindi.wav"],
        "language_code": "hi-IN",
        "speaker": "priya",
        "pitch": -0.03,
        "pace": 0.83,
        "sample_rate": 24000,
        "text": "उफ्फ... दीदी... ३ दिन से पूरा बदन भट्टी की तरह तप रहा है... सिर में इतना भयानक दर्द है कि आंखें भी नहीं खुल रही हैं। पूरे हाथ-पैरों में लाल चकत्ते निकल आए हैं... और चलने की बिल्कुल ताक़त नहीं बची है।"
    },
    # 3. Lipu S. (7M Pediatric Child - Acute Abdominal Pain)
    {
        "files": ["lipu_pediatric.mp3", "lipu_pediatric_odia.wav"],
        "language_code": "od-IN",
        "speaker": "aayan",
        "pitch": 0.16,
        "pace": 0.87,
        "sample_rate": 24000,
        "text": "ଦିଦି... ଆଃ... ପେଟଟା ଭୀଷଣ ବିନ୍ଧୁଛି! ସକାଳୁ ୨ ଥର ବାନ୍ତି ହେଲାଣି... ଆଉ କିଛି ଖାଇ ହେଉନି... ବହୁତ କଷ୍ଟ ହେଉଛି।"
    },
    {
        "files": ["lipu_hindi.mp3", "aarav_pediatric_hindi.wav"],
        "language_code": "hi-IN",
        "speaker": "aayan",
        "pitch": 0.16,
        "pace": 0.87,
        "sample_rate": 24000,
        "text": "दीदी... पेट में बहुत तेज दर्द हो रहा है! सुबह से दो बार उल्टी हो गई... और कुछ भी खाया नहीं जा रहा, बहुत रोना आ रहा है।"
    }
]

def synthesize_ultra():
    print("=========================================================================")
    print("   SYNTHESIZING ULTRA-REALISTIC PHYSIOLOGICAL CLINICAL VOICES (SARVAM AI)")
    print("   Vocal Inhalation Cues & Gasps | 24,000 Hz Studio Broadcast")
    print("=========================================================================")

    for item in ULTRA_CASES:
        payload = {
            "inputs": [item["text"]],
            "target_language_code": item["language_code"],
            "speaker": item["speaker"],
            "pitch": item["pitch"],
            "pace": item["pace"],
            "loudness": 1.25,
            "speech_sample_rate": item["sample_rate"],
            "enable_preprocessing": True,
            "model": "bulbul:v3"
        }

        try:
            resp = requests.post(URL, json=payload, headers=headers, timeout=30)
            if resp.status_code == 200:
                data = resp.json()
                audios = data.get("audios", [])
                if audios:
                    audio_bytes = base64.b64decode(audios[0])
                    for filename in item["files"]:
                        out_path = os.path.join(OUTPUT_DIR, filename)
                        with open(out_path, "wb") as f_out:
                            f_out.write(audio_bytes)
                        print(f"[SUCCESS] Saved {filename} ({len(audio_bytes)} bytes)")
                else:
                    print(f"[ERROR] No audio for {item['files']}")
            else:
                print(f"[ERROR] Failed {item['files']}: {resp.status_code} - {resp.text}")
        except Exception as e:
            print(f"[EXCEPTION] Failed {item['files']}: {e}")

    print("\nAll Ultra-Realistic Clinical Audio files synthesized successfully!")

if __name__ == "__main__":
    synthesize_ultra()
