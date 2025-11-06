import { NextResponse } from "next/server";

type QuizPayload = {
  age: string;
  goal: string;
  phone: string;          // promenjeno
  code?: string;
  priceBefore?: number;
  priceAfter?: number;
  source?: string;
  // Back-compat polje ako stari klijent šalje "mentor"
  mentor?: string;
};

function err(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function isValidPhone(v: unknown) {
  if (typeof v !== "string") return false;
  const s = v.trim();
  if (!/^[+\d\s().-]{7,20}$/.test(s)) return false;
  const digits = s.replace(/\D/g, "");
  return digits.length >= 7;
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== "object") return err("Neispravan payload", 400);

    const p = body as QuizPayload;

    // Back-compat: dozvoli "mentor" polje i mapiraj na phone
    const phone = (p.phone || p.mentor || "").toString().trim();

    if (!p.age || !p.goal || !phone) return err("Nedostaju odgovori", 400);
    if (!isValidPhone(phone)) return err("Neispravan broj telefona", 400);

    if (!process.env.N8N_QUIZ_WEBHOOK_URL) return err("N8N_QUIZ_WEBHOOK_URL nije setovan", 500);

    const res = await fetch(process.env.N8N_QUIZ_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET || "",
      },
      body: JSON.stringify({
        ...p,
        phone,         // osiguraj normalizovano polje
        mentor: undefined, // ne šaljemo staro ime
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
