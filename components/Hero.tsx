"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Banknote, Users, BadgeCheck, BadgeDollarSign } from "lucide-react";
import {
  motion,
  LazyMotion,
  domAnimation,
  MotionConfig,
  cubicBezier,
  type Variants,
} from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

// Easing i varijante
const easeStandard = cubicBezier(0.22, 1, 0.36, 1);
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeStandard,
      delay: i * 0.08,
    },
  }),
};

// Typewriter
function useTypewriter({
  text,
  speed = 18,
  startDelay = 120,
  enabled = true,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  enabled?: boolean;
}) {
  const [out, setOut] = useState(enabled ? "" : text);
  const [done, setDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setOut(text);
      setDone(true);
      return;
    }
    let i = 0;
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const kick = setTimeout(function tick() {
      if (cancelled) return;
      i += 1;
      setOut(text.slice(0, i));
      if (i < text.length) {
        timeout = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    }, startDelay);

    return () => {
      cancelled = true;
      clearTimeout(kick);
      if (timeout) clearTimeout(timeout);
    };
  }, [text, speed, startDelay, enabled]);

  return { out, done } as const;
}

export default function Hero() {
  const pathname = usePathname();

  // 1) Ready posle hidratacije (sprečava FOUC)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // 2) Sačekaj preloader (900ms) pa tek onda dozvoli prvi start
  const [loaderDone, setLoaderDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaderDone(true), 900);
    return () => clearTimeout(t);
  }, []);

  // 3) Replay kad god korisnik "dođe" na hero (uđe u viewport)
  const sectionRef = useRef<HTMLElement | null>(null);
  const lastPlayRef = useRef(0);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const MIN_GAP = 1200; // ms – anti-bounce
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        const now = performance.now();
        const visible = e.isIntersecting && e.intersectionRatio >= 0.6;
        if (visible && ready && loaderDone && now - lastPlayRef.current > MIN_GAP) {
          lastPlayRef.current = now;
          setReplayKey(k => k + 1); // remount animacionih blokova
        }
      },
      { threshold: [0, 0.6] }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ready, loaderDone]);

  // 4) Retrigger i pri promeni rute (SPA povratak na /)
  useEffect(() => {
    if (ready && loaderDone) {
      setReplayKey(k => k + 1);
      lastPlayRef.current = performance.now();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const typedHeadline = useMemo(
    () => "od resellinga u 30 dana ILI VRAĆAMO NOVAC",
    []
  );
  const { out: typedOut, done } = useTypewriter({
    text: typedHeadline,
    speed: 18,
    startDelay: 120,
    enabled: true, // HERO uvek tipka
  });

  return (
    <MotionConfig reducedMotion="never">
      <LazyMotion features={domAnimation}>
        <section
          ref={sectionRef}
          className="relative mx-auto mt-10 overflow-hidden bg-brand-dark py-10 sm:py-14 md:mt-40 md:py-0"
        >
          {/* Zlatni radijal (loop) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-[-10%] w-[70%] max-w-[900px] opacity-80"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(212,160,32,0.45) 0%, rgba(212,160,32,0.15) 40%, rgba(11,15,19,0) 70%)",
            }}
            initial={{ opacity: 0.5, scale: 0.98 }}
            animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.98, 1, 0.98] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="container mx-auto grid max-w-[1600px] items-center gap-10 px-4 md:grid-cols-2 md:gap-12">
            {/* LEFT – remount preko key pokreće fadeUp svaki put */}
            <motion.div
              key={`left-${replayKey}`}
              className="relative z-10"
              initial="hidden"
              animate={ready && loaderDone ? "visible" : "hidden"}
            >
              <motion.h1
                className="mb-2 font-display text-[36px] leading-[1.05] tracking-tight text-white md:mb-6 md:text-[64px]"
                variants={fadeUp}
                custom={0}
              >
                <span className="m-0 block font-display text-[40px] leading-tight text-brand-gold md:text-[64px]">
                  💸 Prva online zarada
                  <span
                    className="ml-2 text-white"
                    aria-label={typedHeadline}
                    aria-live="polite"
                  >
                    {typedOut}
                    {!done && (
                      <motion.span
                        aria-hidden
                        className="inline-block w-[0.5ch] translate-y-[0.05em]"
                      >
                        |
                      </motion.span>
                    )}
                  </span>
                </span>
              </motion.h1>

              <motion.p
                className="mb-6 max-w-[680px] text-lg leading-relaxed text-white/85 md:text-xl"
                variants={fadeUp}
                custom={1}
              >
                Dobijaš proizvode, uputstva i “copy-paste” šablone da napraviš
                prvu prodaju za 30 dana, a ako ne uspeš VRATIĆEMO TI NOVAC.
              </motion.p>

              <motion.div
                className="mb-8 flex flex-wrap items-center gap-3 text-white/85"
                variants={fadeUp}
                custom={2}
              >
                <div className="flex -space-x-2">
                  <Image src="/a1.webp" alt="član" width={40} height={40} className="h-10 w-10 rounded-full ring-2 ring-brand-dark" />
                  <Image src="/a2.webp" alt="član" width={40} height={40} className="h-10 w-10 rounded-full ring-2 ring-brand-dark" />
                  <Image src="/a3.webp" alt="član" width={40} height={40} className="h-10 w-10 rounded-full ring-2 ring-brand-dark" />
                  <span className="inline-flex h-10 items-center justify-center rounded-full bg-brand-gold px-2 text-sm font-semibold text-black">3000+</span>
                </div>
                <span className="text-xs md:text-base">Pridruži se zajednici od preko 3000+ članova</span>
              </motion.div>

              <motion.div variants={fadeUp} custom={3} className="relative w-full max-w-[640px]">
                <Link
                  href="#sta-dobijam"
                  className="group relative inline-flex w-full items-center justify-center rounded-[28px] bg-brand-gold px-6 py-8 font-display text-xl font-bold text-brand-dark shadow-[0_10px_30px_rgba(212,160,32,.35)] transition md:text-2xl hover:bg-brand-goldDark"
                >
                  <BadgeDollarSign className="mb-[3px] mr-[2px] h-9 w-9 text-brand-dark transition-transform group-hover:scale-110" aria-hidden />
                  Hoću da zarađujem od resellinga
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
                    <span className="absolute -inset-y-1 -left-1 h-[200%] w-1 rotate-[20deg] bg-white/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT – remount i fade-in */}
            <motion.div
              key={`right-${replayKey}`}
              className="relative z-0 mx-auto w-full md:max-w-none"
              initial={{ opacity: 0, y: 24 }}
              animate={ready && loaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, ease: easeStandard }}
            >
              <motion.div
                className="relative rounded-[24px] bg-transparent p-0 will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
              >
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="[transform:translateZ(40px)]"
                >
                  <Image
                    src="/hero.png"
                    alt="Kompletan sistem za prvu zaradu od resellinga u 30 dana"
                    width={2007}
                    height={1172}
                    priority
                    fetchPriority="high"
                    quality={100}
                    sizes="(min-width:1536px) 940px, (min-width:1280px) 860px, (min-width:1024px) 720px, 100vw"
                    className="mx-auto h-auto w-full rounded-[24px] shadow-2xl"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* FEATURE TRAKA */}
          <div className="container mx-auto max-w-[1600px] px-4">
            <div className="mt-10 grid grid-cols-1 gap-0 text-center sm:grid-cols-3">
              {[
                { Icon: Banknote, text: <>Prva prodaja za<br className="hidden sm:block" /> mesec dana</> },
                { Icon: Users, text: <>Zajednica<br className="hidden sm:block" /> uspešnih ljudi</> },
                { Icon: BadgeCheck, text: <>100%<br className="hidden sm:block" /> garancija</> },
              ].map(({ Icon, text }, i) => (
                <motion.div
                  key={`${replayKey}-${i}`}
                  className="mb-6 flex flex-col items-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={ready && loaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.5, delay: 0.1 * i, ease: easeStandard }}
                >
                  <motion.div
                    className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <Icon className="h-9 w-9 text-brand-gold" aria-hidden />
                  </motion.div>
                  <p className="font-display text-xl font-semibold leading-snug text-white md:text-2xl">
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </LazyMotion>
    </MotionConfig>
  );
}
