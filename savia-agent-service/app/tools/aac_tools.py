import time
from typing import List, Dict, Any

# AAC Contextual Graph for Pediatric Intent Modeling
AAC_INTENT_GRAPH = {
    "want": [
        {"id": "water", "title": "Water", "emoji": "💧", "titleHi": "पानी", "category": "Food", "colorClass": "bg-sky-100 dark:bg-sky-950 text-sky-900"},
        {"id": "eat", "title": "Eat Food", "emoji": "🍎", "titleHi": "खाना", "category": "Food", "colorClass": "bg-emerald-100 dark:bg-emerald-950 text-emerald-900"},
        {"id": "break", "title": "Break / Rest", "emoji": "⏸️", "titleHi": "विश्राम", "category": "Core", "colorClass": "bg-amber-100 dark:bg-amber-950 text-amber-900"},
        {"id": "hug", "title": "Warm Hug", "emoji": "🫂", "titleHi": "गले लगाना", "category": "Comfort", "colorClass": "bg-pink-100 dark:bg-pink-950 text-pink-900"}
    ],
    "help": [
        {"id": "bathroom", "title": "Washroom", "emoji": "🚽", "titleHi": "शौचालय", "category": "Core", "colorClass": "bg-teal-100 dark:bg-teal-950 text-teal-900"},
        {"id": "open", "title": "Open This", "emoji": "📦", "titleHi": "खोलें", "category": "Core", "colorClass": "bg-blue-100 dark:bg-blue-950 text-blue-900"},
        {"id": "shoes", "title": "Tie Shoes", "emoji": "👟", "titleHi": "जूते", "category": "Activities", "colorClass": "bg-indigo-100 dark:bg-indigo-950 text-indigo-900"}
    ],
    "feel": [
        {"id": "happy", "title": "Happy", "emoji": "😊", "titleHi": "खुश", "category": "Emotions", "colorClass": "bg-emerald-100 dark:bg-emerald-950 text-emerald-900"},
        {"id": "sad", "title": "Sad", "emoji": "😢", "titleHi": "उदास", "category": "Emotions", "colorClass": "bg-blue-100 dark:bg-blue-950 text-blue-900"},
        {"id": "overwhelmed", "title": "Overwhelmed", "emoji": "😵‍💫", "titleHi": "घबराहट", "category": "Emotions", "colorClass": "bg-rose-100 dark:bg-rose-950 text-rose-900"},
        {"id": "tired", "title": "Sleepy", "emoji": "😴", "titleHi": "नींद", "category": "Comfort", "colorClass": "bg-purple-100 dark:bg-purple-950 text-purple-900"}
    ]
}

def predict_next_aac_tiles(tokens: List[str], time_of_day: str = "14:00", mood: str = "CALM") -> Dict[str, Any]:
    """Predicts next high-probability AAC tiles based on linguistic context."""
    start = time.time()
    last_token = tokens[-1].lower() if tokens else "want"
    
    # Match keyword in intent graph
    matched_predictions = []
    for key in AAC_INTENT_GRAPH:
        if key in last_token:
            matched_predictions = AAC_INTENT_GRAPH[key]
            break
            
    if not matched_predictions:
        matched_predictions = AAC_INTENT_GRAPH["want"]

    # Adapt if time is afternoon/evening or mood is tired
    if "14:" in time_of_day or "15:" in time_of_day or mood == "TIRED":
        # Inject resting tiles
        matched_predictions = [
            {"id": "quiet", "title": "Quiet Time", "emoji": "🤫", "titleHi": "शांत समय", "category": "Comfort", "colorClass": "bg-indigo-100 dark:bg-indigo-950 text-indigo-900"},
            *matched_predictions
        ]

    return {
        "predictions": matched_predictions[:4],
        "latency_ms": round((time.time() - start) * 1000, 2)
    }

def expand_aac_utterance(tokens: List[str]) -> Dict[str, Any]:
    """Expands fragmented AAC chips into natural clinical and bilingual spoken sentences."""
    start = time.time()
    clean_tokens = [t.strip().lower() for t in tokens if t.strip()]
    phrase = " ".join(clean_tokens)

    # Bilingual natural speech expansion
    en_expansion = f"I am saying: {phrase}. Please help me with this."
    hi_expansion = f"मैं कह रहा हूँ: {phrase}। कृपया मेरी मदद करें।"

    urgency = "NORMAL"
    if any(w in phrase for w in ["hurt", "pain", "stop", "scared", "overwhelmed", "help"]):
        urgency = "HIGH"
        en_expansion = f"I need urgent attention: {phrase} right now please!"
        hi_expansion = f"मुझे तुरंत ध्यान चाहिए: मुझे {phrase} हो रहा है!"

    if "water" in phrase or "thirsty" in phrase:
        en_expansion = "I would like to drink fresh water please."
        hi_expansion = "कृपया मुझे पीने के लिए पानी चाहिए।"
    elif "eat" in phrase or "hungry" in phrase:
        en_expansion = "I am hungry and would like something to eat please."
        hi_expansion = "मुझे भूख लगी है, कृपया कुछ खाने को दें।"

    return {
        "en": en_expansion,
        "hi": hi_expansion,
        "urgency": urgency,
        "latency_ms": round((time.time() - start) * 1000, 2)
    }
