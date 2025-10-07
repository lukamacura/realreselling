"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [panelHeight, setPanelHeight] = useState<number>(0);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // ESC za zatvaranje
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Klik van panela
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      const panel = panelRef.current;
      const btn = buttonRef.current;
      const t = e.target as Node;
      if (panel && !panel.contains(t) && btn && !btn.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Zaključaj skrol dok je otvoren
useEffect(() => {
  if (open) {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev; // ✅ void
    };
  }
}, [open]);


  // Animacija visine: meri sadržaj i postavljaj height (u px) sa tranzicijom
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (open) {
      const h = el.scrollHeight;
      setPanelHeight(h);
    } else {
      setPanelHeight(0);
    }
  }, [open]);

  // Ako se sadržaj menja dinamički, možeš ponovo meriti:
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (!open || !innerRef.current) return;
      setPanelHeight(innerRef.current.scrollHeight);
    });
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [open]);

  const links = [
    { href: "#pocetna", label: "Početna" },
    { href: "#sta-dobijam", label: "Šta dobijam" },
    { href: "#recenzije", label: "Recenzije" },
    { href: "#cena", label: "Cena programa" },
    { href: "#faq", label: "FAQ" },
  ];

  function closeAndFocus() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1200px] px-4">
        <nav
          className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B0F13]/60 px-4 py-2.5 text-sm text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          aria-label="Glavna navigacija"
        >
          <Link
            href="#pocetna"
            className="select-none text-base font-semibold tracking-tight text-white/90 hover:text-white"
          >
            RealReselling
          </Link>

          {/* Desktop */}
          <div className="hidden gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl text-lg px-3 py-2 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            ref={buttonRef}
            type="button"
            aria-controls="mobile-nav"
            aria-expanded={open}
            aria-label="Meni"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* Overlay (samo mobilni) */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-200 ease-out motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden
        onClick={() => setOpen(false)}
      >
        <div className="h-full w-full bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Mobile panel */}
      <div
        ref={panelRef}
        id="mobile-nav"
        className={`md:hidden relative z-50`}
      >
        <div className="mx-auto max-w-[1200px] px-4">
          <div
            className={`mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F13]/70 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl
              transition-[height,transform,opacity] duration-250 ease-out
              motion-reduce:transition-none
              ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
            `}
            style={{ height: panelHeight }}
            role="dialog"
            aria-modal="true"
          >
            {/* Unutrašnji sadržaj koji merimo */}
            <div ref={innerRef}>
              <div className="p-2">
                {links.map((l, i) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={closeAndFocus}
                    className={`block rounded-xl px-3 py-3 text-base text-white/90 transition
                      hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60
                      opacity-0 translate-y-1
                      ${open ? "animate-[fadeInUp_220ms_forwards]" : ""}
                    `}
                    style={{ animationDelay: open ? `${60 + i * 35}ms` : "0ms" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer da sadržaj ne ulazi ispod nava */}
      <div aria-hidden className="h-[68px] md:h-[76px]" />

      {/* Keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(4px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </header>
  );
}
