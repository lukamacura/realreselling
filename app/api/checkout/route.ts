// app/api/checkout/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { price, email } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
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
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      // ✅ dodaj session_id placeholder
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
