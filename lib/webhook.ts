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
    const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
    const isServer = typeof window === "undefined";

    const base = isServer
      ? (process.env.NEXT_PUBLIC_BASE_URL
          || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"))
      : "";

    const res = await fetch(`${base}/api/leads`, {
      method: "POST",
      headers: isFormData ? undefined : { "content-type": "application/json" },
      body: isFormData ? payload : JSON.stringify(payload),
      ...(isServer ? {} : { keepalive: true }),
    });

    if (!res.ok) console.warn("[RRS] /api/leads status:", res.status);
  } catch (e) {
    console.warn("[RRS] proxy error", e);
  }
}
