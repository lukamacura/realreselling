"use client";

import { useEffect, useRef, useState } from "react";
import { loadScript, type PayPalNamespace, type PayPalScriptOptions } from "@paypal/paypal-js";

export default function PPTest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paypal, setPaypal] = useState<PayPalNamespace | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const opts: PayPalScriptOptions = {
  clientId: "sb",
  currency: "EUR",
  intent: "capture",   // << umesto "CAPTURE"
  components: "buttons",
};


    loadScript(opts)
      .then((pp) => {
        if (!pp || !pp.Buttons) {
          setErr("PayPal SDK učitan ali Buttons API nije dostupan (CSP/adblock?).");
          return;
        }
        setPaypal(pp);
        setLoaded(true);
        if (containerRef.current) {
          pp.Buttons({}).render(containerRef.current);
        } else {
          setErr("Nema containerRef za render.");
        }
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : String(e);
        setErr("SDK load failed (CSP/adblock/mreža?): " + msg);
      });
  }, []);

  return (
    <div style={{ padding: 24, color: "white", background: "#0B0F13", minHeight: "100vh" }}>
      <h1>PayPal SDK test</h1>
      <div ref={containerRef} style={{ marginTop: 16 }} />
      <pre style={{ marginTop: 16, fontSize: 12, opacity: 0.8 }}>
        loaded: {String(loaded)} | has paypal: {String(Boolean(paypal))}
      </pre>
      {err && <div style={{ marginTop: 16, color: "#fca5a5" }}>Greška: {err}</div>}
    </div>
  );
}
