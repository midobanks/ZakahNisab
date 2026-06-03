import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidEmail } from '@/lib/validation';
import { generateUnsubscribeToken, sendConfirmationEmail } from '@/services/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const existing = await prisma.emailSubscription.findUnique({ where: { email } });

    if (existing) {
      if (existing.confirmedAt) {
        return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
      }
      // Resend confirmation for unconfirmed subscriptions
      const sent = await sendConfirmationEmail(email, existing.unsubscribeToken);
      if (!sent) {
        console.warn('[SUBSCRIBE] Failed to send confirmation email, but subscription saved');
      }
      return NextResponse.json({ message: 'Confirmation email resent' }, { status: 200 });
    }

    const unsubscribeToken = generateUnsubscribeToken();

    await prisma.emailSubscription.create({
      data: { email, unsubscribeToken },
    });

    // Fire-and-forget: don't block response on email send
    sendConfirmationEmail(email, unsubscribeToken).then((sent) => {
      if (!sent) {
        console.warn('[SUBSCRIBE] Failed to send confirmation email, but subscription saved');
      }
    });

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (err) {
    console.error('[SUBSCRIBE API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
