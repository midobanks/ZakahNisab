'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

type VerifyState =
  | { status: 'loading' }
  | { status: 'verified'; amount: number; currency: string; customerEmail: string | null }
  | { status: 'error'; message: string };

function VerifyContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [state, setState] = useState<VerifyState>({ status: 'loading' });

  useEffect(() => {
    if (!sessionId) {
      setState({ status: 'error', message: 'No session ID found in URL' });
      return;
    }

    fetch(`/api/donate/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.verified) {
          setState({
            status: 'verified',
            amount: data.amount,
            currency: data.currency,
            customerEmail: data.customerEmail,
          });
        } else {
          setState({ status: 'error', message: data.error || 'Payment could not be verified' });
        }
      })
      .catch(() => {
        setState({ status: 'error', message: 'Failed to verify payment' });
      });
  }, [sessionId]);

  if (state.status === 'loading') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 text-center">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-200" />
          <div className="mx-auto h-6 w-48 rounded bg-gray-200" />
          <div className="mx-auto h-4 w-64 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 text-center">
        <div className="text-5xl mb-6">😕</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Not Verified</h1>
        <p className="text-gray-500 mb-2">{state.message}</p>
        <p className="text-gray-400 text-sm mb-8">
          If you believe this is an error, please contact support with your session ID: {sessionId}
        </p>
        <Link
          href="/donate"
          className="inline-flex items-center rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
        >
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 text-center">
      <div className="text-5xl mb-6">🙏</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h1>
      <p className="text-gray-500 mb-2">
        Your donation of{' '}
        <strong>
          {state.currency} {state.amount.toFixed(2)}
        </strong>{' '}
        has been received.
      </p>
      <p className="text-gray-400 text-sm mb-8">
        JazakAllah Khair for supporting ZakahNisab.
        {state.customerEmail && <> A receipt will be sent to {state.customerEmail}.</>}
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 text-center">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-200" />
          <div className="mx-auto h-6 w-48 rounded bg-gray-200" />
          <div className="mx-auto h-4 w-64 rounded bg-gray-200" />
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
