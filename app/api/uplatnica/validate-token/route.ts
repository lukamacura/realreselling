import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.json({ valid: false });
  }

  const { data, error } = await supabase
    .from("uplatnica_submissions")
    .select("id, status")
    .eq("access_token", token)
    .eq("status", "approved")
    .single();

  if (error || !data) {
    // Always 200 — let client decide what to show
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true });
}
