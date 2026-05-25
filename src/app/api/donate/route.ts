import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL;

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    if (!amount || typeof amount !== 'number' || amount < 1) {
      return NextResponse.json({ error: 'Invalid donation amount' }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in your environment variables.' },
        { status: 500 },
      );
    }

    const origin = DOMAIN || new URL(request.url).origin;
    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation to ZakahNisab',
              description: 'Support the ZakahNisab project',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate/cancel`,
      metadata: {
        source: 'zakahnisab_donation',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[DONATE API]', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
