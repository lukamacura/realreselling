"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BadgeCheck, Clock, ShieldCheck, Loader2 } from "lucide-react";

type Message = {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
};

const MESSAGES: Message[] = [
  { icon: ShieldCheck, text: "Vraćamo novac ako ne napraviš prvu zaradu za 30 dana." },
  { icon: Clock, text: "Program je napravljen za početnike i vodi te kroz ceo proces" },
  { icon: BadgeCheck, text: "Sigurna kupovina i podrška 24/7." },
];

export default function Preloader({
  active = true,
  onDone,
  cycleMs = 900,
}: {
  active?: boolean;
  onDone?: () => void;
  cycleMs?: number;
}) {
  const [visible, setVisible] = useState(active);
  const [index, setIndex] = useState(0);

  // ✅ koristimo setInterval, pa je tip ovaj:
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setVisible(active);
  }, [active]);

  useEffect(() => {
    if (!visible) return;

    // ✅ bez short-circuit izraza
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }

    const it = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, cycleMs);

    timer.current = it;

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [visible, cycleMs]);

  // Omogući parentu da reaguje kada se sakrije
  useEffect(() => {
    if (!visible && onDone) onDone();
  }, [visible, onDone]);

  const { icon: Icon, text } = useMemo(() => MESSAGES[index], [index]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#0B0F13] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 top-1/2 h-[140%] w-[70%] -translate-y-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(212,160,32,0.40) 0%, rgba(212,160,32,0.12) 45%, rgba(11,15,19,0) 70%)",
          filter: "blur(10px)",
        }}
      />

      <div className="relative mx-4 w-full max-w-[520px] rounded-2xl border border-white/10 bg-[#12171E]/80 p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-500/15 ring-1 ring-amber-400/30">
          <Loader2 className="h-6 w-6 animate-spin text-amber-300" />
        </div>

       <div className="mt-5 flex items-center justify-center gap-3 flex-col sm:flex-row">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-400 text-black shadow-[0_8px_24px_rgba(212,160,32,0.45)]">
          <Icon className="h-5 w-5" />
        </span>
        <p key={index} className="text-xs font-semibold text-white/90 animate-fade-in">
          {text}
        </p>
      </div>


        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            key={`bar-${index}`}
            className="h-full w-full origin-left animate-bar bg-amber-400"
            style={{ animationDuration: `${cycleMs}ms` }}
          />
        </div>

        <p className="mt-4 text-xs text-white/60">RealReselling</p>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fade-in { animation: fade-in .45s ease forwards }
        @keyframes bar { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        .animate-bar { animation: bar 1.6s linear forwards }
      `}</style>
    </div>
  );
}
