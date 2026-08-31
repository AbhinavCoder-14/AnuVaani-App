const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000";

export type WebSocketEndpoint = "/ws/device" | "/ws/dashboard";

export function getWebSocketUrl(endpoint: WebSocketEndpoint): string {
  const base = WS_URL.replace(/\/$/, "");
  return `${base}${endpoint}`;
}

export interface WebSocketClientOptions {
  endpoint: WebSocketEndpoint;
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
}

/** Creates a WebSocket connection — protocol handling to be implemented later. */
export function createWebSocketClient(options: WebSocketClientOptions): WebSocket {
  const url = getWebSocketUrl(options.endpoint);
  const ws = new WebSocket(url);

  if (options.onOpen) ws.addEventListener("open", options.onOpen);
  if (options.onClose) ws.addEventListener("close", options.onClose);
  if (options.onMessage) ws.addEventListener("message", options.onMessage);
  if (options.onError) ws.addEventListener("error", options.onError);

  return ws;
}
