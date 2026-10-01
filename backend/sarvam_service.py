import os
import re
import requests
import base64
from typing import Optional, Dict, Any
from dotenv import load_dotenv

# Load environment from same directory or parent
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()


SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "").strip()
SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"
SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"
SARVAM_TRANSLATE_URL = "https://api.sarvam.ai/translate"

def is_sarvam_configured() -> bool:
    """Returns True if a Sarvam AI API key is configured."""
    return bool(SARVAM_API_KEY and SARVAM_API_KEY.startswith("sk_"))

def get_sarvam_headers() -> Dict[str, str]:
    return {
        "api-subscription-key": SARVAM_API_KEY,
        "Content-Type": "application/json"
    }

def enhance_clinical_prosody(text: str) -> str:
    """
    Inserts subtle prosody breath pauses (...) at clause boundaries and commas
    so neural Indic TTS takes natural human breaths instead of reading monotonically.
    """
    if not text or not text.strip():
        return text
    # Avoid duplicate ellipses
    enhanced = text.strip()
    enhanced = re.sub(r'\.{2,}', '...', enhanced)
    # Add breath pauses at major clinical conjunctions/breaks if not already punctuated
    for marker in [", ", " - ", "—", "। ", "! "]:
        if marker in enhanced and "..." not in enhanced:
            enhanced = enhanced.replace(marker, "... ")
            break
    return enhanced

def synthesize_sarvam_speech(
    text: str,
    target_language_code: str = "od-IN",
    speaker: str = "ashutosh",
    pitch: float = -0.05,
    pace: float = 0.85,
    loudness: float = 1.25,
    sample_rate: int = 24000
) -> Optional[str]:
    """
    Synthesizes speech using Sarvam AI Bulbul v3 with 24,000 Hz broadcast fidelity
    and natural human prosody breath pauses.
    Returns base64 encoded audio string (WAV) or None on failure.
    """
    if not is_sarvam_configured():
        return None

    # Map colloquial language codes to Sarvam standard
    lang_map = {
        "odia": "od-IN",
        "or": "od-IN",
        "or-in": "od-IN",
        "hindi": "hi-IN",
        "hi": "hi-IN",
        "hi-in": "hi-IN",
        "english": "en-IN",
        "en": "en-IN",
        "en-in": "en-IN"
    }
    norm_lang = lang_map.get(target_language_code.lower(), target_language_code)

    # Apply emotional/human breath pauses
    processed_text = enhance_clinical_prosody(text)

    payload = {
        "inputs": [processed_text],
        "target_language_code": norm_lang,
        "speaker": speaker,
        "pitch": pitch,
        "pace": pace,
        "loudness": loudness,
        "speech_sample_rate": sample_rate,
        "enable_preprocessing": True,
        "model": "bulbul:v3"
    }

    try:
        response = requests.post(SARVAM_TTS_URL, json=payload, headers=get_sarvam_headers(), timeout=15)
        if response.status_code == 200:
            data = response.json()
            audios = data.get("audios", [])
            if audios:
                return audios[0]  # Base64 string
        else:
            print(f"[Sarvam TTS Error] {response.status_code}: {response.text}")
    except Exception as e:
        print(f"[Sarvam TTS Exception]: {e}")

    return None

def transcribe_sarvam_speech(
    audio_file_bytes: bytes,
    filename: str = "audio.wav",
    model: str = "saaras:v3"
) -> Optional[Dict[str, Any]]:
    """
    Transcribes Indic speech audio using Sarvam AI Saaras v3.
    """
    if not is_sarvam_configured():
        return None

    headers = {"api-subscription-key": SARVAM_API_KEY}
    files = {"file": (filename, audio_file_bytes, "audio/wav")}
    data = {"model": model}

    try:
        response = requests.post(SARVAM_STT_URL, headers=headers, files=files, data=data, timeout=20)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"[Sarvam STT Error] {response.status_code}: {response.text}")
    except Exception as e:
        print(f"[Sarvam STT Exception]: {e}")

    return None

def translate_sarvam_text(
    text: str,
    source_language_code: str = "od-IN",
    target_language_code: str = "en-IN"
) -> Optional[str]:
    """
    Translates vernacular Indic text using Sarvam AI Mayura v1.
    """
    if not is_sarvam_configured() or not text.strip():
        return None

    payload = {
        "input": text.strip(),
        "source_language_code": source_language_code,
        "target_language_code": target_language_code,
        "mode": "formal",
        "model": "mayura:v1"
    }

    try:
        response = requests.post(SARVAM_TRANSLATE_URL, json=payload, headers=get_sarvam_headers(), timeout=15)
        if response.status_code == 200:
            data = response.json()
            return data.get("translated_text")
        else:
            print(f"[Sarvam Translate Error] {response.status_code}: {response.text}")
    except Exception as e:
        print(f"[Sarvam Translate Exception]: {e}")

    return None
