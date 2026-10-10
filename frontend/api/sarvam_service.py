import os
import re
import json
import base64
from typing import Optional, Dict, Any
from dotenv import load_dotenv

try:
    import requests
except ImportError:
    requests = None

import urllib.request
import urllib.error

# Load environment from same directory or parent
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

# Active sovereign Sarvam AI key for Saransh
DEFAULT_SARVAM_KEY = "sk_59bgvpud_U63opIk3mtAhebdnb2M3XAHz"
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "").strip() or DEFAULT_SARVAM_KEY
SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"
SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"
SARVAM_TRANSLATE_URL = "https://api.sarvam.ai/translate"

def is_sarvam_configured() -> bool:
    """Returns True if a valid Sarvam AI API key is configured."""
    return bool(SARVAM_API_KEY and SARVAM_API_KEY.startswith("sk_"))

def get_sarvam_headers() -> Dict[str, str]:
    return {
        "api-subscription-key": SARVAM_API_KEY,
        "Content-Type": "application/json"
    }

def _post_json(url: str, payload: dict, timeout: int = 20) -> Optional[dict]:
    headers = get_sarvam_headers()
    if requests is not None:
        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=timeout)
            if resp.status_code == 200:
                return resp.json()
            else:
                print(f"[Sarvam API Error {resp.status_code}] {resp.text}")
                return None
        except Exception as e:
            print(f"[Sarvam API Requests Exception] {e}")
            # fall through to urllib
    try:
        req_data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=req_data, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            if resp.status == 200:
                res_body = resp.read().decode("utf-8")
                return json.loads(res_body)
    except Exception as e:
        print(f"[Sarvam API Urllib Exception] {e}")
        return None


def enhance_clinical_prosody(text: str) -> str:
    """
    Inserts subtle prosody breath pauses (...) at clause boundaries, interjections,
    and converts written Odia numerals into authentic spoken Odia words so neural
    Indic TTS takes natural human breaths and pronounces numbers with local vernacular cadence.
    """
    if not text or not text.strip():
        return text
    enhanced = text.strip()

    # Spoken Odia numeral expansion before temporal/frequency/cardinal terms
    if re.search(r'[\u0B00-\u0B7F]', enhanced):
        odia_digits = {
            "0": "ଶୂନ", "1": "ଏକ", "2": "ଦୁଇ", "3": "ତିନି", "4": "ଚାରି", "5": "ପାଞ୍ଚ", "6": "ଛଅ", "7": "ସାତ", "8": "ଆଠ", "9": "ନଅ",
            "୦": "ଶୂନ", "୧": "ଏକ", "୨": "ଦୁଇ", "୩": "ତିନି", "୪": "ଚାରି", "୫": "ପାଞ୍ଚ", "୬": "ଛଅ", "୭": "ସାତ", "୮": "ଆଠ", "୯": "ନଅ"
        }
        enhanced = re.sub(r'([0-9]|[\u0B66-\u0B6F])\s*(?:ଘଣ୍ଟା)', lambda m: f"{odia_digits.get(m.group(1), m.group(1))} ଘଣ୍ଟା", enhanced)
        enhanced = re.sub(r'([0-9]|[\u0B66-\u0B6F])\s*(?:ଦିନ)', lambda m: f"{odia_digits.get(m.group(1), m.group(1))} ଦିନ", enhanced)
        enhanced = re.sub(r'([0-9]|[\u0B66-\u0B6F])\s*(?:ଥର)', lambda m: f"{odia_digits.get(m.group(1), m.group(1))} ଥର", enhanced)
        enhanced = re.sub(r'([0-9]|[\u0B66-\u0B6F])\s*(?:ମାସ)', lambda m: f"{odia_digits.get(m.group(1), m.group(1))} ମାସ", enhanced)
        
        # Conversational Odia distress interjections breath tokens
        for interj in ["ଆଃ", "ଉଫ୍", "ଡାକ୍ତର ବାବୁ", "ଦିଦି", "ମାଉସୀ"]:
            if interj in enhanced and f"{interj}..." not in enhanced:
                enhanced = re.sub(rf'\b{re.escape(interj)}\b(?!\.\.\.)', f"{interj}...", enhanced)

    enhanced = re.sub(r'\.{2,}', '...', enhanced)
    for marker in [", ", " - ", "—", "। ", "! "]:
        if marker in enhanced and "..." not in enhanced:
            enhanced = enhanced.replace(marker, "... ")
            break
    return enhanced

def normalize_sarvam_language(code_or_name: str) -> str:
    """
    Normalizes any language string or code into Sarvam's exact case-sensitive code format:
    'od-IN', 'hi-IN', 'en-IN', 'bn-IN', 'ta-IN', 'te-IN', etc.
    """
    if not code_or_name:
        return "od-IN"
    
    clean = str(code_or_name).lower().strip()
    lang_map = {
        "odia": "od-IN", "oriya": "od-IN", "or": "od-IN", "or-in": "od-IN", "od": "od-IN", "od-in": "od-IN",
        "hindi": "hi-IN", "hi": "hi-IN", "hi-in": "hi-IN",
        "english": "en-IN", "indian english": "en-IN", "en": "en-IN", "en-in": "en-IN",
        "bengali": "bn-IN", "bangla": "bn-IN", "bn": "bn-IN", "bn-in": "bn-IN",
        "tamil": "ta-IN", "ta": "ta-IN", "ta-in": "ta-IN",
        "telugu": "te-IN", "te": "te-IN", "te-in": "te-IN",
        "marathi": "mr-IN", "mr": "mr-IN", "mr-in": "mr-IN",
        "gujarati": "gu-IN", "gu": "gu-IN", "gu-in": "gu-IN",
        "kannada": "kn-IN", "kn": "kn-IN", "kn-in": "kn-IN",
        "malayalam": "ml-IN", "ml": "ml-IN", "ml-in": "ml-IN",
        "punjabi": "pa-IN", "pa": "pa-IN", "pa-in": "pa-IN"
    }
    return lang_map.get(clean, code_or_name)

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
    and natural human prosody breath pauses across 11 Indian languages.
    Returns base64 encoded audio string (WAV) or None on failure.
    """
    if not is_sarvam_configured():
        return None

    norm_lang = normalize_sarvam_language(target_language_code)
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

    data = _post_json(SARVAM_TTS_URL, payload, timeout=20)
    if data:
        audios = data.get("audios", [])
        if audios:
            return audios[0]  # Base64 string

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

    if requests is not None:
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

    norm_src = normalize_sarvam_language(source_language_code)
    norm_tgt = normalize_sarvam_language(target_language_code)

    payload = {
        "input": text.strip(),
        "source_language_code": norm_src,
        "target_language_code": norm_tgt,
        "mode": "formal",
        "model": "mayura:v1"
    }

    data = _post_json(SARVAM_TRANSLATE_URL, payload, timeout=15)
    if data:
        return data.get("translated_text")

    return None

