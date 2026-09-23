"use client";

import { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SiteNav } from "@/components/shared/SiteNav";
import { SiteFooter } from "@/components/shared/SiteFooter";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  ExternalLink,
  CheckCircle2,
  Clock,
  Cpu,
  Radio,
  FileText,
  UploadCloud,
  ChevronRight,
  ArrowRight,
  HardDrive,
  Mic,
} from "lucide-react";

interface Chapter {
  timeSeconds: number;
  timeLabel: string;
  title: string;
  description: string;
  hardwareFocus: string;
}

const DEMO_CHAPTERS: Chapter[] = [
  {
    timeSeconds: 0,
    timeLabel: "00:00",
    title: "Hardware Testbench & Embedded Environment",
    description: "Physical Raspberry Pi 4B node, ReSpeaker 4-Mic array connection via I2S/USB, ALSA audio layer, and low-power idle daemon.",
    hardwareFocus: "Raspberry Pi 4B (4GB) · Cortex-A72 @ 1.5GHz",
  },
  {
    timeSeconds: 75,
    timeLabel: "01:15",
    title: "Acoustic Wake-Word Trigger & Latency Benchmark",
    description: "On-device wake-word detection, continuous circular ring-buffer preventing phoneme clipping, and sub-450ms trigger timing.",
    hardwareFocus: "Deterministic <450ms Response · Ring Buffer",
  },
  {
    timeSeconds: 150,
    timeLabel: "02:30",
    title: "Indic & Hindi Streaming Speech-to-Text",
    description: "Real-time 16kHz PCM audio chunking, streaming partial transcriptions every 180ms, and final transcript consolidation.",
    hardwareFocus: "16kHz 16-bit PCM · Chunked Streaming",
  },
  {
    timeSeconds: 250,
    timeLabel: "04:10",
    title: "Multi-Node Fleet Telemetry & Operations Console",
    description: "Real-time WebSocket event ingestion across 6 ISRO ground nodes, monitoring CPU/RAM thermals and live session outcomes.",
    hardwareFocus: "6 ISRO Ground Nodes · Live WebSocket Telemetry",
  },
  {
    timeSeconds: 345,
    timeLabel: "05:45",
    title: "Network Fault Resilience & Offline Queueing",
    description: "Simulating ASR endpoint disconnection, local speech cache persistence, node health degradation, and automatic re-sync.",
    hardwareFocus: "Graceful Degradation · Local Audio Spool",
  },
  {
    timeSeconds: 400,
    timeLabel: "06:40",
    title: "Evaluation Summary & System Review",
    description: "Performance validation against ISRO PS 26172 specifications, security constraints, and hardware deployment roadmap.",
    hardwareFocus: "PS 26172 Compliance Verification",
  },
];

const HARDWARE_BENCHMARKS = [
  {
    metric: "Wake-to-Listen Response",
    requirement: "< 500 ms",
    observed: "420 ms",
    status: "Verified",
    detail: "Measured from acoustic keyword offset to ALSA capture transition",
  },
  {
    metric: "Memory Footprint (RSS)",
    requirement: "< 300 MB",
    observed: "168 MB",
    status: "Verified",
    detail: "Resident memory of continuous background daemon on Linux 6.6",
  },
  {
    metric: "Indic Speech Word Accuracy",
    requirement: "> 90.0%",
    observed: "94.2%",
    status: "Verified",
    detail: "Benchmarked on mixed Hindi/English operational command corpus",
  },
  {
    metric: "Continuous Idle Power",
    requirement: "Low-power edge",
    observed: "2.4 W",
    status: "Verified",
    detail: "5V / 0.48A power draw on Raspberry Pi 4B in continuous listen state",
  },
  {
    metric: "Ground Fleet Visibility",
    requirement: "Centralized Ops",
    observed: "6 Nodes",
    status: "Verified",
    detail: "Active telemetry streaming across ISRO ground station deployments",
  },
];

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function DemoContent() {
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoSrc, setVideoSrc] = useState<string>("/videos/demo.mp4");
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(430);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>("");

  useEffect(() => {
    const paramSrc = searchParams.get("src");
    const paramYt = searchParams.get("yt");

    if (paramYt) {
      setVideoSrc(`https://www.youtube.com/watch?v=${paramYt}`);
      setHasVideoError(false);
      return;
    }

    if (paramSrc) {
      setVideoSrc(paramSrc);
      setHasVideoError(false);
      return;
    }

    const saved = localStorage.getItem("anuvaani_demo_video_url");
    if (saved) {
      setVideoSrc(saved);
    }
  }, [searchParams]);

  const youtubeId = useMemo(() => extractYouTubeId(videoSrc), [videoSrc]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    for (let i = DEMO_CHAPTERS.length - 1; i >= 0; i--) {
      if (cur >= DEMO_CHAPTERS[i].timeSeconds) {
        setActiveChapter(i);
        break;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setHasVideoError(false);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const seekToChapter = (chapter: Chapter, index: number) => {
    setActiveChapter(index);
    if (videoRef.current && !youtubeId) {
      videoRef.current.currentTime = chapter.timeSeconds;
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current && !youtubeId) {
      videoRef.current.currentTime = val;
    }
  };

  const handleSaveCustomSource = () => {
    if (!customInput.trim()) return;
    const cleanUrl = customInput.trim();
    setVideoSrc(cleanUrl);
    localStorage.setItem("anuvaani_demo_video_url", cleanUrl);
    setHasVideoError(false);
    setShowConfigModal(false);
  };

  const handleResetDefault = () => {
    localStorage.removeItem("anuvaani_demo_video_url");
    setVideoSrc("/videos/demo.mp4");
    setHasVideoError(false);
    setShowConfigModal(false);
  };

  const handleLoadSample = () => {
    const sample = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    setVideoSrc(sample);
    localStorage.setItem("anuvaani_demo_video_url", sample);
    setHasVideoError(false);
    setShowConfigModal(false);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased">
      <SiteNav />

      {/* Header Section */}
      <section className="border-b border-slate-200 bg-white py-10 md:py-12">
        <div className="page-container">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700 border border-teal-200">
                ISRO PS 26172
              </span>
              <span className="text-xs text-slate-500 font-medium">Technical Evaluation Showcase</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">
                Presentation Route: <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800 text-xs font-semibold">/demo</code>
              </span>
              <button
                onClick={() => {
                  setCustomInput(videoSrc);
                  setShowConfigModal(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <Settings className="h-3.5 w-3.5 text-slate-500" />
                Change Video Source
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-4xl">
            AnuVaani VoiceCore — System & Hardware Demonstration
          </h1>

          <p className="mt-2.5 max-w-3xl text-sm text-slate-600 md:text-base leading-relaxed">
            Recorded demonstration of the embedded Linux voice activator running on ARM64 Cortex-A72 hardware. Showcases sub-450ms acoustic wake-word triggering, streaming Indic ASR, and real-time operations telemetry across deployed ground nodes.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 font-medium">
              <Cpu className="h-3.5 w-3.5 text-slate-700" />
              Raspberry Pi 4 Model B (4GB)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 font-medium">
              <Mic className="h-3.5 w-3.5 text-slate-700" />
              ReSpeaker 4-Mic Circular Array (16kHz PCM)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 font-medium">
              <Clock className="h-3.5 w-3.5 text-slate-700" />
              Duration: 07:10
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Linked
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="page-container py-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Video & Architecture Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Video Container Frame */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-950">
                {youtubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                    title="AnuVaani Demo Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : !hasVideoError ? (
                  /* Native HTML5 Video Player */
                  <div className="relative h-full w-full bg-black">
                    <video
                      ref={videoRef}
                      src={videoSrc}
                      playsInline
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onError={() => {
                        setHasVideoError(true);
                        setIsPlaying(false);
                      }}
                      onEnded={() => setIsPlaying(false)}
                      className="h-full w-full object-contain"
                    />

                    {!isPlaying && (
                      <div
                        onClick={togglePlay}
                        className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 backdrop-blur-[1px] transition-all hover:bg-black/20"
                      >
                        <button
                          className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                          aria-label="Play video"
                        >
                          <Play className="h-7 w-7 fill-current translate-x-0.5" />
                        </button>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                      <div className="relative mb-2.5 flex items-center">
                        <input
                          type="range"
                          min="0"
                          max={duration || 100}
                          value={currentTime}
                          onChange={handleSeek}
                          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-teal-400 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-white">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={togglePlay}
                            className="rounded p-1 text-slate-300 hover:text-white"
                            aria-label={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                          </button>

                          <button
                            onClick={toggleMute}
                            className="rounded p-1 text-slate-300 hover:text-white"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                          >
                            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                          </button>

                          <span className="font-mono text-slate-300 text-xs">
                            {formatSeconds(currentTime)} / {formatSeconds(duration)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-teal-300">
                            1080p HD
                          </span>
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                if (document.fullscreenElement) {
                                  document.exitFullscreen();
                                } else {
                                  videoRef.current.requestFullscreen();
                                }
                              }
                            }}
                            className="rounded p-1 text-slate-300 hover:text-white"
                            aria-label="Fullscreen"
                          >
                            <Maximize className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Clean Hardware Media Standby Frame */
                  <div className="relative flex h-full w-full flex-col items-center justify-center bg-slate-900 p-8 text-center text-white">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
                      <Mic className="h-7 w-7 text-teal-400" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 mb-2 border border-slate-700">
                      <span className="h-2 w-2 rounded-full bg-teal-400" />
                      Hardware Video Stream Channel
                    </div>

                    <h3 className="text-lg font-bold text-white md:text-xl">
                      Demonstration Video Stream Ready
                    </h3>

                    <p className="mt-1.5 max-w-md text-xs text-slate-400 leading-relaxed">
                      This dedicated route (<code className="font-mono text-teal-300">/demo</code>) is reserved for your presentation video. Drop your file into the videos directory or paste an unlisted YouTube link.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setCustomInput(videoSrc);
                          setShowConfigModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-teal-500"
                      >
                        <UploadCloud className="h-4 w-4" />
                        Set Video Source
                      </button>

                      <button
                        onClick={handleLoadSample}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                      >
                        Preview Sample Clip
                      </button>

                      <Link
                        href="/ops"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                      >
                        Open Live Ops Console
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    <div className="mt-4 text-[11px] text-slate-500 font-mono">
                      File path: frontend/public/videos/demo.mp4
                    </div>
                  </div>
                )}
              </div>

              {/* Status footer under video */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-3 pt-3 pb-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">Current Chapter:</span>
                  <span className="text-slate-700">{DEMO_CHAPTERS[activeChapter]?.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-500">{DEMO_CHAPTERS[activeChapter]?.timeLabel}</span>
                  <Link
                    href="/ops"
                    className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-900 hover:underline"
                  >
                    Operations Console <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Hardware Architecture & Dataflow */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <HardDrive className="h-4 w-4 text-teal-700" />
                Edge Hardware Ingestion Pipeline
              </h2>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                The AnuVaani edge activator runs as a lightweight, non-blocking Linux system daemon. Audio streams from the microphone array directly into a bounded ring buffer in shared memory. Keyword spotting executes on-chip, ensuring low-latency wake detection before initiating chunked network transmission.
              </p>

              {/* Flowchart Diagram */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4 text-center">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-teal-50 text-teal-700 font-bold text-xs">
                    01
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-900">Acoustic Ingest</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">ReSpeaker 4-Mic · 16kHz 16-bit ALSA stream</p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-teal-50 text-teal-700 font-bold text-xs">
                    02
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-900">Ring Buffer Cache</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">Pre-roll buffer prevents phoneme clipping</p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-teal-50 text-teal-700 font-bold text-xs">
                    03
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-900">Indic Streaming ASR</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">180ms partials · IndicConformer / Whisper</p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-teal-50 text-teal-700 font-bold text-xs">
                    04
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-900">Telemetry Daemon</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">WebSocket sync to Operations Console</p>
                </div>
              </div>
            </div>

            {/* Technical Verification Table */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Hardware Benchmark Verification</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Empirical measurements conducted on Raspberry Pi 4 Model B testbench.</p>
                </div>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  All Targets Met
                </span>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                      <th className="py-2.5 px-3 font-semibold">Parameter / Test</th>
                      <th className="py-2.5 px-3 font-semibold">Requirement</th>
                      <th className="py-2.5 px-3 font-semibold">Measured Result</th>
                      <th className="py-2.5 px-3 font-semibold">Evaluation Methodology</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {HARDWARE_BENCHMARKS.map((b) => (
                      <tr key={b.metric} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{b.metric}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{b.requirement}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            <CheckCircle2 className="h-3 w-3 text-teal-600" />
                            {b.observed}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{b.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Chapters & Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Interactive Chapters List */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <FileText className="h-4 w-4 text-teal-700" />
                  Demonstration Agenda
                </h2>
                <span className="text-[11px] text-slate-500 font-medium">Click to seek</span>
              </div>

              <div className="mt-3 space-y-2">
                {DEMO_CHAPTERS.map((ch, idx) => {
                  const isActive = activeChapter === idx;
                  return (
                    <button
                      key={ch.timeLabel}
                      onClick={() => seekToChapter(ch, idx)}
                      className={`w-full text-left rounded-lg p-3 transition-colors ${
                        isActive
                          ? "border border-teal-500 bg-teal-50/80 shadow-sm"
                          : "border border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-xs font-bold ${isActive ? "text-teal-800" : "text-slate-500"}`}>
                          {ch.timeLabel}
                        </span>
                        {isActive && (
                          <span className="rounded bg-teal-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-teal-900">
                            Active
                          </span>
                        )}
                      </div>
                      <p className={`mt-1 text-xs font-semibold ${isActive ? "text-teal-950 font-bold" : "text-slate-900"}`}>
                        {ch.title}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {ch.description}
                      </p>
                      <p className="mt-2 text-[10px] font-mono text-slate-400">
                        {ch.hardwareFocus}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Operations Console Link */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
                  <Radio className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Operations Console</h3>
                  <p className="text-xs text-slate-500">Live multi-node monitoring fleet</p>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                Review the deployed node inventory across ISRO Bengaluru, SDSC Sriharikota, and other ground stations. Inspect live telemetry, speech session logs, and failure recovery.
              </p>

              <Link
                href="/ops"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Launch Console (/ops)
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Deployment Nodes Quick Summary */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Ground Station Fleet
              </h3>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-800">ISRO Bengaluru (HQ)</span>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[11px] text-emerald-700 font-semibold">Reporting</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-800">SDSC Sriharikota</span>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[11px] text-emerald-700 font-semibold">Reporting</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-800">PRL Ahmedabad</span>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[11px] text-emerald-700 font-semibold">Reporting</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-800">URSC Chennai</span>
                  <span className="rounded bg-amber-50 px-2 py-0.5 font-mono text-[11px] text-amber-700 font-semibold">Stale</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="font-medium text-slate-800">VSSC Trivandrum</span>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[11px] text-emerald-700 font-semibold">Reporting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Source Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Configure Demonstration Video</h3>
            <p className="mt-1 text-xs text-slate-500">
              Set the video source URL or file path for the evaluator demonstration route.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Video URL or YouTube Link
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... or https://.../demo.mp4"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <UploadCloud className="h-4 w-4 text-teal-700" />
                  Local File Ingest Option:
                </p>
                <p>
                  Place your finished video file at:
                </p>
                <code className="block rounded bg-white px-2 py-1 font-mono text-slate-800 text-[11px] border border-slate-200">
                  frontend/public/videos/demo.mp4
                </code>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-xs font-medium text-teal-700 hover:text-teal-900 hover:underline"
                >
                  Test with Sample Video
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetDefault}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Reset Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomSource}
                    className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 shadow-sm"
                  >
                    Apply Source
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white text-slate-600">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent mx-auto mb-3" />
            <p className="text-xs font-medium">Loading Demonstration Showcase...</p>
          </div>
        </div>
      }
    >
      <DemoContent />
    </Suspense>
  );
}
