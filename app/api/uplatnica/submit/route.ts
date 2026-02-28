import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── helpers ────────────────────────────────────────────────────────────────

function err(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/gif": "gif",
    "image/avif": "avif",
  };
  return map[mime] ?? "jpg";
}

// ─── POST handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── 1. Parse multipart ──────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return err("Neispravan zahtev.", 400);
  }

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const imageFile = formData.get("image") as File | null;

  // ── 2. Validate ─────────────────────────────────────────────────────────
  if (!name) return err("Ime i prezime je obavezno.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return err("Email adresa nije ispravna.");
  if (!imageFile) return err("Slika uplatnice je obavezna.");
  if (!imageFile.type.startsWith("image/"))
    return err("Fajl mora biti slika (JPG, PNG, HEIC…).");
  if (imageFile.size > 10 * 1024 * 1024)
    return err("Slika ne sme biti veća od 10 MB.");

  // ── 3. Upload to Supabase Storage ────────────────────────────────────────
  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const ext = extFromMime(imageFile.type);
  const storagePath = `${Date.now()}-${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("uplatnice")
    .upload(storagePath, buffer, {
      contentType: imageFile.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[uplatnica/submit] storage upload error:", uploadError);
    return err("Greška pri čuvanju slike. Pokušajte ponovo.", 500);
  }

  // ── 4. Get public URL ────────────────────────────────────────────────────
  const { data: urlData } = supabase.storage
    .from("uplatnice")
    .getPublicUrl(storagePath);
  const imageUrl = urlData.publicUrl;

  // ── 5. Insert DB row ─────────────────────────────────────────────────────
  const approveSecret = randomUUID();

  const { data: row, error: insertError } = await supabase
    .from("uplatnica_submissions")
    .insert({
      name,
      email,
      image_url: imageUrl,
      status: "pending",
      approve_secret: approveSecret,
      access_token: null,
    })
    .select()
    .single();

  if (insertError || !row) {
    console.error("[uplatnica/submit] db insert error:", insertError);
    return err("Greška pri čuvanju podataka. Pokušajte ponovo.", 500);
  }

  // ── 6. Notify admin via n8n ──────────────────────────────────────────────
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://realreselling.com";
  const approveUrl = `${baseUrl}/api/uplatnica/approve?id=${row.id}&secret=${approveSecret}`;
  const webhookUrl = process.env.N8N_WEBHOOK_UPLATNICA_URL;

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          event: "uplatnica_submitted",
          id: row.id,
          name,
          email,
          image_url: imageUrl,
          approve_url: approveUrl,
          submitted_at: new Date().toISOString(),
        }),
        // fire-and-forget friendly — don't block user response
        signal: AbortSignal.timeout(8000),
      });
    } catch (e) {
      // Log but don't fail the user's request — admin can still see it in Supabase
      console.error("[uplatnica/submit] n8n notify error:", e);
    }
  } else {
    console.warn("[uplatnica/submit] N8N_WEBHOOK_UPLATNICA_URL not set — skipping admin notification");
  }

  // ── 7. Done ──────────────────────────────────────────────────────────────
  return NextResponse.json({ ok: true });
}
