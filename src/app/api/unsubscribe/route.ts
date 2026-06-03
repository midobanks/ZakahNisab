import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return new Response(
      `<html><body style="font-family:sans-serif;padding:40px;text-align:center">
        <h1>Missing Token</h1>
        <p>No unsubscribe token provided. If you received this link via email, please click the full link.</p>
      </body></html>`,
      { status: 400, headers: { 'content-type': 'text/html' } }
    );
  }

  try {
    const sub = await prisma.emailSubscription.findFirst({
      where: { unsubscribeToken: token },
    });

    if (!sub) {
      return new Response(
        `<html><body style="font-family:sans-serif;padding:40px;text-align:center">
          <h1>Invalid Link</h1>
          <p>This unsubscribe link is invalid or expired.</p>
        </body></html>`,
        { status: 404, headers: { 'content-type': 'text/html' } }
      );
    }

    if (sub.unsubscribedAt) {
      return new Response(
        `<html><body style="font-family:sans-serif;padding:40px;text-align:center">
          <h1>Already Unsubscribed</h1>
          <p>You have already been unsubscribed from Zakah reminders.</p>
        </body></html>`,
        { status: 200, headers: { 'content-type': 'text/html' } }
      );
    }

    await prisma.emailSubscription.update({
      where: { id: sub.id },
      data: { unsubscribedAt: new Date() },
    });

    return new Response(
      `<html><body style="font-family:sans-serif;padding:40px;text-align:center">
        <h1>Unsubscribed</h1>
        <p>You have been unsubscribed from Zakah reminders. You will no longer receive emails.</p>
      </body></html>`,
      { status: 200, headers: { 'content-type': 'text/html' } }
    );
  } catch (err) {
    console.error('[UNSUBSCRIBE]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
