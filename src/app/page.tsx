'use client';

import Link from "next/link";
import { NisabCards } from "@/components/nisab";
import { Button } from "@/components/ui";
import { useCurrency } from "@/context";
import { usePrices } from "@/hooks/usePrices";

export default function HomePage() {
  const { currency } = useCurrency();
  const { prices, loading } = usePrices(currency);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Know Your Nisab. Fulfill Your Zakah.
        </h1>
        <p className="mt-4 text-base text-gray-500 leading-relaxed">
          Find out if your wealth has reached the Nisab threshold and calculate
          your estimated Zakah obligation using live gold and silver prices.
        </p>
      </div>

      <div className="mt-12">
        <NisabCards prices={prices} loading={loading} />
      </div>

      <div className="mt-10 text-center">
        <Link href="/calculator">
          <Button size="lg">
            Calculate Your Zakah
          </Button>
        </Link>
      </div>

      <div className="mt-20 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Live Prices</h3>
          <p className="text-xs text-gray-500">Daily updated gold and silver values in 14 currencies</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <div className="text-2xl mb-2">🧮</div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Instant Calculation</h3>
          <p className="text-xs text-gray-500">See your Zakah due immediately as you enter your assets</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <div className="text-2xl mb-2">📖</div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Educational</h3>
          <p className="text-xs text-gray-500">Learn about Nisab, Hawl, and proper Zakah calculation</p>
        </div>
      </div>
    </div>
  );
}
