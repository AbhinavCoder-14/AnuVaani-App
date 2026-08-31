"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { createWebSocketClient, type WebSocketEndpoint } from "@/lib/websocket";

interface UseWebSocketOptions {
  endpoint: WebSocketEndpoint;
  enabled?: boolean;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: MessageEvent | null;
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  disconnect: () => void;
}

/** WebSocket hook — event parsing and reconnection logic to be added later. */
export function useWebSocket({ endpoint, enabled = true }: UseWebSocketOptions): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  const send = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const ws = createWebSocketClient({
      endpoint,
      onOpen: () => setIsConnected(true),
      onClose: () => setIsConnected(false),
      onMessage: (event) => setLastMessage(event),
    });

    wsRef.current = ws;

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [endpoint, enabled]);

  return { isConnected, lastMessage, send, disconnect };
}
