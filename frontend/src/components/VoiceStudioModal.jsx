import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Sliders,
  Play,
  Square,
  CheckCircle2,
  X,
  Activity,
  HeartPulse,
  User,
  Baby,
  Stethoscope,
  Globe
} from "lucide-react";
import { stopHumanVoice, playWithClinicalMastering } from "../utils/voiceSynthesisEngine";

const PERSONA_PRESETS = [
  {
    id: "ELDERLY_MALE",
    name: "Ramesh K. (62M Senior)",
    role: "Elderly Cardiac Patient",
    badge: "🔴 Acute Distress",
    speaker: "ashutosh",
    gender: "Male",
    pitch: -0.10,
    pace: 0.82,
    sampleRate: 24000,
    icon: HeartPulse,
    sampleText: {
      Odia: "ଡାକ୍ତର ବାବୁ... ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି... ଆଉ ବହୁତ ଜୋରରେ କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ... ଆଦୌ ନେଇପାରୁନି... ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି!",
      Hindi: "डॉक्टर साहब... २ घंटे से सीने में भारी पत्थर जैसा दर्द हो रहा है... और बहुत तेज चुभन महसूस हो रही है। सांस... बिल्कुल नहीं आ रही, शरीर पसीने से ठंडा पड़ गया है!",
      English: "Doctor... for the past two hours, my chest feels crushed under a heavy stone... with unbearable stabbing pain. I can barely breathe... and I am breaking into a cold sweat!",
      Bengali: "ডাক্তারবাবু... ২ ঘণ্টা ধরে বুকটা পাথরের মতো ভারী লাগছে... আর খুব তীব্র চিনচিনে ব্যথা হচ্ছে। শ্বাস... একদম নিতে পারছি না... সারা শরীর ঘামে ঠান্ডা হয়ে গেছে!",
      Tamil: "டாக்டர் ஐயா... இரண்டு மணி நேரமாக நெஞ்சு பாராங்கல் போல அழுத்துகிறது... தாங்க முடியாத அளவுக்கு ஊசி குத்துவது போல வலிக்கிறது. மூச்சு... விடவே முடியவில்லை... உடல் முழுவதும் குளிர்ந்து வியர்த்து கொட்டுகிறது!",
      Telugu: "డాక్టర్ గారూ... రెండు గంటల నుంచి గుండె మీద రాయి పెట్టినట్లు బరువుగా ఉంది... విపరీతమైన పొడుస్తున్న నొప్పిగా ఉంది. ఊపిరి... అస్సలు ఆడటం లేదు... ఒళ్లంతా చల్లటి చెమటలు పట్టేస్తున్నాయి!"
    }
  },
  {
    id: "ADULT_FEMALE",
    name: "Priya S. (34F Adult)",
    role: "High Fever / Thrombocytopenia",
    badge: "🟠 Severe Exhaustion",
    speaker: "priya",
    gender: "Female",
    pitch: -0.02,
    pace: 0.85,
    sampleRate: 24000,
    icon: User,
    sampleText: {
      Odia: "ଦିଦି... ୩ ଦିନ ହେଲା ଦେହ ସାରା ନିଆଁ ଭଳି ତାତିଛି... ମୁଣ୍ଡଟା ଏତେ ଜୋରରେ ବିନ୍ଧୁଛି ଯେ ଆଖି ଖୋଲି ହେଉନି। ହାତ ଗୋଡ଼ରେ ଲାଲ୍ ଦାଗ ବାହାରି ପଡ଼ିଛି... ଆଉ ଚାଲିବାକୁ ଜମା ବଳ ପାଉନି।",
      Hindi: "दीदी... ३ दिन से पूरा बदन भट्टी की तरह तप रहा है... सिर में इतना भयानक दर्द है कि आंखें भी नहीं खुल रही हैं। पूरे हाथ-पैरों में लाल चकत्ते निकल आए हैं... और चलने की बिल्कुल ताक़त नहीं बची है।",
      English: "Sister... for 3 days my entire body has been burning with high fever. My headache is blinding and red spots have appeared all over my arms and legs.",
      Bengali: "দিদি... ৩ দিন ধরে পুরো শরীর আগুনের মতো জ্বলছে... মাথায় এত তীব্র যন্ত্রণা যে চোখ খুলতে পারছি না। হাত-পায়ে লাল দাগ ফুটে উঠেছে... আর হাঁটার একদম শক্তি নেই।",
      Tamil: "அக்கா... 3 நாட்களாக உடம்பு நெருப்பு போல கொதிக்கிறது... தலை பயங்கரமாக வலிக்கிறது, கண்ணையே திறக்க முடியவில்லை. கை கால்களில் சிவப்பு புள்ளிகள் வந்துவிட்டன... எழுந்து நடக்கக் கூட தெம்பு இல்லை.",
      Telugu: "అక్కా... మూడు రోజుల నుంచి ఒళ్లంతా నిప్పులా కాలిపోతోంది... తలనొప్పి ఎంత తీవ్రంగా ఉందంటే కళ్లు కూడా తెరవలేకపోతున్నాను. కాళ్లు చేతులపై ఎర్రటి మచ్చలు వచ్చాయి... నడవడానికి అస్సలు శక్తి లేదు."
    }
  },
  {
    id: "CHILD_MALE",
    name: "Lipu S. (7M Pediatric)",
    role: "Acute Abdominal Colic",
    badge: "🟡 Pediatric Colic",
    speaker: "aayan",
    gender: "Child (Male)",
    pitch: 0.16,
    pace: 0.88,
    sampleRate: 24000,
    icon: Baby,
    sampleText: {
      Odia: "ଦିଦି... ପେଟଟା ଭୀଷଣ ବିନ୍ଧୁଛି! ସକାଳୁ ୨ ଥର ବାନ୍ତି ହେଲାଣି... ଆଉ କିଛି ଖାଇ ହେଉନି... ବହୁତ କଷ୍ଟ ହେଉଛି।",
      Hindi: "दीदी... पेट में बहुत तेज दर्द हो रहा है! सुबह से दो बार उल्टी हो गई... और कुछ भी खाया नहीं जा रहा, बहुत रोना आ रहा है।",
      English: "Sister... my tummy hurts so bad! I threw up twice since morning and I can't eat anything... it hurts so much.",
      Bengali: "দিদি... পেটে খুব জোরে ব্যথা করছে! সকাল থেকে দু'বার বমি হয়ে গেছে... আর কিছুই খেতে পারছি না... খুব কষ্ট হচ্ছে।",
      Tamil: "அக்கா... வயிறு ரொம்ப பயங்கரமா வலிக்குது! காலையில இருந்து ரெண்டு தடவ வாந்தி எடுத்திட்டேன்... ஒண்ணுமே சாப்பிட முடியல... ரொம்ப கஷ்டமா இருக்கு.",
      Telugu: "అక్కా... కడుపులో విపరీతంగా నొప్పిగా ఉంది! పొద్దున్నుంచి రెండుసార్లు వాంతులు అయ్యాయి... ఏమీ తినలేకపోతున్నాను... చాలా ఏడుపు వస్తోంది."
    }
  },
  {
    id: "MATERNAL_FEMALE",
    name: "Meena D. (28F Maternal)",
    role: "High-Risk Pre-eclampsia",
    badge: "🔴 Obstetric Critical",
    speaker: "priya",
    gender: "Female",
    pitch: 0.04,
    pace: 0.82,
    sampleRate: 24000,
    icon: User,
    sampleText: {
      Odia: "ମାଉସୀ... ମୋତେ ୮ ମାସ ଚାଲିଛି... ଗୋଡ଼ ଦୁଇଟା ଏତେ ଫୁଲି ଯାଇଛି ଯେ ଚପଲ ପଶୁନି। ମୁଣ୍ଡଟା କାଠ ଭଳିଆ ଖୁବ୍ ବିନ୍ଧୁଛି... ଆଉ ଆଖିକୁ ସବୁ ଝାପ୍ସା ଦିଶୁଛି!",
      Hindi: "नर्स दीदी... मुझे ८ महीने का गर्भ है... दोनों पैर इतने सूज गए हैं कि चप्पल नहीं आ रही। सिर फटने जैसा भारी दर्द है और आंखों के सामने सब धुंधला दिख रहा है!",
      English: "Sister... I am 8 months pregnant and my feet are so swollen my slippers won't fit. I have a blinding throbbing headache and my vision is completely blurred!",
      Bengali: "নার্স দিদি... আমার ৮ মাসের গর্ভ চলছে... দুটো পা এত ফুলে গেছে যে চটি পরতে পারছি না। মাথায় প্রচণ্ড যন্ত্রণা হচ্ছে আর চোখের সামনে সব ঝাপসা দেখছি!",
      Tamil: "நர்ஸ் அக்கா... எனக்கு 8 மாத கர்ப்பம்... இரண்டு கால்களும் பயங்கரமாக வீங்கி செருப்பு கூட போட முடியவில்லை. தலை வெடிப்பது போல வலிக்கிறது, கண்ணும் மங்கலாக தெரிகிறது!",
      Telugu: "నర్సు అక్కా... నాకు 8 నెలల గర్భం... రెండు కాళ్లూ బాగా వాచిపోయి చెప్పులు కూడా పట్టడం లేదు. తల బద్దలయ్యేంత తీవ్రమైన నొప్పిగా ఉంది, కళ్లు కూడా మసకగా కనిపిస్తున్నాయి!"
    }
  },
  {
    id: "YOUNG_MALE",
    name: "Subhash P. (24M Young Adult)",
    role: "Mild Tension Headache",
    badge: "🟢 Ambulatory / Non-Urgent",
    speaker: "shubh",
    gender: "Male",
    pitch: 0.02,
    pace: 0.92,
    sampleRate: 24000,
    icon: User,
    sampleText: {
      Odia: "ନମସ୍କାର ଦିଦି... କାଲି ରାତିରେ ପରୀକ୍ଷା ପାଇଁ ପାଠ ପଢ଼ିବା ପରେ ମଥାଟା ସାମାନ୍ୟ ବିନ୍ଧୁଛି... ଟିକେ ଥକା ଲାଗୁଛି, ବାକି ସବୁ ଠିକ୍ ଅଛି।",
      Hindi: "नमस्ते दीदी... कल देर रात परीक्षा की पढ़ाई करने के बाद माथे में हल्का-हल्का दर्द है... बस थोड़ी थकान लग रही है, बाकी सब ठीक है।",
      English: "Hello sister... after studying late last night for my exams, I have a mild tension headache across my forehead and feeling a bit tired, otherwise I am fine.",
      Bengali: "নমস্কার দিদি... কাল রাতে পরীক্ষার পড়ার পর কপালে হালকা ব্যথা করছে... একটু ক্লান্তি লাগছে, বাকি সব ঠিক আছে।",
      Tamil: "வணக்கம் அக்கா... நேற்று இரவு தேர்வுக்கு படித்ததால் நெற்றியில் லேசான தலைவலி இருக்கிறது... கொஞ்சம் சோர்வாக உள்ளது, மற்றபடி பரவாயில்லை.",
      Telugu: "నమస్కారం అక్కా... నిన్న రాత్రి పరీక్షల కోసం చదువుకున్న తర్వాత నుదిటిలో కొద్దిగా తలనొప్పిగా ఉంది... కాస్త నీరసంగా ఉంది, మిగతా అంతా బాగుంది."
    }
  },
  {
    id: "NURSE_FEMALE",
    name: "Sister Ishita (Staff Nurse)",
    role: "Emergency Triage Officer",
    badge: "👩‍⚕️ Clinical Handover",
    speaker: "ishita",
    gender: "Female",
    pitch: 0.00,
    pace: 0.90,
    sampleRate: 24000,
    icon: Stethoscope,
    sampleText: {
      Odia: "ରୋଗୀଙ୍କର ଆଭା ଆଇଡି ଯାଞ୍ଚ ସରିଛି। ତୁରନ୍ତ ଇସିଜି ଓ ଅମ୍ଳଜାନ ସହାୟତା ପାଇଁ ଏମର୍ଜେନ୍ସି ବେ'କୁ ସ୍ଥାନାନ୍ତର କରାଯାଉଛି।",
      Hindi: "मरीज की आभा आईडी सत्यापित कर ली गई है। उच्च प्राथमिकता वाले ट्राइएज के तहत ऑक्सीजन और आपातकालीन ईसीजी तैयार की जा रही है।",
      English: "Patient has been registered with verified ABHA ID. Priority triage indicates acute respiratory distress. High-flow oxygen and emergency ECG are being prepared at the bay.",
      Bengali: "রোগীর আভা আইডি যাচাই সম্পন্ন হয়েছে। জরুরি ভিত্তিতে ইসিজি এবং অক্সিজেন সহায়তার জন্য এমার্জেন্সি বে-তে স্থানান্তর করা হচ্ছে।",
      Tamil: "நோயாளியின் ஆயுஷ்மான் பாரத் (ABHA) அடையாள அட்டை சரிபார்க்கப்பட்டது. அவசர ஈசிஜி மற்றும் ஆக்சிஜன் சிகிச்சைக்காக நோயாளி அவசர சிகிச்சைப் பிரிவுக்கு மாற்றப்படுகிறார்.",
      Telugu: "రోగి ఆభా (ABHA) ఐడీ ధృవీకరణ పూర్తయింది. అత్యవసర ఈసీజీ మరియు ఆక్సిజన్ సపోర్ట్ కోసం వెంటనే ఎమర్జెన్సీ బేకి తరలిస్తున్నాము."
    }
  },
  {
    id: "DOCTOR_MALE",
    name: "Dr. Aditya (MO In-Charge)",
    role: "Chief Medical Officer",
    badge: "👨‍⚕️ Tertiary Referral",
    speaker: "aditya",
    gender: "Male",
    pitch: -0.04,
    pace: 0.90,
    sampleRate: 24000,
    icon: Activity,
    sampleText: {
      Odia: "ଡିଷ୍ଟ୍ରିକ୍ଟ ହେଡକ୍ୱାର୍ଟର ହସ୍ପିଟାଲକୁ ଜରୁରୀକାଳୀନ ରେଫରାଲ ସ୍ଲିପ ପ୍ରସ୍ତୁତ କରାଗଲା। ଆମ୍ବୁଲାନ୍ସ ୧୦୮ ସହିତ ତୁରନ୍ତ ସ୍ଥାନାନ୍ତର କରନ୍ତୁ।",
      Hindi: "जिला अस्पताल के लिए आपातकालीन रेफरल पर्ची तैयार की गई है। एम्बुलेंस १०८ द्वारा तत्काल स्थानांतरण सुनिश्चित करें।",
      English: "Clinical handover alert. High priority cardiac case requiring immediate CCU transfer. Bilateral oxygenation active, emergency stabilization underway.",
      Bengali: "জেলা সদর হাসপাতালের জন্য জরুরি রেফারাল স্লিপ তৈরি করা হয়েছে। ১০৮ অ্যাম্বুলেন্সের মাধ্যমে অবিলম্বে স্থানান্তর নিশ্চিত করুন।",
      Tamil: "மாவட்ட தலைமை மருத்துவமனைக்கு அவசர பரிந்துரை சீட்டு தயாராகிவிட்டது. 108 ஆம்புலன்ஸ் மூலம் உடனடியாக கொண்டு செல்ல ஏற்பாடு செய்யுங்கள்.",
      Telugu: "జిల్లా ఆసుపత్రికి అత్యవసర రెఫరల్ స్లిప్ సిద్ధం చేయబడింది. 108 అంబులెన్స్ ద్వారా వెంటనే తరలించండి."
    }
  }
];

const LANGUAGES = [
  { code: "od-IN", label: "Odia (ଓଡ଼ିଆ)", key: "Odia" },
  { code: "hi-IN", label: "Hindi (हिन्दी)", key: "Hindi" },
  { code: "en-IN", label: "Indian English", key: "English" },
  { code: "bn-IN", label: "Bengali (বাংলা)", key: "Bengali" },
  { code: "ta-IN", label: "Tamil (தமிழ்)", key: "Tamil" },
  { code: "te-IN", label: "Telugu (తెలుగు)", key: "Telugu" }
];


export default function VoiceStudioModal({ isOpen, onClose }) {
  const [selectedPersona, setSelectedPersona] = useState(PERSONA_PRESETS[0]);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [customPitch, setCustomPitch] = useState(PERSONA_PRESETS[0].pitch);
  const [customPace, setCustomPace] = useState(PERSONA_PRESETS[0].pace);
  const [customText, setCustomText] = useState(PERSONA_PRESETS[0].sampleText.Odia);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const audioRef = useRef(null);

  // Sync text when persona or language changes
  useEffect(() => {
    if (selectedPersona && selectedLang) {
      setCustomPitch(selectedPersona.pitch);
      setCustomPace(selectedPersona.pace);
      const text = selectedPersona.sampleText[selectedLang.key] || selectedPersona.sampleText.Odia || selectedPersona.sampleText.English;
      setCustomText(text);
    }
  }, [selectedPersona, selectedLang]);

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      stopHumanVoice();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    stopHumanVoice();
    setIsPlaying(false);
    setIsGenerating(false);
    setStatusMessage("");
  };

  const handleSynthesizeAndPlay = async () => {
    handleStopAudio();
    setIsGenerating(true);
    setStatusMessage("Synthesizing 24,000 Hz Sovereign Neural Voice...");

    try {
      const baseUrl = (typeof window !== "undefined" && window.location.port === "5173") ? "http://localhost:8000" : "";
      const resp = await fetch(`${baseUrl}/api/v1/sarvam/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: customText,
          target_language_code: selectedLang.code,
          speaker: selectedPersona.speaker,
          pitch: parseFloat(customPitch),
          pace: parseFloat(customPace)
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.audio_base64) {
          const audioUri = `data:audio/wav;base64,${data.audio_base64}`;
          const audio = new Audio(audioUri);
          audioRef.current = audio;

          audio.onplay = () => {
            setIsGenerating(false);
            setIsPlaying(true);
            setStatusMessage(`Speaking (${selectedPersona.name} • 24kHz Bulbul v3)`);
          };

          audio.onended = () => {
            setIsPlaying(false);
            setStatusMessage("Finished playback.");
            audioRef.current = null;
          };

          audio.onerror = () => {
            setIsPlaying(false);
            setIsGenerating(false);
            setStatusMessage("Audio playback failed.");
          };

          await playWithClinicalMastering(audio);
        } else {
          throw new Error("No audio returned");
        }
      } else {
        throw new Error(`Server status: ${resp.status}`);
      }
    } catch (err) {
      console.warn("Dynamic synthesis error:", err);
      setIsGenerating(false);
      setStatusMessage("Using local pre-rendered audio...");

      // Fallback to local audio if offline or serverless cold-start
      const localAudioMap = {
        ELDERLY_MALE: {
          Odia: "/audio/ramesh_cardiac_odia.wav",
          Hindi: "/audio/ramesh_cardiac_hindi.wav",
          English: "/audio/ramesh_english.mp3"
        },
        ADULT_FEMALE: {
          Odia: "/audio/priya_fever_odia.wav",
          Hindi: "/audio/priya_fever_hindi.wav",
          English: "/audio/priya_fever_english.mp3"
        },
        CHILD_MALE: {
          Odia: "/audio/lipu_pediatric_odia.wav",
          Hindi: "/audio/aarav_pediatric_hindi.wav",
          English: "/audio/aarav_pediatric_english.mp3"
        },
        MATERNAL_FEMALE: {
          Odia: "/audio/meena_maternal_odia.wav",
          Hindi: "/audio/meena_maternal_hindi.wav",
          English: "/audio/meena_maternal_english.mp3"
        },
        YOUNG_MALE: {
          Odia: "/audio/subhash_headache_odia.wav",
          Hindi: "/audio/subhash_headache_hindi.wav",
          English: "/audio/subhash_headache_english.mp3"
        },
        NURSE_FEMALE: {
          Odia: "/audio/nurse_advisory.mp3",
          Hindi: "/audio/nurse_advisory.mp3",
          English: "/audio/nurse_advisory.mp3"
        },
        DOCTOR_MALE: {
          Odia: "/audio/doctor_referral.mp3",
          Hindi: "/audio/doctor_referral.mp3",
          English: "/audio/doctor_referral.mp3"
        }
      };

      const personaAudio = localAudioMap[selectedPersona.id];
      const fallbackUrl = personaAudio
        ? (personaAudio[selectedLang.key] || personaAudio.English || personaAudio.Hindi || personaAudio.Odia)
        : "/audio/ramesh_cardiac.mp3";

      if (fallbackUrl) {
        const audio = new Audio(fallbackUrl);
        audioRef.current = audio;
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => {
          setIsPlaying(false);
          audioRef.current = null;
        };
        await playWithClinicalMastering(audio);
      } else {
        setIsPlaying(false);
        setStatusMessage("Failed to play audio.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white px-5 sm:px-7 py-4.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-inner">
              <Sparkles className="w-5 h-5 text-teal-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">Sovereign Voice Studio</h2>
                <span className="bg-teal-500/25 border border-teal-300/30 text-teal-200 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                  Zero-Recording AI
                </span>
              </div>
              <p className="text-xs text-teal-200/80">
                Acoustic Neural Persona Design • Sarvam AI Bulbul v3 (24,000 Hz)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              handleStopAudio();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {/* Pitch Banner for Judges */}
          <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-blue-50 border border-teal-200/80 rounded-2xl p-3.5 flex items-start space-x-3">
            <Activity className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="font-bold text-teal-950">How Zero-Recording Voice Training Works:</strong> Instead of recording real people with microphones, unique human voices are synthesized mathematically using <strong>latent speaker embeddings</strong>, <strong>inhalation breath tokens (`...`)</strong>, and <strong>biological vocal resonance</strong> across 11 Indian languages.
            </div>
          </div>

          {/* 1. Persona Selector Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              1. Select Trained Clinical Persona
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PERSONA_PRESETS.map((persona) => {
                const IconComponent = persona.icon;
                const isSelected = selectedPersona.id === persona.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersona(persona)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-3 ${
                      isSelected
                        ? "bg-teal-50/90 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                        : "bg-slate-50/80 border-slate-200/90 hover:bg-slate-100/70 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-teal-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">{persona.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 ml-1" />}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{persona.role}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                          {persona.speaker}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {persona.pitch < 0 ? `${persona.pitch} deep` : (persona.pitch > 0 ? `+${persona.pitch} high` : "neutral")}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Language Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              2. Target Vernacular Dialect
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLang.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Real-Time Acoustic Sliders */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-teal-600" />
                3. Real-Time Acoustic & Vocal Formant Controls
              </span>
              <span className="text-[11px] font-mono text-teal-700 bg-teal-100/70 border border-teal-200 rounded-md px-2 py-0.5 font-bold">
                24,000 Hz Master
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pitch Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Vocal Resonance / Pitch:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {customPitch > 0 ? `+${customPitch}` : customPitch}
                  </span>
                </div>
                <input
                  type="range"
                  min="-0.20"
                  max="0.25"
                  step="0.02"
                  value={customPitch}
                  onChange={(e) => setCustomPitch(parseFloat(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Deep / Elderly (-0.20)</span>
                  <span>Pediatric Child (+0.25)</span>
                </div>
              </div>

              {/* Pace Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Speech Cadence / Pace:</span>
                  <span className="font-mono font-bold text-slate-900">{customPace}x</span>
                </div>
                <input
                  type="range"
                  min="0.70"
                  max="1.15"
                  step="0.02"
                  value={customPace}
                  onChange={(e) => setCustomPace(parseFloat(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Breathless Pain (0.70x)</span>
                  <span>Clinical Handover (1.15x)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Text Editor & Prosody Markers */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                4. Phonetic & Prosody Script (Edit or Test Custom Phrasing)
              </label>
              <span className="text-[10px] text-slate-400">
                Tip: Use <code className="bg-slate-100 text-teal-800 px-1 py-0.5 rounded font-mono font-bold">...</code> for breath pauses
              </span>
            </div>
            <textarea
              rows={3}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 font-sans text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all leading-relaxed"
              placeholder="Type any sentence in Odia, Hindi, English..."
            />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-7 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-600 truncate">
            {isPlaying ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {statusMessage || "Speaking in 24kHz High-Fidelity Voice..."}
              </span>
            ) : isGenerating ? (
              <span className="inline-flex items-center gap-1.5 text-teal-700 font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                Synthesizing via Sarvam AI Bulbul v3...
              </span>
            ) : (
              <span className="text-slate-500">{statusMessage || "Ready to synthesize zero-recording persona."}</span>
            )}
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            {isPlaying ? (
              <button
                onClick={handleStopAudio}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer w-full sm:w-auto"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                Stop Audio
              </button>
            ) : (
              <button
                disabled={isGenerating || !customText.trim()}
                onClick={handleSynthesizeAndPlay}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-900/15 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isGenerating ? "Synthesizing..." : "Synthesize & Speak (24 kHz)"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
