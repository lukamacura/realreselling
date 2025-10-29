// app/api/meet/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type LeadPayload = { name: string; phone: string };

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  headers.set("Content-Type", "application/json; charset=utf-8");
  return NextResponse.json(data, { ...init, headers });
}
function err(message: string, status = 400) {
  return json({ ok: false, error: message }, { status });
}

export async function GET() {
  return json({
    ok: true,
    info: "Lead endpoint is alive. Use POST.",
    hasUrl: Boolean(process.env.N8N_WEBHOOK_MEET),
    ts: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  try {
    // 1) Bezbedno parsiranje
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
    if (name.trim().length < 2) return err("Ime je prekratko", 400);
    if (phone.replace(/\D/g, "").length < 7) return err("Telefon je neispravan", 400);

    // 2) Env
    const n8nUrl = process.env.N8N_WEBHOOK_MEET;
    if (!n8nUrl) return err("N8N_WEBHOOK_MEET nije setovan", 500);

    // 3) Jednostavan timeout (bez retry-a)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s

    const upstream = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // bez X-Webhook-Secret
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        source: "meet-page",
        createdAt: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: controller.signal,
    }).catch((e: unknown) => {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error("Upstream nedostupan: " + msg);
    });

    clearTimeout(timeout);

    if (!upstream.ok) {
      const txt = await upstream.text().catch(() => "");
      return err(`n8n error: ${upstream.status} ${txt?.slice(0, 200)}`, 502);
    }

    return json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return err(msg || "Greška", 500);
  }
}
