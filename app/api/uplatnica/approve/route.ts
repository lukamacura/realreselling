import { NextRequest } from "next/server";
import { randomUUID, createHash } from "crypto";
import { supabase } from "@/lib/supabase";
import { postRRSWebhook } from "@/lib/webhook";

// ─── Meta CAPI helper ────────────────────────────────────────────────────────

interface MetaCAPIPayload {
  submissionId: string;
  email: string;
  phone?: string | null;
}

async function sendMetaCAPIEvent({
  submissionId,
  email,
  phone,
}: MetaCAPIPayload): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) return;

  const hash = (val: string) =>
    createHash("sha256").update(val).digest("hex");

  const normalizedEmail = email.toLowerCase().trim();
  const hashedEmail = hash(normalizedEmail);
  const externalId = hash(normalizedEmail); // consistent cross-session ID

  // Normalize phone to E.164 digits-only (no + sign, with country code)
  // Serbia example: "064 123 4567" → "381641234567", "+381641234567" → "381641234567"
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
        event_id: submissionId,
        action_source: "website",
        user_data: userData,
        custom_data: {
          value: 39,
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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── helpers ────────────────────────────────────────────────────────────────

function html(body: string, status = 200) {
  return new Response(
    `<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Uplatnica – Admin</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;background:#0B0F13;color:#fff;
         display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1.5rem}
    .card{background:#12171E;border:1px solid rgba(255,255,255,.1);border-radius:1.25rem;
          padding:2.5rem;max-width:440px;width:100%;text-align:center}
    h1{font-size:1.5rem;font-weight:800;margin-bottom:.75rem}
    p{color:rgba(255,255,255,.6);font-size:.9rem;line-height:1.6}
    .email{color:#fbbf24;font-weight:600}
  </style>
</head>
<body>
  <div class="card">${body}</div>
</body>
</html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

// ─── GET handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")?.trim();
  const secret = searchParams.get("secret")?.trim();

  if (!id || !secret) {
    return html(
      `<h1>&#10060; Link je nevažeći</h1>
       <p>Nedostaju obavezni parametri.</p>`,
      400
    );
  }

  // ── 1. Fetch row ─────────────────────────────────────────────────────────
  const { data: row, error: fetchError } = await supabase
    .from("uplatnica_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !row) {
    console.error("[uplatnica/approve] fetch error:", fetchError);
    return html(
      `<h1>&#10060; Link je nevažeći ili već iskorišćen</h1>
       <p>Nije pronađena prijava sa datim ID-em.</p>`,
      404
    );
  }

  // ── 2. Verify secret and status ──────────────────────────────────────────
  if (row.approve_secret !== secret) {
    return html(
      `<h1>&#10060; Link je nevažeći</h1>
       <p>Tajni ključ se ne podudara.</p>`,
      403
    );
  }

  if (row.status !== "pending") {
    return html(
      `<h1>&#9888;&#65039; Već obrađeno</h1>
       <p>Ova prijava je već odobrena ili odbijena (status: <strong>${row.status}</strong>).</p>`,
      409
    );
  }

  // ── 3. Generate access token and approve ──────────────────────────────────
  const accessToken = randomUUID();

  const { error: updateError } = await supabase
    .from("uplatnica_submissions")
    .update({ status: "approved", access_token: accessToken })
    .eq("id", id);

  if (updateError) {
    console.error("[uplatnica/approve] update error:", updateError);
    return html(
      `<h1>&#10060; Greška</h1>
       <p>Greška pri ažuriranju statusa. Pokušajte ponovo.</p>`,
      500
    );
  }

  // ── 4. Obavesti leads webhook o uspešnoj kupovini ────────────────────────
  try {
    await postRRSWebhook({
      event: "purchase_completed",
      email: row.email,
      name: row.name,
      price: 39,
      method: "uplatnica",
      status: "success",
      ts: new Date().toISOString(),
    });
  } catch (e) {
    console.error("[uplatnica/approve] leads webhook error:", e);
  }

  // ── 5. Meta CAPI — server-side purchase event ─────────────────────────────
  // Fired here so Meta receives the conversion even when the buyer opens the
  // access email link in a different browser (IAB → email client), where the
  // browser pixel would have no _fbp/_fbc cookies to match against.
  // event_id matches what the browser pixel sends on /uplatnica/approved so
  // Meta deduplicates and counts the purchase only once.
  try {
    await sendMetaCAPIEvent({ submissionId: id, email: row.email, phone: row.phone });
  } catch (e) {
    console.error("[uplatnica/approve] Meta CAPI error:", e);
  }

  // ── 6. Return success HTML ───────────────────────────────────────────────
  return html(
    `<h1>&#10003; Odobreno!</h1>
     <p style="margin-top:.5rem">Email je poslat kupcu<br>
     <span class="email">${row.email}</span></p>
     <p style="margin-top:1rem;font-size:.8rem;color:rgba(255,255,255,.35)">
       Kupac pristupa programu putem linka koji smo mu poslali na email.
     </p>`
  );
}
