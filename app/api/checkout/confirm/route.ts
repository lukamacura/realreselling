// app/api/checkout/confirm/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      price,
      method: "kartica",
      status: "success",
      orderId: session.id,
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

    return NextResponse.json({ ok: true, forwarded: true });
  } catch (e: any) {
    console.error("[confirm] error", e?.message || e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
