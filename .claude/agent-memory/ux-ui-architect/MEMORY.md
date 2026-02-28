# UX/UI Architect — Project Memory

## Project: Real Reselling
Dark-theme NextJS 14 App Router marketing/checkout site.

## Design Tokens (verified)
- Page bg: `bg-[#0B0F13]`
- Card bg: `bg-[#12171E]/80`
- Inner bg: `bg-[#0E1319]` or `bg-[#0B0F13]`
- Card border: `border border-white/10`, `rounded-2xl`
- Accent: `text-amber-400`, `text-amber-300`, gradient `from-amber-500 to-amber-400`
- Body text muted: `text-white/70`, `text-white/60`, `text-white/40`
- Success color: `text-emerald-400`
- Error color: `text-red-400`
- Input focus ring: `ring-amber-400/60 focus:ring-2 focus:border-amber-400/60`

## Font families (tailwind.config.ts)
- `font-sans` → Inter (`var(--font-inter)`)
- `font-display` → Bebas (`var(--font-bebas)`)

## Component conventions
- `SnowCanvas` from `@/components/SnowCanvas` — decorative background, `pointer-events-none absolute inset-0 z-0 opacity-80`
- Pixel tracking: `trackCustom(eventName, params)` from `@/lib/pixel` — async, fire-and-forget
- Supabase server-side: `supabase` from `@/lib/supabase` (service role, never client-side)

## Page patterns
- Pages with `useSearchParams()` must wrap inner component in `<Suspense>` — see `/app/uplatnica/page.tsx`
- `export const dynamic = "force-dynamic"` on pages that read URL params
- All client pages: `"use client"` at top

## API route conventions
- Always add `export const runtime = "nodejs"` and `export const dynamic = "force-dynamic"`
- n8n calls are fire-and-forget with `AbortSignal.timeout(8000)` — never block user response
- Return `NextResponse.json({ error: msg }, { status })` for errors
- Admin HTML responses use plain `new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })`

## Uplatnica flow (implemented 2026-02-27)
- `/app/uplatnica/page.tsx` — intake form (name, email, image upload with preview)
- `/app/uplatnica/pending/page.tsx` — post-submit confirmation
- `/app/uplatnica/approved/page.tsx` — token-validated success, fires pixel
- `/app/api/uplatnica/submit/route.ts` — multipart, uploads to Supabase Storage bucket `uplatnice`, inserts to `uplatnica_submissions`, notifies admin n8n
- `/app/api/uplatnica/approve/route.ts` — admin GET link, updates status, fires buyer n8n email, fires Meta CAPI
- `/app/api/uplatnica/validate-token/route.ts` — token lookup, always 200, returns `{ valid, submissionId }`

## Meta tracking (implemented 2026-02-28)
- Browser pixel: `@/lib/pixel.ts` — client-only, uses `react-facebook-pixel`
- CAPI: inline `sendMetaCAPIEvent` in approve route — server-side, SHA-256 hashed email, `action_source: "email"`
- Dedup strategy: `event_id = row.id` (submission UUID) used in CAPI and as `eventID` in browser pixel
- Approved page fires TWO browser events: `track("Purchase", { eventID })` for Meta algo + `trackCustom("Closed - kupio uplatnicom", { eventID })` for internal reporting
- If `FACEBOOK_CAPI_ACCESS_TOKEN` env var missing, CAPI silently skips (same pattern as n8n webhooks)

## Env vars in use
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — server-only
- `NEXT_PUBLIC_BASE_URL` — base URL for approve/access links
- `N8N_WEBHOOK_UPLATNICA_URL` — new webhook for uplatnica events
- `N8N_WEBHOOK_LEADS_URL`, `N8N_WEBHOOK_SECRET` — existing leads webhook
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` — pixel ID, also used server-side in CAPI helper
- `FACEBOOK_CAPI_ACCESS_TOKEN` — server-only, Meta Conversions API system user token

## Detailed patterns
See `patterns.md` for file-by-file notes.
