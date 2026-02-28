# Idea: Uplatnica Form + Admin Approval Flow

**Date**: 2026-02-27
**Status**: Full implementation plan written — BUILD IT (Phase 1 only)

## What Already Exists
- `/uplatnica/page.tsx` - shows bank slip image + WhatsApp/Instagram buttons (instruction-only, NO form)
- `/uplatnica/success/page.tsx` - static "we'll verify and email you" page
- Current flow is fully manual: user screenshots slip, sends via social media, admin manually grants access

## The Real Problem (Not What Was Asked)
The user framed this as "fraud prevention via AI." The actual problem is:
1. No pixel fires for uplatnica payments (Meta can't optimize for these buyers)
2. No automation (admin manually processes each uplatnica)
3. The current flow leaks revenue attribution entirely

## Key Architecture Decision
**DO NOT build Meta Conversions API.** Instead, after admin approval, redirect buyer to
a token-gated `/uplatnica/approved?token=ONE_TIME_TOKEN` page that fires the existing
client-side `trackCustom` pixel. This reuses existing pixel infrastructure and ships faster.

## Definitive Flow (Phase 1)

```
User fills form (/uplatnica, rewritten)
  → Browser uploads image via pre-signed Supabase Storage URL
  → POST /api/uplatnica/submit { name, email, price, imagePath, submissionId, discountCode? }
    → Insert row into uplatnica_submissions (status: "pending")
    → POST /api/leads with event: "uplatnica_submitted" (n8n notified)
    → n8n sends admin email/Telegram with: name, email, price, image signed URL, approval link
  → User redirected to /uplatnica/pending

Admin clicks approval link in email:
  GET /api/uplatnica/approve?id=ROW_ID&secret=ADMIN_SECRET
    → Validates secret, checks row is "pending"
    → Updates row: status="approved", generates approval_token
    → POST /api/leads with event: "purchase_completed", method: "uplatnica"
    → Returns 302 redirect to /uplatnica/approved?token=TOKEN

/uplatnica/approved page (Client Component):
  → GET /api/uplatnica/validate-token?token=TOKEN
  → Marks token_used=true in DB
  → Fires trackCustom("Closed - platio uplatnicom", { value: 39, currency: "EUR", method: "uplatnica" })
  → Shows success UI matching /success page
```

## Files to Create

```
app/uplatnica/page.tsx                          ← FULL REWRITE (form)
app/uplatnica/pending/page.tsx                  ← NEW (static holding page)
app/uplatnica/approved/page.tsx                 ← NEW (pixel-firing success, Client Component)
app/api/uplatnica/upload-url/route.ts           ← NEW (pre-signed upload URL)
app/api/uplatnica/submit/route.ts               ← NEW (form metadata submission)
app/api/uplatnica/approve/route.ts              ← NEW (admin approval, secret-gated GET)
app/api/uplatnica/validate-token/route.ts       ← NEW (marks token used, returns buyer name)
```

## Supabase Table

```sql
create table uplatnica_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  price numeric not null,
  discount_code text,
  image_path text not null,
  status text not null default 'pending', -- pending | approved | rejected
  approval_token text unique,
  token_used boolean default false,
  n8n_notified boolean default false,
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

create unique index uplatnica_email_pending_idx
  on uplatnica_submissions (email)
  where status = 'pending';
```

## Supabase Storage

- Bucket: `uplatnica-slips` (PRIVATE, no public access)
- Path: `{submission_id}/{timestamp}.jpg`
- Admin gets signed URL (30-min expiry) via n8n notification payload
- Never expose raw storage URL to client

## New Env Vars Required

- `SUPABASE_SERVICE_ROLE_KEY` — server-side only, for Storage + DB writes
- `ADMIN_WEBHOOK_SECRET` — secret used to validate approve endpoint calls

## Critical Gaps Found in User's Proposed Flow

1. No defined mechanism for admin to trigger approval (resolved: click link in email)
2. Meta Conversions API was proposed but is overkill — use client pixel on token-gated page
3. Duplicate pixel event risk if both server + client fire (resolved: client-only approach eliminates this)
4. Image upload must go direct from browser to Supabase via pre-signed URL, NOT through Next.js serverless (Vercel 4.5MB body limit)
5. No idempotency — resolved by unique index on (email) where status='pending'
6. PRICE INCONSISTENCY: /uplatnica showed 50€/45€ but /postaniclan shows 39€ — must reconcile before building form

## OpenAI Vision (Phase 2 — Optional, Build Later)

Add inside `/api/uplatnica/submit/route.ts` after upload, before DB insert:
- high confidence valid → proceed normally
- high confidence invalid → return 400 with user-friendly Serbian error message
- uncertain → insert row with `needs_review: true`, route to manual queue

DO NOT build Phase 2 until Phase 1 runs in production for 2-3 weeks and you understand
actual fraud volume. At 39€ price point, sophisticated fraud is unlikely.

## Risk Register

- Image forgery: LOW risk at 39€ price point
- False positives from Vision AI: MEDIUM — could reject valid payments (Phase 2 only)
- Admin approval on mobile: HIGH priority UX — approval link must work in one tap
- Mobile upload on bad connection: HIGH priority — implement clear retry messaging
- GDPR: Storing user images requires privacy policy mention of image processing
- Meta pixel timing: Fire ONLY on validated token load, never on form submit
- Price inconsistency (50€ vs 39€): Must resolve before building form

## Effort Estimate
Phase 1: Medium — 5 to 7 days
Phase 2 (Vision): Additional 2-3 days once Phase 1 is live
