"use client";
import { useEffect, useRef, useState } from "react";

type Src = { src: string; type: string };
export default function SmartVideo({
  sources,
  poster,
  className = "",
  aspectRatio = "16 / 9",
  loop = true,
}: {
  sources: Src[];
  poster?: string;
  className?: string;
  aspectRatio?: string;
  loop?: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [wantSound, setWantSound] = useState(false); // pamti želju korisnika

  // Autoplay/pause po vidljivosti
  useEffect(() => {
    const v = ref.current;
    const el = wrapRef.current;
    if (!v || !el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        if (e.isIntersecting && e.intersectionRatio >= 0.6) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.6] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Na prvi klik – uključi zvuk (dozvoljen gest)
  const unmute = async () => {
    const v = ref.current;
    if (!v) return;
    try {
      v.muted = false;
      setWantSound(true);
      // ako je pauziran (npr. iOS), pusti ponovo
      if (v.paused) await v.play().catch(() => {});
    } catch {}
  };

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden rounded-2xl bg-black ${className}`}
      style={{ aspectRatio }}
    >
      <video
        ref={ref}
        poster={poster}
        playsInline
        loop={loop}
        muted={!wantSound}
        controls={false}
        preload="metadata"
        className="h-full w-full object-cover"
      >
        {sources.map(s => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
        Your browser does not support HTML5 video.
      </video>

      {/* Unmute overlay – prikazuje se dok je muted */}
      {!wantSound && (
        <button
          onClick={unmute}
          className="absolute bottom-3 right-3 rounded-lg bg-white/20 px-3 py-2 text-sm text-white backdrop-blur hover:bg-white/30"
        >
          🔊 Uključi zvuk
        </button>
      )}
    </div>
  );
}
