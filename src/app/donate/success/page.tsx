import Link from 'next/link';

export default function DonateSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 text-center">
      <div className="text-5xl mb-6">🙏</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h1>
      <p className="text-gray-500 mb-8">
        Your donation has been received. JazakAllah Khair for supporting ZakahNisab.
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
