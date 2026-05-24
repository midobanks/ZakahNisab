export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-8">Terms of Use</h1>

      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <p><strong>Last updated:</strong> May 2026</p>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Purpose</h2>
          <p>
            ZakahNisab is an educational tool designed to help Muslims estimate their Zakah obligation.
            It is not a substitute for religious scholarship or legal advice.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Disclaimer</h2>
          <p>
            All calculations are approximations based on standard Nisab values and the 2.5% Zakah rate.
            Individual circumstances may vary. Users are encouraged to consult a qualified Islamic scholar
            for personalized Zakah guidance.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Accuracy</h2>
          <p>
            While we strive for accuracy, we do not guarantee that prices, exchange rates, or
            calculations are error-free. Data may be delayed or cached. Use at your own discretion.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Limitation of Liability</h2>
          <p>
            ZakahNisab and its creators shall not be held liable for any errors, omissions, or
            consequences arising from the use of this tool. By using this tool, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Changes</h2>
          <p>
            These terms may be updated from time to time. Continued use of the tool after changes
            constitutes acceptance of the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
