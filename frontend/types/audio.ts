export type AudioEventType =
  | "stream_started"
  | "audio_chunk"
  | "stream_ended"
  | "asr_processing"
  | "partial_transcript"
  | "final_transcript";

export interface StreamStartedEvent {
  type: "stream_started";
  device_id: string;
  session_id: string;
  sample_rate: number;
  channels: number;
  timestamp: string;
}

export interface AudioChunkEvent {
  type: "audio_chunk";
  device_id: string;
  session_id: string;
  sequence: number;
  timestamp: string;
}

export interface StreamEndedEvent {
  type: "stream_ended";
  device_id: string;
  session_id: string;
  timestamp: string;
}

export interface AsrProcessingEvent {
  type: "asr_processing";
  device_id: string;
  session_id: string;
  timestamp: string;
}

export interface PartialTranscriptEvent {
  type: "partial_transcript";
  device_id: string;
  session_id: string;
  text: string;
  timestamp: string;
}

export interface FinalTranscriptEvent {
  type: "final_transcript";
  device_id: string;
  session_id: string;
  text: string;
  timestamp: string;
}

export type AudioEvent =
  | StreamStartedEvent
  | AudioChunkEvent
  | StreamEndedEvent
  | AsrProcessingEvent
  | PartialTranscriptEvent
  | FinalTranscriptEvent;
