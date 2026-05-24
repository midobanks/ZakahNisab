import Link from 'next/link';

export default function DonateCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Donation Cancelled</h1>
      <p className="text-gray-500 mb-8">
        No worries. You can donate anytime if you change your mind.
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
