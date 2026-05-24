export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-8">Privacy Policy</h1>

      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <p><strong>Last updated:</strong> May 2026</p>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">What we collect</h2>
          <p>We collect only the data you voluntarily provide:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li><strong>Email address:</strong> If you choose to subscribe for Zakah reminders</li>
            <li><strong>Analytics data:</strong> Anonymous page views and feature usage (no IP logging, no personal identifiers)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">What we do NOT collect</h2>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>We do not store or transmit your financial data or calculation inputs</li>
            <li>All calculation inputs remain in your browser and are never sent to our servers</li>
            <li>We do not use tracking cookies or fingerprinting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">How we use your data</h2>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Email: Only to send Zakah reminders you have requested. You can unsubscribe at any time.</li>
            <li>Analytics: To understand which features are used and improve the tool</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Data retention</h2>
          <p>Unconfirmed email subscriptions are deleted after 30 days. You may request deletion of your data at any time by contacting us.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Third parties</h2>
          <p>We do not sell, share, or transfer your data to third parties. Analytics data is processed anonymously.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Contact</h2>
          <p>For privacy-related inquiries, please reach out via our support channels.</p>
        </section>
      </div>
    </div>
  );
}
