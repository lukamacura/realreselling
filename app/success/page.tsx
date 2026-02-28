// app/success/page.tsx
"use client";

import { useEffect } from "react";
import { PackageCheck } from "lucide-react";
import { track, trackCustom } from "@/lib/pixel";

const FIXED_PRICE = 50; // paritet sa uplatnicom

export default function SuccessPage() {
  useEffect(() => {
    const sid = new URLSearchParams(window.location.search).get("session_id");
    if (!sid) return;

    (async () => {
      try {
        // Fire-and-forget ponašanje ostaje, ali sačekamo odgovor da znamo da je potvrđeno
        const res = await fetch("/api/checkout/confirm", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ session_id: sid }),
          keepalive: true,
        });

        // Ako tvoj API vraća { ok: true } — uzmi to u obzir; u suprotnom, koristi res.ok
        let ok = res.ok;
        try {
          const data = await res.json();
          if (typeof data?.ok === "boolean") ok = data.ok;
        } catch {
          // ako nema JSON-a, samo ostavi ok = res.ok
        }

        if (!ok) return;

        // ✅ Standard Purchase event — isti pattern kao uplatnica, eventID za dedup
        track("Purchase", { value: FIXED_PRICE, currency: "EUR", eventID: sid });
        trackCustom("Closed - kupio karticom", {
          value: FIXED_PRICE,
          currency: "EUR",
          method: "kartica",
          eventID: sid,
        });
      } catch {
        // tiho — ne rušimo UX na success stranici
      }
    })();
  }, []);

  return (
    <main className="container mx-auto max-w-lg h-screen px-4 py-12 text-center flex flex-col justify-center items-center">
      <PackageCheck className="h-12 w-12 mb-6 text-emerald-400" />
      <h1 className="text-3xl font-bold text-white mb-1">Uspešna kupovina!</h1>
      <p className="text-white/80 max-w-md">
        Hvala ti na poverenju! Uskoro ćeš primiti email sa daljim instrukcijama.
      </p>
    </main>
  );
}
