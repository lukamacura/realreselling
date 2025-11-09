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

/**
 * Napomena:
 * - `keepalive` NIKAD za FormData (iOS/Chrome limit ~64KB).
 * - Vraćamo uvek `Response` (UI može da proveri .ok / .status / .text()).
 */
export async function postRRSWebhook(payload: BasePayload | FormData): Promise<Response> {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
  const isServer = typeof window === "undefined";

  const base = isServer
    ? (process.env.NEXT_PUBLIC_BASE_URL
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"))
    : "";

  try {
    const res = await fetch(`${base}/api/leads`, {
      method: "POST",
      headers: isFormData ? undefined : { "content-type": "application/json" },
      body: isFormData ? payload : JSON.stringify(payload),
      // ✅ keepalive koristimo SAMO za male JSON pingove, nikad za FormData
      ...(isServer ? {} : (!isFormData ? { keepalive: true } : {})),
      // opciono: credentials: "same-origin",
    });

    if (!res.ok) {
      console.warn("[RRS] /api/leads status:", res.status);
    }
    return res;
  } catch (e) {
    console.warn("[RRS] proxy error", e);
    return new Response("proxy error", { status: 499 });
  }
}
