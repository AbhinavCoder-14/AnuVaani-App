"use client";

/* ── Central state store for Anuvaani Operations ─────── */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SimulationEngine } from "@/lib/data/simulation-adapter";
import type { OpsDevice } from "@/types/ops-device";
import type { OpsEvent } from "@/types/events";
import type { Session } from "@/types/session";
import type { DataSourceType, SessionFilter } from "@/lib/data/data-adapter";

/* ── Types ────────────────────────────────────────────── */

export interface OpsState {
  /** Current data source mode. */
  sourceType: DataSourceType;
  /** Last time any event was received. */
  lastUpdate: Date | null;
  /** All registered devices. */
  devices: OpsDevice[];
  /** Get a single device by ID. */
  getDevice: (id: string) => OpsDevice | null;
  /** Get sessions with optional filters. */
  getSessions: (filters?: SessionFilter) => Session[];
  /** Get a single session by ID. */
  getSession: (id: string) => Session | null;
  /** Reporting device count. */
  reportingDevices: number;
  /** Total registered device count. */
  totalDevices: number;
  /** Currently active (in_progress) sessions. */
  activeSessions: number;
  /** Percentage of eligible sessions that reached final transcript. */
  transcriptionCompletion: number;
  /** Count of unresolved issues. */
  openIssueCount: number;
  /** Session outcome breakdown. */
  sessionOutcomes: { completed: number; noTranscript: number; failed: number };
  /** Device availability breakdown. */
  availabilityBreakdown: Record<string, number>;
  /** Most recent N sessions. */
  recentSessions: Session[];
  /** Open issues with device context. */
  openIssues: Array<{ device: OpsDevice; issue: OpsDevice["issues"][number] }>;
  /** Force a refresh of computed values. */
  refresh: () => void;
}

const OpsContext = createContext<OpsState | null>(null);

/* ── Provider ─────────────────────────────────────────── */

export function OpsProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<SimulationEngine | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Initialise simulation on mount
  useEffect(() => {
    const engine = new SimulationEngine();
    engineRef.current = engine;
    engine.connect();

    const unsubscribe = engine.onEvent((_event: OpsEvent) => {
      setLastUpdate(new Date());
    });

    // Refresh computed values every 2s so the UI stays current without
    // re-rendering on every single event (which can be very frequent).
    const refreshInterval = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
      engine.disconnect();
    };
  }, []);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const state = useMemo<OpsState>(() => {
    const engine = engineRef.current;
    if (!engine) {
      return {
        sourceType: "live",
        lastUpdate: null,
        devices: [],
        getDevice: () => null,
        getSessions: () => [],
        getSession: () => null,
        reportingDevices: 0,
        totalDevices: 0,
        activeSessions: 0,
        transcriptionCompletion: 100,
        openIssueCount: 0,
        sessionOutcomes: { completed: 0, noTranscript: 0, failed: 0 },
        availabilityBreakdown: { reporting: 0, stale: 0, offline: 0, unknown: 0 },
        recentSessions: [],
        openIssues: [],
        refresh: () => {},
      };
    }

    return {
      sourceType: "live",
      lastUpdate,
      devices: engine.getDevices(),
      getDevice: (id) => engine.getDevice(id),
      getSessions: (filters) => engine.getSessions(filters),
      getSession: (id) => engine.getSession(id),
      reportingDevices: engine.getReportingDeviceCount(),
      totalDevices: engine.getTotalDeviceCount(),
      activeSessions: engine.getActiveSessionCount(),
      transcriptionCompletion: engine.getTranscriptionCompletion(),
      openIssueCount: engine.getOpenIssueCount(),
      sessionOutcomes: engine.getSessionOutcomeCounts(),
      availabilityBreakdown: engine.getAvailabilityBreakdown(),
      recentSessions: engine.getRecentSessions(8),
      openIssues: engine.getOpenIssues(),
      refresh,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, lastUpdate]);

  return <OpsContext.Provider value={state}>{children}</OpsContext.Provider>;
}

/* ── Hook ──────────────────────────────────────────────── */

export function useOpsStore(): OpsState {
  const ctx = useContext(OpsContext);
  if (!ctx) throw new Error("useOpsStore must be used inside <OpsProvider>");
  return ctx;
}
