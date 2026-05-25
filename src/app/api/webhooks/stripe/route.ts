import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET.' },
      { status: 500 },
    );
  }

  const stripe = new Stripe(secretKey);

  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        await prisma.donation.create({
          data: {
            stripeSessionId: session.id,
            stripePaymentId: session.payment_intent?.toString() ?? null,
            amount: (session.amount_total ?? 0) / 100,
            currency: session.currency ?? 'usd',
            status: 'completed',
            customerEmail: session.customer_details?.email ?? null,
            customerName: session.customer_details?.name ?? null,
            metadata: session.metadata ?? {},
          },
        });

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;

        await prisma.donation.create({
          data: {
            stripeSessionId: session.id,
            amount: (session.amount_total ?? 0) / 100,
            currency: session.currency ?? 'usd',
            status: 'expired',
            metadata: session.metadata ?? {},
          },
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[STRIPE WEBHOOK]', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
