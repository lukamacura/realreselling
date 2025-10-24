/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

type Src = { src: string; type: string };

export default function SmartVideo({
  sources,
  poster,
  className = "",
  aspectRatio = "16 / 9",
  loop = true,
  initialMuted = true,
}: {
  sources: Src[];
  poster?: string;
  className?: string;
  aspectRatio?: string;
  loop?: boolean;
  initialMuted?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [volume, setVolume] = useState<number>(initialMuted ? 0 : 1);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [isFs, setIsFs] = useState(false);

  // Wire basic video events (bez init zvuka ovde, da deps budu čisti)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onLoaded = () => setDuration(v.duration || 0);
    const onTime = () => setCurrent(v.currentTime || 0);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);

    // inicijalno stanje
    if (!Number.isNaN(v.duration)) setDuration(v.duration || 0);
    setCurrent(v.currentTime || 0);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
    };
  }, []);

  // Jednostavan sync za mute/volume (rešava react-hooks/exhaustive-deps upozorenje)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    v.volume = volume;
  }, [isMuted, volume]);

  // Fullscreen state (bez ts-komentara; koristimo vendor prefikse preko any)
  useEffect(() => {
    const onFsChange = () => {
      const docAny = document as any;
      const fsEl =
        document.fullscreenElement ||
        docAny?.webkitFullscreenElement ||
        docAny?.msFullscreenElement;
      setIsFs(!!fsEl);
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

  const play = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (v.ended && !loop) v.currentTime = 0;
      await v.play();
    } catch {}
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
    // ako odmutiramo, a volume je 0 — podigni ga na 1 radi čujnosti
    if (!next && v.volume === 0) {
      setVolume(1);
    }
  };

  const onVolume = (val: number) => {
    setVolume(val);
    if (val === 0 && !isMuted) setIsMuted(true);
    else if (val > 0 && isMuted) setIsMuted(false);
  };

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;

    const docAny = document as any;
    const isAnyFs =
      document.fullscreenElement ||
      docAny?.webkitFullscreenElement ||
      docAny?.msFullscreenElement;

    if (!isAnyFs) {
      (el.requestFullscreen?.bind(el) ??
        (el as any).webkitRequestFullscreen ??
        (el as any).msRequestFullscreen)?.();
    } else {
      (document.exitFullscreen?.bind(document) ??
        docAny?.webkitExitFullscreen ??
        docAny?.msExitFullscreen)?.();
    }
  };

  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={wrapRef}
      className={`relative mx-auto md:w-[80%] overflow-hidden rounded-2xl bg-black ${className}`}
      style={{ aspectRatio }}
    >
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        loop={loop}
        muted={isMuted}
        controls={false}
        preload="metadata"
        className="h-full w-full object-cover"
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
        Your browser does not support HTML5 video.
      </video>

      {/* centralni Play overlay */}
      {!isPlaying && (
        <button
          onClick={play}
          aria-label="Pusti"
          className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30">
          <Play className="h-8 w-8 text-white" />
        </button>
      )}

      {/* kontrole: scrub + play/pause + mute/volume + fullscreen */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
        <div className="flex items-center gap-2">
          <span className="w-10 text-right text-xs text-white/80">{fmt(current)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Number.isFinite(current) ? current : 0}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full accent-white"
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
              onChange={(e) => onVolume(Number(e.target.value))}
              className="w-28 accent-white"
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
