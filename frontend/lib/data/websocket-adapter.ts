/* ── WebSocket adapter stub for Anuvaani Operations ───
 *
 * This adapter implements the DataAdapter interface for real
 * backend WebSocket connections.  It is structurally complete
 * but not functional — connect the real backend event stream
 * here when hardware integration is ready.
 *
 * It consumes the same event types as the simulation adapter,
 * so the UI does not change when switching data sources.
 */

import type { DataAdapter, SessionFilter } from "./data-adapter";
import type { OpsDevice } from "@/types/ops-device";
import type { OpsEvent } from "@/types/events";
import type { Session } from "@/types/session";

export class WebSocketAdapter implements DataAdapter {
  readonly type = "live" as const;

  private ws: WebSocket | null = null;
  private handlers = new Set<(event: OpsEvent) => void>();
  private devices = new Map<string, OpsDevice>();
  private sessions = new Map<string, Session>();

  connect(): void {
    const url = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/dashboard";
    this.ws = new WebSocket(url);

    this.ws.addEventListener("message", (msg) => {
      try {
        const event = JSON.parse(msg.data) as OpsEvent;
        event.timestamp = new Date(event.timestamp);
        for (const handler of this.handlers) handler(event);
      } catch {
        // Ignore malformed messages
      }
    });

    this.ws.addEventListener("close", () => {
      // Reconnection logic to be implemented
      // Should restore state without duplicate subscriptions
    });
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }

  getDevices(): OpsDevice[] {
    return Array.from(this.devices.values());
  }

  getDevice(id: string): OpsDevice | null {
    return this.devices.get(id) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSessions(_filters?: SessionFilter): Session[] {
    return Array.from(this.sessions.values());
  }

  getSession(id: string): Session | null {
    return this.sessions.get(id) ?? null;
  }

  onEvent(handler: (event: OpsEvent) => void): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }
}
