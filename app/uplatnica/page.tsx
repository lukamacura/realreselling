"use client";

import { Suspense, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import SnowCanvas from "@/components/SnowCanvas";

export const dynamic = "force-dynamic";

// ─── Page wrapper (keeps Suspense pattern from original) ───────────────────
export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm opacity-70">Učitavanje…</div>}>
      <UplatnicaClient />
    </Suspense>
  );
}

// ─── Client component ──────────────────────────────────────────────────────
function UplatnicaClient() {
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File selection ──────────────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Fajl mora biti slika (JPG, PNG, HEIC…).");
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError("Slika ne sme biti veća od 10 MB.");
      return;
    }

    setError(null);
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreview(url);
  }

  function clearFile() {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!name.trim()) { setError("Unesite ime i prezime."); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Unesite ispravnu email adresu.");
      return;
    }
    if (!file) { setError("Priložite sliku uplatnice."); return; }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("image", file);

      const res = await fetch("/api/uplatnica/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Greška pri slanju. Pokušajte ponovo.";
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch { /* ignore */ }
        setError(msg);
        setLoading(false);
        return;
      }

      router.push("/uplatnica/pending");
    } catch {
      setError("Greška pri slanju. Proverite internet konekciju i pokušajte ponovo.");
      setLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#0B0F13] text-white">
      <SnowCanvas className="pointer-events-none absolute inset-0 z-0 opacity-80" />

      <div className="relative z-10 container mx-auto max-w-[680px] px-4 py-8 sm:py-12">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Nazad
        </button>

        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Uplati{" "}
            <span className="text-amber-400">uplatnicom</span>
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Popuni uplatnicu, fotografiši je i pošalji nam. Pristup dobijate za 30 minuta.
          </p>
        </div>

        {/* Example image card */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#12171E]/80 p-5 shadow-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-400/80">
            Primer popunjene uplatnice
          </p>
          <Image
            src="/uplatnica_39.jpeg"
            alt="Primer popunjene uplatnice"
            width={1400}
            height={900}
            className="w-full rounded-xl ring-1 ring-white/10"
            priority
          />
          <p className="mt-2 text-center text-xs text-white/40">
            Popuni po ovom uzoru — iznos, primalac, svrha uplate
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-white/10 bg-[#12171E]/80 p-6 shadow-xl">
          <h2 className="mb-5 text-lg font-bold">Pošalji sliku uplatnice</h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-white/80">
                Ime i prezime
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marko Marković"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F13] px-4 py-3 text-sm text-white placeholder-white/30 outline-none ring-amber-400/60 transition focus:border-amber-400/60 focus:ring-2 disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marko@gmail.com"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F13] px-4 py-3 text-sm text-white placeholder-white/30 outline-none ring-amber-400/60 transition focus:border-amber-400/60 focus:ring-2 disabled:opacity-50"
              />
            </div>

            {/* File upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">
                Priloži sliku uplatnice
              </label>

              {!preview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-[#0B0F13] py-8 text-sm text-white/50 transition hover:border-amber-400/40 hover:text-white/70 disabled:pointer-events-none disabled:opacity-50"
                >
                  <Upload className="h-6 w-6" />
                  <span>Klikni da odabereš sliku</span>
                  <span className="text-xs text-white/30">JPG, PNG, HEIC — max 10 MB</span>
                </button>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Pregled uplatnice"
                    className="w-full object-contain max-h-64"
                  />
                  <button
                    type="button"
                    onClick={clearFile}
                    disabled={loading}
                    aria-label="Ukloni sliku"
                    className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white/80 transition hover:bg-black hover:text-white disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="bg-[#0B0F13]/90 px-3 py-2 text-xs text-white/50">
                    {file?.name}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
                disabled={loading}
                aria-hidden="true"
                tabIndex={-1}
              />
            </div>

            {/* Error */}
            {error && (
              <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-4 text-base font-bold text-[#0B0F13] shadow-lg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Šalje se…
                </span>
              ) : (
                "Pošalji uplatnicu"
              )}
            </button>

            {/* Trust line */}
            <p className="text-center text-xs text-white/40">
              Pristup dobijate u roku od 30 minuta od verifikacije
            </p>

          </form>
        </div>
      </div>
    </section>
  );
}
