import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function sha256Hex(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-rrs-token",
    },
  });
}

export async function POST(req: NextRequest) {
  const url = process.env.N8N_WEBHOOK_LEADS_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET ?? "";
  if (!url) return new NextResponse("N8N_WEBHOOK_LEADS_URL missing", { status: 500 });

  try {
    const bodyText = await req.text();
    const token = sha256Hex(bodyText + secret);

    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rrs-token": token,
      },
      body: bodyText,
      cache: "no-store",
    });

    const txt = await upstream.text();
    return new NextResponse(txt || "ok", {
      status: upstream.status,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (e) {
    console.error("[/api/leads] proxy error:", e);
    return new NextResponse("proxy error", { status: 500 });
  }
}
