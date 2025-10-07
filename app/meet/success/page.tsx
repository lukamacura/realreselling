// app/meet/success/page.tsx
"use client";

import { CheckCircle2, MessageCircle, Phone, Users } from "lucide-react";
import Link from "next/link";

export default function MeetSuccessPage() {
  return (
    <main className="relative min-h-dvh bg-[#0B0F13] text-white overflow-hidden">
      {/* pozadinski glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-15%] top-[-20%] h-[160%] w-[70%] opacity-70"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(212,160,32,0.40) 0%, rgba(212,160,32,0.12) 45%, rgba(11,15,19,0) 70%)",
          filter: "blur(10px)",
        }}
      />

      <section className="container mx-auto max-w-[720px] px-4 py-24">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12171E]/80 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur">
          <div className="absolute inset-x-0 top-0 h-[10px] rounded-t-2xl bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30 animate-[popIn_.25s_ease-out]">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <h1 className="mt-4 text-3xl font-extrabold">Primljeni ste!</h1>
          <p className="mt-2 text-white/80">
            Mentor će vas kontaktirati putem <b className="text-white">WhatsApp-a</b> u
            najkraćem roku da potvrdi termin za besplatni meetup.
          </p>

          <ul className="mt-6 grid gap-3 text-sm text-white/80">
            <li className="mx-auto flex max-w-[520px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <Phone className="h-4 w-4 text-amber-300" />
              Držite telefon pri ruci (može stići poruka ili poziv).
            </li>
            <li className="mx-auto flex max-w-[520px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <MessageCircle className="h-4 w-4 text-amber-300" />
              Ako imate pitanja – spremite ih za Q&amp;A na kraju meeta.
            </li>
            <li className="mx-auto flex max-w-[520px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <Users className="h-4 w-4 text-amber-300" />
              Bonus: dobijate pristup našoj WhatsApp grupi <b>Reselling Room.</b>
            </li>
          </ul>

          <div className="mt-8 flex justify-center gap-3">
           
            <Link
              href="/meet"
              className="rounded-xl font-display bg-gradient-to-b from-amber-400 to-amber-600 px-12 py-4 text-2xl font-semibold text-black shadow-[0_14px_40px_rgba(212,160,32,0.45)] transition hover:brightness-110"
            >
              Nazad na Meet
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes popIn { from { opacity:0; transform:scale(.96) } to { opacity:1; transform:scale(1) } }
      `}</style>
    </main>
  );
}
