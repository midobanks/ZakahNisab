'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { isValidEmail } from '@/lib/validation';

export function ReminderCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? 'Failed to subscribe');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
        <p className="font-medium">You are subscribed!</p>
        <p>We will notify you when your Zakah may be due.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-gray-200 bg-white px-4 py-4">
      <p className="text-sm font-medium text-gray-900">
        Zakah Reminder
      </p>
      <p className="text-xs text-gray-500">
        Zakah is due annually after holding wealth above Nisab for one full lunar year. Would you like us to notify you when it is time?
      </p>
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={status === 'error' ? errorMsg : undefined}
        placeholder="your@email.com"
      />
      <Button type="submit" loading={status === 'loading'} className="w-full" size="sm">
        Notify Me
      </Button>
      <p className="text-xs text-gray-400">
        Your email will only be used to send Zakah reminders. Unsubscribe at any time.
      </p>
    </form>
  );
}
