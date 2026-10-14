from typing import Dict, Any, List
from ..models.schemas import ChatResponse

# Verified Agricultural Knowledge Base
KNOWLEDGE_RESPONSES = {
    "early_blight": {
        "en": "Tomato Early Blight is caused by Alternaria solani. It manifests as dark concentric 'target board' lesions on older leaves. \n\nRecommended Safe Actions:\n1. Prune lower leaves touching wet soil.\n2. Apply bio-fungicide Bacillus subtilis or Trichoderma harzianum.\n3. Foliar spray 5% Neem Seed Kernel Extract (NSKE) at first appearance.\n4. Avoid overhead sprinkler watering to keep leaves dry.",
        "te": "టొమాటో ఆకుమచ్చ తెగులు (ఎర్లీ బ్లైట్) ఆల్టర్నేరియా శిలీంధ్రం వల్ల వస్తుంది. ఆకులపై నల్లటి వలయాలు ఏర్పడతాయి.\n\nరైతు సూచనలు:\n1. నేలను తాకే క్రింది ఆకులను కత్తిరించి తీసివేయండి.\n2. ట్రైకోడెర్మా లేదా బ్యాసిల్లస్ వంటి జీవ నియంత్రణలను వాడండి.\n3. 5% వేప గింజల కషాయం (NSKE) పిచికారీ చేయండి.\n4. బిందు సేద్యం (డ్రిప్) ఉపయోగించి ఆకులు తడవకుండా చూసుకోండి.",
        "hi": "टमाटर का अगेती झुलसा (अर्ली ब्लाइट) अल्टरनेरिया कवक के कारण होता है। निचली पत्तियों पर भूरे छल्लेदार धब्बे बनते हैं।\n\nसुरक्षित प्रबंधन:\n1. नीचे की प्रभावित पत्तियों को काटकर नष्ट करें।\n2. ट्राइकोडर्मा हरजिएनम या नीम तेल (5 मिली/लीटर) का छिड़काव करें।\n3. ड्रिप सिंचाई अपनाएं ताकि पत्तियां सूखी रहें।"
    },
    "late_blight": {
        "en": "Late Blight (Phytophthora infestans) is an aggressive water mold disease favored by cool, damp weather. \n\nRecommended Actions:\n1. Rogue out and safely bury heavily infected plants immediately.\n2. Preventive spray of 1% Bordeaux mixture or Copper Oxychloride (2.5 g/L).\n3. Ensure excellent field drainage to prevent standing water.",
        "te": "లేట్ బ్లైట్ (లేటు తెగులు) చల్లని, అధిక తేమ ఉన్న వాతావరణంలో వేగంగా వ్యాపిస్తుంది.\n\nరైతు సూచనలు:\n1. తీవ్రంగా దెబ్బతిన్న మొక్కలను వెంటనే తీసి పూడ్చిపెట్టండి.\n2. ముందు జాగ్రత్తగా బోర్డో మిశ్రమం (1%) లేదా కాపర్ ఆక్సిక్లోరైడ్ పిచికారీ చేయండి.\n3. పొలంలో నీరు నిల్వ ఉండకుండా డ్రైనేజీ కాల్వలు ఏర్పాటు చేయండి.",
        "hi": "पछेती झुलसा (लेट ब्लाइट) ठंडे और नम मौसम में तेजी से फैलता है। पत्तियों पर काले पानी जैसे धब्बे बनते हैं।\n\nसुझाव:\n1. गंभीर रूप से बीमार पौधों को उखाड़कर नष्ट करें।\n2. बोर्डो मिश्रण (1%) या कॉपर ऑक्सीक्लोराइड का छिड़काव करें।\n3. खेत में जलभराव न होने दें।"
    },
    "irrigation": {
        "en": "Optimal irrigation requires matching soil moisture with crop growth stages. \n\nKey Principles:\n1. Critical stages: Flowering and fruit/grain filling are the most water-sensitive.\n2. Irrigate early morning (5 AM - 8 AM) or evening to minimize evapotranspiration losses.\n3. Drip irrigation saves 40-60% water and minimizes fungal foliar leaf wetness.",
        "te": "సరైన నీటి యాజమాన్యం పంట దిగుబడిని పెంచుతుంది.\n\nముఖ్య నియమాలు:\n1. పూత మరియు గింజ పాలుపోసుకునే దశల్లో నీటి ఎద్దడి రాకుండా చూడాలి.\n2. ఉదయం లేదా సాయంత్రం వేళల్లోనే నీరు పెట్టాలి.\n3. బిందు సేద్యం ద్వారా 50% నీరు ఆదా అవుతుంది మరియు తెగుళ్లు తగ్గుతాయి.",
        "hi": "उचित सिंचाई प्रबंधन से फसल उत्पादन बढ़ता है।\n\nमुख्य सावधानियां:\n1. फूल आने और दाना भरने की अवस्था में पर्याप्त नमी बनाए रखें।\n2. सुबह या शाम के समय ही सिंचाई करें ताकि वाष्पीकरण कम हो।\n3. ड्रिप सिंचाई अपनाकर 40-50% पानी की बचत करें।"
    },
    "fertilizer": {
        "en": "Balanced fertilizer application should be guided by Soil Health Card testing.\n\nGuidelines:\n1. Nitrogen (Urea) should always be applied in 2-3 split doses rather than all at once.\n2. Apply Phosphorus (DAP/SSP) as a basal dose near the root zone during sowing.\n3. Add 4-5 tonnes/acre of well-rotted FYM or vermicompost to improve soil organic carbon.",
        "te": "సమతుల్య ఎరువుల వాడకం భూసార పరీక్ష ఆధారంగా జరగాలి.\n\nసూచనలు:\n1. యూరియాను ఒకేసారి వేయకుండా 2-3 దఫాలుగా విభజించి వేయాలి.\n2. భాస్వరం ఎరువులను విత్తే సమయంలోనే ఆఖరి దుక్కిలో వేయాలి.\n3. ఎకరానికి 4-5 టన్నుల పశువుల ఎరువు లేదా వర్మీకంపోస్ట్ వాడటం వలన నేల సారం పెరుగుతుంది.",
        "hi": "मृदा स्वास्थ्य कार्ड (सॉइल हेल्थ कार्ड) के आधार पर ही संतुलित उर्वरक दें।\n\nसलाह:\n1. यूरिया को 2-3 किस्तों में बांटकर दें।\n2. फास्फोरस और पोटाश बुवाई के समय बेसल डोज के रूप में डालें।\n3. 4-5 टन प्रति एकड़ सड़ी गोबर खाद या केंचुआ खाद का प्रयोग करें।"
    },
    "soil_health": {
        "en": "Soil health is the foundation of high crop yields. \n\nRecommendations:\n1. Optimal soil pH is 6.2 to 7.2 for most crops.\n2. For acidic soils (pH < 5.5), apply agricultural lime. For sodic soils (pH > 8.5), apply agricultural gypsum.\n3. Grow green manure crops like Dhaincha or Sunnhemp before main kharif season and incorporate at flowering.",
        "te": "నేల ఆరోగ్యం అధిక దిగుబడులకు పునాది.\n\nముఖ్యమైన చిట్కాలు:\n1. చాలా పంటలకు నేల pH 6.2 నుండి 7.2 మధ్య అనుకూలంగా ఉంటుంది.\n2. చౌడు నేలల్లో జిప్సం, ఆమ్ల నేలల్లో సున్నం వేయండి.\n3. జీలుగ లేదా జనుము వంటి పచ్చిరొట్ట ఎరువులను పూత దశలో కలియదున్నండి.",
        "hi": "स्वस्थ मिट्टी ही अच्छी फसल का आधार है।\n\nमहत्वपूर्ण सुझाव:\n1. फसलों के लिए आदर्श पीएच 6.2 से 7.2 होता है।\n2. क्षारीय भूमि में जिप्सम और अम्लीय भूमि में चूने का प्रयोग करें।\n3. ढैंचा या सनई जैसी हरी खाद को मुख्य फसल से पहले मिट्टी में मिलाएं।"
    },
    "general": {
        "en": "I am your AgriSmart Agricultural Assistant. You can ask me about crop diseases, smart irrigation scheduling, soil NPK balancing, organic fertilizers, or weather advisories. Please specify your crop and symptoms.",
        "te": "నేను మీ అగ్రిస్మార్ట్ వ్యవసాయ సహాయకుడిని. పంట తెగుళ్లు, నీటి యాజమాన్యం, ఎరువుల మోతాదు లేదా వాతావరణ సలహాల గురించి నన్ను అడగవచ్చు. మీ పంట మరియు సమస్యను తెలపండి.",
        "hi": "मैं आपका एग्रीस्मार्ट कृषि सहायक हूँ। आप मुझसे फसल रोग, स्मार्ट सिंचाई, मिट्टी परीक्षण, जैविक खाद या मौसम से जुड़े सवाल पूछ सकते हैं।"
    }
}

SAFE_CAUTION = {
    "en": "⚠️ Agricultural Safety Notice: Chemical dosages vary by soil type, crop variety, and local microclimate. Always use prescribed protective personal equipment (PPE) and consult your local Krishi Vigyan Kendra (KVK) or Agriculture Extension Officer before spraying synthetic chemicals.",
    "te": "⚠️ రైతు రక్షణ సూచన: రసాయన మందుల వాడకానికి ముందు స్థానిక వ్యవసాయ అధికారి (ఏఈవో) లేదా కేవీకే శాస్త్రవేత్తలను సంప్రదించండి. రసాయనాలు పిచికారీ చేసేటప్పుడు మాస్క్ మరియు చేతి తొడుగులు ధరించండి.",
    "hi": "⚠️ किसान सुरक्षा सूचना: किसी भी रासायनिक कीटनाशक का छिड़काव करने से पहले अपने नजदीकी कृषि विज्ञान केंद्र (KVK) या कृषि अधिकारी से परामर्श लें। सुरक्षा किट व मास्क का प्रयोग अवश्य करें।"
}

FOLLOWUPS = {
    "en": ["How can I test my soil moisture?", "What are organic treatments for leaf spots?", "How much water does tomato require?", "How to prepare Jeevamrutha?"],
    "te": ["నేలలో తేమను ఎలా గుర్తించాలి?", "ఆకుమచ్చ తెగులుకు సేంద్రీయ మందులు ఏమిటి?", "టొమాటో పంటకు ఎంత నీరు అవసరం?", "జీవామృతం ఎలా తయారుచేయాలి?"],
    "hi": ["मिट्टी में नमी की जांच कैसे करें?", "पत्तियों के धब्बों के जैविक उपचार क्या हैं?", "टमाटर को कितने पानी की आवश्यकता होती है?", "जीवामृत कैसे बनाएं?"]
}

def get_chatbot_reply(user_msg: str, lang: str = "en") -> ChatResponse:
    lang = lang.lower()
    if lang not in ["en", "te", "hi"]:
        lang = "en"

    query = user_msg.lower()

    # Intent matching
    if any(k in query for k in ["blight", "early blight", "target spot", "మచ్చ", "ఆకుమచ్చ", "झुलसा", "अगेती"]):
        topic = "early_blight"
    elif any(k in query for k in ["late blight", "mold", "rot", "లేటు తెగులు", "కుళ్లు", "पछेती"]):
        topic = "late_blight"
    elif any(k in query for k in ["water", "irrigat", "moisture", "drip", "నీరు", "తడి", "బిందు", "సిరి", "पानी", "सिंचाई"]):
        topic = "irrigation"
    elif any(k in query for k in ["fertiliz", "urea", "npk", "dap", "potash", "manure", "ఎరువు", "యూరియా", "ఖతం", "उर्वरक", "खाद"]):
        topic = "fertilizer"
    elif any(k in query for k in ["soil", "ph", "salin", "testing", "నేల", "భూమి", "మట్టి", "సారం", "मिट्टी", "पीएच"]):
        topic = "soil_health"
    else:
        topic = "general"

    response_text = KNOWLEDGE_RESPONSES[topic][lang]
    caution = SAFE_CAUTION[lang]
    followup_list = FOLLOWUPS[lang]

    return ChatResponse(
        response=response_text,
        language=lang,
        confidence="High" if topic != "general" else "Moderate",
        caution_notice=caution,
        suggested_followups=followup_list,
        source="AgriSmart Verified Agronomic Knowledge Engine (ICAR & FAO standards)"
    )
