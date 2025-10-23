// app/api/checkout/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const UNIT_AMOUNT_EUR = 5000; // 50€ u centima

export async function POST(req: Request) {
  const { email, code } = await req.json(); // price IGNORIŠEMO

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Real Reselling program - specijalna cena",
              description:
                "Dobijaš proizvode, uputstva i “copy-paste” šablone da napraviš prvu prodaju za 30 dana, a ako ne uspeš VRATIĆEMO TI NOVAC.",
              images: ["https://realreselling.com/hero.png"],
            },
            unit_amount: UNIT_AMOUNT_EUR,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        method: "kartica",
        code: code ?? "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
