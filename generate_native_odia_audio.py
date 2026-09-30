import requests
import json
import os
import time

BASE_URL = "https://ai4bharat-indic-parler-tts.hf.space"
OUTPUT_FILE = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh\frontend\public\audio\ramesh_cardiac.mp3"

# Authentic Odia text for Ramesh (62M Cardiac Emergency)
odia_text = "ଡାକ୍ତର ବାବୁ, ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି ଆଉ ବହୁତ ଜୋରରେ କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ ଆଦୌ ନେଇପାରୁନି, ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି। ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ, ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି।"

# Description for AI4Bharat Indic Parler-TTS
description = "A distressed elderly male speaker speaks in Odia with a slow, breathless, raspy voice in a quiet room."

print("[1/3] Submitting Odia text to AI4Bharat Indic Parler-TTS...")
call_resp = requests.post(
    f"{BASE_URL}/gradio_api/call/generate_finetuned",
    json={"data": [odia_text, description]},
    timeout=30
)

if call_resp.status_code != 200:
    print(f"[FAIL] Call failed: {call_resp.status_code} - {call_resp.text}")
    exit(1)

event_id = call_resp.json().get("event_id")
print(f"[2/3] Event ID received: {event_id}. Streaming generation...")

stream_resp = requests.get(
    f"{BASE_URL}/gradio_api/call/generate_finetuned/{event_id}",
    stream=True,
    timeout=120
)

audio_saved = False
for line in stream_resp.iter_lines():
    if not line:
        continue
    decoded = line.decode("utf-8")
    if decoded.startswith("data:"):
        json_str = decoded[5:].strip()
        try:
            data = json.loads(json_str)
            if isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
                audio_url = data[0].get("url")
                if audio_url:
                    print(f"[3/3] Audio URL received: {audio_url}")
                    audio_bytes = requests.get(audio_url, timeout=30).content
                    with open(OUTPUT_FILE, "wb") as f_out:
                        f_out.write(audio_bytes)
                    print(f"[SUCCESS] Native Odia audio saved: {OUTPUT_FILE} ({len(audio_bytes)} bytes)")
                    audio_saved = True
                    break
        except Exception as e:
            pass

if not audio_saved:
    print("[ERROR] Could not extract audio from stream.")
