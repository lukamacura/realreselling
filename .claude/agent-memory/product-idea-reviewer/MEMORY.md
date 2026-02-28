# Product Idea Reviewer - Persistent Memory

## Platform Overview
- **Product**: Real Reselling - Serbian reselling community/course
- **Price**: 39€ membership (shown as discounted from 50€)
- **Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Stripe, Meta Pixel, n8n webhooks
- **Base URL env**: NEXT_PUBLIC_BASE_URL
- **DB**: Supabase (available, not yet heavily used in payment flow)

## Existing Architecture (Payment Flow)
- `/postaniclan` — main sales page with swipe-to-buy UI triggering Stripe checkout
- `/api/checkout/story` — Stripe checkout session creation (story funnel, 39€)
- `/api/checkout/route.ts` — older checkout route (50€/45€ with POPUST code)
- `/api/checkout/confirm` — verifies Stripe session_id, fires n8n webhook on success
- `/api/leads` — proxy to n8n webhook (HMAC-signed with sha256)
- `/success` — fires Meta Pixel `trackCustom("Closed - kupio karticom")` after confirm
- `/uplatnica` — already built: shows bank slip image + WhatsApp/Instagram links to send proof
- `/uplatnica/success` — static confirmation page (no pixel, no automation)
- `lib/pixel.ts` — async pixel wrapper (initPixel, track, trackCustom)

## Key Architectural Patterns
- Pixel fires CLIENT-SIDE on success pages, NOT server-side
- Payment verification goes through `/api/checkout/confirm` -> `/api/leads` -> n8n
- n8n webhook handles downstream fulfillment (email, access grant)
- Discount code logic: "POPUST" code, validated server-side
- Icons: Lucide React exclusively
- Components: Client Components for interactive UI, Server Components for static
- Lead payload shape: { event, email, name, price, method, status, orderId, source, ts }

## Ideas Reviewed

### Uplatnica Form + Admin Approval Flow (2026-02-27)
- **Verdict**: BUILD IT Phase 1 only — client-side pixel on token-gated success page, NOT Meta Conversions API
- **Reasoning**: See `ideas/uplatnica-verification.md` for full architecture and file list
- **Key insight**: /uplatnica is instruction-only (no form). Must be fully rewritten.
- **The real gap**: No pixel for uplatnica buyers (dark to Meta), no automation, all manual
- **Market fit**: HIGH — Serbian market strongly prefers bank transfer, especially 30+ demographic
- **Architecture decision**: Pre-signed URL upload (browser to Supabase direct), admin approves via email link, pixel fires on token-gated /uplatnica/approved page
- **Blocker found**: Price inconsistency — /uplatnica showed 50€/45€, /postaniclan shows 39€. Must resolve before building form.
- **New env vars needed**: SUPABASE_SERVICE_ROLE_KEY, ADMIN_WEBHOOK_SECRET
