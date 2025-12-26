// app/api/checkout/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const BASE_AMOUNT_EUR = 5000;   // 50€
const DISCOUNT_AMOUNT_EUR = 4500; // 45€
const BOZIC_AMOUNT_EUR = 3900; // 39€
const COUPON_CODE = "POPUST";   // validan kod
const BOZIC_CODE = "BOZIC";     // Božićni kod

export async function POST(req: Request) {
  const { email, code, codeApplied } = await req.json();

  const norm = (v?: string) => (v ? String(v).trim().toUpperCase() : "");

  // Provera za Božićni kod ili standardni kupon
  const isBozic = !!codeApplied && norm(code) === BOZIC_CODE;
  const isStandardCoupon = !!codeApplied && norm(code) === COUPON_CODE;

  let unitAmount = BASE_AMOUNT_EUR;
  if (isBozic) {
    unitAmount = BOZIC_AMOUNT_EUR;
  } else if (isStandardCoupon) {
    unitAmount = DISCOUNT_AMOUNT_EUR;
  }

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
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        method: "kartica",
        code: norm(code),
        codeApplied: String(!!codeApplied),
        unitAmount: String(unitAmount),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
