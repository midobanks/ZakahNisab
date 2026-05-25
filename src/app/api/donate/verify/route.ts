import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }

  const sessionId = request.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        verified: false,
        status: session.payment_status,
        error: 'Payment has not been completed',
      });
    }

    return NextResponse.json({
      verified: true,
      amount: (session.amount_total ?? 0) / 100,
      currency: (session.currency ?? 'usd').toUpperCase(),
      status: session.payment_status,
      customerEmail: session.customer_details?.email ?? null,
    });
  } catch {
    return NextResponse.json({ verified: false, error: 'Invalid or expired session' }, { status: 404 });
  }
}
