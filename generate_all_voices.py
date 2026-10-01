import os
import base64
import requests
import asyncio
import edge_tts

OUTPUT_DIR = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh\frontend\public\audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

SARVAM_KEY = "sk_59bgvpud_U63opIk3mtAhebdnb2M3XAHz"

ODIA_CASES = [
    {
        "filename": "ramesh_cardiac_odia.wav",
        "speaker": "ashutosh",
        "pace": 0.82,
        "text": "ଡାକ୍ତର ବାବୁ, ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି ଆଉ ବହୁତ ଜୋରରେ କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ ଆଦୌ ନେଇପାରୁନି, ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି। ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ, ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି।"
    },
    {
        "filename": "priya_fever_odia.wav",
        "speaker": "priya",
        "pace": 0.88,
        "text": "ଦିଦି, ୩ ଦିନ ହେଲା ଦେହ ସାରା ନିଆଁ ଭଳି ତାତିଛି। ମୁଣ୍ଡଟା ଏତେ ଜୋରରେ ବିନ୍ଧୁଛି ଯେ ଆଖି ଖୋଲି ହେଉନି। ହାତ ଗୋଡ଼ରେ ଲାଲ୍ ଦାଗ ବାହାରି ପଡ଼ିଛି ଆଉ ଚାଲିବାକୁ ଜମା ବଳ ପାଉନି।"
    },
    {
        "filename": "lipu_pediatric_odia.wav",
        "speaker": "aayan",
        "pace": 0.90,
        "text": "ଦିଦି, ପେଟଟା ଭୀଷଣ ବିନ୍ଧୁଛି। ସକାଳୁ ୨ ଥର ବାନ୍ତି ହେଲାଣି ଆଉ କିଛି ଖାଇ ହେଉନି, ବହୁତ କଷ୍ଟ ହେଉଛି।"
    },
    {
        "filename": "subhash_headache_odia.wav",
        "speaker": "shubh",
        "pace": 0.88,
        "text": "ନମସ୍କାର ଦିଦି, ଗତକାଲି ରାତିରେ ଅନେକ ସମୟ ଧରି ପାଠ ପଢ଼ିବା ପରେ ମଥାଟା ସାମାନ୍ୟ ବିନ୍ଧୁଛି। ଜ୍ୱର କି ବାନ୍ତି କିଛି ନାହିଁ, କେବଳ ଟିକେ ଥକା ଲାଗୁଛି।"
    }
]

HINDI_CASES = [
    {
        "filename": "ramesh_cardiac_hindi.wav",
        "speaker": "ashutosh",
        "pace": 0.82,
        "text": "डॉक्टर साहब, २ घंटे से सीने में भारी पत्थर जैसा दर्द हो रहा है और बहुत तेज चुभन महसूस हो रही है। सांस बिल्कुल नहीं आ रही, शरीर पसीने से ठंडा पड़ गया है। कृपया जल्दी देखें, लग रहा है सीना फट जाएगा।"
    },
    {
        "filename": "priya_fever_hindi.wav",
        "speaker": "priya",
        "pace": 0.88,
        "text": "दीदी, ३ दिन से पूरा बदन भट्टी की तरह तप रहा है। सिर में इतना भयानक दर्द है कि आंखें भी नहीं खुल रही हैं। पूरे हाथ-पैरों में लाल चकत्ते निकल आए हैं और चलने की बिल्कुल ताक़त नहीं बची है।"
    },
    {
        "filename": "aarav_pediatric_hindi.wav",
        "speaker": "aayan",
        "pace": 0.90,
        "text": "दीदी, पेट में बहुत तेज दर्द हो रहा है। सुबह से दो बार उल्टी हो गई और कुछ भी खाया नहीं जा रहा, बहुत रोना आ रहा है।"
    },
    {
        "filename": "subhash_headache_hindi.wav",
        "speaker": "shubh",
        "pace": 0.88,
        "text": "नमस्ते दीदी, कल देर रात तक स्क्रीन पर पढ़ाई करने के बाद से माथे में हल्का-हल्का दर्द है। कोई बुखार या उल्टी नहीं है, बस थोड़ी थकान महसूस हो रही है।"
    }
]

def generate_sarvam_audio(cases, lang_code):
    for c in cases:
        out_path = os.path.join(OUTPUT_DIR, c["filename"])
        print(f"[SARVAM] Generating {c['filename']} ({lang_code}, {c['speaker']})...")
        try:
            res = requests.post(
                "https://api.sarvam.ai/text-to-speech",
                headers={
                    "api-subscription-key": SARVAM_KEY,
                    "Content-Type": "application/json"
                },
                json={
                    "inputs": [c["text"]],
                    "target_language_code": lang_code,
                    "speaker": c["speaker"],
                    "pace": c["pace"],
                    "model": "bulbul:v3"
                },
                timeout=20
            )
            if res.ok:
                data = res.json()
                audios = data.get("audios", [])
                if audios and audios[0]:
                    audio_bytes = base64.b64decode(audios[0])
                    with open(out_path, "wb") as f:
                        f.write(audio_bytes)
                    print(f"  [SUCCESS] {c['filename']} ({len(audio_bytes)} bytes)")
                else:
                    print(f"  [WARN] No audio returned for {c['filename']}")
            else:
                print(f"  [ERROR] {c['filename']}: {res.status_code} - {res.text}")
        except Exception as e:
            print(f"  [EXC] {c['filename']}: {e}")

ENGLISH_CASES = [
    {
        "filename": "ramesh_english.mp3",
        "voice": "en-IN-PrabhatNeural",
        "pitch": "-10Hz",
        "rate": "-12%",
        "text": "Doctor, for the past two hours, my chest feels crushed under a heavy stone, with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    {
        "filename": "priya_fever_english.mp3",
        "voice": "en-IN-NeerjaExpressiveNeural",
        "pitch": "-2Hz",
        "rate": "-5%",
        "text": "Sister, for the past 3 days my entire body has been burning with high fever. My headache is so severe that I can't even open my eyes. Red spots have appeared across my arms and legs, and I have zero strength to stand."
    },
    {
        "filename": "aarav_pediatric_english.mp3",
        "voice": "en-IN-NeerjaNeural",
        "pitch": "+16Hz",
        "rate": "+6%",
        "text": "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts really bad."
    },
    {
        "filename": "subhash_headache_english.mp3",
        "voice": "en-IN-PrabhatNeural",
        "pitch": "+0Hz",
        "rate": "-2%",
        "text": "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    }
]

async def generate_edge_english():
    for item in ENGLISH_CASES:
        out_path = os.path.join(OUTPUT_DIR, item["filename"])
        print(f"[EDGE-TTS] Generating {item['filename']} ({item['voice']})...")
        try:
            communicate = edge_tts.Communicate(
                text=item["text"],
                voice=item["voice"],
                pitch=item["pitch"],
                rate=item["rate"]
            )
            await communicate.save(out_path)
            sz = os.path.getsize(out_path)
            print(f"  [SUCCESS] {item['filename']} ({sz} bytes)")
        except Exception as e:
            print(f"  [EXC] {item['filename']}: {e}")

if __name__ == "__main__":
    print("Starting generation of authentic Odia voices...")
    generate_sarvam_audio(ODIA_CASES, "od-IN")
    print("\nStarting generation of authentic Hindi voices...")
    generate_sarvam_audio(HINDI_CASES, "hi-IN")
    print("\nStarting generation of English voices...")
    asyncio.run(generate_edge_english())
    print("\nAll audio asset generation complete!")
