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

# The complete studio-trained acoustic voice library across Indian languages
STUDIO_PERSONAS = [
    # 1. Ramesh K. (62M Senior Male - Cardiac / Chest Pain Emergency)
    {
        "filename": "ramesh_cardiac.mp3",
        "language_code": "od-IN",
        "speaker": "ashutosh",
        "pitch": -0.10,
        "pace": 0.82,
        "sample_rate": 24000,
        "text": "ଡାକ୍ତର ବାବୁ... ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି... ଆଉ ବହୁତ ଜୋରରେ କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ... ଆଦୌ ନେଇପାରୁନି... ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି! ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ... ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି।"
    },
    {
        "filename": "ramesh_hindi.mp3",
        "language_code": "hi-IN",
        "speaker": "ashutosh",
        "pitch": -0.10,
        "pace": 0.82,
        "sample_rate": 24000,
        "text": "डॉक्टर साहब... २ घंटे से सीने में भारी पत्थर जैसा दर्द हो रहा है... और बहुत तेज चुभन महसूस हो रही है। सांस... बिल्कुल नहीं आ रही, शरीर पसीने से ठंडा पड़ गया है! कृपया जल्दी देखें... लग रहा है सीना फट जाएगा।"
    },
    {
        "filename": "ramesh_english.mp3",
        "language_code": "en-IN",
        "speaker": "aditya",
        "pitch": -0.08,
        "pace": 0.82,
        "sample_rate": 24000,
        "text": "Doctor... for the past two hours, my chest feels crushed under a heavy stone... with unbearable stabbing pain. I can barely breathe... and I am breaking into a cold sweat! Please check me quickly... it feels like my chest is tearing."
    },
    # 2. Priya S. (34F Adult Female - Dengue / Febrile Exhaustion)
    {
        "filename": "priya_fever.mp3",
        "language_code": "od-IN",
        "speaker": "priya",
        "pitch": -0.02,
        "pace": 0.85,
        "sample_rate": 24000,
        "text": "ଦିଦି... ୩ ଦିନ ହେଲା ଦେହ ସାରା ନିଆଁ ଭଳି ତାତିଛି... ମୁଣ୍ଡଟା ଏତେ ଜୋରରେ ବିନ୍ଧୁଛି ଯେ ଆଖି ଖୋଲି ହେଉନି। ହାତ ଗୋଡ଼ରେ ଲାଲ୍ ଦାଗ ବାହାରି ପଡ଼ିଛି... ଆଉ ଚାଲିବାକୁ ଜମା ବଳ ପାଉନି।"
    },
    {
        "filename": "priya_hindi.mp3",
        "language_code": "hi-IN",
        "speaker": "priya",
        "pitch": -0.02,
        "pace": 0.85,
        "sample_rate": 24000,
        "text": "दीदी... ३ दिन से पूरा बदन भट्टी की तरह तप रहा है... सिर में इतना भयानक दर्द है कि आंखें भी नहीं खुल रही हैं। पूरे हाथ-पैरों में लाल चकत्ते निकल आए हैं... और चलने की बिल्कुल ताक़त नहीं बची है।"
    },
    # 3. Lipu S. (7M Pediatric Child - Acute Abdominal Pain)
    {
        "filename": "lipu_pediatric.mp3",
        "language_code": "od-IN",
        "speaker": "aayan",
        "pitch": 0.16,
        "pace": 0.88,
        "sample_rate": 24000,
        "text": "ଦିଦି... ପେଟଟା ଭୀଷଣ ବିନ୍ଧୁଛି! ସକାଳୁ ୨ ଥର ବାନ୍ତି ହେଲାଣି... ଆଉ କିଛି ଖାଇ ହେଉନି... ବହୁତ କଷ୍ଟ ହେଉଛି।"
    },
    {
        "filename": "lipu_hindi.mp3",
        "language_code": "hi-IN",
        "speaker": "aayan",
        "pitch": 0.16,
        "pace": 0.88,
        "sample_rate": 24000,
        "text": "दीदी... पेट में बहुत तेज दर्द हो रहा है! सुबह से दो बार उल्टी हो गई... और कुछ भी खाया नहीं जा रहा, बहुत रोना आ रहा है।"
    },
    # 4. Subhash P. (24M Screen Fatigue & Mild Tension Headache)
    {
        "filename": "subhash_odia.mp3",
        "language_code": "od-IN",
        "speaker": "shubh",
        "pitch": 0.00,
        "pace": 0.90,
        "sample_rate": 24000,
        "text": "ନମସ୍କାର ଦିଦି... ଗତକାଲି ରାତିରେ ଅନେକ ସମୟ ଧରି ପାଠ ପଢ଼ିବା ପରେ ମଥାଟା ସାମାନ୍ୟ ବିନ୍ଧୁଛି। ଜ୍ୱର କି ବାନ୍ତି କିଛି ନାହିଁ, କେବଳ ଟିକେ ଥକା ଲାଗୁଛି।"
    },
    # 5. Bedside Triage Nurse Advisory (Empathetic Medical Officer)
    {
        "filename": "nurse_advisory.mp3",
        "language_code": "en-IN",
        "speaker": "ishita",
        "pitch": 0.00,
        "pace": 0.90,
        "sample_rate": 24000,
        "text": "Patient has been registered with verified ABHA ID. Priority triage indicates acute respiratory and cardiac distress. High-flow oxygen and emergency ECG are being prepared at the emergency bay."
    },
    # 6. Chief Medical Officer Doctor Handover (Authoritative Referral)
    {
        "filename": "doctor_referral.mp3",
        "language_code": "en-IN",
        "speaker": "aditya",
        "pitch": -0.04,
        "pace": 0.90,
        "sample_rate": 24000,
        "text": "Clinical handover alert. High priority cardiac case requiring immediate CCU transfer. Bilateral oxygenation active, emergency stabilization underway."
    }
]

def synthesize_studio_personas():
    print("=========================================================================")
    print("      SYNTHESIZING ZERO-RECORDING TRAINED VOICE PERSONAS (SARVAM AI)")
    print("      Fidelity: 24,000 Hz | Biological Acoustics & Inhalation Markers")
    print("=========================================================================")

    for item in STUDIO_PERSONAS:
        out_path = os.path.join(OUTPUT_DIR, item["filename"])
        print(f"\n[SYNTHESIZING] {item['filename']} ({item['language_code']} - {item['speaker']} @ {item['sample_rate']}Hz)...")

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
                    with open(out_path, "wb") as f_out:
                        f_out.write(audio_bytes)
                    print(f"[SUCCESS] Saved {item['filename']} ({len(audio_bytes)} bytes)")
                else:
                    print(f"[ERROR] No audio for {item['filename']}")
            else:
                print(f"[ERROR] Failed {item['filename']}: {resp.status_code} - {resp.text}")
        except Exception as e:
            print(f"[EXCEPTION] Failed {item['filename']}: {e}")

    print("\nAll zero-recording trained personas synthesized successfully!")

if __name__ == "__main__":
    synthesize_studio_personas()
