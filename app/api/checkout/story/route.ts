// app/api/checkout/story/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const STORY_PRICE_EUR = 3900; // 39€

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Real Reselling program - Specijalna ponuda",
              description:
                "Kompletna edukacija, pristup zajednici, copy-paste šabloni i doživotna podrška. Garancija povrata novca ako ne napraviš prvu prodaju za 30 dana.",
              images: ["https://realreselling.com/hero.png"],
            },
            unit_amount: STORY_PRICE_EUR,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/postaniclan`,
      metadata: {
        method: "kartica",
        source: "story_page",
        unitAmount: String(STORY_PRICE_EUR),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
