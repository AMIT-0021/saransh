import os
import requests
import base64
import asyncio
import edge_tts

SARVAM_KEY = "sk_59bgvpud_U63opIk3mtAhebdnb2M3XAHz"
SARVAM_URL = "https://api.sarvam.ai/text-to-speech"

print("=== TESTING ULTRA-HUMAN EMOTIVE AUDIO GENERATION ===")

# Test 1: Sarvam Odia with physiological distress tokens
odia_text = "ଆଃ... ଡାକ୍ତର ବାବୁ... ୨ ଘଣ୍ଟା ହେଲା... ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି... କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ... ଆଦୌ ନେଇପାରୁନି... ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି! ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ... ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି... ଆଃ..."
payload = {
    "inputs": [odia_text],
    "target_language_code": "od-IN",
    "speaker": "ashutosh",
    "pitch": -0.12,
    "pace": 0.77,
    "loudness": 1.20,
    "speech_sample_rate": 24000,
    "enable_preprocessing": True,
    "model": "bulbul:v3"
}
resp = requests.post(
    SARVAM_URL,
    headers={"api-subscription-key": SARVAM_KEY, "Content-Type": "application/json"},
    json=payload,
    timeout=20
)
if resp.ok:
    audios = resp.json().get("audios", [])
    if audios:
        b = base64.b64decode(audios[0])
        print(f"[OK] Sarvam Odia Ashutosh generated: {len(b)} bytes (24kHz)")
else:
    print(f"[ERROR] Sarvam error: {resp.status_code} {resp.text}")

# Test 2: Edge-TTS Expressive SSML with breaks
ssml_priya = """<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='en-IN'>
<voice name='en-IN-NeerjaExpressiveNeural'>
<mstts:express-as style='sad' styledegree='1.8'>
<prosody pitch='-2Hz' rate='-8%'>
Sister... <break time='400ms'/> for the past three days my entire body has been burning with severe fever. <break time='450ms'/> My headache is so blinding I can't even open my eyes... <break time='400ms'/> Red rash spots have appeared across my arms and legs... <break time='350ms'/> and I have zero strength left to stand.
</prosody>
</mstts:express-as>
</voice>
</speak>"""

async def test_edge():
    c = edge_tts.Communicate(text=ssml_priya, voice="en-IN-NeerjaExpressiveNeural")
    await c.save("scratch/test_priya_expressive.mp3")
    sz = os.path.getsize("scratch/test_priya_expressive.mp3")
    print(f"[OK] Edge-TTS Neerja Expressive generated: {sz} bytes")

asyncio.run(test_edge())
print("Test completed successfully!")
