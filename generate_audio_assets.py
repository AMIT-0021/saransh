import asyncio
import edge_tts
import os

OUTPUT_DIR = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh\frontend\public\audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

AUDIO_CASES = [
    {
        "filename": "ramesh_cardiac.mp3",
        "voice": "hi-IN-MadhurNeural", # Deep, natural elderly Indian male
        "pitch": "-12Hz",              # Slightly deeper for 62-year-old
        "rate": "-15%",                # Slower, labored breathing cadence
        "text": "Doctor babu... 2 ghanta hela chhati re bhara laagu chi... pathara bhali bhari laagu chi au bahut jor re darada heuchhi... Nishwas aadou neiparuni... deha sara jhalare thanda padigalani... Tike shighra dekhantu babu... chhati fatijiba bhali laguchhi."
    },
    {
        "filename": "ramesh_english.mp3",
        "voice": "en-IN-PrabhatNeural", # Indian English male
        "pitch": "-10Hz",
        "rate": "-12%",
        "text": "Doctor... for the past two hours, my chest feels crushed under a heavy stone, with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    {
        "filename": "priya_fever.mp3",
        "voice": "en-IN-NeerjaExpressiveNeural", # Expressive Indian female
        "pitch": "-2Hz",
        "rate": "-5%",
        "text": "Sister, my body has been burning with severe fever for 3 days. My headache is so blinding I can't even open my eyes. Red petechial rashes have appeared on my arms and legs, and I have zero strength to stand."
    },
    {
        "filename": "lipu_pediatric.mp3",
        "voice": "hi-IN-SwaraNeural", # Warm, younger register
        "pitch": "+15Hz",
        "rate": "+5%",
        "text": "Didi, I cannot breathe properly. My chest is whistling when I breathe, and coughing won't stop since last night."
    },
    {
        "filename": "nurse_advisory.mp3",
        "voice": "en-IN-NeerjaNeural", # Professional, calm Indian nurse
        "pitch": "+0Hz",
        "rate": "-5%",
        "text": "Patient has been registered with ABHA ID. Priority triage indicates acute respiratory and cardiac distress. High-flow oxygen and emergency ECG are being prepared."
    }
]

async def generate_all():
    print("Generating Neural Indian audio files...")
    for item in AUDIO_CASES:
        out_path = os.path.join(OUTPUT_DIR, item["filename"])
        communicate = edge_tts.Communicate(
            text=item["text"],
            voice=item["voice"],
            pitch=item["pitch"],
            rate=item["rate"]
        )
        await communicate.save(out_path)
        sz = os.path.getsize(out_path)
        print(f"[OK] {item['filename']} -> {sz} bytes ({item['voice']})")

if __name__ == "__main__":
    asyncio.run(generate_all())
