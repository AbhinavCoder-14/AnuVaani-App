"use client";

import { useOpsStore } from "@/hooks/useOpsStore";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Radio,
  Mic,
  FileText,
  AlertTriangle,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3 } as Intl.DateTimeFormatOptions);
}

const EVENT_ICONS: Record<string, typeof Radio> = {
  wake_confirmed: Radio,
  audio_first_received: Mic,
  transcript_partial: FileText,
  transcript_final: CheckCircle2,
  session_closed: Clock,
  error: AlertTriangle,
};

const EVENT_COLORS: Record<string, string> = {
  wake_confirmed: "text-ops-teal",
  audio_first_received: "text-ops-blue",
  transcript_partial: "text-ops-purple",
  transcript_final: "text-ops-green",
  session_closed: "text-ops-text-secondary",
  error: "text-ops-red",
};

const EVENT_LABELS: Record<string, string> = {
  wake_confirmed: "Wake Confirmed",
  audio_first_received: "First Audio Received",
  transcript_partial: "Partial Transcript",
  transcript_final: "Final Transcript",
  session_closed: "Session Closed",
  error: "Error",
};

export default function SessionDetailPage() {
  const params = useParams<{ sessionId: string }>();
  const { getSession } = useOpsStore();
  const session = getSession(params.sessionId);

  if (!session) {
    return (
      <div className="mx-auto max-w-ops space-y-4 py-10 text-center">
        <p className="text-ops-h2 text-ops-text">Session not found</p>
        <p className="text-ops-body text-ops-text-secondary">
          No session with ID <code className="font-mono text-ops-teal">{params.sessionId}</code>
        </p>
        <Link href="/ops/sessions" className="ops-btn mt-4 inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to sessions
        </Link>
      </div>
    );
  }

  const outcomeColor =
    session.outcome === "completed"
      ? "text-ops-green"
      : session.outcome === "failed"
        ? "text-ops-red"
        : session.outcome === "in_progress"
          ? "text-ops-blue"
          : "text-ops-amber";

  return (
    <div className="mx-auto max-w-ops space-y-6">
      {/* Back link */}
      <Link href="/ops/sessions" className="inline-flex items-center gap-1.5 text-ops-body text-ops-text-secondary hover:text-ops-teal">
        <ArrowLeft className="h-4 w-4" /> Back to sessions
      </Link>

      {/* Session header */}
      <div className="ops-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-ops-h1 text-ops-text">Session Detail</h1>
            <p className="mt-1 text-ops-body text-ops-text-secondary">
              <Link href={`/ops/devices/${session.deviceId}`} className="text-ops-teal hover:underline">
                {session.deviceName}
              </Link>
              {" · "}{session.location}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-ops-caption text-ops-text-secondary">
              <span className={outcomeColor + " font-semibold"}>
                {session.outcome === "in_progress" ? "In Progress" : session.outcome.charAt(0).toUpperCase() + session.outcome.slice(1)}
              </span>
              <span>{session.startTime.toLocaleString()}</span>
              {session.durationMs && <span>{(session.durationMs / 1000).toFixed(1)}s duration</span>}
              <span>{session.asrEngine} · {session.asrModel}</span>
            </div>
          </div>
          <div className="font-mono text-[11px] text-ops-text-secondary">{session.id}</div>
        </div>
      </div>

      {/* Three-panel layout */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Transcript */}
        <div className="ops-card p-5 lg:col-span-2">
          <h2 className="mb-4 text-ops-h3 text-ops-text">Transcript</h2>

          {session.outcome === "in_progress" && session.currentPartial && (
            <div className="rounded-lg border border-ops-blue/20 bg-ops-blue/5 p-4">
              <p className="text-ops-caption font-medium text-ops-blue">Streaming — partial hypothesis</p>
              <p className="mt-2 text-ops-body italic text-ops-text">{session.currentPartial}</p>
            </div>
          )}

          {session.finalTranscript && (
            <div className="rounded-lg border border-ops-green/20 bg-ops-green-light p-4">
              <p className="text-ops-caption font-medium text-ops-green">Final transcript</p>
              <p className="mt-2 text-ops-body text-ops-text">{session.finalTranscript}</p>
            </div>
          )}

          {!session.finalTranscript && !session.currentPartial && (
            <div className="rounded-lg bg-ops-bg p-4 text-center text-ops-body text-ops-text-secondary">
              {session.outcome === "in_progress"
                ? "Waiting for transcript…"
                : session.outcome === "failed"
                  ? "No transcript — session failed"
                  : "No transcript available"}
            </div>
          )}

          {session.failureReason && (
            <div className="mt-4 rounded-lg border border-ops-red/20 bg-ops-red-light p-4">
              <p className="text-ops-caption font-semibold text-ops-red">Failure</p>
              <p className="mt-1 text-ops-body text-ops-text">{session.failureReason}</p>
              {session.failureStage && (
                <p className="mt-1 text-ops-caption text-ops-text-secondary">
                  Stage: {session.failureStage.replace(/_/g, " ")}
                </p>
              )}
            </div>
          )}

          {/* Partial history */}
          {session.partialHistory.length > 0 && (
            <div className="mt-4">
              <p className="text-ops-caption font-medium text-ops-text-secondary">Partial hypothesis history</p>
              <div className="mt-2 space-y-1">
                {session.partialHistory.map((p, i) => (
                  <div key={i} className="flex items-baseline gap-2 text-ops-caption">
                    <span className="shrink-0 font-mono text-[10px] text-ops-text-secondary">{formatTime(p.timestamp)}</span>
                    <span className="italic text-ops-text-secondary">{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Event Timeline + Review */}
        <div className="space-y-4">
          {/* Event timeline */}
          <div className="ops-card p-5">
            <h2 className="mb-4 text-ops-h3 text-ops-text">Event Timeline</h2>
            <div className="space-y-0">
              {session.events.map((evt, i) => {
                const Icon = EVENT_ICONS[evt.type] ?? Clock;
                const color = EVENT_COLORS[evt.type] ?? "text-ops-text-secondary";
                const label = EVENT_LABELS[evt.type] ?? evt.type;
                const isLast = i === session.events.length - 1;

                return (
                  <div key={evt.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ops-bg ${color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      {!isLast && <div className="h-full w-px bg-ops-border" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-ops-body font-medium text-ops-text">{label}</p>
                      <p className="font-mono text-[10px] text-ops-text-secondary">{formatTime(evt.timestamp)}</p>
                      {evt.detail && (
                        <p className="mt-0.5 text-ops-caption text-ops-text-secondary">{evt.detail}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review controls */}
          <div className="ops-card p-5">
            <h2 className="mb-4 text-ops-h3 text-ops-text">Review</h2>
            <p className="text-ops-caption text-ops-text-secondary">
              Current status: <span className="font-semibold text-ops-text">{session.reviewStatus}</span>
            </p>
            <div className="mt-3 space-y-2">
              <button type="button" className="ops-btn w-full justify-start gap-2 text-ops-caption">
                <ThumbsUp className="h-3.5 w-3.5 text-ops-green" />
                Expected activation
              </button>
              <button type="button" className="ops-btn w-full justify-start gap-2 text-ops-caption">
                <ThumbsDown className="h-3.5 w-3.5 text-ops-red" />
                Reported false activation
              </button>
              <button type="button" className="ops-btn w-full justify-start gap-2 text-ops-caption">
                <HelpCircle className="h-3.5 w-3.5 text-ops-amber" />
                Uncertain
              </button>
            </div>
            <p className="mt-3 text-[10px] text-ops-text-secondary">
              Note: An empty transcript is not automatically a false activation. It may indicate silence after wake, audio loss, ASR failure, or another cause.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
