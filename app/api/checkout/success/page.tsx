// app/success/page.tsx
"use client";

import { useEffect } from "react";
import { PackageCheck } from "lucide-react";

export default function SuccessPage() {
  useEffect(() => {
    const sid = new URLSearchParams(window.location.search).get("session_id");
    if (!sid) return;

    // Fire-and-forget; keepalive pomaže ako user brzo navigira dalje
    fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ session_id: sid }),
      keepalive: true,
    }).catch(() => {});
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
