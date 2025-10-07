// app/api/leads/route.ts
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
    const ct = req.headers.get("content-type") ?? "";

    // ====== A) MULTIPART (sa fajlom) ======
    if (ct.includes("multipart/form-data")) {
      const inForm = await req.formData();

      // Rekreiramo FormData (sigurno prosleđivanje fajla i polja)
      const outForm = new FormData();
      for (const [k, v] of inForm.entries()) {
        if (v instanceof File) {
          outForm.append(k, v, v.name);
        } else {
          outForm.append(k, String(v));
        }
      }

      // Napravi token nad stabilnim stringom polja (bez binarnog sadržaja)
      // – uskladi verifikaciju u n8n-u da računa isto:
      const tokenPayload = JSON.stringify({
        event: inForm.get("event"),
        email: inForm.get("email"),
        name: inForm.get("name"),
        code: inForm.get("code"),
        price: inForm.get("price"),
        method: inForm.get("method"),
        ts: inForm.get("ts"),
        proof: inForm.get("proof") instanceof File
          ? { filename: (inForm.get("proof") as File).name, size: (inForm.get("proof") as File).size, type: (inForm.get("proof") as File).type }
          : undefined,
      });
      const token = sha256Hex(tokenPayload + secret);

      const upstream = await fetch(url, {
        method: "POST",
        body: outForm,                   // ⚠️ ne postavljati content-type ručno
        headers: { "x-rrs-token": token }
      });

      const txt = await upstream.text();
      return new NextResponse(txt || "ok", {
        status: upstream.status,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    // ====== B) JSON (bez fajla) ======
    const bodyText = await req.text();          // raw body za stari način potpisivanja
    const token = sha256Hex(bodyText + secret);

    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rrs-token": token,
      },
      body: bodyText,
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
