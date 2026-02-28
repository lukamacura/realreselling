"use client";

import { useEffect, useState } from "react";
import { PackageCheck, AlertCircle, Loader2 } from "lucide-react";
import { track, trackCustom } from "@/lib/pixel";

type State = "loading" | "valid" | "invalid";

export default function ApprovedPage() {
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setState("invalid");
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `/api/uplatnica/validate-token?token=${encodeURIComponent(token)}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          setState("invalid");
          return;
        }

        const data: { valid: boolean; submissionId?: string } = await res.json();

        if (!data.valid) {
          setState("invalid");
          return;
        }

        // Token valid — fire conversion pixels.
        // submissionId matches the event_id sent via CAPI at approval time so
        // Meta deduplicates and counts the purchase only once even if both
        // paths fire (same-browser user AND server-side CAPI).
        const eventId = data.submissionId;

        // Standard Purchase event — what Meta's algorithm optimises on.
        // event_id deduplicates against the CAPI call made server-side.
        await track("Purchase", {
          value: 39,
          currency: "EUR",
          eventID: eventId,
        });

        // Custom event — preserved for internal reporting in Events Manager.
        await trackCustom("Closed - kupio uplatnicom", {
          value: 39,
          currency: "EUR",
          method: "uplatnica",
          eventID: eventId,
        });

        setState("valid");
      } catch {
        setState("invalid");
      }
    })();
  }, []);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#0B0F13] px-4 py-16 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12171E]/80 p-8 text-center shadow-xl">

        {state === "loading" && (
          <>
            <Loader2 className="mx-auto mb-5 h-14 w-14 animate-spin text-amber-400" strokeWidth={1.5} />
            <h1 className="text-xl font-bold text-white/80">Proveravamo pristup…</h1>
          </>
        )}

        {state === "valid" && (
          <>
            <PackageCheck className="mx-auto mb-5 h-14 w-14 text-emerald-400" strokeWidth={1.5} />
            <h1 className="text-2xl font-extrabold">Pristup odobren!</h1>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Dobili ste pristup{" "}
              <span className="font-semibold text-white">Real Reselling</span> programu.
              Proverite email za dalja uputstva.
            </p>
          </>
        )}

        {state === "invalid" && (
          <>
            <AlertCircle className="mx-auto mb-5 h-14 w-14 text-red-400" strokeWidth={1.5} />
            <h1 className="text-2xl font-extrabold">Link je nevažeći</h1>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Ovaj link je nevažeći ili je već iskorišćen. Ako mislite da je došlo do greške,
              kontaktirajte nas na Instagram{" "}
              <a
                href="https://instagram.com/rrealreselling"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-amber-400 underline underline-offset-2 hover:text-amber-300"
              >
                @rrealreselling
              </a>
              .
            </p>
          </>
        )}

      </div>
    </main>
  );
}
