import { NextResponse } from "next/server";

type QuizPayload = {
  age: string;
  goal: string;
  mentor: string;
  code?: string;
  priceBefore?: number;
  priceAfter?: number;
  source?: string;
};

function err(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== "object") return err("Neispravan payload", 400);

    const p = body as QuizPayload;
    if (!p.age || !p.goal || !p.mentor) return err("Nedostaju odgovori", 400);
    if (!process.env.N8N_QUIZ_WEBHOOK_URL) return err("N8N_QUIZ_WEBHOOK_URL nije setovan", 500);

    const res = await fetch(process.env.N8N_QUIZ_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET || "",
      },
      body: JSON.stringify({
        ...p,
        createdAt: new Date().toISOString(),
      }),
      cache: "no-store",
    });

    if (!res.ok) return err(`n8n error: ${await res.text()}`, 502);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return err(msg || "Greška", 500);
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, info: "Quiz endpoint alive" });
}
