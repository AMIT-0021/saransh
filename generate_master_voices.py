import os
import sys
import base64
import requests
import asyncio
import edge_tts

# Target output folder
OUTPUT_DIR = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh\frontend\public\audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

SARVAM_KEY = "sk_59bgvpud_U63opIk3mtAhebdnb2M3XAHz"
SARVAM_URL = "https://api.sarvam.ai/text-to-speech"

print("=========================================================================")
print("   GENERATING MASTER CLINICAL VOICES: ULTRA-REALISTIC & DEEPLY HUMAN")
print("   Engines: Sarvam AI Bulbul v3 (24kHz) + Microsoft Edge Neural Expressive")
print("=========================================================================")

# --------------------------------------------------------------------------
# 1. ODIA PATIENT PERSONAS (Sarvam AI Bulbul v3 @ 24,000 Hz)
# --------------------------------------------------------------------------
ODIA_CASES = [
    {
        "id": "Ramesh_ACS_Odia",
        "filenames": ["ramesh_cardiac_odia.wav", "ramesh_cardiac.mp3"],
        "speaker": "ashutosh",
        "pitch": -0.12,
        "pace": 0.77,
        "loudness": 1.20,
        "text": "ଆଃ... ଡାକ୍ତର ବାବୁ... ୨ ଘଣ୍ଟା ହେଲା... ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି... କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ... ଆଦୌ ନେଇପାରୁନି... ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି! ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ... ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି... ଆଃ..."
    },
    {
        "id": "Priya_Dengue_Odia",
        "filenames": ["priya_fever_odia.wav", "priya_fever.mp3"],
        "speaker": "priya",
        "pitch": -0.03,
        "pace": 0.80,
        "loudness": 1.15,
        "text": "ଉଫ୍... ଦିଦି... ୩ ଦିନ ହେଲା ଦେହ ସାରା ନିଆଁ ଭଳି ତାତିଛି... ମୁଣ୍ଡଟା ଏତେ ଜୋରରେ ବିନ୍ଧୁଛି ଯେ ଆଖି ବି ଖୋଲି ହେଉନି। ହାତ ଗୋଡ଼ରେ ଲାଲ୍ ଦାଗ ବାହାରି ପଡ଼ିଛି... ଆଉ ଠିଆ ହେବାକୁ ଜମା ବଳ ପାଉନି... ଦୟାକରି ସାହାଯ୍ୟ କରନ୍ତୁ।"
    },
    {
        "id": "Aarav_Pediatric_Odia",
        "filenames": ["lipu_pediatric_odia.wav", "lipu_pediatric.mp3"],
        "speaker": "aayan",
        "pitch": 0.18,
        "pace": 0.85,
        "loudness": 1.15,
        "text": "ଦିଦି... ପେଟଟା ଭୀଷଣ ବିନ୍ଧୁଛି! ସକାଳୁ ୨ ଥର ବାନ୍ତି ହେଲାଣି... ଆଉ କିଛି ଖାଇ ହେଉନି... ବହୁତ କଷ୍ଟ ହେଉଛି ଦିଦି... ପ୍ଲିଜ୍ ଦେଖନ୍ତୁ..."
    },
    {
        "id": "Subhash_Headache_Odia",
        "filenames": ["subhash_headache_odia.wav", "subhash_odia.mp3"],
        "speaker": "shubh",
        "pitch": 0.0,
        "pace": 0.88,
        "loudness": 1.15,
        "text": "ନମସ୍କାର ଦିଦି, ଗତକାଲି ରାତିରେ ଅନେକ ସମୟ ଧରି ପାଠ ପଢ଼ିବା ପରେ ମଥାଟା ସାମାନ୍ୟ ବିନ୍ଧୁଛି। ଜ୍ୱର କି ବାନ୍ତି କିଛି ନାହିଁ, କେବଳ ଟିକେ ଥକା ଲାଗୁଛି।"
    },
    {
        "id": "Meena_Maternal_Odia",
        "filenames": ["meena_maternal_odia.wav"],
        "speaker": "priya",
        "pitch": 0.02,
        "pace": 0.80,
        "loudness": 1.18,
        "text": "ମାଉସୀ... ମୋତେ ୮ ମାସ ଚାଲିଛି। ଗତକାଲି ସଞ୍ଜରୁ ମୁଣ୍ଡଟା କାଠ ଭଳିଆ ଖୁବ୍ ବିନ୍ଧୁଛି... ଆଖିକୁ ଝାପ୍ସା ଦିଶୁଛି... ଆଉ ଗୋଡ଼ ଦୁଇଟା ଏତେ ଫୁଲି ଯାଇଛି ଯେ ଚପଲ ପଶୁନି। ମୋ ଛୁଆଟା ଠିକ୍ ଅଛି ତ ମାଉସୀ?"
    }
]

# --------------------------------------------------------------------------
# 2. HINDI PATIENT PERSONAS (Sarvam AI Bulbul v3 @ 24,000 Hz)
# --------------------------------------------------------------------------
HINDI_CASES = [
    {
        "id": "Ramesh_ACS_Hindi",
        "filenames": ["ramesh_cardiac_hindi.wav", "ramesh_hindi.mp3"],
        "speaker": "ashutosh",
        "pitch": -0.12,
        "pace": 0.77,
        "loudness": 1.20,
        "text": "आह... डॉक्टर साहब... २ घंटे से सीने में भारी पत्थर जैसा दर्द हो रहा है... बहुत तेज चुभन महसूस हो रही है। उफ्फ... सांस बिल्कुल नहीं आ रही... पूरा शरीर पसीने से ठंडा पड़ गया है! कृपया जल्दी देखिए... लग रहा है सीना फट जाएगा..."
    },
    {
        "id": "Priya_Dengue_Hindi",
        "filenames": ["priya_fever_hindi.wav", "priya_hindi.mp3"],
        "speaker": "priya",
        "pitch": -0.03,
        "pace": 0.80,
        "loudness": 1.15,
        "text": "उफ्फ... दीदी... ३ दिन से पूरा बदन भट्टी की तरह तप रहा है... सिर में इतना भयानक दर्द है कि आंखें भी नहीं खुल रही हैं। पूरे हाथ-पैरों में लाल चकत्ते निकल आए हैं... और चलने की बिल्कुल ताक़त नहीं बची है।"
    },
    {
        "id": "Aarav_Pediatric_Hindi",
        "filenames": ["aarav_pediatric_hindi.wav", "lipu_hindi.mp3"],
        "speaker": "aayan",
        "pitch": 0.18,
        "pace": 0.85,
        "loudness": 1.15,
        "text": "दीदी... पेट में बहुत तेज दर्द हो रहा है! सुबह से दो बार उल्टी हो गई... और कुछ भी खाया नहीं जा रहा... बहुत रोना आ रहा है दीदी..."
    },
    {
        "id": "Subhash_Headache_Hindi",
        "filenames": ["subhash_headache_hindi.wav"],
        "speaker": "shubh",
        "pitch": 0.0,
        "pace": 0.88,
        "loudness": 1.15,
        "text": "नमस्ते दीदी, कल देर रात तक स्क्रीन पर पढ़ाई करने के बाद से माथे में हल्का-हल्का दर्द है। कोई बुखार या उल्टी नहीं है, बस थोड़ी थकान महसूस हो रही है।"
    },
    {
        "id": "Meena_Maternal_Hindi",
        "filenames": ["meena_maternal_hindi.wav"],
        "speaker": "priya",
        "pitch": 0.02,
        "pace": 0.80,
        "loudness": 1.18,
        "text": "नर्स दीदी... मुझे ८ महीने का गर्भ है। कल शाम से सिर बहुत तेज फटने जैसा दर्द हो रहा है... आंखों के आगे धुंधलापन आ रहा है... और दोनों पैर इतने सूज गए हैं कि चप्पल नहीं आ रही। कृपया मेरे बच्चे को देखिए दीदी..."
    }
]

def synthesize_sarvam_batch(cases, lang_code):
    for item in cases:
        print(f"\n[SARVAM AI] Synthesizing {item['id']} ({lang_code}, speaker: {item['speaker']})...")
        payload = {
            "inputs": [item["text"]],
            "target_language_code": lang_code,
            "speaker": item["speaker"],
            "pitch": item["pitch"],
            "pace": item["pace"],
            "loudness": item["loudness"],
            "speech_sample_rate": 24000,
            "enable_preprocessing": True,
            "model": "bulbul:v3"
        }
        try:
            r = requests.post(
                SARVAM_URL,
                headers={"api-subscription-key": SARVAM_KEY, "Content-Type": "application/json"},
                json=payload,
                timeout=30
            )
            if r.ok:
                audios = r.json().get("audios", [])
                if audios:
                    audio_bytes = base64.b64decode(audios[0])
                    for fname in item["filenames"]:
                        p = os.path.join(OUTPUT_DIR, fname)
                        with open(p, "wb") as f:
                            f.write(audio_bytes)
                        print(f"  [OK] Saved {fname} ({len(audio_bytes)} bytes @ 24kHz)")
                else:
                    print(f"  [WARN] No audio bytes returned for {item['id']}")
            else:
                print(f"  [ERROR] {item['id']}: {r.status_code} - {r.text}")
        except Exception as e:
            print(f"  [EXC] {item['id']}: {e}")

# --------------------------------------------------------------------------
# 3. ENGLISH PATIENT & CLINICIAN PERSONAS (Microsoft Edge Neural Expressive)
# --------------------------------------------------------------------------
ENGLISH_CASES = [
    {
        "id": "Ramesh_ACS_English",
        "filename": "ramesh_english.mp3",
        "voice": "en-IN-PrabhatNeural",
        "ssml": """<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-IN'>
<voice name='en-IN-PrabhatNeural'>
<prosody pitch='-8Hz' rate='-14%'>
Doctor... <break time='450ms'/> for the past two hours... <break time='300ms'/> my chest feels crushed under a heavy stone... <break time='400ms'/> with unbearable stabbing pain. <break time='500ms'/> I can barely breathe... <break time='350ms'/> and I am breaking into a cold sweat! <break time='450ms'/> Please check me quickly... <break time='300ms'/> it feels like my chest is tearing apart...
</prosody>
</voice>
</speak>"""
    },
    {
        "id": "Priya_Dengue_English",
        "filename": "priya_fever_english.mp3",
        "voice": "en-IN-NeerjaExpressiveNeural",
        "ssml": """<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='en-IN'>
<voice name='en-IN-NeerjaExpressiveNeural'>
<mstts:express-as style='sad' styledegree='1.8'>
<prosody pitch='-2Hz' rate='-8%'>
Sister... <break time='400ms'/> for the past three days my entire body has been burning with severe fever. <break time='450ms'/> My headache is so blinding I can't even open my eyes... <break time='400ms'/> Red rash spots have appeared across my arms and legs... <break time='350ms'/> and I have zero strength left to stand.
</prosody>
</mstts:express-as>
</voice>
</speak>"""
    },
    {
        "id": "Aarav_Pediatric_English",
        "filename": "aarav_pediatric_english.mp3",
        "voice": "en-IN-NeerjaNeural",
        "ssml": """<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-IN'>
<voice name='en-IN-NeerjaNeural'>
<prosody pitch='+18Hz' rate='-4%'>
Sister... <break time='350ms'/> my tummy hurts so bad... <break time='400ms'/> I threw up twice since morning... <break time='300ms'/> and I can't eat anything... <break time='350ms'/> it hurts really bad, please help me...
</prosody>
</voice>
</speak>"""
    },
    {
        "id": "Subhash_Headache_English",
        "filename": "subhash_headache_english.mp3",
        "voice": "en-IN-PrabhatNeural",
        "ssml": """<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-IN'>
<voice name='en-IN-PrabhatNeural'>
<prosody rate='-2%'>
Good morning sister... <break time='250ms'/> I've had a mild throbbing headache across my forehead since yesterday after long study hours. <break time='300ms'/> No fever or vomiting, just feeling quite tired.
</prosody>
</voice>
</speak>"""
    },
    {
        "id": "Meena_Maternal_English",
        "filename": "meena_maternal_english.mp3",
        "voice": "en-IN-NeerjaExpressiveNeural",
        "ssml": """<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='en-IN'>
<voice name='en-IN-NeerjaExpressiveNeural'>
<mstts:express-as style='sad' styledegree='1.4'>
<prosody rate='-7%'>
Nurse didi... <break time='350ms'/> I am eight months pregnant. <break time='400ms'/> Since yesterday evening I have a severe throbbing headache... <break time='300ms'/> my vision is blurry... <break time='350ms'/> and my feet are so swollen my slippers won't fit... <break time='400ms'/> Please check my baby...
</prosody>
</mstts:express-as>
</voice>
</speak>"""
    },
    {
        "id": "Nurse_Bedside_Advisory",
        "filename": "nurse_advisory.mp3",
        "voice": "en-IN-NeerjaExpressiveNeural",
        "ssml": """<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='en-IN'>
<voice name='en-IN-NeerjaExpressiveNeural'>
<mstts:express-as style='empathetic' styledegree='1.2'>
<prosody rate='-4%'>
Patient has been registered with verified ABHA ID. <break time='300ms'/> Priority triage indicates acute respiratory and cardiac distress. <break time='350ms'/> High-flow oxygen and emergency ECG are being prepared at the emergency bay.
</prosody>
</mstts:express-as>
</voice>
</speak>"""
    },
    {
        "id": "Doctor_Clinical_Referral",
        "filename": "doctor_referral.mp3",
        "voice": "en-IN-PrabhatNeural",
        "ssml": """<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-IN'>
<voice name='en-IN-PrabhatNeural'>
<prosody rate='-3%'>
Clinical summary for referral: <break time='250ms'/> Sixty-two year old male presenting with acute retrosternal chest pain and profound hypoxia, oxygen saturation eighty-nine percent. <break time='350ms'/> Priority RED verified. Immediate transfer to District Hospital cardiac intensive care unit.
</prosody>
</voice>
</speak>"""
    }
]

async def generate_all_english():
    for item in ENGLISH_CASES:
        p = os.path.join(OUTPUT_DIR, item["filename"])
        print(f"\n[EDGE-TTS] Synthesizing {item['id']} ({item['voice']})...")
        try:
            c = edge_tts.Communicate(text=item["ssml"], voice=item["voice"])
            await c.save(p)
            sz = os.path.getsize(p)
            print(f"  [OK] Saved {item['filename']} ({sz} bytes)")
        except Exception as e:
            print(f"  [EXC] {item['id']}: {e}")

if __name__ == "__main__":
    print("\n--- PHASE 1: Synthesizing Authentic Odia Voices (Sarvam AI Bulbul v3) ---")
    synthesize_sarvam_batch(ODIA_CASES, "od-IN")

    print("\n--- PHASE 2: Synthesizing Authentic Hindi Voices (Sarvam AI Bulbul v3) ---")
    synthesize_sarvam_batch(HINDI_CASES, "hi-IN")

    print("\n--- PHASE 3: Synthesizing Expressive English Voices (Edge Neural SSML) ---")
    asyncio.run(generate_all_english())

    print("\n=========================================================================")
    print("   ALL ULTRA-REALISTIC CLINICAL VOICES GENERATED & SAVED SUCCESSFULLY!")
    print("=========================================================================")
