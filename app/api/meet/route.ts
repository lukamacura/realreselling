// app/api/meet/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";          // stabilniji env za libs i env varijable
export const dynamic = "force-dynamic";   // bez keširanja ove rute
export const revalidate = 0;

type LeadPayload = { name: string; phone: string };

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers || {});
  // Spreči CDN/browser keširanje API odgovora
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  headers.set("Content-Type", "application/json; charset=utf-8");
  return NextResponse.json(data, { ...init, headers });
}
function err(message: string, status = 400) {
  return json({ ok: false, error: message }, { status });
}

export async function GET() {
  // Health-check: uvek JSON (nema HTML error stranica)
  return json({
    ok: true,
    info: "Lead endpoint is alive. Use POST.",
    hasUrl: Boolean(process.env.N8N_WEBHOOK_MEET),
    ts: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  try {
    // 1) Bezbedno parsiranje body-ja
    let body: unknown = null;
    try {
      body = await req.json();
    } catch {
      return err("Body mora biti validan JSON", 400);
    }

    if (
      !body ||
      typeof body !== "object" ||
      typeof (body as Record<string, unknown>).name !== "string" ||
      typeof (body as Record<string, unknown>).phone !== "string"
    ) {
      return err("Neispravan payload", 400);
    }

    const { name, phone } = body as LeadPayload;

    // 2) Validacija inputa
    if (name.trim().length < 2) return err("Ime je prekratko", 400);
    if (phone.replace(/\D/g, "").length < 7) return err("Telefon je neispravan", 400);

    // 3) Provera env varijabli
    const n8nUrl = process.env.N8N_WEBHOOK_MEET;
    if (!n8nUrl) return err("N8N_WEBHOOK_MEET nije setovan", 500);

    // (opciono) validacija URL-a
    try {
      new URL(n8nUrl);
    } catch {
      return err("N8N_WEBHOOK_MEET je nevažeći URL", 500);
    }

    // 4) Poziv ka n8n sa timeout-om i retry backoff-om (za 5xx/429 i mrežne greške)
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      source: "meet-page",
      createdAt: new Date().toISOString(),
    };

    const maxAttempts = 3;                // ukupno 3 pokušaja
    const baseDelayMs = 250;              // exponential backoff sa jitter-om
    const timeoutMs = 8000;               // timeout po pokušaju

    let lastError: string | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const upstream = await fetch(n8nUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET || "",
          },
          body: JSON.stringify(payload),
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        // 4a) Ako je 2xx — gotovo
        if (upstream.ok) {
          return json({ ok: true });
        }

        // 4b) Ako je 4xx (osim 429), nema smisla retry — vrati grešku
        if (upstream.status >= 400 && upstream.status < 500 && upstream.status !== 429) {
          const txt = await upstream.text().catch(() => "");
          return err(`n8n error: ${upstream.status} ${txt?.slice(0, 200)}`, 502);
        }

        // 4c) Za 5xx/429 — probaj opet (sa backoff-om)
        lastError = `Upstream status ${upstream.status}`;
      } catch (e) {
        // mrežne greške / timeout (AbortError)
        lastError = e instanceof Error ? e.message : String(e);
      }

      if (attempt < maxAttempts) {
        const jitter = Math.floor(Math.random() * 120);
        const delay = baseDelayMs * 2 ** (attempt - 1) + jitter; // 250, ~500, ~1000ms
        await new Promise((r) => setTimeout(r, delay));
      }
    }

    // Ako smo iscrpeli pokušaje
    return err(`Upstream nedostupan: ${lastError || "nepoznata greška"}`, 502);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return err(msg || "Greška", 500);
  }
}
