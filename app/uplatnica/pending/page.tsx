"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PendingPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#0B0F13] px-4 py-16 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12171E]/80 p-8 text-center shadow-xl">

        <CheckCircle className="mx-auto mb-5 h-14 w-14 text-emerald-400" strokeWidth={1.5} />

        <h1 className="text-2xl font-extrabold">
          Uplatnica primljena!
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-white/70">
          Proveravamo vašu uplatu. Pristup ćete dobiti u roku od{" "}
          <span className="font-semibold text-white">30 minuta</span> — poslaćemo vam email
          sa uputstvima.
        </p>

        <div className="mt-6 rounded-xl border border-white/8 bg-[#0B0F13]/60 px-4 py-3">
          <p className="text-xs text-white/40">
            Ako ne dobijete email za 1 sat, kontaktirajte nas na Instagram{" "}
            <Link
              href="https://instagram.com/rrealreselling"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              @rrealreselling
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
