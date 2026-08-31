from __future__ import annotations

import re
from difflib import SequenceMatcher

from app.intent.commands import INTENT_PHRASES
from app.models.intent import IntentType


def normalize_text(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def match_intent(transcript: str, threshold: float = 0.85) -> tuple[IntentType, float]:
    normalized = normalize_text(transcript)
    best_intent = IntentType.UNKNOWN
    best_score = 0.0

    for intent, phrases in INTENT_PHRASES.items():
        for phrase in phrases:
            score = SequenceMatcher(None, normalized, normalize_text(phrase)).ratio()
            if score > best_score:
                best_score = score
                best_intent = intent

    if best_score < threshold:
        return IntentType.UNKNOWN, best_score
    return best_intent, best_score
