from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "AnuVanni Backend"
    cors_origins: str = "http://localhost:3000"
    host: str = "0.0.0.0"
    port: int = 8000

    # ESP32 network ports (Mayank firmware contract)
    udp_telemetry_port: int = 8766
    tcp_audio_port: int = 8765

    # Audio defaults (PCM16 mono 16 kHz)
    sample_rate: int = 16000
    channels: int = 1
    sample_width: int = 2  # 16-bit

    # ASR: mock | whisper
    asr_provider: str = "mock"
    whisper_model: str = "base"

    # Intent confidence threshold
    intent_confidence_threshold: float = 0.85

    # Where session WAV files are stored
    audio_storage_dir: str = "data/sessions"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
