"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Ticket, X } from "lucide-react";

/**
 * SocialProofToast (hydration-safe)
 * - Renders only after mount to avoid SSR/CSR mismatches
 * - Deterministic initial text (no random on server)
 * - Bottom-left toast with periodic random name + minutes
 */

const NAMES = [
  "Miloš",
  "Vasilije",
  "Nikola",
  "Pavle",
  "Marko",
  "Dušan",
  "Luka",
  "Aleksa",
  "Petar",
  "Teodor",
  "Stefan",
  "Vukan",
  "Vuk",
  "Zoran",
  "Aleksej",
];

function randomName(except?: string) {
  const pool = NAMES.filter((n) => n !== except);
  return pool[Math.floor(Math.random() * pool.length)];
}

function randomMinutes(min = 2, max = 60) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // inclusive
}

export default function SocialProofToast() {
  // avoid SSR hydration mismatches: render only after mount
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState<string>("Miloš"); // deterministic for SSR
  const [minsAgo, setMinsAgo] = useState<number>(15); // deterministic for SSR
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // message memo to avoid recompute
  const message = useMemo(() => `${name} je rezervisao svoje mesto.`, [name]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const t0 = setTimeout(show, 1200);
    return () => clearTimeout(t0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  function show() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setVisible(true);
    // auto hide after 6.5s
    hideTimer.current = setTimeout(() => setVisible(false), 6500);

    // schedule next cycle 10-22s later
    if (cycleTimer.current) clearTimeout(cycleTimer.current);
    const nextIn = 10000 + Math.floor(Math.random() * 12000);
    cycleTimer.current = setTimeout(() => {
      setName((prev: string) => randomName(prev));
      setMinsAgo(randomMinutes());
      show();
    }, nextIn);
  }

  function close() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (cycleTimer.current) clearTimeout(cycleTimer.current);
    setVisible(false);
  }

  if (!mounted) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed left-4 bottom-4 z-50 w-[calc(100vw-2rem)] max-w-[360px] pb-[env(safe-area-inset-bottom)] sm:left-6 sm:bottom-6"
    >
      <div
        className={[
          "pointer-events-auto select-none rounded-2xl border border-white/10 bg-[#12171E]/95 text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur",
          "flex items-center gap-3 p-3 pr-2 sm:p-4 sm:pr-3",
          "transition-all duration-500 ease-out",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
        ].join(" ")}
        role="dialog"
        aria-label="Obaveštenje o kupovini"
      >
        <div className="grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-black shrink-0">
          <Ticket className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold sm:text-[14px]">{message}</p>
          <p className="mt-0.5 text-xs text-white/70">pre {minsAgo} min</p>
        </div>
        <button
          aria-label="Zatvori obaveštenje"
          onClick={close}
          className="ml-auto rounded-lg p-1 text-white/60 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
