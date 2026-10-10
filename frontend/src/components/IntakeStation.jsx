import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Camera,
  Heart,
  Activity,
  ShieldAlert,
  Sparkles,
  FileText,
  User,
  Volume2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Radio,
  FileCheck,
  Check,
  RotateCcw,
  Send,
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  SYNTHETIC_CASES,
  SAMPLE_REPORTS,
  SAMPLE_AUDIO_SCRIPTS
} from "../data/syntheticCases";
import { TRANSLATIONS } from "../data/translations";
import { evaluateLocalDeterministicTriage } from "../utils/localTriageRules";
import { normalizeIndicSpeech } from "../utils/indicSpeechNormalizer";
import {
  speakHumanVoice,
  stopHumanVoice,
  getVocalAcoustics
} from "../utils/voiceSynthesisEngine";
import TriageResultCard from "./TriageResultCard";

// Canonical cross-language patient statements ensuring synchronous script translation on language switch
const CANONICAL_CLINICAL_CASES = [
  {
    key: "CARDIAC_RAMESH",
    keywords: ["ପଥର", "ଦରଦ", "ଛାତି", "କଣେଇକି", "पत्थर", "सीने", "दर्द", "चुभन", "crushed", "stabbing", "chest"],
    Odia: {
      verbatim: "ଡାକ୍ତର ବାବୁ, ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି ଆଉ ବହୁତ ଜୋରରେ କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ ଆଦୌ ନେଇପାରୁନି, ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି। ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ, ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି।",
      phonetic: "Doctor babu, 2 ghanta hela chhatita pathara bhali bhari laguchhi au bahut jor re kaneiki darada heuchhi. Nishwas aadou neiparuni, deha sara jhalare thanda padigalani. Tike shighra dekhantu babu, chhati fatijiba bhali laguchhi.",
      translation: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    Hindi: {
      verbatim: "डॉक्टर साहब, २ घंटे से सीने में भारी पत्थर जैसा दर्द हो रहा है और बहुत तेज चुभन महसूस हो रही है। सांस बिल्कुल नहीं आ रही, शरीर पसीने से ठंडा पड़ गया है। कृपया जल्दी देखें, लग रहा है सीना फट जाएगा।",
      phonetic: "Doctor sahab, 2 ghante se seene mein bhari patthar jaisa dard ho raha hai aur bahut tez chubhan mehsoos ho rahi hai. Saans bilkul nahi aa rahi, shareer paseene se thanda pad gaya hai. Kripya jaldi dekhein, lag raha hai seena phat jayega.",
      translation: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    English: {
      verbatim: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing.",
      phonetic: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing.",
      translation: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    Bengali: {
      verbatim: "ডাক্তারবাবু, ২ ঘণ্টা ধরে বুকটা পাথরের মতো ভারী লাগছে আর খুব তীব্র চিনচিনে ব্যথা হচ্ছে। শ্বাস একদম নিতে পারছি না, সারা শরীর ঘামে ঠান্ডা হয়ে গেছে। একটু তাড়াতাড়ি দেখুন বাবু, মনে হচ্ছে বুকটা ফেটে যাবে।",
      phonetic: "Daktarbabu, 2 ghonta dhore bukta pathorer moto bhari lagchhe ar khub tibro chinchine byatha hochhe. Shwas ekdom nite parchhi na, sara shorir ghame thanda hoye gechhe. Ektu taratari dekhun babu, mone hochhe bukta phete jabe.",
      translation: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    Tamil: {
      verbatim: "டாக்டர் ஐயா, இரண்டு மணி நேரமாக நெஞ்சு பாராங்கல் போல அழுத்துகிறது மற்றும் தாங்க முடியாத ஊசி குத்துவது போன்ற வலி இருக்கிறது. மூச்சு விடவே முடியவில்லை, உடல் முழுவதும் குளிர்ந்து வியர்த்து கொட்டுகிறது. சீக்கிரம் பாருங்கள் ஐயா, நெஞ்சு வெடிப்பது போல் இருக்கிறது.",
      phonetic: "Doctor aiya, irandu mani neramaga nenju paarangal pola aluthugirathu matrum thaanga mudiyatha oosi kuthuvathu pondra vali irukkirathu. Moochu vidave mudiyavillai, udal muzhuvathum kulirnthu viyarthu kottugirathu. Seekiram paarungal aiya, nenju vedippathu pol irukkirathu.",
      translation: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    Telugu: {
      verbatim: "డాక్టర్ గారూ, రెండు గంటల నుంచి గుండె మీద రాయి పెట్టినట్లు బరువుగా ఉంది మరియు విపరీతమైన పొడుస్తున్న నొప్పిగా ఉంది. ఊపిరి అస్సలు ఆడటం లేదు, ఒళ్లంతా చల్లటి చెమటలు పట్టేస్తున్నాయి. త్వరగా చూడండి బాబూ, గుండె పగిలిపోయేలా ఉంది.",
      phonetic: "Doctor garoo, rendu gantala nunchi gunde meeda raayi pettinatlu baruvuga undi mariyu vipareetamaina podustunna noppiga undi. Oopiri assalu aadatam ledu, ollantaa challati chematalu pattesthunnaayi. Tvaraga choodandi baboo, gunde pagilipoyela undi.",
      translation: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    }
  },
  {
    key: "FEVER_PRIYA",
    keywords: ["ତାତିଛି", "ବିନ୍ଧୁଛି", "ଦାଗ", "ନିଆଁ", "भट्टी", "तप रहा", "चकत्ते", "बुखार", "fever", "burning", "petechial", "rash"],
    Odia: {
      verbatim: "ଦିଦି, ୩ ଦିନ ହେଲା ଦେହ ସାରା ନିଆଁ ଭଳି ତାତିଛି। ମୁଣ୍ଡଟା ଏତେ ଜୋରରେ ବିନ୍ଧୁଛି ଯେ ଆଖି ଖୋଲି ହେଉନି। ହାତ ଗୋଡ଼ରେ ଲାଲ୍ ଦାଗ ବାହାରି ପଡ଼ିଛି ଆଉ ଚାଲିବାକୁ ଜମା ବଳ ପାଉନି।",
      phonetic: "Didi, 3 dina hela deha sara nia bhali tatichhi. Mundata ete jor re bindhuchhi je aakhi kholi heuni. Hata godare laal daga bahari padichhi au chalibaku jama bala pauni.",
      translation: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand."
    },
    Hindi: {
      verbatim: "दीदी, ३ दिन से पूरा बदन भट्टी की तरह तप रहा है। सिर में इतना भयानक दर्द है कि आंखें भी नहीं खुल रही हैं। पूरे हाथ-पैरों में लाल चकत्ते निकल आए हैं और चलने की बिल्कुल ताक़त नहीं बची है।",
      phonetic: "Didi, 3 din se pura badan bhatti ki tarah tap raha hai. Sir mein itna bhayanak dard hai ki aankhein bhi nahi khul rahi hain. Pure haath-pairon mein laal chakatte nikal aaye hain aur chalne ki bilkul taaqat nahi bachi hai.",
      translation: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand."
    },
    English: {
      verbatim: "Sister, for the past 3 days my entire body has been burning with high fever. My headache is so severe that I can't even open my eyes. Red spots have appeared across my arms and legs, and I have zero strength to stand.",
      phonetic: "Sister, for the past 3 days my entire body has been burning with high fever. My headache is so severe that I can't even open my eyes. Red spots have appeared across my arms and legs, and I have zero strength to stand.",
      translation: "Sister, for the past 3 days my entire body has been burning with high fever. My headache is so severe that I can't even open my eyes. Red spots have appeared across my arms and legs, and I have zero strength to stand."
    },
    Bengali: {
      verbatim: "দিদি, ৩ দিন ধরে পুরো শরীর আগুনের মতো জ্বলছে। মাথায় এত তীব্র যন্ত্রণা যে চোখ খুলতে পারছি না। হাত-পায়ে লাল দাগ ফুটে উঠেছে আর হাঁটার একদম শক্তি নেই।",
      phonetic: "Didi, 3 din dhore puro shorir aguner moto jwolchhe. Mathay eto tibro jontrona je chokh khulte parchhi na. Hath-paye laal daag phute uthechhe ar haatar ekdom shokti nei.",
      translation: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand."
    },
    Tamil: {
      verbatim: "அக்கா, 3 நாட்களாக உடம்பு நெருப்பு போல கொதிக்கிறது. தலை பயங்கரமாக வலிக்கிறது, கண்ணையே திறக்க முடியவில்லை. கை கால்களில் சிவப்பு புள்ளிகள் வந்துவிட்டன, எழுந்து நடக்கக் கூட தெம்பு இல்லை.",
      phonetic: "Akka, 3 naatkalaga udambu neruppu pola kothikkirathu. Thalai bayangaramaaga valikkirathu, kannaiye thirakka mudiyavillai. Kai kaalgalil sivappu pulligal vanthuvittana, ezhunthu nadakka kooda thembu illai.",
      translation: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand."
    },
    Telugu: {
      verbatim: "అక్కా, మూడు రోజుల నుంచి ఒళ్లంతా నిప్పులా కాలిపోతోంది. తలనొప్పి ఎంత తీవ్రంగా ఉందంటే కళ్లు కూడా తెరవలేకపోతున్నాను. కాళ్లు చేతులపై ఎర్రటి మచ్చలు వచ్చాయి, నడవడానికి అస్సలు శక్తి లేదు.",
      phonetic: "Akka, moodu rojula nunchi ollantaa nippulaa kaalipothondi. Talanroppi entha teevramgaa undante kallu kooda teravalekapothunnaanu. Kaallu chetulapai errati machalu vachhaayi, nadavadaaniki assalu shakti ledu.",
      translation: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand."
    }
  },
  {
    key: "CHILD_LIPU_AARAV",
    keywords: ["ପେଟଟା", "ବାନ୍ତି", "ଖାଇ", "କଷ୍ଟ", "पेट", "उल्टी", "रोना", "दर्द", "tummy", "threw up", "vomit", "hurts"],
    Odia: {
      verbatim: "ଦିଦି, ପେଟଟା ଭୀଷଣ ବିନ୍ଧୁଛି। ସକାଳୁ ୨ ଥର ବାନ୍ତି ହେଲାଣି ଆଉ କିଛି ଖାଇ ହେଉନି, ବହୁତ କଷ୍ଟ ହେଉଛି।",
      phonetic: "Didi, petata bhisana bindhuchhi. Sakalu 2 thara banti helani au kichhi khai heuni, bahut kasta heuchhi.",
      translation: "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts a lot."
    },
    Hindi: {
      verbatim: "दीदी, पेट में बहुत तेज दर्द हो रहा है। सुबह से दो बार उल्टी हो गई और कुछ भी खाया नहीं जा रहा, बहुत रोना आ रहा है।",
      phonetic: "Didi, pet mein bahut tez dard ho raha hai. Subah se do baar ulti ho gayi aur kuch bhi khaya nahi ja raha, bahut rona aa raha hai.",
      translation: "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts so much."
    },
    English: {
      verbatim: "Sister, my stomach hurts so much. I threw up twice this morning and I can't eat anything, it hurts really bad.",
      phonetic: "Sister, my stomach hurts so much. I threw up twice this morning and I can't eat anything, it hurts really bad.",
      translation: "Sister, my stomach hurts so much. I threw up twice this morning and I can't eat anything, it hurts really bad."
    },
    Bengali: {
      verbatim: "দিদি, পেটে খুব জোরে ব্যথা করছে। সকাল থেকে দু'বার বমি হয়ে গেছে আর কিছুই খেতে পারছি না, খুব কষ্ট হচ্ছে।",
      phonetic: "Didi, pete khub jore byatha korchhe. Sokal theke dubar bomi hoye gechhe ar kichhui khete parchhi na, khub koshto hochhe.",
      translation: "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts a lot."
    },
    Tamil: {
      verbatim: "அக்கா, வயிறு ரொம்ப பயங்கரமா வலிக்குது. காலையில இருந்து ரெண்டு தடவ வாந்தி எடுத்திட்டேன், ஒண்ணுமே சாப்பிட முடியல, ரொம்ப கஷ்டமா இருக்கு.",
      phonetic: "Akka, vayiru romba bayangarama valikkuthu. Kaalaiyila irunthu rendu thadava vaanthi eduthitten, onnumey saapida mudiyala, romba kashtama irukku.",
      translation: "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts a lot."
    },
    Telugu: {
      verbatim: "అక్కా, కడుపులో విపరీతంగా నొప్పిగా ఉంది. పొద్దున్నుంచి రెండుసార్లు వాంతులు అయ్యాయి, ఏమీ తినలేకపోతున్నాను, చాలా ఏడుపు వస్తోంది.",
      phonetic: "Akka, kadupulo vipareetamgaa noppiga undi. Poddununchi rendusarlu vaanthulu ayyaayi, emee tinalekapothunnaanu, chaala edupu vasthondi.",
      translation: "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts a lot."
    }
  },
  {
    key: "HEADACHE_SUBHASH",
    keywords: ["ମଥାଟା", "ପାଠ", "ଥକା", "ନମସ୍କାର", "माथे", "पढ़ाई", "थकान", "नमस्ते", "headache", "throbbing", "study", "tired"],
    Odia: {
      verbatim: "ନମସ୍କାର ଦିଦି, ଗତକାଲି ରାତିରେ ଅନେକ ସମୟ ଧରି ପାଠ ପଢ଼ିବା ପରେ ମଥାଟା ସାମାନ୍ୟ ବିନ୍ଧୁଛି। ଜ୍ୱର କି ବାନ୍ତି କିଛି ନାହିଁ, କେବଳ ଟିକେ ଥକା ଲାଗୁଛି।",
      phonetic: "Namaskar didi, gatakali raatire aneka samaya dhari patha padhiba pare mathata samanya bindhuchhi. Jwara ki banti kichhi naahi, kebala tike thaka laguchhi.",
      translation: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    },
    Hindi: {
      verbatim: "नमस्ते दीदी, कल देर रात तक स्क्रीन पर पढ़ाई करने के बाद से माथे में हल्का-हल्का दर्द है। कोई बुखार या उल्टी नहीं है, बस थोड़ी थकान महसूस हो रही है।",
      phonetic: "Namaste didi, kal der raat tak screen par padhai karne ke baad se maathe mein halka-halka dard hai. Koi bukhar ya ulti nahi hai, bas thodi thakan mehsoos ho rahi hai.",
      translation: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    },
    English: {
      verbatim: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired.",
      phonetic: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired.",
      translation: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    },
    Bengali: {
      verbatim: "নমস্কার দিদি, কাল রাতে পরীক্ষার পড়ার পর কপালে হালকা ব্যথা করছে। কোনো জ্বর বা বমি নেই, শুধু একটু ক্লান্তি লাগছে।",
      phonetic: "Nomoshkar didi, kaal raate porikshar porar por kopale halka byatha korchhe. Kono jwor ba bomi nei, shudhu ektu klanti lagchhe.",
      translation: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    },
    Tamil: {
      verbatim: "வணக்கம் அக்கா, நேற்று இரவு தேர்வுக்கு படித்ததால் நெற்றியில் லேசான தலைவலி இருக்கிறது. காய்ச்சல் அல்லது வாந்தி எதுவும் இல்லை, கொஞ்சம் சோர்வாக உள்ளது.",
      phonetic: "Vanakkam akka, netru iravu thervukku padithathaal netriyil lesaana thalaivali irukkirathu. Kaaichal allathu vaanthi ethuvum illai, konjam sorvaaga ullathu.",
      translation: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    },
    Telugu: {
      verbatim: "నమస్కారం అక్కా, నిన్న రాత్రి పరీక్షల కోసం చదువుకున్న తర్వాత నుదిటిలో కొద్దిగా తలనొప్పిగా ఉంది. జ్వరం లేదా వాంతులు ఏమీ లేవు, కాస్త నీరసంగా ఉంది.",
      phonetic: "Namaskaram akka, ninna raatri pareekshala kosam chaduvukunna tarvata nuditilo koddigaa talanoppiga undi. Jwaram leda vaanthulu emee levu, kaasta neerasamgaa undi.",
      translation: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    }
  },
  {
    key: "MATERNAL_MEENA",
    keywords: ["ମାଉସୀ", "ଗର୍ଭ", "ଝାପ୍ସା", "ଫୁଲି", "ଚପଲ", "चप्पल", "सूज", "धुंधलापन", "महीने का गर्भ", "pregnant", "swollen", "pre-eclampsia", "slippers", "vision"],
    Odia: {
      verbatim: "ମାଉସୀ, ମୋତେ ୮ ମାସ ଚାଲିଛି। ଗତକାଲି ସଞ୍ଜରୁ ମୁଣ୍ଡଟା କାଠ ଭଳିଆ ଖୁବ୍ ବିନ୍ଧୁଛି, ଆଖିକୁ ଝାପ୍ସା ଦିଶୁଛି ଆଉ ଗୋଡ଼ ଦୁଇଟା ଫୁଲି ଯାଇ ଚପଲ ପଶୁନି।",
      phonetic: "Mausi, mote 8 masa chalichhi. Gatakali sanjaru mundata katha bhalia khub bindhuchhi, aakhiku jhapsa disuchhi au goda duita fuli jai chapala pasuni.",
      translation: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    },
    Hindi: {
      verbatim: "नर्स दीदी, मुझे ८ महीने का गर्भ है। कल शाम से सिर बहुत तेज फटने जैसा दर्द कर रहा है, आंखों के आगे धुंधलापन आ रहा है और दोनों पैर इतने सूज गए हैं कि चप्पल नहीं आ रही।",
      phonetic: "Nurse didi, mujhe 8 mahine ka garbh hai. Kal shaam se sir bahut tez phatne jaisa dard kar raha hai, aankhon ke aage dhundhlapan aa raha hai aur dono pair itne sooj gaye hain ki chappal nahi aa rahi.",
      translation: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    },
    English: {
      verbatim: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit.",
      phonetic: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit.",
      translation: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    },
    Bengali: {
      verbatim: "নার্স দিদি, আমার ৮ মাসের গর্ভ চলছে। কাল সন্ধ্যা থেকে মাথায় প্রচণ্ড যন্ত্রণা হচ্ছে, চোখের সামনে সব ঝাপসা দেখছি আর দুটো পা এত ফুলে গেছে যে চটি পরতে পারছি না।",
      phonetic: "Nurse didi, amar 8 masher gorbho cholchhe. Kaal sondhya theke mathay prochondo jontrona hochhe, chokher shamne shob jhapsa dekhchhi ar duto pa eto phule gechhe je choti porte parchhi na.",
      translation: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    },
    Tamil: {
      verbatim: "நர்ஸ் அக்கா, எனக்கு 8 மாத கர்ப்பம். நேற்று மாலையில் இருந்து தலை பயங்கரமாக வலிக்கிறது, கண்ணும் மங்கலாக தெரிகிறது, இரண்டு கால்களும் வீங்கி செருப்பு கூட போட முடியவில்லை.",
      phonetic: "Nurse akka, enakku 8 maatha karppam. Netru maalaiyil irunthu thalai bayangaramaaga valikkirathu, kannum mangalaaga therigirathu, irandu kaalgalum veengi seruppu kooda poda mudiyavillai.",
      translation: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    },
    Telugu: {
      verbatim: "నర్సు అక్కా, నాకు 8 నెలల గర్భం. నిన్న సాయంత్రం నుంచి తల బద్దలయ్యేంత తీవ్రమైన నొప్పిగా ఉంది, కళ్లు మసకగా కనిపిస్తున్నాయి, రెండు కాళ్లూ బాగా వాచిపోయి చెప్పులు కూడా పట్టడం లేదు.",
      phonetic: "Nurse akka, naaku 8 nelala garbham. Ninna saayantram nunchi tala baddalayyentha teevramaina noppiga undi, kallu masakaga kanipisthunnaayi, rendu kaalloo baagaa vaachipoyi cheppulu kooda pattadam ledu.",
      translation: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    }
  }
];


function findCanonicalCase(text) {
  if (!text || typeof text !== "string") return null;
  const lower = text.toLowerCase();
  for (const c of CANONICAL_CLINICAL_CASES) {
    if (c.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return c;
    }
  }
  return null;
}

export default function IntakeStation({
  selectedFacility,
  selectedLanguage,
  onAnalyze,
  isAnalyzing,
  triageResult,
  onSubmitFollowupAnswers,
  onGoToDoctorQueue,
  externalPresetId,
  onOpenAbhaStudio,
  externalAbhaProfile
}) {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.English;

  // Wizard Step: 1 = Registration, 2 = Symptoms & Vitals, 3 = Triage Note & Handover
  const [wizardStep, setWizardStep] = useState(1);

  // Smooth scroll to top on step transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [wizardStep]);

  // Form State
  const [patientInfo, setPatientInfo] = useState({
    patient_id: "PHC-1024",
    token_number: "T-024",
    name_or_alias: "",
    age: 35,
    sex: "Male",
    location_state: "Odisha - Khordha",
    facility_type: selectedFacility || "PHC_OPD",
    language_preference: selectedLanguage || "English",
    consent_given: true,
    unconscious_bypass: false,
    emergency_contact: "+91-",
    abha_id: ""
  });

  const [abhaScanned, setAbhaScanned] = useState(false);
  const [isScanningAbha, setIsScanningAbha] = useState(false);

  // Synchronize externally generated ABHA ID & Profile
  useEffect(() => {
    if (externalAbhaProfile) {
      setPatientInfo((prev) => ({
        ...prev,
        abha_id: externalAbhaProfile.abha_number,
        name_or_alias: externalAbhaProfile.name,
        age: externalAbhaProfile.age,
        sex: externalAbhaProfile.gender,
        location_state: externalAbhaProfile.state,
        emergency_contact: externalAbhaProfile.mobile,
        consent_given: true
      }));

      setMedicalHistory((prev) => ({
        ...prev,
        existing_conditions: prev.existing_conditions.length > 0
          ? prev.existing_conditions
          : ["Essential Hypertension (ICD-10 I10)", "Type 2 Diabetes"],
        current_medications: prev.current_medications.length > 0
          ? prev.current_medications
          : ["Amlodipine 5mg OD"],
        known_allergies: prev.known_allergies.length > 0
          ? prev.known_allergies
          : ["Penicillin Allergy"]
      }));

      setAbhaScanned(true);
    }
  }, [externalAbhaProfile]);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const currentlyPlayingTextRef = useRef(null);
  const prevLangRef = useRef(selectedLanguage);
  const [, setActiveBodyRegion] = useState("chestCardiac");

  // 6 Interactive Anatomical Zones
  const BODY_REGIONS = [
    {
      id: "headNeck",
      icon: "🧠",
      label: t.headNeck || "Head & Neck",
      symptoms: ["Headache", "Dizziness", "Blurred Vision"]
    },
    {
      id: "chestCardiac",
      icon: "🫀",
      label: t.chestCardiac || "Chest & Cardiac",
      symptoms: ["Chest Pain", "Palpitations", "Sweating"]
    },
    {
      id: "lungsBreathing",
      icon: "🫁",
      label: t.lungsBreathing || "Lungs & Breathing",
      symptoms: ["Difficulty Breathing", "Cough"]
    },
    {
      id: "abdomenPelvis",
      icon: "🤰",
      label: t.abdomenPelvis || "Abdomen & Pelvis",
      symptoms: ["Severe Abdominal Pain", "Nausea", "Vomiting"]
    },
    {
      id: "limbsJoints",
      icon: "🦵",
      label: t.limbsJoints || "Limbs & Joints",
      symptoms: ["Ankle Swelling", "Edema", "Weakness / Fatigue"]
    },
    {
      id: "skinSurface",
      icon: "🩹",
      label: t.skinSurface || "Skin & Surface",
      symptoms: ["Skin Rash", "Wound / Trauma", "Burns"]
    }
  ];

  // 1-Click ABHA / ABDM Mock Scan Handler with Holographic Laser Scan
  const handleMockScanAbha = () => {
    setIsScanningAbha(true);
    setTimeout(() => {
      setPatientInfo((prev) => ({
        ...prev,
        abha_id: "91-4821-9923-0192",
        name_or_alias: prev.name_or_alias || "Verified ABHA Citizen",
        age: prev.age || 45,
        sex: prev.sex || "Male",
        location_state: "Odisha - Khordha",
        consent_given: true
      }));

      setMedicalHistory({
        existing_conditions: [
          "Essential Hypertension (ICD-10 I10)",
          "Type 2 Diabetes"
        ],
        current_medications: [
          "Amlodipine 5mg OD (Irregular)",
          "Metformin 500mg BD"
        ],
        known_allergies: [
          "Penicillin (Severe Urticaria / Anaphylaxis Risk)"
        ]
      });

      setAbhaScanned(true);
      setIsScanningAbha(false);
    }, 750);
  };

  // Click handler for 2D Anatomical Body Map Zone
  const handleBodyRegionClick = (region) => {
    setActiveBodyRegion(region.id);
    const regionSyms = region.symptoms;
    const allSelected = regionSyms.every((s) => symptoms.selected_symptoms.includes(s));

    setSymptoms((prev) => {
      let updated;
      if (allSelected) {
        // Deselect this region's symptoms
        updated = prev.selected_symptoms.filter((s) => !regionSyms.includes(s));
      } else {
        // Auto-select all symptoms for this anatomical region
        const toAdd = regionSyms.filter((s) => !prev.selected_symptoms.includes(s));
        updated = [...prev.selected_symptoms, ...toAdd];
      }
      return {
        ...prev,
        selected_symptoms: updated,
        chief_complaint: updated.join(", ") || prev.chief_complaint
      };
    });
  };

  const [symptoms, setSymptoms] = useState({
    chief_complaint: "",
    selected_symptoms: [],
    duration: "",
    onset_trend: "Gradual",
    severity_self_reported: "Moderate (5/10)",
    associated_symptoms: [],
    previous_similar_episodes: "",
    verbatim_local_statement: "",
    phonetic_transliteration: "",
    translated_english_statement: ""
  });

  const [vitals, setVitals] = useState({
    temperature_f: 98.6,
    spo2_percent: 98,
    heart_rate_bpm: 76,
    bp_systolic: 120,
    bp_diastolic: 80,
    respiratory_rate_min: 16,
    blood_glucose_mg_dl: 100,
    weight_kg: 60
  });

  const [medicalHistory, setMedicalHistory] = useState({
    existing_conditions: [],
    current_medications: [],
    known_allergies: []
  });

  const [redFlags, setRedFlags] = useState({
    severe_chest_pain: false,
    severe_breathing_difficulty: false,
    very_low_oxygen_spo2: false,
    loss_of_consciousness: false,
    severe_bleeding: false,
    seizure: false,
    sudden_weakness_paralysis: false,
    severe_allergic_reaction: false
  });

  const [selectedReportId, setSelectedReportId] = useState("");
  const [uploadedReports, setUploadedReports] = useState([]);
  const [visualCategory, setVisualCategory] = useState("None");
  const [visualCaption, setVisualCaption] = useState("");

  const [isListening, setIsListening] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [isStatementVerified, setIsStatementVerified] = useState(false);
  const [liveStreamText, setLiveStreamText] = useState("");
  const [isSoundDetected, setIsSoundDetected] = useState(false);
  const [audioVolumePercent, setAudioVolumePercent] = useState(0);
  const [detectedIdioms, setDetectedIdioms] = useState([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micErrorMessage, setMicErrorMessage] = useState("");

  // Hardware Audio & Speech Recognition Refs
  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedAudioChunksRef = useRef([]);
  const isListeningRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const accumulatedTranscriptRef = useRef("");

  // Recording timer for animated audio waveform
  useEffect(() => {
    let timer = null;
    if (isListening || isPlayingAudio) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isListening, isPlayingAudio]);

  const formatTimerString = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}s`;
  };

  const stopHardwareAudioStream = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // media recorder stop error ignored
      }
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {
        // audio context close error ignored
      }
      audioContextRef.current = null;
    }
    setIsSoundDetected(false);
    setAudioVolumePercent(0);
  }, []);

  // Stop speech recognition, finalize statement and optionally transcribe audio via Sarvam STT
  const handleStopSpeech = useCallback(async (autoConfirmed = false) => {
    isListeningRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // recognition stop error ignored
      }
      recognitionRef.current = null;
    }

    // Stop MediaRecorder and grab recorded audio chunks
    let recordedBlob = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
        if (recordedAudioChunksRef.current.length > 0) {
          const mime = mediaRecorderRef.current.mimeType || "audio/webm";
          recordedBlob = new Blob(recordedAudioChunksRef.current, { type: mime });
        }
      } catch {
        // media recorder stop error ignored
      }
    } else if (recordedAudioChunksRef.current.length > 0) {
      recordedBlob = new Blob(recordedAudioChunksRef.current, { type: "audio/webm" });
    }

    stopHardwareAudioStream();
    setIsListening(false);

    const liveText = accumulatedTranscriptRef.current?.trim();

    // If Web Speech API didn't yield text (or for Odia) and we captured live audio, send to Sarvam STT
    if (!liveText && recordedBlob && recordedBlob.size > 800) {
      setIsTranscribing(true);
      try {
        const formData = new FormData();
        const ext = recordedBlob.type.includes("mp4") ? "m4a" : "webm";
        formData.append("file", recordedBlob, `patient_speech.${ext}`);
        formData.append("model", "saaras:v3");

        let lang = "en-IN";
        if (patientInfo.language_preference === "Odia") lang = "od-IN";
        else if (patientInfo.language_preference === "Hindi") lang = "hi-IN";
        formData.append("language_code", lang);

        const res = await fetch("/api/v1/sarvam/stt", {
          method: "POST",
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          const transcript = (data.transcript || data.text || "").trim();
          if (transcript) {
            setLiveStreamText(transcript);
            setSymptoms((prev) => ({
              ...prev,
              verbatim_local_statement: transcript
            }));
            const norm = normalizeIndicSpeech(transcript, patientInfo.language_preference);
            if (norm.detectedIdioms && norm.detectedIdioms.length > 0) {
              setDetectedIdioms(norm.detectedIdioms);
            }
            if (norm.clinicalSummary) {
              setSymptoms((prev) => ({
                ...prev,
                translated_english_statement: norm.clinicalSummary,
                chief_complaint: norm.clinicalSummary
              }));
            }
            setIsStatementVerified(true);
          }
        }
      } catch (sttErr) {
        console.warn("Sarvam STT invocation note:", sttErr);
      } finally {
        setIsTranscribing(false);
      }
    } else if (liveText) {
      if (autoConfirmed) {
        setIsStatementVerified(true);
      }
    }
  }, [stopHardwareAudioStream, patientInfo.language_preference]);

  // Sync facility and language props & synchronize clinical script
  useEffect(() => {
    setPatientInfo((prev) => ({
      ...prev,
      facility_type: selectedFacility,
      language_preference: selectedLanguage
    }));

    // If language actually changed, cancel active playback and synchronize statement
    if (prevLangRef.current !== selectedLanguage) {
      stopHumanVoice();
      setIsPlayingAudio(false);
      currentlyPlayingTextRef.current = null;
      if (isListeningRef.current) {
        handleStopSpeech(false);
      }

      prevLangRef.current = selectedLanguage;

      setSymptoms((prev) => {
        const currentStatement = prev.verbatim_local_statement || "";
        const matched = findCanonicalCase(currentStatement);

        if (matched && matched[selectedLanguage]) {
          const target = matched[selectedLanguage];
          setLiveStreamText(target.verbatim);
          const norm = normalizeIndicSpeech(target.verbatim, selectedLanguage);
          setDetectedIdioms(norm.detectedIdioms || []);

          return {
            ...prev,
            verbatim_local_statement: target.verbatim,
            phonetic_transliteration: target.phonetic,
            translated_english_statement: target.translation,
            chief_complaint: target.translation
          };
        } else {
          // Re-extract idioms for the new language
          const norm = normalizeIndicSpeech(currentStatement, selectedLanguage);
          setDetectedIdioms(norm.detectedIdioms || []);
          return prev;
        }
      });
    }
  }, [selectedFacility, selectedLanguage, handleStopSpeech]);

  // When triage result is available, auto transition to step 3
  useEffect(() => {
    if (triageResult) {
      setWizardStep(3);
    }
  }, [triageResult]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setSpeechRecognitionSupported(true);
    }
  }, []);

  // Vernacular idiom extraction for statement
  useEffect(() => {
    if (symptoms.verbatim_local_statement) {
      const norm = normalizeIndicSpeech(symptoms.verbatim_local_statement, patientInfo.language_preference);
      if (norm.detectedIdioms && norm.detectedIdioms.length > 0) {
        setDetectedIdioms(norm.detectedIdioms);
      }
    }
  }, [symptoms.verbatim_local_statement, patientInfo.language_preference]);

  // Cleanup audio stream, speech synthesis and timers on unmount
  useEffect(() => {
    return () => {
      stopHumanVoice();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {
          // audio context close error ignored
        }
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // recognition stop error ignored
        }
      }
    };
  }, []);

  // Compute live client-side deterministic priority for instant visual feedback
  const localEval = evaluateLocalDeterministicTriage(vitals, redFlags, patientInfo);

  // Compute live vocal acoustics modulated by age, gender, and regional language
  const activeVocalAcoustics = getVocalAcoustics({
    age: patientInfo.age,
    gender: patientInfo.sex,
    role: "patient",
    language: patientInfo.language_preference
  });

  // Adaptive Human Voice Synthesis modulated by age, gender, and regional dialect
  const handlePlaySpeech = (text, langPreference, customDemographics = null) => {
    const age = customDemographics?.age !== undefined ? customDemographics.age : patientInfo.age;
    const gender = customDemographics?.gender || patientInfo.sex;
    const language = langPreference || patientInfo.language_preference;

    if (!text || !text.trim()) return;

    // Toggle off ONLY if user taps play on the exact same currently playing text
    if (isPlayingAudio && currentlyPlayingTextRef.current === text.trim()) {
      stopHumanVoice();
      currentlyPlayingTextRef.current = null;
      setIsPlayingAudio(false);
      return;
    }

    // Otherwise, cancel any ongoing speech and immediately start new one
    stopHumanVoice();
    currentlyPlayingTextRef.current = text.trim();
    setIsPlayingAudio(true);

    speakHumanVoice(text, {
      age,
      gender,
      role: "patient",
      language,
      onStart: () => {
        setIsPlayingAudio(true);
      },
      onEnd: () => {
        setIsPlayingAudio(false);
        currentlyPlayingTextRef.current = null;
      },
      onError: () => {
        setIsPlayingAudio(false);
        currentlyPlayingTextRef.current = null;
      }
    });
  };

  // Load a 1-click synthetic preset
  const handleLoadPreset = (preset) => {
    stopHumanVoice();
    setIsPlayingAudio(false);
    currentlyPlayingTextRef.current = null;
    if (isListening) {
      handleStopSpeech(false);
    }

    let finalVerbatim = preset.symptoms_and_complaints.verbatim_local_statement;
    let finalPhonetic = preset.symptoms_and_complaints.phonetic_transliteration || "";
    let finalTranslation = preset.symptoms_and_complaints.translated_english_statement;
    let finalComplaint = preset.symptoms_and_complaints.chief_complaint;

    const matched = findCanonicalCase(finalVerbatim);
    if (matched && matched[selectedLanguage]) {
      finalVerbatim = matched[selectedLanguage].verbatim;
      finalPhonetic = matched[selectedLanguage].phonetic;
      finalTranslation = matched[selectedLanguage].translation;
      finalComplaint = matched[selectedLanguage].translation;
    }

    setPatientInfo({
      ...preset.patient_basic_info,
      facility_type: selectedFacility || preset.patient_basic_info.facility_type,
      language_preference: selectedLanguage || preset.patient_basic_info.language_preference,
      abha_id: preset.patient_basic_info.abha_id || (preset.id === "RAMESH_CARDIAC_RED" ? "91-4821-9923-0192" : "")
    });
    setAbhaScanned(preset.id === "RAMESH_CARDIAC_RED" || Boolean(preset.patient_basic_info.abha_id));
    setSymptoms({
      ...preset.symptoms_and_complaints,
      verbatim_local_statement: finalVerbatim,
      phonetic_transliteration: finalPhonetic,
      translated_english_statement: finalTranslation,
      chief_complaint: finalComplaint
    });
    setVitals(preset.vital_signs);
    setMedicalHistory({
      existing_conditions: preset.medical_history.existing_conditions || [],
      current_medications: preset.medical_history.current_medications || [],
      known_allergies: preset.medical_history.known_allergies || []
    });
    setRedFlags(preset.red_flag_checklist);
    setUploadedReports(preset.uploaded_reports || []);
    if (preset.visual_inputs && preset.visual_inputs.length > 0) {
      setVisualCategory(preset.visual_inputs[0].image_category);
      setVisualCaption(preset.visual_inputs[0].user_caption);
    } else {
      setVisualCategory("None");
      setVisualCaption("");
    }

    // Extract vernacular idioms from preset statement
    const norm = normalizeIndicSpeech(
      finalVerbatim,
      selectedLanguage || preset.patient_basic_info.language_preference
    );
    setDetectedIdioms(norm.detectedIdioms || []);
    setLiveStreamText(finalVerbatim || "");
  };

  // Auto-load preset requested externally (e.g. from Judge Tour Modal)
  useEffect(() => {
    if (externalPresetId) {
      const p = SYNTHETIC_CASES.find((c) => c.id === externalPresetId);
      if (p) {
        handleLoadPreset(p);
      }
    }
  }, [externalPresetId]);

  // Sample report selection handler
  const handleSelectSampleReport = (reportId) => {
    setSelectedReportId(reportId);
    const found = SAMPLE_REPORTS.find((r) => r.id === reportId);
    if (found) {
      setUploadedReports([
        {
          report_type: found.report_type,
          file_name: `${found.id.toLowerCase()}.jpg`,
          ocr_extracted_text: found.text,
          key_findings: found.findings
        }
      ]);
    }
  };

  // Sample audio injection handler with dialect idiom extraction and age/gender adaptation
  const handleInjectSampleVoice = (sample) => {
    if (sample.age !== undefined || sample.gender !== undefined) {
      setPatientInfo((prev) => ({
        ...prev,
        age: sample.age !== undefined ? sample.age : prev.age,
        sex: sample.gender || prev.sex
      }));
    }

    setSymptoms((prev) => ({
      ...prev,
      verbatim_local_statement: sample.text,
      phonetic_transliteration: sample.phonetic || "",
      translated_english_statement: sample.translation,
      chief_complaint: sample.translation
    }));
    setLiveStreamText(sample.text);
    const norm = normalizeIndicSpeech(sample.text, patientInfo.language_preference);
    setDetectedIdioms(norm.detectedIdioms || []);
    setIsStatementVerified(true);

    // Speak with human voice tailored to this sample's age, gender, and language
    handlePlaySpeech(sample.text, patientInfo.language_preference, {
      age: sample.age !== undefined ? sample.age : patientInfo.age,
      gender: sample.gender || patientInfo.sex
    });
  };

  // Re-record action handler
  const handleRecordAgain = () => {
    setSymptoms((prev) => ({
      ...prev,
      verbatim_local_statement: "",
      phonetic_transliteration: "",
      translated_english_statement: ""
    }));
    setLiveStreamText("");
    setDetectedIdioms([]);
    setIsStatementVerified(false);
    if (!isListening) {
      handleToggleSpeech();
    }
  };

  // Hardware audio capture & real-time volume detection (AnalyserNode) + MediaRecorder
  const startHardwareAudioStream = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        audioStreamRef.current = stream;

        // Initialize MediaRecorder for robust audio capture across all browsers
        try {
          recordedAudioChunksRef.current = [];
          let mimeType = "";
          if (typeof MediaRecorder !== "undefined") {
            if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
              mimeType = "audio/webm;codecs=opus";
            } else if (MediaRecorder.isTypeSupported("audio/webm")) {
              mimeType = "audio/webm";
            } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
              mimeType = "audio/mp4";
            }
            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            recorder.ondataavailable = (e) => {
              if (e.data && e.data.size > 0) {
                recordedAudioChunksRef.current.push(e.data);
              }
            };
            recorder.start(250);
            mediaRecorderRef.current = recorder;
          }
        } catch (recErr) {
          console.warn("MediaRecorder initialization note:", recErr);
        }

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          if (audioCtx.state === "suspended") {
            try {
              await audioCtx.resume();
            } catch {}
          }
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const checkAudioActivity = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const volPercent = Math.min(100, Math.round((avg / 128) * 100));
            setAudioVolumePercent(volPercent);

            // Active voice activity threshold
            setIsSoundDetected(volPercent > 2);

            animationFrameRef.current = requestAnimationFrame(checkAudioActivity);
          };
          animationFrameRef.current = requestAnimationFrame(checkAudioActivity);
        }
        return stream;
      }
    } catch (err) {
      console.warn("Hardware audio capture warning:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicErrorMessage("Microphone permission was denied. Please allow microphone access in your browser URL bar.");
      } else {
        setMicErrorMessage("Could not access microphone: " + (err.message || "Hardware error"));
      }
      return null;
    }
  };

  // Start real-time speech recognition with interim streaming & 2.5s silence detector
  const handleStartSpeech = async () => {
    setMicErrorMessage("");
    setLiveStreamText("");
    accumulatedTranscriptRef.current = "";
    setIsStatementVerified(false);
    isListeningRef.current = true;

    // 1. Hardware studio constraints & sound detection
    const stream = await startHardwareAudioStream();
    if (!stream) {
      isListeningRef.current = false;
      setIsListening(false);
      return;
    }

    setIsListening(true);

    // 2. Web Speech API with regional BCP-47 locale tags (Chrome/Edge)
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        let langCode = "en-IN";
        if (patientInfo.language_preference === "Hindi") langCode = "hi-IN";
        if (patientInfo.language_preference === "Odia") langCode = "hi-IN"; // Use Indic phonetic model while Sarvam STT processes Odia audio

        recognition.lang = langCode;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 3;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onend = () => {
          // If still listening and not manually stopped, keep recognition alive
          if (isListeningRef.current && recognitionRef.current) {
            try {
              recognition.start();
            } catch {}
          }
        };

        recognition.onerror = (e) => {
          console.warn("Speech recognition warning:", e);
          if (e.error === "not-allowed") {
            setMicErrorMessage("Microphone permission was denied. Please allow microphone in your browser URL bar.");
            handleStopSpeech(false);
          }
          // Do not abort on no-speech or language-not-supported; MediaRecorder continues recording!
        };

        recognition.onresult = (event) => {
          let interim = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? " " : "") + event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          const currentLive = (accumulatedTranscriptRef.current + " " + interim).trim();
          setLiveStreamText(currentLive);

          if (currentLive) {
            setSymptoms((prev) => ({
              ...prev,
              verbatim_local_statement: currentLive
            }));

            // Run Indic Medical Speech Normalizer
            const norm = normalizeIndicSpeech(currentLive, patientInfo.language_preference);
            if (norm.detectedIdioms && norm.detectedIdioms.length > 0) {
              setDetectedIdioms(norm.detectedIdioms);
            }
            if (norm.clinicalSummary) {
              setSymptoms((prev) => ({
                ...prev,
                translated_english_statement: norm.clinicalSummary,
                chief_complaint: norm.clinicalSummary
              }));
            }

            // 2.5-second Intelligent Silence Detector
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
            }
            silenceTimerRef.current = setTimeout(() => {
              handleStopSpeech(true);
            }, 2500);
          }
        };

        recognition.start();
      }
    } catch (err) {
      console.warn("Speech recognition startup note:", err);
      // MediaRecorder is already recording audio, which will transcribe via Sarvam STT on stop!
    }
  };

  const handleToggleSpeech = () => {
    if (isListening || isTranscribing) {
      handleStopSpeech(false);
    } else {
      handleStartSpeech();
    }
  };

  const handleRedFlagToggle = (key) => {
    setRedFlags((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSymptomToggle = (symptomName) => {
    setSymptoms((prev) => {
      const exists = prev.selected_symptoms.includes(symptomName);
      const updated = exists
        ? prev.selected_symptoms.filter((s) => s !== symptomName)
        : [...prev.selected_symptoms, symptomName];
      return {
        ...prev,
        selected_symptoms: updated,
        chief_complaint: updated.join(", ") || prev.chief_complaint
      };
    });
  };

  // Navigation handlers
  const handleContinueToStep2 = () => {
    if (!patientInfo.consent_given && !patientInfo.unconscious_bypass) {
      alert("Please confirm Informed Consent (or toggle Emergency Unconscious Override) to proceed.");
      return;
    }
    setWizardStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRunAnalysis = (e) => {
    if (e) e.preventDefault();

    if (!patientInfo.consent_given && !patientInfo.unconscious_bypass) {
      alert("Informed Consent is required before proceeding with triage.");
      return;
    }

    const payload = {
      patient_basic_info: {
        ...patientInfo,
        age: Math.max(0, Math.min(125, Math.abs(Number(patientInfo.age) || 30)))
      },
      symptoms_and_complaints: symptoms,
      vital_signs: vitals,
      medical_history: {
        ...medicalHistory,
        previous_surgeries: [],
        previous_hospitalizations: [],
        family_history: ""
      },
      uploaded_reports: uploadedReports,
      visual_inputs: visualCategory !== "None" ? [
        {
          image_category: visualCategory,
          user_caption: visualCaption,
          ai_supporting_observation: `Supporting visual context for ${visualCategory}`
        }
      ] : [],
      red_flag_checklist: redFlags
    };

    onAnalyze(payload);
  };

  const handleResetForm = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const randomToken = Math.floor(20 + Math.random() * 80);
    setPatientInfo({
      patient_id: `PHC-${randomId}`,
      token_number: `T-0${randomToken}`,
      name_or_alias: "",
      age: 32,
      sex: "Female",
      location_state: "Odisha - Khordha",
      facility_type: selectedFacility || "PHC_OPD",
      language_preference: selectedLanguage || "English",
      consent_given: true,
      unconscious_bypass: false,
      emergency_contact: "+91-",
      abha_id: ""
    });
    setAbhaScanned(false);
    setSymptoms({
      chief_complaint: "",
      selected_symptoms: [],
      duration: "",
      onset_trend: "Gradual",
      severity_self_reported: "Moderate (5/10)",
      associated_symptoms: [],
      previous_similar_episodes: "",
      verbatim_local_statement: "",
      phonetic_transliteration: "",
      translated_english_statement: ""
    });
    setVitals({
      temperature_f: 98.6,
      spo2_percent: 98,
      heart_rate_bpm: 78,
      bp_systolic: 120,
      bp_diastolic: 80,
      respiratory_rate_min: 18,
      blood_glucose_mg_dl: 110,
      weight_kg: 60
    });
    setRedFlags({
      severe_chest_pain: false,
      severe_breathing_difficulty: false,
      very_low_oxygen_spo2: false,
      loss_of_consciousness: false,
      severe_bleeding: false,
      seizure: false,
      sudden_weakness_paralysis: false,
      severe_allergic_reaction: false
    });
    setUploadedReports([]);
    setWizardStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 max-w-full">
      {/* 3-STEP SEQUENTIAL WIZARD PROGRESS BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4">
        {/* Mobile Step Progress Indicator (< sm:) */}
        <div className="sm:hidden space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-teal-800 flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-black">
                {wizardStep}
              </span>
              <span>Step {wizardStep} of 3</span>
            </span>
            <span className="text-slate-600 font-bold text-[11px] truncate max-w-[200px]">
              {wizardStep === 1
                ? (t.wizardStep1Short || "Registration & Consent")
                : wizardStep === 2
                ? (t.wizardStep2Short || "Symptoms & Vitals")
                : (t.wizardStep3Short || "Triage & Handover")}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-600 to-teal-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(wizardStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop Step Stepper (sm:) */}
        <div className="hidden sm:flex items-center justify-between max-w-3xl mx-auto">
          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => setWizardStep(1)}
            className={`flex items-center space-x-2 text-xs font-bold transition cursor-pointer min-h-[44px] ${
              wizardStep === 1
                ? "text-teal-700"
                : wizardStep > 1
                ? "text-slate-700 hover:text-teal-600"
                : "text-slate-400"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                wizardStep === 1
                  ? "bg-teal-600 text-white shadow-md shadow-teal-700/25"
                  : wizardStep > 1
                  ? "bg-teal-100 text-teal-800"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {wizardStep > 1 ? <Check className="w-4 h-4" /> : "1"}
            </span>
            <span>{t.wizardStep1 || "1. Patient Registration & Consent"}</span>
          </button>

          <div
            className={`flex-1 h-0.5 mx-3 sm:mx-6 transition-colors ${
              wizardStep >= 2 ? "bg-teal-500" : "bg-slate-200"
            }`}
          ></div>

          {/* Step 2 Pill */}
          <button
            type="button"
            onClick={() => {
              if (patientInfo.consent_given || patientInfo.unconscious_bypass) setWizardStep(2);
            }}
            className={`flex items-center space-x-2 text-xs font-bold transition cursor-pointer min-h-[44px] ${
              wizardStep === 2
                ? "text-teal-700"
                : wizardStep > 2
                ? "text-slate-700 hover:text-teal-600"
                : "text-slate-400"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                wizardStep === 2
                  ? "bg-teal-600 text-white shadow-md shadow-teal-700/25"
                  : wizardStep > 2
                  ? "bg-teal-100 text-teal-800"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {wizardStep > 2 ? <Check className="w-4 h-4" /> : "2"}
            </span>
            <span>{t.wizardStep2 || "2. Multimodal Symptoms, Vitals & Reports"}</span>
          </button>

          <div
            className={`flex-1 h-0.5 mx-3 sm:mx-6 transition-colors ${
              wizardStep >= 3 ? "bg-teal-500" : "bg-slate-200"
            }`}
          ></div>

          {/* Step 3 Pill */}
          <button
            type="button"
            onClick={() => {
              if (triageResult) setWizardStep(3);
            }}
            className={`flex items-center space-x-2 text-xs font-bold transition cursor-pointer min-h-[44px] ${
              wizardStep === 3
                ? "text-teal-700"
                : triageResult
                ? "text-slate-700 hover:text-teal-600"
                : "text-slate-400 cursor-not-allowed"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                wizardStep === 3
                  ? "bg-teal-600 text-white shadow-md shadow-teal-700/25"
                  : triageResult
                  ? "bg-teal-100 text-teal-800"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              3
            </span>
            <span>{t.wizardStep3 || "3. Structured Triage Note & Handover"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: PATIENT REGISTRATION & INFORMED CONSENT GATE */}
      {/* ========================================================================= */}
      {wizardStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {/* ========================================================================= */}
          {/* 1. HOLOGRAPHIC ABHA DIGITAL HEALTH CARD (NHA / ABDM STYLE) */}
          {/* ========================================================================= */}
          {/* 🪪 NATIONAL HEALTH AUTHORITY • OFFICIAL DIGITAL ABHA SMART CARD          */}
          {/* ========================================================================= */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/5 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/40 text-slate-900 group transition-all duration-300 hover:shadow-emerald-600/15">
            {/* Holographic iridescent light sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-teal-500/5 to-transparent pointer-events-none"></div>

            {/* Laser Scan line when isScanningAbha is true */}
            {isScanningAbha && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_25px_#10b981] animate-laserScan z-30 pointer-events-none"></div>
            )}

            {/* Top Tricolor Accent Bar (Saffron #FF9933, White #FFFFFF, Green #138808) */}
            <div className="h-2 w-full grid grid-cols-3">
              <div className="bg-[#FF9933] h-full"></div>
              <div className="bg-white h-full"></div>
              <div className="bg-[#138808] h-full"></div>
            </div>

            {/* National Health Authority • ABDM Sub-bar */}
            <div className="bg-emerald-50/90 backdrop-blur-md px-5 py-2.5 flex flex-wrap items-center justify-between border-b border-emerald-200/80 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-base leading-none">🏛️</span>
                <span className="font-black tracking-widest text-[11px] text-emerald-950">
                  {t.nationalHealthAuthority || "NATIONAL HEALTH AUTHORITY • ABDM VERIFIED"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                  <span>ABDM LIVE SANDBOX</span>
                </span>
              </div>
            </div>

            {/* Main Card Body */}
            <div className="p-3.5 sm:p-6 relative z-10 space-y-4 sm:space-y-5 min-w-0 max-w-full overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 min-w-0">
                {/* Left side: Chip & Contactless & Avatar */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 min-w-0 w-full md:w-auto">
                  {/* Photorealistic Gold Microchip Graphic */}
                  <div className="relative shrink-0 hidden xs:block">
                    <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-500/90 shadow-md flex flex-col justify-between p-1">
                      <div className="w-full h-[1px] bg-amber-900/40"></div>
                      <div className="flex justify-between items-center h-full px-1">
                        <div className="w-2 h-full border-r border-amber-900/40"></div>
                        <div className="w-3 h-3 rounded-full border border-amber-900/40"></div>
                        <div className="w-2 h-full border-l border-amber-900/40"></div>
                      </div>
                      <div className="w-full h-[1px] bg-amber-900/40"></div>
                    </div>
                    {/* Contactless waves graphic */}
                    <div className="absolute -top-1 -right-2 text-[10px] font-mono text-emerald-800 font-bold select-none">
                      )))
                    </div>
                  </div>

                  {/* Verified Checkmark Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-800 shadow-sm">
                      <User className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    {abhaScanned && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 sm:p-1 border-2 border-white shadow-sm" title="ABDM Verified Citizen">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Citizen Basic Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight truncate max-w-[200px] sm:max-w-none">
                        {patientInfo.name_or_alias || (abhaScanned ? "ABHA Verified Citizen" : "Walk-in Citizen (No Name)")}
                      </h3>
                      <span className={`text-[9px] sm:text-[10px] ${abhaScanned ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-emerald-50 text-emerald-700 border-emerald-200"} border px-2 py-0.5 rounded-md font-bold shrink-0`}>
                        {abhaScanned ? "ABHA VERIFIED" : "WALK-IN CITIZEN"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5 truncate">
                      {patientInfo.age ? `${Math.max(0, Math.abs(Number(patientInfo.age) || 0))} Yrs • ` : ""}{patientInfo.sex} • {patientInfo.location_state || "Odisha - Khordha"}
                    </p>
                  </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenAbhaStudio) {
                        onOpenAbhaStudio(patientInfo);
                      } else {
                        handleMockScanAbha();
                      }
                    }}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 shrink-0 cursor-pointer active:scale-95"
                    title="Open the 2-Minute Assisted ABHA ID Creation & Verification Wizard (ABDM M1)"
                  >
                    <span className="text-sm">🪪</span>
                    <span>Create / Verify ABHA (2 Min)</span>
                    <span className="bg-white/20 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded">M1</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleMockScanAbha}
                    disabled={isScanningAbha}
                    className="w-full sm:w-auto bg-white hover:bg-emerald-50 border-2 border-emerald-400 hover:border-emerald-500 text-emerald-800 font-black text-xs px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition shadow-sm flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer active:scale-95 disabled:opacity-75"
                    title="1-Click Instant Mock Scan with Demo Vitals and Past Records"
                  >
                    <span className="text-xs">{isScanningAbha ? "⚡" : "⚡"}</span>
                    <span>
                      {isScanningAbha
                        ? (t.abhaCardScanning || "Scanning...")
                        : "[ ⚡ 1-Click Scan ]"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Formatted ABHA Number Pill & Digital Health ID Bar */}
              <div className="bg-emerald-50/70 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border-2 border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0 max-w-full shadow-sm">
                <div className="flex flex-col xs:flex-row xs:items-center gap-2 min-w-0 max-w-full">
                  <span className="text-[11px] text-emerald-950 font-black uppercase tracking-wider shrink-0">
                    {t.abhaIdLabel || "ABHA ID"}:
                  </span>
                  <div className="bg-white border-2 border-emerald-300/80 px-2.5 sm:px-3.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-black text-slate-900 tracking-wider shadow-xs flex items-center space-x-1.5 sm:space-x-2 max-w-full min-w-0">
                    <span className="text-emerald-700 font-bold shrink-0">ABHA:</span>
                    <span className="text-slate-800 tracking-wider sm:tracking-widest truncate">
                      {patientInfo.abha_id || (abhaScanned ? "91-4821-9923-0192" : "Not Linked (Scan QR or enter 14-digit ID)")}
                    </span>
                    {abhaScanned ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-auto" />
                    ) : (
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-sans font-bold shrink-0 ml-auto hidden sm:inline">Optional</span>
                    )}
                  </div>
                </div>

                {/* Mock QR Matrix Graphic */}
                <div className="flex items-center space-x-2 text-[10px] text-emerald-900 font-mono font-bold shrink-0">
                  <div className="w-6 h-6 bg-white border border-emerald-300 p-0.5 rounded flex items-center justify-center shadow-xs">
                    <div className="w-full h-full bg-emerald-700 rounded-[2px] flex items-center justify-center">
                      <span className="text-[7px] text-white font-bold">QR</span>
                    </div>
                  </div>
                  <span>NHA SCAN-READY</span>
                </div>
              </div>

              {/* Synced Medical History Pills */}
              <div className="space-y-2 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <span className="text-emerald-950 font-black uppercase tracking-wider flex items-center space-x-1.5">
                    <span className="text-emerald-600">⚡</span>
                    <span>ABDM Synced Medical History & Clinical Alerts:</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Auto-synchronized via Consent Protocol</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(medicalHistory.existing_conditions?.length > 0 || medicalHistory.known_allergies?.length > 0) ? (
                    <>
                      {medicalHistory.existing_conditions?.map((cond, idx) => (
                        <span key={`cond-${idx}`} className="bg-white text-emerald-900 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{cond}</span>
                        </span>
                      ))}

                      {medicalHistory.known_allergies?.map((allergy, idx) => (
                        <span key={`allergy-${idx}`} className="bg-rose-50 text-rose-800 border-2 border-rose-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 ring-1 ring-rose-400 shadow-xs animate-pulse">
                          <span>🚨</span>
                          <span>{allergy} Allergy Alert</span>
                        </span>
                      ))}
                    </>
                  ) : (
                    <span className="text-xs text-emerald-800/80 italic py-0.5 font-medium">
                      No prior chronic alerts on record — Ready for fresh clinical intake or ABHA scan
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 1-Click Demo Quick Fill Profiles */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-5 space-y-3 min-w-0 max-w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>{t.quickFillTitle || "1-Click Demo Quick Fill Profiles:"}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="text-[11px] text-slate-500 font-medium hidden md:inline">
                  Standardized clinical profiles across facility scenarios
                </span>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition flex items-center space-x-1 cursor-pointer active:scale-95"
                  title="Clear all fields and reset to a neutral walk-in intake"
                >
                  <span>🔄</span>
                  <span>Reset to Clean Intake</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-3.5">
              {/* Ramesh (Odia RED) */}
              <button
                type="button"
                onClick={() => handleLoadPreset(SYNTHETIC_CASES.find(c => c.id === "RAMESH_CARDIAC_RED") || SYNTHETIC_CASES[0])}
                className="text-left p-3.5 sm:p-4 rounded-2xl border border-rose-200/80 bg-white hover:border-rose-400 hover:bg-rose-50/40 hover:shadow-lg hover:shadow-rose-900/5 transition-all duration-300 flex flex-col justify-between space-y-2.5 group cursor-pointer hover:-translate-y-0.5"
              >
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      <span>Ramesh (62M)</span>
                    </span>
                    <span className="bg-gradient-to-r from-rose-600 to-rose-700 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black shadow-xs">
                      🔴 RED
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
                    {t.quickFillRameshSub || "Odia Chest Pain & Hypoxia (SpO2 89%)"}
                  </div>
                </div>
                <div className="text-[11px] text-teal-700 font-bold pt-2 border-t border-slate-100 flex items-center justify-between group-hover:text-teal-900">
                  <span>{t.quickFillBtn || "Click to Quick Fill"}</span>
                  <span className="transition-transform group-hover:translate-x-1">➔</span>
                </div>
              </button>

              {/* Priya (Hindi YELLOW) */}
              <button
                type="button"
                onClick={() => handleLoadPreset(SYNTHETIC_CASES.find(c => c.id === "PRIYA_FEVER_YELLOW") || SYNTHETIC_CASES[1])}
                className="text-left p-3.5 sm:p-4 rounded-2xl border border-amber-200/80 bg-white hover:border-amber-400 hover:bg-amber-50/40 hover:shadow-lg hover:shadow-amber-900/5 transition-all duration-300 flex flex-col justify-between space-y-2.5 group cursor-pointer hover:-translate-y-0.5"
              >
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Priya (34F)</span>
                    </span>
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black shadow-xs">
                      🟠 YELLOW
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
                    {t.quickFillPriyaSub || "Hindi High Fever (102.8°F) & Low Platelets"}
                  </div>
                </div>
                <div className="text-[11px] text-teal-700 font-bold pt-2 border-t border-slate-100 flex items-center justify-between group-hover:text-teal-900">
                  <span>{t.quickFillBtn || "Click to Quick Fill"}</span>
                  <span className="transition-transform group-hover:translate-x-1">➔</span>
                </div>
              </button>

              {/* Aarav (Pediatric 8M Child YELLOW) */}
              <button
                type="button"
                onClick={() => handleLoadPreset(SYNTHETIC_CASES.find(c => c.id === "AARAV_PEDIATRIC_YELLOW") || SYNTHETIC_CASES[2])}
                className="text-left p-3.5 sm:p-4 rounded-2xl border border-amber-200/80 bg-white hover:border-amber-400 hover:bg-amber-50/40 hover:shadow-lg hover:shadow-amber-900/5 transition-all duration-300 flex flex-col justify-between space-y-2.5 group cursor-pointer hover:-translate-y-0.5"
              >
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Aarav (8M Child)</span>
                    </span>
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black shadow-xs">
                      🟠 YELLOW
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
                    {t.quickFillAaravSub || "Pediatric Acute Abdomen & Vomiting"}
                  </div>
                </div>
                <div className="text-[11px] text-teal-700 font-bold pt-2 border-t border-slate-100 flex items-center justify-between group-hover:text-teal-900">
                  <span>{t.quickFillBtn || "Click to Quick Fill"}</span>
                  <span className="transition-transform group-hover:translate-x-1">➔</span>
                </div>
              </button>

              {/* Subhash (Eng GREEN) */}
              <button
                type="button"
                onClick={() => handleLoadPreset(SYNTHETIC_CASES.find(c => c.id === "SUBHASH_HEADACHE_GREEN") || SYNTHETIC_CASES[3])}
                className="text-left p-3.5 sm:p-4 rounded-2xl border border-emerald-200/80 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col justify-between space-y-2.5 group cursor-pointer hover:-translate-y-0.5"
              >
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Subhash (24M)</span>
                    </span>
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black shadow-xs">
                      🟢 GREEN
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
                    {t.quickFillSubhashSub || "English Tension Headache & Screen Fatigue"}
                  </div>
                </div>
                <div className="text-[11px] text-teal-700 font-bold pt-2 border-t border-slate-100 flex items-center justify-between group-hover:text-teal-900">
                  <span>{t.quickFillBtn || "Click to Quick Fill"}</span>
                  <span className="transition-transform group-hover:translate-x-1">➔</span>
                </div>
              </button>

              {/* Meena (Odia Maternal RED) */}
              <button
                type="button"
                onClick={() => handleLoadPreset(SYNTHETIC_CASES.find(c => c.id === "MEENA_MATERNAL_RED") || SYNTHETIC_CASES[4])}
                className="text-left p-3.5 sm:p-4 rounded-2xl border border-rose-200/80 bg-white hover:border-rose-400 hover:bg-rose-50/40 hover:shadow-lg hover:shadow-rose-900/5 transition-all duration-300 flex flex-col justify-between space-y-2.5 group cursor-pointer hover:-translate-y-0.5"
              >
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      <span>Meena (28F)</span>
                    </span>
                    <span className="bg-gradient-to-r from-rose-600 to-rose-700 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black shadow-xs">
                      🔴 RED
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1.5 font-medium leading-relaxed">
                    {t.quickFillMeenaSub || "Maternal Pre-eclampsia (BP 168/110)"}
                  </div>
                </div>
                <div className="text-[11px] text-teal-700 font-bold pt-2 border-t border-slate-100 flex items-center justify-between group-hover:text-teal-900">
                  <span>{t.quickFillBtn || "Click to Quick Fill"}</span>
                  <span className="transition-transform group-hover:translate-x-1">➔</span>
                </div>
              </button>
            </div>
          </div>

          {/* Minimal Patient Registration Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-6 space-y-4 sm:space-y-5 min-w-0 max-w-full overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {t.step1Title}
                  </h3>
                  <p className="text-xs text-slate-500">{t.step1Subtitle}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs bg-teal-50 text-teal-800 px-2.5 sm:px-3 py-1 rounded-xl border border-teal-200 font-mono font-bold shadow-xs">
                  {t.tokenLabel}: {patientInfo.token_number}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 sm:px-2.5 py-1 rounded-xl font-mono">
                  {t.patientIdLabel}: {patientInfo.patient_id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1.5 flex items-center justify-between">
                  <span>{t.abhaIdLabel || "ABHA ID (ABDM)"}</span>
                  {abhaScanned && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                      ✓ ABDM
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={patientInfo.abha_id || ""}
                  onChange={(e) => setPatientInfo({ ...patientInfo, abha_id: e.target.value })}
                  placeholder="e.g. 91-4821-9923-0192"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-mono font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">{t.nameLabel}</label>
                <input
                  type="text"
                  value={patientInfo.name_or_alias}
                  onChange={(e) => setPatientInfo({ ...patientInfo, name_or_alias: e.target.value })}
                  placeholder={t.namePlaceholder || "e.g. Patient / Citizen Name"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">{t.ageLabel}</label>
                <input
                  type="number"
                  min="0"
                  max="125"
                  step="1"
                  value={patientInfo.age === "" ? "" : patientInfo.age}
                  onKeyDown={(e) => {
                    // Prevent typing negative sign, exponential notation, or plus
                    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setPatientInfo({ ...patientInfo, age: "" });
                      return;
                    }
                    const num = parseInt(val, 10);
                    if (isNaN(num)) return;
                    setPatientInfo({
                      ...patientInfo,
                      age: Math.max(0, Math.min(125, Math.abs(num)))
                    });
                  }}
                  onBlur={() => {
                    if (patientInfo.age === "" || isNaN(patientInfo.age) || Number(patientInfo.age) < 0) {
                      setPatientInfo({ ...patientInfo, age: 30 });
                    }
                  }}
                  placeholder="30"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">{t.sexLabel}</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Male", "Female", "Other"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPatientInfo({ ...patientInfo, sex: s })}
                      className={`py-2.5 rounded-xl border font-bold text-xs transition cursor-pointer ${
                        patientInfo.sex === s
                          ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {s === "Male" ? t.male : s === "Female" ? t.female : t.other}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">{t.langPrefLabel}</label>
                <select
                  value={patientInfo.language_preference}
                  onChange={(e) => setPatientInfo({ ...patientInfo, language_preference: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium cursor-pointer"
                >
                  <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">{t.locationLabel}</label>
                <input
                  type="text"
                  value={patientInfo.location_state}
                  onChange={(e) => setPatientInfo({ ...patientInfo, location_state: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">{t.emergencyContactLabel}</label>
                <input
                  type="text"
                  value={patientInfo.emergency_contact}
                  onChange={(e) => setPatientInfo({ ...patientInfo, emergency_contact: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-mono"
                />
              </div>
            </div>

            {/* Informed Consent & Emergency Bypass */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-start space-x-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={patientInfo.consent_given}
                  onChange={(e) => setPatientInfo({ ...patientInfo, consent_given: e.target.checked })}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span>
                  <strong className="text-slate-900 font-bold block">Informed Consent Confirmed:</strong>
                  {t.consentText}
                </span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-bold text-rose-700 shrink-0 cursor-pointer bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                <input
                  type="checkbox"
                  checked={patientInfo.unconscious_bypass}
                  onChange={(e) => setPatientInfo({ ...patientInfo, unconscious_bypass: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <span>{t.unconsciousBypass}</span>
              </label>
            </div>
          </div>

          {/* Step 1 Sticky Bottom Navigation Action */}
          <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md p-3.5 sm:p-5 border border-slate-200/90 rounded-2xl shadow-xl flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline font-medium">
              Step 1 of 3: Citizen identity & consent verified
            </span>
            <button
              type="button"
              onClick={handleContinueToStep2}
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 sm:px-8 py-3.5 rounded-xl transition shadow-md shadow-teal-700/25 flex items-center justify-center space-x-2 text-sm min-h-[44px] cursor-pointer ml-auto"
            >
              <span>{t.continueToStep2 || "Continue to Symptoms & Vitals ➔"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: MULTIMODAL SYMPTOMS, VITALS & REPORTS (2-COLUMN DESKTOP LAYOUT) */}
      {/* ========================================================================= */}
      {wizardStep === 2 && (
        <form onSubmit={handleRunAnalysis} className="space-y-6 animate-fadeIn">
          {/* Clean 2-Column Desktop Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ------------------------------------------------------------- */}
            {/* LEFT COLUMN: Voice, Transcription, Symptoms & Red-Flags */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-6">
              {/* Quadrant 1: Multilingual Voice & Speech Intake */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-6 space-y-4 min-w-0 max-w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 truncate">
                        {t.quadrant1Title}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{t.quadrant1Subtitle}</p>
                    </div>
                  </div>

                  {/* Speech Recording Button with Active Green Audio Visualizer Ring */}
                  <div className="relative inline-flex items-center w-full sm:w-auto">
                    {isListening && isSoundDetected && (
                      <span className="absolute -inset-1.5 rounded-2xl bg-emerald-400 opacity-75 blur-xs animate-pulse pointer-events-none"></span>
                    )}
                    <button
                      type="button"
                      onClick={handleToggleSpeech}
                      disabled={isTranscribing}
                      aria-label={isTranscribing ? "Transcribing recorded audio" : isListening ? "Stop microphone recording" : "Start microphone voice recording"}
                      className={`relative w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer min-h-[44px] ${
                        isTranscribing
                          ? "bg-slate-800 text-slate-200 border border-teal-500/50 cursor-wait shadow-sm"
                          : isListening
                          ? isSoundDetected
                            ? "bg-emerald-600 text-white ring-4 ring-emerald-400/80 shadow-lg shadow-emerald-500/40"
                            : "bg-rose-600 text-white ring-2 ring-rose-400 animate-pulse"
                          : "bg-teal-600 text-white hover:bg-teal-700"
                      }`}
                    >
                      {isTranscribing ? (
                        <Loader2 className="w-4 h-4 text-teal-400 animate-spin shrink-0" />
                      ) : isListening ? (
                        isSoundDetected ? <Mic className="w-4 h-4 text-white animate-bounce shrink-0" /> : <MicOff className="w-4 h-4 shrink-0" />
                      ) : (
                        <Mic className="w-4 h-4 shrink-0" />
                      )}
                      <span className="truncate">
                        {isTranscribing
                          ? "Transcribing with Sarvam AI..."
                          : isListening
                          ? isSoundDetected
                            ? "Voice Detected • Speaking..."
                            : (t.voiceRecordingPrompt || t.listening)
                          : t.speakBtn}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Microphone Error Message Banner if Permissions Blocked */}
                {micErrorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs flex items-center justify-between space-x-2 shadow-xs">
                    <div className="flex items-center space-x-2 min-w-0">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="font-medium truncate">{micErrorMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMicErrorMessage("")}
                      className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded text-[11px] shrink-0"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Live Transcript Preview Pill */}
                {(isListening || isTranscribing || liveStreamText) && (
                  <div className="flex items-center space-x-2.5 px-3 sm:px-3.5 py-2 bg-slate-900 border border-teal-500/40 rounded-xl text-xs text-white shadow-md animate-fadeIn min-w-0 max-w-full">
                    <span className="flex h-2.5 w-2.5 relative shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="font-mono text-[11px] font-black text-emerald-400 tracking-wider shrink-0">
                      {isTranscribing ? "⚡ STT:" : "🎙️ Live:"}
                    </span>
                    <span className="text-slate-200 font-mono italic truncate flex-1 min-w-0">
                      {isTranscribing
                        ? "Converting audio with Sarvam Saaras Indic STT..."
                        : liveStreamText || (isListening ? `Listening for speech in ${patientInfo.language_preference}...` : "")}
                    </span>
                    {audioVolumePercent > 0 && !isTranscribing && (
                      <span className="ml-auto text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800 shrink-0">
                        {audioVolumePercent}%
                      </span>
                    )}
                  </div>
                )}

                {/* 3. ANIMATED AUDIO WAVEFORM VISUALIZER (Voice Intake in Step 2) */}
                {(isListening || isPlayingAudio) && (
                  <div className="bg-slate-900 border border-teal-500/50 rounded-2xl p-3.5 sm:p-4 text-white shadow-lg flex flex-wrap items-center justify-between gap-3 animate-fadeIn min-w-0 max-w-full">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="relative flex h-3.5 w-3.5 shrink-0">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSoundDetected ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                        <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${isSoundDetected ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-xs sm:text-sm font-black text-teal-300 tracking-wider">
                            {formatTimerString(recordingSeconds)}
                          </span>
                          <span className="text-slate-500 text-xs hidden xs:inline">•</span>
                          <span className="text-xs font-bold text-white truncate">
                            {isListening
                              ? `${isSoundDetected ? "Voice Active" : "Listening"} (${patientInfo.language_preference})`
                              : `Audio Playback (${patientInfo.language_preference})`}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-teal-200/70 mt-0.5 truncate">
                          {isListening
                            ? isSoundDetected
                              ? "Real-time speech stream active • 1.8s auto-silence detect"
                              : "Hardware noise suppression active • Speak clearly"
                            : "Colloquial vernacular speech simulation"}
                        </p>
                      </div>
                    </div>

                    {/* 7 Vertical Frequency Bars of Varying Heights */}
                    <div className="flex items-center space-x-1.5 h-8 px-2 sm:px-2.5 bg-black/50 rounded-xl border border-teal-500/40 shrink-0 shadow-inner ml-auto">
                      <span className="w-1.5 bg-teal-400 rounded-full wave-bar-1 equalizer-bar" style={{ height: isSoundDetected ? `${Math.max(14, Math.min(28, audioVolumePercent * 0.45))}px` : "14px" }}></span>
                      <span className="w-1.5 bg-emerald-400 rounded-full wave-bar-2 equalizer-bar" style={{ height: isSoundDetected ? `${Math.max(18, Math.min(30, audioVolumePercent * 0.65))}px` : "22px" }}></span>
                      <span className="w-1.5 bg-teal-300 rounded-full wave-bar-3 equalizer-bar" style={{ height: isSoundDetected ? `${Math.max(22, Math.min(32, audioVolumePercent * 0.85))}px` : "28px" }}></span>
                      <span className="w-1.5 bg-emerald-300 rounded-full wave-bar-4 equalizer-bar" style={{ height: isSoundDetected ? `${Math.max(16, Math.min(26, audioVolumePercent * 0.55))}px` : "18px" }}></span>
                      <span className="w-1.5 bg-teal-400 rounded-full wave-bar-5 equalizer-bar" style={{ height: isSoundDetected ? `${Math.max(20, Math.min(30, audioVolumePercent * 0.75))}px` : "26px" }}></span>
                      <span className="w-1.5 bg-emerald-400 rounded-full wave-bar-6 equalizer-bar" style={{ height: isSoundDetected ? `${Math.max(16, Math.min(24, audioVolumePercent * 0.5))}px` : "16px" }}></span>
                      <span className="w-1.5 bg-teal-300 rounded-full wave-bar-7 equalizer-bar" style={{ height: isSoundDetected ? `${Math.max(18, Math.min(28, audioVolumePercent * 0.6))}px` : "20px" }}></span>
                    </div>
                  </div>
                )}

                {/* Vernacular Medical Idiom Normalization Banner */}
                {detectedIdioms && detectedIdioms.length > 0 && (
                  <div className="p-3 bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200/90 rounded-2xl space-y-2 shadow-xs animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-950 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        <span>Vernacular Dialect & Idiom Normalizer</span>
                      </span>
                      <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-300">
                        SNOMED-CT / ICD-10 Mapped
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detectedIdioms.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs bg-white text-slate-800 border border-teal-200/80 shadow-xs"
                        >
                          <span className="font-bold text-teal-900">{item.icon || "🩺"} {item.idiom}</span>
                          <span className="text-slate-400 font-bold">➔</span>
                          <span className="font-bold text-emerald-700">{item.clinicalTerm}</span>
                          {item.severity === "CRITICAL" && (
                            <span className="text-[9px] bg-rose-100 text-rose-700 font-black px-1.5 py-0.5 rounded uppercase">
                              Alert
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sample Vernacular Utterance Chips (Language-Specific) with 1-Click Audio Demo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 block">
                      {t.sampleVoiceLabel}
                    </span>
                    <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      ⚡ Stage Demo Audio Ready
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {(SAMPLE_AUDIO_SCRIPTS[patientInfo.language_preference] || SAMPLE_AUDIO_SCRIPTS.Odia || []).map((sample, idx) => (
                      <div
                        key={sample.label || idx}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50/50 hover:border-teal-300 transition text-xs flex items-center justify-between group shadow-2xs"
                      >
                        <div
                          onClick={() => handleInjectSampleVoice(sample)}
                          className="truncate mr-2 flex-1 cursor-pointer"
                        >
                          <span className="font-bold text-slate-900 group-hover:text-teal-900 block truncate">
                            {sample.label}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {sample.text}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInjectSampleVoice(sample);
                            }}
                            title="1-Click Instant Audio Playback (Modulated by Age & Gender)"
                            className="text-[10px] bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 shadow-xs transition cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3 text-teal-100" />
                            <span>Play</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInjectSampleVoice(sample)}
                            className="text-[10px] bg-white border border-slate-300 hover:border-teal-400 text-slate-700 hover:text-teal-800 px-2 py-1 rounded-lg font-semibold transition cursor-pointer"
                          >
                            Inject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adaptive Voice Persona Telemetry Strip */}
                <div className="bg-gradient-to-r from-teal-50/90 via-slate-50 to-indigo-50/70 rounded-2xl p-3.5 border border-teal-200/90 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-teal-200/90 flex items-center justify-center text-lg shadow-2xs shrink-0">
                      {activeVocalAcoustics.personaIcon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <strong className="text-xs font-black text-slate-900 truncate">
                          {activeVocalAcoustics.personaLabel}
                        </strong>
                        <span className="text-[10px] bg-teal-100 text-teal-900 font-mono font-bold px-1.5 py-0.5 rounded border border-teal-300 shrink-0">
                          Pitch: {activeVocalAcoustics.pitch}x • Pace: {activeVocalAcoustics.rate}x
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        Modulated for {patientInfo.sex} ({patientInfo.age}y) in {patientInfo.language_preference} dialect
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handlePlaySpeech(
                        symptoms.verbatim_local_statement || (
                          patientInfo.language_preference === "Hindi"
                            ? "डॉक्टर साहब, बहुत तेज दर्द हो रहा है।"
                            : patientInfo.language_preference === "English"
                            ? "Doctor, I am experiencing severe pain and discomfort."
                            : patientInfo.language_preference === "Bengali"
                            ? "ডাক্তারবাবু, খুব তীব্র যন্ত্রণা হচ্ছে।"
                            : patientInfo.language_preference === "Tamil"
                            ? "டாக்டர் ஐயா, பயங்கரமான வலி இருக்கிறது."
                            : patientInfo.language_preference === "Telugu"
                            ? "డాక్టర్ గారూ, చాలా తీవ్రమైన నొప్పిగా ఉంది."
                            : "ଡାକ୍ତର ବାବୁ, ବହୁତ ଜୋରରେ କଷ୍ଟ ହେଉଛି।"
                        ),
                        patientInfo.language_preference
                      )}
                      className={`text-xs px-3.5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 border transition shadow-xs cursor-pointer min-h-[44px] ${
                        isPlayingAudio
                          ? "bg-rose-600 text-white border-rose-600 animate-pulse"
                          : "bg-white text-teal-800 border-teal-300 hover:bg-teal-50 hover:border-teal-400"
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isPlayingAudio ? "Stop Audio" : "🔊 Test Vocal Persona"}</span>
                    </button>
                  </div>
                </div>

                {/* Dual-Layer Speech Bubble */}
                <div className="space-y-3 pt-1">
                  {/* Top Layer: Native Vernacular Statement + Audio Playback */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                        <Radio className="w-3.5 h-3.5 text-teal-600" />
                        <span>{t.originalStatementLabel} ({patientInfo.language_preference})</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handlePlaySpeech(symptoms.verbatim_local_statement, patientInfo.language_preference)}
                        className={`flex items-center space-x-1 border px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer min-h-[44px] ${
                          isPlayingAudio
                            ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse"
                            : "bg-white hover:bg-teal-50 text-teal-700 border-slate-200"
                        }`}
                      >
                        <Volume2 className="w-4 h-4 text-teal-600" />
                        <span>{isPlayingAudio ? "Stop Audio" : t.playAudioBtn}</span>
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={symptoms.verbatim_local_statement}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSymptoms((prev) => ({ ...prev, verbatim_local_statement: val }));
                        const norm = normalizeIndicSpeech(val, patientInfo.language_preference);
                        setDetectedIdioms(norm.detectedIdioms || []);
                        setIsStatementVerified(false);
                      }}
                      placeholder="Captured spoken statement in patient's native dialect..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />

                    {/* Phonetic Transliteration */}
                    <div className="pt-0.5">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                        {t.phoneticTransliteration}:
                      </span>
                      <input
                        type="text"
                        value={symptoms.phonetic_transliteration || ""}
                        onChange={(e) => setSymptoms({ ...symptoms, phonetic_transliteration: e.target.value })}
                        placeholder="English phonetic romanization..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-mono italic focus:outline-none min-h-[40px]"
                      />
                    </div>

                    {/* Spoken Nuance Verification & Record Again Action Buttons */}
                    <div className="pt-2 border-t border-slate-200/90 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setIsStatementVerified(true)}
                          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs min-h-[44px] ${
                            isStatementVerified
                              ? "bg-emerald-600 text-white shadow-emerald-600/20 ring-2 ring-emerald-500/30"
                              : "bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>
                            {patientInfo.language_preference === "Odia"
                              ? "ହଁ, ଠିକ୍ ଅଛି"
                              : patientInfo.language_preference === "Hindi"
                              ? "हाँ, बिल्कुल सही"
                              : "Looks Accurate"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={handleRecordAgain}
                          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs min-h-[44px]"
                        >
                          <RotateCcw className="w-4 h-4 text-slate-500" />
                          <span>
                            {patientInfo.language_preference === "Odia"
                              ? "ପୁଣି କୁହନ୍ତୁ"
                              : patientInfo.language_preference === "Hindi"
                              ? "दोबारा बोलें"
                              : "Record Again"}
                          </span>
                        </button>
                      </div>

                      {isStatementVerified && (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {patientInfo.language_preference === "Odia"
                              ? "ବକ୍ତବ୍ୟ ଯାଞ୍ଚ ହୋଇଛି"
                              : patientInfo.language_preference === "Hindi"
                              ? "बयान सत्यापित है"
                              : "Verified Accurate"}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Layer: Clinical English Translation & Chief Complaint */}
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-950 flex items-center space-x-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.englishTranslationLabel}</span>
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{t.aiVerifiedTranslation}</span>
                      </span>
                    </div>

                    <textarea
                      rows={2}
                      value={symptoms.chief_complaint}
                      onChange={(e) => setSymptoms({ ...symptoms, chief_complaint: e.target.value })}
                      placeholder="Clinical English translation for medical officer queue note..."
                      className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Quadrant 2: Symptoms & Emergency Red-Flags */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-6 space-y-4 min-w-0 max-w-full overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 truncate">
                        {t.quadrant2Title}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{t.quadrant2Subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* 2. INTERACTIVE 2D ANATOMICAL BODY MAP */}
                <div className="space-y-3 bg-slate-50/80 border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🗺️</span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                          {t.bodyMapTitle || "Interactive 2D Anatomical Body Map"}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {t.bodyMapSubtitle || "Tap any anatomical zone to highlight and auto-select clinical symptoms"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full shrink-0">
                      6 Touch Zones
                    </span>
                  </div>

                  {/* Auto-scaling SVG Anatomical Body Silhouette Figure */}
                  <div className="w-full max-w-[280px] sm:max-w-[340px] mx-auto py-2 flex items-center justify-center overflow-hidden">
                    <svg
                      viewBox="0 0 240 310"
                      className="w-full h-auto max-h-[250px] drop-shadow-sm select-none"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background Ambient Silhouette */}
                      <path
                        d="M120 15 C132 15 142 25 142 38 C142 49 135 58 126 60 L126 70 C148 70 162 76 174 88 L192 135 C196 145 190 155 180 153 C174 152 170 146 166 138 L152 96 L152 165 L144 240 C143 252 144 270 148 285 C149 290 143 294 139 290 L128 245 L122 174 L118 174 L112 245 L101 290 C97 294 91 290 92 285 C96 270 97 252 96 240 L88 165 L88 96 L74 138 C70 146 66 152 60 153 C50 155 44 145 48 135 L66 88 C78 76 92 70 114 70 L114 60 C105 58 98 49 98 38 C98 25 108 15 120 15 Z"
                        className="fill-slate-100 stroke-slate-200 stroke-1"
                      />

                      {/* Head & Neck Target */}
                      <g
                        onClick={() => handleBodyRegionClick(BODY_REGIONS[0])}
                        className="cursor-pointer group"
                      >
                        <circle
                          cx="120"
                          cy="38"
                          r="22"
                          className={
                            BODY_REGIONS[0].symptoms.some((s) => symptoms.selected_symptoms.includes(s))
                              ? "fill-teal-500 stroke-teal-600 stroke-2 filter drop-shadow-md"
                              : "fill-white/80 hover:fill-teal-100 stroke-slate-300 hover:stroke-teal-400 stroke-1"
                          }
                        />
                        <rect
                          x="114"
                          y="58"
                          width="12"
                          height="12"
                          rx="3"
                          className={
                            BODY_REGIONS[0].symptoms.some((s) => symptoms.selected_symptoms.includes(s))
                              ? "fill-teal-600"
                              : "fill-slate-200"
                          }
                        />
                        <text x="120" y="43" textAnchor="middle" fontSize="13">🧠</text>
                      </g>

                      {/* Chest & Cardiac Zone */}
                      <g
                        onClick={() => handleBodyRegionClick(BODY_REGIONS[1])}
                        className="cursor-pointer group"
                      >
                        <path
                          d="M96 72 H144 C152 72 155 78 153 86 L148 112 H92 L87 86 C85 78 88 72 96 72 Z"
                          className={
                            BODY_REGIONS[1].symptoms.some((s) => symptoms.selected_symptoms.includes(s))
                              ? "fill-rose-500/80 stroke-rose-600 stroke-2 filter drop-shadow-md"
                              : "fill-white/80 hover:fill-rose-100 stroke-slate-300 hover:stroke-rose-400 stroke-1"
                          }
                        />
                        <text x="120" y="96" textAnchor="middle" fontSize="14">🫀</text>
                      </g>

                      {/* Lungs & Breathing Zone */}
                      <g
                        onClick={() => handleBodyRegionClick(BODY_REGIONS[2])}
                        className="cursor-pointer group"
                      >
                        <path
                          d="M74 82 C68 90 68 108 76 114 C82 114 86 106 86 92 Z"
                          className={
                            BODY_REGIONS[2].symptoms.some((s) => symptoms.selected_symptoms.includes(s))
                              ? "fill-sky-500/85 stroke-sky-600 stroke-2"
                              : "fill-sky-100/70 hover:fill-sky-200 stroke-slate-300 stroke-1"
                          }
                        />
                        <path
                          d="M166 82 C172 90 172 108 164 114 C158 114 154 106 154 92 Z"
                          className={
                            BODY_REGIONS[2].symptoms.some((s) => symptoms.selected_symptoms.includes(s))
                              ? "fill-sky-500/85 stroke-sky-600 stroke-2"
                              : "fill-sky-100/70 hover:fill-sky-200 stroke-slate-300 stroke-1"
                          }
                        />
                        <text x="120" y="79" textAnchor="middle" fontSize="9" fontWeight="bold" className="fill-slate-600">🫁 Lungs</text>
                      </g>

                      {/* Abdomen & Pelvis Zone */}
                      <g
                        onClick={() => handleBodyRegionClick(BODY_REGIONS[3])}
                        className="cursor-pointer group"
                      >
                        <path
                          d="M92 116 H148 L142 162 C140 168 134 172 128 172 H112 C106 172 100 168 98 162 Z"
                          className={
                            BODY_REGIONS[3].symptoms.some((s) => symptoms.selected_symptoms.includes(s))
                              ? "fill-amber-500/80 stroke-amber-600 stroke-2 filter drop-shadow-md"
                              : "fill-white/80 hover:fill-amber-100 stroke-slate-300 hover:stroke-amber-400 stroke-1"
                          }
                        />
                        <text x="120" y="146" textAnchor="middle" fontSize="14">🤰</text>
                      </g>

                      {/* Limbs & Joints (Arms + Legs) */}
                      <g
                        onClick={() => handleBodyRegionClick(BODY_REGIONS[4])}
                        className="cursor-pointer group"
                      >
                        <circle
                          cx="55"
                          cy="142"
                          r="12"
                          className={
                            BODY_REGIONS[4].symptoms.some((s) => symptoms.selected_symptoms.includes(s))
                              ? "fill-indigo-500 stroke-indigo-600 stroke-2"
                              : "fill-white/80 hover:fill-indigo-100 stroke-slate-300 stroke-1"
                          }
                        />
                        <circle
                          cx="185"
                          cy="142"
                          r="12"
                          className={
                            BODY_REGIONS[4].symptoms.some((s) => symptoms.selected_symptoms.includes(s))
                              ? "fill-indigo-500 stroke-indigo-600 stroke-2"
                              : "fill-white/80 hover:fill-indigo-100 stroke-slate-300 stroke-1"
                          }
                        />
                        <circle
                          cx="96"
                          cy="255"
                          r="12"
                          className={
                            BODY_REGIONS[4].symptoms.some((s) => symptoms.selected_symptoms.includes(s))
                              ? "fill-indigo-500 stroke-indigo-600 stroke-2"
                              : "fill-white/80 hover:fill-indigo-100 stroke-slate-300 stroke-1"
                          }
                        />
                        <circle
                          cx="144"
                          cy="255"
                          r="12"
                          className={
                            BODY_REGIONS[4].symptoms.some((s) => symptoms.selected_symptoms.includes(s))
                              ? "fill-indigo-500 stroke-indigo-600 stroke-2"
                              : "fill-white/80 hover:fill-indigo-100 stroke-slate-300 stroke-1"
                          }
                        />
                        <text x="55" y="146" textAnchor="middle" fontSize="10">✋</text>
                        <text x="185" y="146" textAnchor="middle" fontSize="10">✋</text>
                        <text x="96" y="259" textAnchor="middle" fontSize="10">🦵</text>
                        <text x="144" y="259" textAnchor="middle" fontSize="10">🦵</text>
                      </g>

                      {/* Skin & Surface Floating Pill */}
                      <g
                        onClick={() => handleBodyRegionClick(BODY_REGIONS[5])}
                        className="cursor-pointer group"
                      >
                        <rect
                          x="8"
                          y="10"
                          width="52"
                          height="26"
                          rx="8"
                          className={
                            BODY_REGIONS[5].symptoms.some((s) => symptoms.selected_symptoms.includes(s))
                              ? "fill-emerald-500 stroke-emerald-600 stroke-2 filter drop-shadow"
                              : "fill-white hover:fill-emerald-50 stroke-slate-300 hover:stroke-emerald-400 stroke-1 shadow-xs"
                          }
                        />
                        <text
                          x="34"
                          y="27"
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="bold"
                          className={
                            BODY_REGIONS[5].symptoms.some((s) => symptoms.selected_symptoms.includes(s))
                              ? "fill-white font-extrabold"
                              : "fill-slate-700"
                          }
                        >
                          🩹 Skin
                        </text>
                      </g>
                    </svg>
                  </div>

                  {/* 6 Clickable Anatomical Zones Grid (2-column on mobile < sm, 3-column on sm:) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1">
                    {BODY_REGIONS.map((region) => {
                      const isRegionActive = region.symptoms.some((s) =>
                        symptoms.selected_symptoms.includes(s)
                      );
                      const activeCount = region.symptoms.filter((s) =>
                        symptoms.selected_symptoms.includes(s)
                      ).length;

                      return (
                        <button
                          key={region.id}
                          type="button"
                          onClick={() => handleBodyRegionClick(region)}
                          title={`Anatomical Zone: ${region.label}\nClick to toggle symptoms: ${region.symptoms.join(", ")}`}
                          className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-1.5 group relative overflow-hidden min-h-[44px] ${
                            isRegionActive
                              ? "bg-teal-500/10 border-teal-500 text-teal-950 ring-2 ring-teal-500 shadow-md shadow-teal-500/25 scale-[1.01]"
                              : "bg-white border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50/30 hover:shadow-md hover:shadow-teal-500/10 hover:-translate-y-0.5 active:translate-y-0"
                          }`}
                        >
                          {/* Ambient zone glow on active */}
                          {isRegionActive && (
                            <span className="absolute -right-4 -bottom-4 w-12 h-12 bg-teal-400/20 rounded-full blur-md pointer-events-none"></span>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-base sm:text-lg group-hover:scale-110 transition-transform duration-200">{region.icon}</span>
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full transition-colors ${
                                isRegionActive
                                  ? "bg-teal-600 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-800"
                              }`}
                            >
                              {activeCount > 0 ? `${activeCount}` : "Tap"}
                            </span>
                          </div>
                          <div>
                            <span className="font-black text-[11px] sm:text-xs block leading-tight group-hover:text-teal-900 transition-colors">
                              {region.label}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate block mt-0.5">
                              {region.symptoms.join(", ")}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Granular Symptom Tag Pills */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 block">
                      {t.selectSymptomsLabel || "Select Active Symptoms:"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {symptoms.selected_symptoms.length} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Chest Pain",
                      "Difficulty Breathing",
                      "High Fever",
                      "Sweating",
                      "Palpitations",
                      "Headache",
                      "Dizziness",
                      "Blurred Vision",
                      "Cough",
                      "Severe Abdominal Pain",
                      "Nausea",
                      "Vomiting",
                      "Ankle Swelling",
                      "Edema",
                      "Weakness / Fatigue",
                      "Skin Rash",
                      "Wound / Trauma",
                      "Burns"
                    ].map((sym) => {
                      const isSelected = symptoms.selected_symptoms.includes(sym);
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => handleSymptomToggle(sym)}
                          className={`text-xs px-3 py-1.5 rounded-xl border transition cursor-pointer font-medium ${
                            isSelected
                              ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {sym}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration & Onset Inputs */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">{t.durationLabel}</label>
                    <input
                      type="text"
                      value={symptoms.duration}
                      onChange={(e) => setSymptoms({ ...symptoms, duration: e.target.value })}
                      placeholder="e.g. 2 hours / 3 days"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">{t.onsetTrendLabel}</label>
                    <input
                      type="text"
                      value={symptoms.onset_trend}
                      onChange={(e) => setSymptoms({ ...symptoms, onset_trend: e.target.value })}
                      placeholder="e.g. Worsening rapidly"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                {/* Emergency Red-Flag Overrides Checklist */}
                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-2.5 shadow-xs">
                  <div className="flex items-center space-x-2 text-xs font-bold text-rose-900">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{t.redFlagsTitle}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-950 font-medium">
                    {[
                      { key: "severe_chest_pain", label: "Severe Retrosternal Chest Pain" },
                      { key: "severe_breathing_difficulty", label: "Severe Dyspnea / Stridor" },
                      { key: "very_low_oxygen_spo2", label: "SpO₂ < 90% (Hypoxia Emergency)" },
                      { key: "loss_of_consciousness", label: "Altered Sensorium / Syncope" },
                      { key: "severe_bleeding", label: "Active Uncontrolled Hemorrhage" },
                      { key: "seizure", label: "Active / Recent Seizure Episode" },
                      { key: "sudden_weakness_paralysis", label: "Sudden Focal Neuro Deficit / FAST" },
                      { key: "severe_allergic_reaction", label: "Anaphylaxis / Airway Edema" }
                    ].map((flag) => (
                      <label
                        key={flag.key}
                        className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-rose-100/50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={redFlags[flag.key]}
                          onChange={() => handleRedFlagToggle(flag.key)}
                          className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                        <span className="truncate">{flag.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Longitudinal Medical History & Allergies (ABHA Linked) */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 space-y-2.5 shadow-xs min-w-0 max-w-full">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                    <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <span>🪪</span>
                      <span>Longitudinal Medical History & Drug Allergies</span>
                    </span>
                    {patientInfo.abha_id && (
                      <span className="text-[10px] text-teal-800 bg-teal-100 border border-teal-300 font-bold px-2 py-0.5 rounded-full shrink-0">
                        ABHA Synced
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-500 font-semibold text-[11px]">Conditions:</span>
                      {medicalHistory.existing_conditions.length > 0 ? (
                        medicalHistory.existing_conditions.map((c, i) => (
                          <span key={i} className="bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-medium text-[11px]">
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">None recorded</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-rose-700 font-bold text-[11px]">Critical Allergies:</span>
                      {medicalHistory.known_allergies.length > 0 ? (
                        medicalHistory.known_allergies.map((a, i) => (
                          <span key={i} className="bg-rose-50 border border-rose-200 text-rose-800 px-2 py-0.5 rounded-md font-bold text-[11px]">
                            ⚠️ {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No known drug allergies</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* RIGHT COLUMN: Vitals Bento Grid, Diagnostic OCR & Visuals */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-6">
              {/* Quadrant 3: Vital Signs Bento Grid */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-6 space-y-4 min-w-0 max-w-full overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 truncate">
                        {t.quadrant3Title}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{t.quadrant3Subtitle}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 sm:px-3 py-1 rounded-full font-bold shadow-xs shrink-0 ${
                      localEval.priority === "RED"
                        ? "bg-rose-600 text-white"
                        : localEval.priority === "YELLOW"
                        ? "bg-amber-500 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {t.ruleUrgency}: {localEval.priority}
                  </span>
                </div>

                {/* Vitals Grid with Live Threshold Color Shifts (2-col mobile < sm, 3-col sm:) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {/* SpO2 */}
                  <div
                    className={`p-3 sm:p-4 rounded-2xl border transition-all shadow-xs ${
                      vitals.spo2_percent < 90
                        ? "bg-rose-50 border-rose-300 text-rose-950 ring-1 ring-rose-300"
                        : vitals.spo2_percent < 95
                        ? "bg-amber-50 border-amber-300 text-amber-950 ring-1 ring-amber-300"
                        : "bg-emerald-50 border-emerald-300 text-emerald-950"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wide">
                        {t.spo2Label}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold border border-slate-200">
                        %
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={vitals.spo2_percent}
                      onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                      onChange={(e) => setVitals({ ...vitals, spo2_percent: Math.max(0, Math.min(100, Math.abs(Number(e.target.value) || 0))) })}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 focus:outline-none tracking-tight min-h-[44px]"
                    />
                    <span className="text-[10px] font-bold block mt-0.5 truncate">
                      {vitals.spo2_percent < 90 ? `🔴 ${t.criticalHypoxia || "Critical (<90)"}` : (t.normalOxygen || "Normal Oxygen")}
                    </span>
                  </div>

                  {/* Heart Rate */}
                  <div
                    className={`p-3 sm:p-4 rounded-2xl border transition-all shadow-xs ${
                      vitals.heart_rate_bpm > 130 || vitals.heart_rate_bpm < 45
                        ? "bg-rose-50 border-rose-300 text-rose-950 ring-1 ring-rose-300"
                        : vitals.heart_rate_bpm > 100
                        ? "bg-amber-50 border-amber-300 text-amber-950 ring-1 ring-amber-300"
                        : "bg-emerald-50 border-emerald-300 text-emerald-950"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wide">
                        {t.hrLabel}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold border border-slate-200">
                        bpm
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="300"
                      value={vitals.heart_rate_bpm}
                      onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                      onChange={(e) => setVitals({ ...vitals, heart_rate_bpm: Math.max(0, Math.abs(Number(e.target.value) || 0)) })}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 focus:outline-none tracking-tight min-h-[44px]"
                    />
                    <span className="text-[10px] font-bold block mt-0.5 truncate">
                      {vitals.heart_rate_bpm > 100 ? (t.tachycardia || "Tachycardia") : (t.normalHeartRate || "Normal Rate")}
                    </span>
                  </div>

                  {/* Blood Pressure Systolic */}
                  <div
                    className={`p-3 sm:p-4 rounded-2xl border transition-all shadow-xs ${
                      vitals.bp_systolic >= 180 || vitals.bp_systolic < 85
                        ? "bg-rose-50 border-rose-300 text-rose-950 ring-1 ring-rose-300"
                        : vitals.bp_systolic >= 140
                        ? "bg-amber-50 border-amber-300 text-amber-950 ring-1 ring-amber-300"
                        : "bg-emerald-50 border-emerald-300 text-emerald-950"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wide">
                        {t.bpSystolicLabel || "BP Systolic"}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold border border-slate-200">
                        mmHg
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="350"
                      value={vitals.bp_systolic}
                      onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                      onChange={(e) => setVitals({ ...vitals, bp_systolic: Math.max(0, Math.abs(Number(e.target.value) || 0)) })}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 focus:outline-none tracking-tight min-h-[44px]"
                    />
                    <span className="text-[10px] font-bold block mt-0.5 truncate">
                      {vitals.bp_systolic >= 180 ? `🔴 ${t.bpCrisis || "Crisis (≥180)"}` : vitals.bp_systolic < 85 ? `🔴 ${t.bpShock || "Shock (<85)"}` : (t.normalBP || "Normal Range")}
                    </span>
                  </div>

                  {/* Blood Pressure Diastolic */}
                  <div className="p-3 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50/80 text-slate-900 shadow-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wide">
                        {t.bpDiastolicLabel || "BP Diastolic"}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold border border-slate-200">
                        mmHg
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="250"
                      value={vitals.bp_diastolic}
                      onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                      onChange={(e) => setVitals({ ...vitals, bp_diastolic: Math.max(0, Math.abs(Number(e.target.value) || 0)) })}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 focus:outline-none tracking-tight min-h-[44px]"
                    />
                    <span className="text-[10px] font-bold text-slate-500 block mt-0.5 truncate">
                      {t.diastolicUnit || "Diastolic mmHg"}
                    </span>
                  </div>

                  {/* Temperature */}
                  <div
                    className={`p-3 sm:p-4 rounded-2xl border transition-all shadow-xs ${
                      vitals.temperature_f >= 101.5
                        ? "bg-amber-50 border-amber-300 text-amber-950 ring-1 ring-amber-300"
                        : "bg-emerald-50 border-emerald-300 text-emerald-950"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wide">
                        {t.tempLabel}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold border border-slate-200">
                        °F
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="70"
                      max="115"
                      value={vitals.temperature_f}
                      onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                      onChange={(e) => setVitals({ ...vitals, temperature_f: Math.max(0, Math.abs(Number(e.target.value) || 0)) })}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 focus:outline-none tracking-tight min-h-[44px]"
                    />
                    <span className="text-[10px] font-bold block mt-0.5 truncate">
                      {vitals.temperature_f >= 101.5 ? `🟠 ${t.highFever || "High Fever"}` : (t.afebrile || "Afebrile")}
                    </span>
                  </div>

                  {/* Respiratory Rate */}
                  <div className="p-3 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50/80 text-slate-900 shadow-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wide">
                        {t.rrLabel}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold border border-slate-200">
                        /min
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={vitals.respiratory_rate_min}
                      onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                      onChange={(e) => setVitals({ ...vitals, respiratory_rate_min: Math.max(0, Math.abs(Number(e.target.value) || 0)) })}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 focus:outline-none tracking-tight min-h-[44px]"
                    />
                    <span className="text-[10px] font-bold text-slate-500 block mt-0.5 truncate">
                      {vitals.respiratory_rate_min >= 24 ? (t.tachypnea || "Tachypnea") : (t.normalEupnea || "Normal Eupnea")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quadrant 4: Reports OCR & Supporting Visual Context */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-6 space-y-4 min-w-0 max-w-full overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-700 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 truncate">
                        {t.quadrant4Title}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{t.quadrant4Subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Preset Report Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-600 font-semibold block">
                    {t.attachReportLabel}
                  </label>
                  <select
                    value={selectedReportId}
                    onChange={(e) => handleSelectSampleReport(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium cursor-pointer"
                  >
                    <option value="">{t.noReport}</option>
                    {SAMPLE_REPORTS.map((rep) => (
                      <option key={rep.id} value={rep.id}>
                        {rep.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* OCR Extracted Text Preview */}
                {uploadedReports.length > 0 && (
                  <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-3.5 space-y-1 shadow-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-purple-900">{t.extractedFindings}</span>
                      <span className="text-slate-500 font-mono">{uploadedReports[0].file_name}</span>
                    </div>
                    <p className="text-slate-700 text-[11px] font-mono leading-relaxed">
                      {uploadedReports[0].ocr_extracted_text}
                    </p>
                  </div>
                )}

                {/* Supporting Visual Category & Caption */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-700 font-semibold flex items-center space-x-1.5">
                      <Camera className="w-3.5 h-3.5 text-teal-600" />
                      <span>{t.visualObsLabel}</span>
                    </label>
                    <span className="text-[10px] text-slate-500">{t.nonDiagnostic}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <select
                      value={visualCategory}
                      onChange={(e) => setVisualCategory(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
                    >
                      <option value="None">None</option>
                      <option value="Swelling_Edema">Swelling / Edema</option>
                      <option value="Skin_Rash">Skin Rash / Lesion</option>
                      <option value="Wound_Trauma">Wound / Soft Tissue Trauma</option>
                      <option value="Eye_Redness">Eye Redness / Conjunctival</option>
                    </select>

                    <input
                      type="text"
                      value={visualCaption}
                      onChange={(e) => setVisualCaption(e.target.value)}
                      placeholder="Nurse observation note..."
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer for Step 2 (Sticky Bottom Navigation Bar) */}
          <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md p-3 sm:p-4 border border-slate-200/90 rounded-2xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                setWizardStep(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="min-h-[44px] text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>{t.backToStep1 || "⬅ Back to Registration"}</span>
            </button>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="min-h-[48px] w-full sm:w-auto bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-black tracking-wide px-7 sm:px-10 py-3 rounded-xl transition-all duration-300 shadow-xl shadow-teal-700/30 hover:shadow-2xl hover:shadow-teal-700/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2.5 text-sm sm:text-base disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.analyzingBtn}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-teal-100 shrink-0" />
                  <span>{t.runAiTriageCta || "🧠 Run AI Triage Analysis ➔"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: STRUCTURED TRIAGE NOTE & HANDOVER TO DOCTOR QUEUE */}
      {/* ========================================================================= */}
      {wizardStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          {triageResult ? (
            <>
              {/* Triage Result Card Display */}
              <TriageResultCard
                triageRecord={triageResult}
                onSubmitFollowupAnswers={onSubmitFollowupAnswers}
                onGoToDoctorQueue={onGoToDoctorQueue}
                selectedLanguage={selectedLanguage}
              />

              {/* Handover & Action Footer (Sticky Bottom Navigation Bar) */}
              <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md p-3 sm:p-4 border border-slate-200/90 rounded-2xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWizardStep(2);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="min-h-[44px] text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span>{t.backToStep2 || "⬅ Edit Vitals"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="min-h-[44px] text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{t.registerNextPatient || "➕ Next Patient"}</span>
                  </button>
                </div>

                {/* Big Handover Button to Doctor Queue */}
                <button
                  type="button"
                  onClick={onGoToDoctorQueue}
                  className="min-h-[48px] w-full sm:w-auto bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-black tracking-wide px-7 sm:px-10 py-3 rounded-xl transition-all duration-300 shadow-xl shadow-teal-700/30 hover:shadow-2xl hover:shadow-teal-700/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2.5 text-sm sm:text-base cursor-pointer"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>{t.addToDoctorQueue || "📨 Add Patient to Doctor Queue"}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                No Triage Result Generated Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Please enter symptoms and vitals in Step 2 and run the AI Triage Analysis to generate the clinical note.
              </p>
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                Go to Step 2: Symptoms & Vitals
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
