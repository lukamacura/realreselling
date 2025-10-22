/* eslint-disable @typescript-eslint/no-unused-vars */
// app/success/page.tsx

"use client";
import { useEffect, useState } from "react";

import {
  PackageCheck
} from "lucide-react";

export default function SuccessPage() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("session_id");
    if (!sessionId) return;

    // Anti-duplikat (ako user refresha)
    const key = `rrs_confirmed_${sessionId}`;
    if (sessionStorage.getItem(key)) return;

    (async () => {
      try {
        const res = await fetch("/api/checkout/confirm", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        // Ignorišemo sadržaj; važno je da je pozvano
        setDone(true);
        sessionStorage.setItem(key, "1");
      } catch {
        // ne ruši UI, samo ne postavi flag
      }
    })();
  }, []);

  return (
    <main className="container mx-auto max-w-lg h-screen px-4 py-12 text-center flex flex-col justify-center items-center">
       <PackageCheck className="h-12 w-12 mb-6 text-emerald-400" />
      <h1 className="text-3xl font-bold text-white mb-1">Uspela kupovina!</h1>
      <p className="text-white/80 max-w-md">
        Hvala ti na poverenju! Uskoro ćeš primiti email sa daljim instrukcijama.{done ? "✅" : ""}
      </p>
     
    </main>
  );
}
