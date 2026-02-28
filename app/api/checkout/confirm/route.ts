// app/api/checkout/confirm/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function sendMetaCAPIEvent({
  sessionId,
  email,
  phone,
}: {
  sessionId: string;
  email: string;
  phone?: string | null;
}): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) return;

  const hash = (val: string) =>
    createHash("sha256").update(val).digest("hex");

  const normalizedEmail = email.toLowerCase().trim();
  const hashedEmail = hash(normalizedEmail);
  const externalId = hash(normalizedEmail);

  let hashedPhone: string | undefined;
  if (phone) {
    let digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) digits = "381" + digits.slice(1);
    if (digits.length >= 9) hashedPhone = hash(digits);
  }

  const userData: Record<string, string> = {
    em: hashedEmail,
    external_id: externalId,
  };
  if (hashedPhone) userData.ph = hashedPhone;

  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: sessionId,
        action_source: "website",
        user_data: userData,
        custom_data: {
          value: 50,
          currency: "EUR",
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Meta CAPI responded ${res.status}: ${text}`);
  }
}

export async function POST(req: Request) {
  try {
    const { session_id } = await req.json();
    if (!session_id) {
      return NextResponse.json({ error: "session_id missing" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Minimalna verifikacija
    const paid = session.payment_status === "paid";
    const email = session.customer_email || session.customer_details?.email || null;
    const name = session.customer_details?.name || null;
    const price = (session.amount_total ?? 0) / 100;

    if (!paid || !email) {
      // vrati OK da strana ne puca, ali ne šalji event
      return NextResponse.json({ ok: true, paid, emailFound: !!email });
    }

    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    // Pošalji u tvoj postojeći proxy /api/leads (koji dalje šalje n8n-u)
    const payload = {
      event: "purchase_completed",
      email,
      name,
      price,
      method: "kartica",
      status: "success",
      orderId: session.id,
      source: session.metadata?.source || "checkout",
      ts: new Date().toISOString(),
    };

    const res = await fetch(`${base}/api/leads`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.warn("[confirm] /api/leads failed:", res.status, txt);
      return NextResponse.json({ error: "leads failed" }, { status: 502 });
    }

    // Meta CAPI — server-side Purchase event for card payments
    // event_id = session.id, matches what browser pixel sends on /success for deduplication
    try {
      const phone = session.metadata?.phone || null;
      await sendMetaCAPIEvent({ sessionId: session.id, email, phone });
    } catch (e: any) {
      console.error("[confirm] Meta CAPI error:", e?.message || e);
    }

    return NextResponse.json({ ok: true, forwarded: true });
  } catch (e: any) {
    console.error("[confirm] error", e?.message || e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
