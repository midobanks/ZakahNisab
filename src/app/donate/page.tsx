'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

const PRESET_AMOUNTS = [5, 10, 25, 50, 100, 250];

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDonate() {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (!finalAmount || finalAmount < 1) {
      setError('Please enter a valid donation amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate donation');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Support ZakahNisab</h1>
        <p className="mt-3 text-gray-500">
          Your donation helps keep this tool free, accurate, and accessible for Muslims worldwide.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Choose an amount (USD)</h2>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => { setAmount(preset); setCustomAmount(''); setError(null); }}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                !customAmount && amount === preset
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label htmlFor="custom-amount" className="block text-sm text-gray-600 mb-1">
            Or enter a custom amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              id="custom-amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button
          onClick={handleDonate}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Redirecting to Stripe...' : `Donate ${customAmount ? `$${parseFloat(customAmount).toFixed(2)}` : `$${amount}`}`}
        </Button>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Payments are processed securely by Stripe. Your card details never touch our servers.
        </p>
      </div>
    </div>
  );
}
