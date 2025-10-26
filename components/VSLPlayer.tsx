/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

// --- Types ---
type Src = { src: string; type: string };

type SmartVideoProps = {
  sources: Src[];
  poster?: string;
  className?: string;
  aspectRatio?: string;
  loop?: boolean;
  initialMuted?: boolean;
  autoFullscreenOnPlay?: boolean; // NEW: opt-in flag (default true)
};

// Detect iOS/iPadOS Safari-ish
const isiOS = () =>
  typeof navigator !== "undefined" && /iP(hone|ad|od)/.test(navigator.userAgent);

export default function SmartVideo({
  sources,
  poster,
  className = "",
  aspectRatio = "16 / 9",
  loop = true,
  initialMuted = true,
  autoFullscreenOnPlay = true,
}: SmartVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [volume, setVolume] = useState<number>(initialMuted ? 0 : 1);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [isFs, setIsFs] = useState(false);

  // UI visibility with auto-hide
  const [uiVisible, setUiVisible] = useState(true);
  const hideTimeoutRef = useRef<number | null>(null);
  const isScrubbingRef = useRef(false);

  const clearHideTimer = () => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const scheduleAutoHide = () => {
    clearHideTimer();
    if (!isPlaying) return; // keep visible while paused
    hideTimeoutRef.current = window.setTimeout(() => setUiVisible(false), 1200);
  };

  const showUI = (persist = false) => {
    setUiVisible(true);
    if (persist) clearHideTimer();
    else scheduleAutoHide();
  };

  // --- Fullscreen helpers ---
  const getAnyFsElement = () => {
    const docAny = document as any;
    return (
      document.fullscreenElement ||
      docAny?.webkitFullscreenElement ||
      docAny?.msFullscreenElement ||
      null
    );
  };

  const enterFullscreen = async () => {
    const v = videoRef.current as any;
    const wrap = wrapRef.current as any;
    if (!v) return;

    // Prefer video-level fullscreen on iOS for the best controls/UX
    try {
      if (isiOS() && (v.webkitEnterFullscreen || v.webkitEnterFullScreen)) {
        (v.webkitEnterFullscreen || v.webkitEnterFullScreen).call(v);
        return;
      }
    } catch {}

    // Otherwise try standards API on wrapper (keeps custom UI)
    try {
      if (!getAnyFsElement()) {
        const req =
          wrap?.requestFullscreen?.bind(wrap) ||
          v?.requestFullscreen?.bind(v) ||
          wrap?.webkitRequestFullscreen ||
          wrap?.msRequestFullscreen ||
          v?.webkitRequestFullscreen ||
          v?.msRequestFullscreen;
        if (req) await req();
      }
    } catch {}

    // Try orientation lock when possible (non-blocking)
    try {
      // @ts-ignore
      await (screen.orientation?.lock?.("landscape") ?? Promise.resolve());
    } catch {}
  };

  const exitFullscreen = async () => {
    const docAny = document as any;
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (docAny?.webkitExitFullscreen) await docAny.webkitExitFullscreen();
      else if (docAny?.msExitFullscreen) await docAny.msExitFullscreen();
    } catch {}

    // Best-effort orientation unlock
    try {
      // @ts-ignore
      await (screen.orientation?.unlock?.() ?? Promise.resolve());
    } catch {}
  };

  // --- Video event wiring ---
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => {
      setIsPlaying(true);
      scheduleAutoHide();
    };
    const onPause = () => {
      setIsPlaying(false);
      showUI(true);
    };
    const onEnded = () => {
      setIsPlaying(false);
      showUI(true);
    };
    const onLoaded = () => setDuration(v.duration || 0);
    const onTime = () => {
      // Ignore time updates while scrubbing to avoid jitter
      if (!isScrubbingRef.current) setCurrent(v.currentTime || 0);
    };

    v.addEventListener("play", onPlay, { passive: true });
    v.addEventListener("pause", onPause, { passive: true });
    v.addEventListener("ended", onEnded, { passive: true });
    v.addEventListener("loadedmetadata", onLoaded, { once: true });
    v.addEventListener("timeupdate", onTime);

    // Initial values (if already available)
    if (!Number.isNaN(v.duration)) setDuration(v.duration || 0);
    setCurrent(v.currentTime || 0);

    return () => {
      v.removeEventListener("play", onPlay as any);
      v.removeEventListener("pause", onPause as any);
      v.removeEventListener("ended", onEnded as any);
      v.removeEventListener("loadedmetadata", onLoaded as any);
      v.removeEventListener("timeupdate", onTime as any);
      clearHideTimer();
    };
  }, []);

  // Sync mute/volume to DOM
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    // Clamp volume (Safari can throw if outside [0,1])
    v.volume = Math.min(1, Math.max(0, volume));
  }, [isMuted, volume]);

  // Fullscreen state listeners
  useEffect(() => {
    const onFsChange = () => {
      setIsFs(!!getAnyFsElement());
      showUI(true);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    (document as any).addEventListener?.("webkitfullscreenchange", onFsChange);
    (document as any).addEventListener?.("MSFullscreenChange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      (document as any).removeEventListener?.("webkitfullscreenchange", onFsChange);
      (document as any).removeEventListener?.("MSFullscreenChange", onFsChange);
    };
  }, []);

  // Pause auto-hide when tab not visible
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) clearHideTimer();
      else scheduleAutoHide();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // --- Controls logic ---
  const play = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (v.ended && !loop) v.currentTime = 0;
      // First attempt: play then fullscreen (works in most browsers with a user gesture)
      await v.play();
      if (autoFullscreenOnPlay) await enterFullscreen();
    } catch {
      // Fallback (some iOS builds require entering fullscreen first in the same gesture)
      try {
        if (autoFullscreenOnPlay) await enterFullscreen();
        await v.play();
      } catch {}
    }
  };

  const pause = () => videoRef.current?.pause();
  const togglePlay = () => (isPlaying ? pause() : play());

  const onSeek = (value: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = value;
    setCurrent(value);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    setIsMuted(next);
    if (!next && (v.volume ?? volume) === 0) {
      setVolume(1);
    }
  };

  const onVolume = (val: number) => {
    setVolume(val);
    if (val === 0 && !isMuted) setIsMuted(true);
    else if (val > 0 && isMuted) setIsMuted(false);
  };

  const toggleFullscreen = () => {
    if (getAnyFsElement()) exitFullscreen();
    else enterFullscreen();
  };

  const fmt = (t: number) => {
    if (!Number.isFinite(t) || t < 0) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // UI interaction helpers
  const onVideoClick = () => {
    setUiVisible((v) => {
      const next = !v;
      if (next) scheduleAutoHide();
      else clearHideTimer();
      return next;
    });
  };

  const onMouseMove = () => showUI();

  // Prevent auto-hide while scrubbing or hovering controls
  const onPointerDown = () => {
    isScrubbingRef.current = true;
    showUI(true);
  };
  const onPointerUp = () => {
    isScrubbingRef.current = false;
    scheduleAutoHide();
  };

  return (
    <div
      ref={wrapRef}
      className={`relative mx-auto md:w-[80%] overflow-hidden rounded-2xl bg-black ${className} ${uiVisible ? "cursor-default" : "cursor-none"}`}
      style={{ aspectRatio }}
      onMouseMove={onMouseMove}
    >
      <video
        ref={videoRef}
        poster={poster}
        playsInline // important for iOS inline playback when not in FS
        loop={loop}
        muted={isMuted}
        controls={false}
        preload="metadata"
        className="h-full w-full object-cover"
        onClick={onVideoClick}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
        Your browser does not support HTML5 video.
      </video>

      {/* Central Play overlay (hidden with UI) */}
      {!isPlaying && uiVisible && (
        <button
          onClick={play}
          aria-label="Pusti"
          className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-opacity hover:bg-white/30"
        >
          <Play className="h-8 w-8 text-white" />
        </button>
      )}

      {/* Controls: scrub + play/pause + mute/volume + fullscreen */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex flex-col gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 transition-opacity ${uiVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!uiVisible}
      >
        <div className="flex items-center gap-2">
          <span className="w-10 text-right text-xs text-white/80">{fmt(current)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Number.isFinite(current) ? current : 0}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full accent-white touch-pan-y"
            aria-label="Traži poziciju u videu"
          />
          <span className="w-10 text-xs text-white/80">{fmt(duration || 0)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pauziraj" : "Pusti"}
              className="rounded-md p-2 text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Uključi zvuk" : "Isključi zvuk"}
              className="rounded-md p-2 text-white hover:bg-white/20"
            >
              {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onChange={(e) => onVolume(Number(e.target.value))}
              className="w-28 accent-white touch-pan-y"
              aria-label="Jačina zvuka"
            />
          </div>

          <button
            onClick={toggleFullscreen}
            aria-label={isFs ? "Izađi iz celog ekrana" : "Ceo ekran"}
            className="rounded-md p-2 text-white hover:bg-white/20"
          >
            {isFs ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
