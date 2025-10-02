// app/meet/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  Users,
  Phone,
  MessageCircle,
  Gift,
  CheckCircle2,
  X,
  Lightbulb, 
} from "lucide-react";

export default function MeetPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0B0F13] text-white">
      {/* Pozadinski glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-12%] top-[-20%] h-[160%] w-[70%] opacity-70"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(212,160,32,0.40) 0%, rgba(212,160,32,0.12) 45%, rgba(11,15,19,0) 70%)",
          filter: "blur(10px)",
        }}
      />

      <section className="container mx-auto max-w-[1300px] px-4 py-12 sm:py-16">
        {/* HERO CARD */}
        <div className="relative grid items-center gap-10 rounded-2xl border border-white/10 bg-[#12171E]/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur md:grid-cols-2 md:p-8">
          <div className="absolute inset-x-0 top-0 h-[10px] rounded-t-2xl bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

          {/* Left: copy */}
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Users className="h-3.5 w-3.5 text-amber-300" />
              Besplatan Reselling Starter Meetup
            </p>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Prva resell prodaja za{" "}
              <span className="text-amber-300">30 dana</span>, saznaj{" "}
              <span className="underline decoration-amber-400/80 underline-offset-4">
                BESPLATNO
              </span>{" "}
              kako!
            </h1>

            <p className="mt-4 max-w-[56ch] text-white/80">
              Na ovom uvodnom online meetu otkrićeš da li ti reselling
              odgovara, koje korake da uradiš i kako najbrže dođeš do prve
              zarade.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-amber-300" />
                Mentor te kontaktira putem <b className="text-white">WhatsApp-a</b>
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-300" />
                <span>Bonus: pristup <b className="text-white">Reselling Room</b> (naša
                WhatsApp grupa), BESPLATNO</span>
                
              </li>
              <li className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-amber-300" />
                 <b className="text-white">Malo iznenađenje</b>  na kraju meeta
              </li>
            </ul>

            <div className="mt-6">
              <button
                onClick={() => setOpen(true)}
                className="group font-display font-bold text-2xl inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 px-12 py-6 text-center text-black shadow-[0_14px_40px_rgba(212,160,32,0.45)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-300/60 sm:w-auto"
              >
                <Sparkles className="h-5 w-5" />
                Obezbedi svoje free mesto
              </button>
              <p className="mt-2 text-xs text-white">
                Ostalo još 2 mesta
              </p>
              <p className="mt-2 text-xs text-white/60">
                Brzo je, traje oko 45 min i nije obavezna kupovina.
              </p>
            </div>
          </div>

          {/* Right: ilustracija / mockup */}
          <div className="relative">
              <Image
                src="/meet.png"
                alt="RealReselling – besplatan uvod"
                width={2780}
                height={1200}
                className="h-full w-full object-cover opacity-90"
                priority
              />
            <p className="mt-3 text-center text-xs text-white/60">
              Q&A na kraju pa možeš pitati sve što te zanima.
            </p>
          </div>
        </div>

        {/* Trust strip / kratki bullets */}
        <div className="mt-6 grid gap-4 justify-items-center md:grid-cols-3">
  {/* 1 */}
  <div className="w-full max-w-[380px] rounded-2xl border border-white/10 bg-[#12171E]/60 p-4 text-center">
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
      <Lightbulb className="h-7 w-7" aria-hidden />
    </div>
    <p className="mt-3 text-sm text-white/80">
      Saznaješ da li je reselling uopšte za tebe
    </p>
  </div>

  {/* 2 */}
  <div className="w-full max-w-[380px] rounded-2xl border border-white/10 bg-[#12171E]/60 p-4 text-center">
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
      <MessageCircle className="h-7 w-7" aria-hidden />
    </div>
    <p className="mt-3 text-sm text-white/80">
      Pristup WhatsApp grupi sa uspešnim resellerima
    </p>
  </div>

  {/* 3 */}
  <div className="w-full max-w-[380px] rounded-2xl border border-white/10 bg-[#12171E]/60 p-4 text-center">
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
      <Gift className="h-7 w-7" aria-hidden />
    </div>
    <p className="mt-3 text-sm text-white/80">
      Poklon iznenađenje ako ostaneš do kraja meeta
    </p>
  </div>
</div>

        
      </section>

      {/* Modal forma za prijavu (telefon umesto emaila) */}
      {open && <SignupModal onClose={() => setOpen(false)} />}
    </main>
  );
}

/* ---------------- Modal (inline radi jednostavnosti) ---------------- */

function SignupModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // WhatsApp broj
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  // minimalna validacija: min 7 cifara
  const valid = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 7;


type ApiResponse = { ok: true } | { ok: false; error?: string };

async function submit() {
  if (!valid) return;
  setBusy(true);
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    const data: ApiResponse = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(("error" in data && data.error) || "Greška pri slanju");
    }

   setDone(true);
// mala vizuelna pauza pa redirect
setTimeout(() => {
  onClose();              // zatvori modal
  router.push("/meet/success");
}, 600);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(e);
    alert(message);
  } finally {
    setBusy(false);
  }
}



  return (
    <div className="fixed inset-0 z-[90]">
      <button
        aria-label="Zatvori"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_.15s_ease-out]"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl border border-white/10 bg-[#12171E]/90 p-5 text-white shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl animate-[popIn_.18s_ease-out]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Rezerviši free mesto</h3>
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-1 text-sm text-white/70">
            Ostavi broj i mentor će te kontaktirati preko WhatsApp-a. Dobijaš i
            poziv u naš <b>Reselling Room</b> (WhatsApp grupa) + iznenađenje na kraju.
          </p>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs text-white/70">Ime</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0E1319] px-3 py-2 text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                placeholder="npr. Luka"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs text-white/70">
                Telefon (WhatsApp)
              </span>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0E1319] px-9 py-2 text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                  placeholder="+381 6x xxx xxxx"
                />
              </div>
            </label>
          </div>

          <button
            onClick={submit}
            disabled={!valid || busy || done}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 px-5 py-3 font-semibold text-black shadow-[0_14px_40px_rgba(212,160,32,0.45)] transition hover:brightness-110 disabled:opacity-60"
          >
            {done ? (
              <>
                <CheckCircle2 className="h-5 w-5" /> Sačuvano!
              </>
            ) : (
              <>
                <MessageCircle className="h-5 w-5" /> Pošalji broj
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs text-white/60">
            Tvoj broj koristimo samo da te kontaktiramo za meetup i WhatsApp
            grupu.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: scale(.98) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}
