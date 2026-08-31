export type DeviceStatus = "connected" | "disconnected" | "listening";

export type DeviceEventType =
  | "device_connected"
  | "device_disconnected"
  | "kws_listening"
  | "wake_word_detected";

export interface DeviceInfo {
  device_id: string;
  name?: string;
  status: DeviceStatus;
  last_seen?: string;
}

export interface DeviceConnectedEvent {
  type: "device_connected";
  device_id: string;
  timestamp: string;
}

export interface DeviceDisconnectedEvent {
  type: "device_disconnected";
  device_id: string;
  timestamp: string;
}

export interface KwsListeningEvent {
  type: "kws_listening";
  device_id: string;
  timestamp: string;
}

export interface WakeWordDetectedEvent {
  type: "wake_word_detected";
  device_id: string;
  keyword?: string;
  confidence?: number;
  timestamp: string;
}

export type DeviceEvent =
  | DeviceConnectedEvent
  | DeviceDisconnectedEvent
  | KwsListeningEvent
  | WakeWordDetectedEvent;
