import { NextResponse } from "next/server";

type LeadPayload = { name: string; phone: string };

function err(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET() {
  // Health check pomaže da uvek dobiješ JSON, ne HTML
  return NextResponse.json({
    ok: true,
    info: "Lead endpoint is alive. Use POST.",
    hasUrl: Boolean(process.env.N8N_WEBHOOK_MEET),
  });
}

export async function POST(req: Request) {
  try {
    // 1) Validacija payload-a bez any
    const body: unknown = await req.json();
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

    // 2) Guard za env varijable (sprečava HTML error strane)
    if (!process.env.N8N_WEBHOOK_MEET) return err("N8N_WEBHOOK_MEET nije setovan", 500);

    // 3) Slanje ka n8n webhook-u
    const res = await fetch(process.env.N8N_WEBHOOK_MEET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET || "",
      },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        source: "meet-page",
        createdAt: new Date().toISOString(),
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return err(`n8n error: ${text}`, 502);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return err(msg || "Greška", 500);
  }
}