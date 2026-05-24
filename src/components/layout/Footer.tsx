import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">ZakahNisab</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Helping Muslims worldwide calculate their Zakah obligation accurately.
              Educational purposes only. Always consult a qualified scholar.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Links</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link href="/calculator" className="hover:text-emerald-700 transition-colors">Calculator</Link></li>
              <li><Link href="/blog" className="hover:text-emerald-700 transition-colors">Blog</Link></li>
              <li><Link href="/methodology" className="hover:text-emerald-700 transition-colors">Methodology</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Support</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link href="/privacy" className="hover:text-emerald-700 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-700 transition-colors">Terms of Use</Link></li>
              <li>
                <Link href="/donate" className="font-medium text-emerald-700 hover:text-emerald-800 transition-colors">
                  Support Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} ZakahNisab. Not affiliated with any scholar or institution.
        </div>
      </div>
    </footer>
  );
}
