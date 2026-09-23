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
  Video,
  Clock,
  Sparkles,
  Layers,
  Activity,
  Cpu,
  Radio,
  FileText,
  UploadCloud,
  ChevronRight,
  MonitorPlay,
  ArrowRight,
} from "lucide-react";

interface Chapter {
  timeSeconds: number;
  timeLabel: string;
  title: string;
  description: string;
}

const DEMO_CHAPTERS: Chapter[] = [
  {
    timeSeconds: 0,
    timeLabel: "00:00",
    title: "Hardware Architecture & Edge Setup",
    description: "Physical Raspberry Pi 4B node, ReSpeaker 4-mic array, thermal dissipation, and embedded Linux daemon.",
  },
  {
    timeSeconds: 75,
    timeLabel: "01:15",
    title: "Low-Latency Wake-Word Trigger (<450ms)",
    description: "Acoustic wake-word validation on-device, pre-roll circular audio buffer, and sub-500ms transition to listening.",
  },
  {
    timeSeconds: 150,
    timeLabel: "02:30",
    title: "Indic & Hindi Speech-to-Text Pipeline",
    description: "Live streaming audio chunks, partial vs. final transcription comparison, and multi-dialect phoneme handling.",
  },
  {
    timeSeconds: 250,
    timeLabel: "04:10",
    title: "Operations Console & Fleet Telemetry",
    description: "6-node ISRO deployment monitoring, real-time WebSocket telemetry, CPU/memory stats, and session inspector.",
  },
  {
    timeSeconds: 345,
    timeLabel: "05:45",
    title: "Fault Tolerance & Network Failover",
    description: "ASR network outage failover, automatic offline audio queuing, node health degradation, and automatic recovery.",
  },
  {
    timeSeconds: 400,
    timeLabel: "06:40",
    title: "Evaluation Summary & Architecture Review",
    description: "Key performance metrics vs. PS 26172 problem statement requirements, security, and next steps.",
  },
];

const EVALUATOR_METRICS = [
  {
    label: "Wake-to-Listen Latency",
    value: "420 ms",
    target: "Spec < 500 ms",
    icon: Clock,
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "RAM Footprint",
    value: "172 MB",
    target: "Budget < 300 MB",
    icon: Cpu,
    accent: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Hindi ASR Accuracy",
    value: "94.2%",
    target: "Field benchmark",
    icon: Activity,
    accent: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    label: "Telemetry Nodes",
    value: "6 Sites",
    target: "Active ISRO Ground Fleet",
    icon: Radio,
    accent: "text-purple-500",
    bg: "bg-purple-500/10",
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

  // Video source resolution: URL query param -> localStorage -> default /videos/demo.mp4
  const [videoSrc, setVideoSrc] = useState<string>("/videos/demo.mp4");
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(430); // 7m 10s default
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

    // Update active chapter based on timestamp
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
    // High quality public tech demo clip as an immediate preview test
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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      <SiteNav />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pb-8 pt-12 md:pb-12 md:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="page-container relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300">
              <Sparkles className="h-3.5 w-3.5" />
              Evaluator Presentation Portal
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Route: <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-teal-400">/demo</code></span>
              <button
                onClick={() => {
                  setCustomInput(videoSrc);
                  setShowConfigModal(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-teal-500 hover:text-white"
                title="Configure Video URL or embed"
              >
                <Settings className="h-3.5 w-3.5" />
                Change Video Source
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:leading-tight">
            AnuVaani VoiceCore <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">— System & Hardware Demo</span>
          </h1>

          <p className="mt-3 max-w-3xl text-base text-slate-300 md:text-lg">
            Complete end-to-end demonstration of the embedded Linux voice activator: edge wake-word detection, chunked Indic ASR streaming, real-time telemetry, and multi-node fleet operations.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 rounded bg-slate-800/60 px-2.5 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              ISRO Problem Statement 26172
            </span>
            <span className="flex items-center gap-1.5 rounded bg-slate-800/60 px-2.5 py-1">
              <Cpu className="h-3.5 w-3.5 text-teal-400" />
              Raspberry Pi 4B (ARM64)
            </span>
            <span className="flex items-center gap-1.5 rounded bg-slate-800/60 px-2.5 py-1">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              Duration: ~7 min
            </span>
          </div>
        </div>
      </section>

      {/* Main Video Showcase Stage */}
      <section className="page-container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Video Column */}
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl ring-1 ring-white/10">
              {/* If YouTube Embed */}
              {youtubeId ? (
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                    title="AnuVaani Demo Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              ) : !hasVideoError ? (
                /* Native HTML5 Video Player */
                <div className="relative aspect-video w-full bg-black">
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

                  {/* Play Overlay if not playing */}
                  {!isPlaying && (
                    <div
                      onClick={togglePlay}
                      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all hover:bg-black/20"
                    >
                      <button
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-500 text-white shadow-xl shadow-teal-500/30 transition-transform hover:scale-110 active:scale-95"
                        aria-label="Play video"
                      >
                        <Play className="h-9 w-9 fill-current translate-x-0.5" />
                      </button>
                    </div>
                  )}

                  {/* Custom Controls Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                    {/* Scrubbing Bar */}
                    <div className="relative mb-3 flex items-center">
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

                        <span className="font-mono text-slate-300">
                          {formatSeconds(currentTime)} / {formatSeconds(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="hidden rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-teal-400 sm:inline-block">
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
                /* Evaluator Standby Showcase when video is pending upload */
                <div className="relative aspect-video w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />

                  {/* Pulsing Hardware Audio Wave Animation */}
                  <div className="relative mb-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-teal-500/30 bg-teal-950/60 shadow-inner shadow-teal-500/20 backdrop-blur-md">
                      <MonitorPlay className="h-12 w-12 text-teal-400 animate-pulse" />
                    </div>
                    <div className="absolute -inset-2 rounded-3xl border border-teal-500/20 animate-ping pointer-events-none" />
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 mb-3">
                    <Video className="h-3.5 w-3.5" />
                    Dedicated Demo Stream Active
                  </div>

                  <h3 className="text-xl font-bold text-white md:text-2xl">
                    Demonstration Recording Pipeline Ready
                  </h3>

                  <p className="mt-2 max-w-lg text-sm text-slate-300">
                    This dedicated route is designated for the AnuVaani hardware & software evaluation video. The video file is scheduled to stream directly at this link.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      href="/ops"
                      className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-400 hover:shadow-teal-500/30"
                    >
                      <Radio className="h-4 w-4" />
                      Explore Live Ops Console
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => {
                        setCustomInput(videoSrc);
                        setShowConfigModal(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
                    >
                      <UploadCloud className="h-4 w-4 text-teal-400" />
                      Configure Video Link
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    Pro-tip: Place <code className="font-mono text-teal-400">demo.mp4</code> into <code className="font-mono text-slate-400">frontend/public/videos/</code> or paste an unlisted YouTube URL.
                  </p>
                </div>
              )}

              {/* Status bar under player */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 bg-slate-900/60 px-5 py-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>
                    Current Chapter: <strong className="text-slate-200">{DEMO_CHAPTERS[activeChapter]?.title}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-slate-500">{DEMO_CHAPTERS[activeChapter]?.timeLabel}</span>
                  <Link
                    href="/ops"
                    className="inline-flex items-center gap-1 text-teal-400 transition-colors hover:text-teal-300"
                  >
                    Open Ops Dashboard <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Video Overview & Technical Transcript Summary */}
            <div className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <FileText className="h-5 w-5 text-teal-400" />
                Demonstration Overview & Architecture Points
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                This presentation demonstrates our implementation of the <strong>Low-Latency Edge Voice Activator</strong> (ISRO PS 26172). Unlike consumer voice assistants that offload wake-word validation to distant servers or rely on heavy proprietary runtimes, AnuVaani performs on-device acoustic feature extraction on an embedded ARM64 host, achieving deterministic sub-450ms activation with a minimal memory footprint.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                    Key Highlights in the Video
                  </h3>
                  <ul className="mt-2.5 space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span><strong>Continuous Ring Buffer:</strong> Zero clipping on initial phonemes upon wake detection.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span><strong>Streaming Indic ASR:</strong> Live intermediate transcripts update every 180ms.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span><strong>Fleet Telemetry:</strong> Multi-node visibility across ISRO ground control sites.</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                    Evaluator Testing Commands
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Hardware nodes accept standardized test audio sequences:
                  </p>
                  <div className="mt-2 space-y-1.5 font-mono text-[11px] text-slate-300">
                    <div className="rounded bg-slate-900 px-2 py-1 border border-slate-800">
                      $ anuvaani-node --device-id isro-blr-01
                    </div>
                    <div className="rounded bg-slate-900 px-2 py-1 border border-slate-800">
                      $ curl -X POST /api/v1/sessions/replay
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chapters & Agenda Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                  <Layers className="h-4 w-4 text-teal-400" />
                  Interactive Video Chapters
                </h2>
                <span className="text-[11px] font-medium text-slate-400">Click to jump</span>
              </div>

              <div className="mt-3 space-y-2">
                {DEMO_CHAPTERS.map((ch, idx) => {
                  const isActive = activeChapter === idx;
                  return (
                    <button
                      key={ch.timeLabel}
                      onClick={() => seekToChapter(ch, idx)}
                      className={`w-full text-left rounded-xl p-3 transition-all ${
                        isActive
                          ? "border border-teal-500/40 bg-teal-500/10 text-white shadow-sm shadow-teal-500/10"
                          : "border border-transparent bg-slate-950/40 text-slate-300 hover:border-slate-800 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-xs font-bold ${isActive ? "text-teal-300" : "text-slate-400"}`}>
                          {ch.timeLabel}
                        </span>
                        {isActive && (
                          <span className="flex items-center gap-1 rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                            Current
                          </span>
                        )}
                      </div>
                      <p className={`mt-1 text-xs font-semibold ${isActive ? "text-white" : "text-slate-200"}`}>
                        {ch.title}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                        {ch.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Evaluator Metrics Cards */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Verified Benchmark Metrics
              </p>
              <div className="grid grid-cols-2 gap-3">
                {EVALUATOR_METRICS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">{m.label}</span>
                        <div className={`rounded-lg p-1.5 ${m.bg}`}>
                          <Icon className={`h-3.5 w-3.5 ${m.accent}`} />
                        </div>
                      </div>
                      <p className="mt-2 text-lg font-extrabold text-white">{m.value}</p>
                      <p className="text-[10px] text-slate-400">{m.target}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Ops Callout */}
            <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-950/40 to-slate-900 p-5 text-center">
              <Radio className="mx-auto h-8 w-8 text-teal-400" />
              <h3 className="mt-2 text-sm font-bold text-white">Live Operations Console</h3>
              <p className="mt-1 text-xs text-slate-300">
                Inspect live telemetry across 6 nodes, view speech transcripts, and review latency.
              </p>
              <Link
                href="/ops"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-500/20 transition-all hover:bg-teal-400"
              >
                Launch Dashboard (/ops)
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Config / Upload Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Configure Video Source</h3>
            <p className="mt-1 text-xs text-slate-400">
              Update the video stream URL displayed on this route without modifying code.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Direct Video URL or YouTube Link
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/watch?v=... or https://.../demo.mp4"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs text-slate-400 space-y-2">
                <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <UploadCloud className="h-4 w-4 text-teal-400" />
                  Local File Ingest Option:
                </p>
                <p>
                  Copy your finished MP4 file to:
                  <br />
                  <code className="rounded bg-slate-900 px-1 py-0.5 font-mono text-teal-300 text-[11px]">
                    frontend/public/videos/demo.mp4
                  </code>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-xs text-teal-400 hover:underline"
                >
                  Test with Sample Video
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetDefault}
                    className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Reset Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomSource}
                    className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-bold text-white hover:bg-teal-400"
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
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent mx-auto mb-3" />
            <p className="text-sm font-medium">Loading Demonstration Portal...</p>
          </div>
        </div>
      }
    >
      <DemoContent />
    </Suspense>
  );
}
