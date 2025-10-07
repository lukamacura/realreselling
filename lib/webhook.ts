// lib/webhook.ts
export type RRSEvent =
  | "lead_checkout_started"
  | "purchase_completed"
  | "purchase_abandoned"
  | "bank_transfer_proof_submitted";

export type BasePayload = {
  event: RRSEvent;
  email?: string;
  name?: string;
  price?: number;
  code?: string;
  method?: "uplatnica" | "kartica";
  orderId?: string;
  status?: "success" | "error" | "canceled";
  reason?: string;
  ts?: string;
  utm?: Record<string, string | null | undefined>;
  proof?: { filename?: string; size?: number; type?: string };
};

export async function postRRSWebhook(payload: BasePayload | FormData) {
  try {
    const isFD = typeof FormData !== "undefined" && payload instanceof FormData;
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: isFD ? undefined : { "content-type": "application/json" }, // ⚠️
      body: isFD ? payload : JSON.stringify(payload),
      keepalive: true,
    });
    if (!res.ok) console.warn("[RRS] /api/leads status:", res.status);
  } catch (e) {
    console.warn("[RRS] proxy error", e);
  }
}
