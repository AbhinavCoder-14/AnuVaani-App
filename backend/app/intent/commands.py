"""Intent definitions and example utterances for fuzzy matching."""

from app.models.intent import IntentType

INTENT_PHRASES: dict[IntentType, list[str]] = {
    IntentType.GET_DEVICE_STATUS: [
        "show device status",
        "what is the device status",
        "device status",
        "current status",
    ],
    IntentType.GET_CPU_USAGE: [
        "show cpu usage",
        "show me current cpu usage",
        "what is the cpu",
        "cpu usage",
        "how much cpu",
    ],
    IntentType.GET_MEMORY_USAGE: [
        "show memory usage",
        "show ram usage",
        "memory usage",
        "how much ram",
        "ram usage",
    ],
    IntentType.GET_NETWORK_STATUS: [
        "show network status",
        "network status",
        "is the device online",
        "connectivity status",
    ],
    IntentType.GET_SESSION_STATS: [
        "show session stats",
        "session statistics",
        "audio session stats",
        "last session info",
    ],
    IntentType.GET_DEVICE_METRICS: [
        "show device performance",
        "show me current device performance",
        "device metrics",
        "show all metrics",
        "performance metrics",
    ],
}
