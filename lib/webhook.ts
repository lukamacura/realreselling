export type RRSEvent =
  | "lead_checkout_started"
  | "purchase_completed";

export type BasePayload = {
  event: RRSEvent;
  email?: string;
  name?: string;
  price?: number;
  code?: string;
  method?: "uplatnica" | "kartica";
  orderId?: string;
  status?: "success" | "error" | "canceled";
  ts?: string;
  utm?: Record<string, string | null | undefined>;
};

export async function postRRSWebhook(payload: BasePayload): Promise<Response> {
  const isServer = typeof window === "undefined";

  const base = isServer
    ? (process.env.NEXT_PUBLIC_BASE_URL
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"))
    : "";

  try {
    const res = await fetch(`${base}/api/leads`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      ...(isServer ? {} : { keepalive: true }),
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
