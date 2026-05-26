import { Card } from '@/components/ui';

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-8">Methodology</h1>

      <div className="space-y-6">
        <Card>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Nisab Thresholds</h2>
          <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
            <p><strong>Gold Nisab:</strong> 87.48 grams of gold × current gold price per gram</p>
            <p><strong>Silver Nisab:</strong> 595 grams of silver × current silver price per gram</p>
            <p>These weights follow the standard Hanafi school consensus. Both thresholds are provided so users may follow either.</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Zakah Rate</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The Zakah rate is universally recognized as <strong>2.5%</strong> (1/40th) of net zakatable wealth, based on the hadith of the Prophet Muhammad (peace be upon him).
          </p>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Calculation Formula</h2>
          <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
            <p><strong>Total Assets</strong> = Cash + Investments + Gold Value + Silver Value + Business Assets + Receivables + Other Assets</p>
            <p><strong>Net Wealth</strong> = Total Assets &minus; Total Debts</p>
            <p><strong>Zakah Due</strong> = Net Wealth × 2.5% (if Net Wealth &ge; Selected Nisab Threshold)</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Data Sources</h2>
          <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
            <p>ZakahNisab currently uses mock price data for development purposes. Live gold and silver prices will be sourced from reputable metals APIs in production. Exchange rates similarly.</p>
            <p>Prices are checked daily and cached for up to 6 hours. Last-updated timestamps are displayed with all price data.</p>
          </div>
        </Card>

        <Card variant="muted">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Limitations</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>This tool does not cover every possible asset type or edge case</li>
            <li>It follows one set of Nisab weights (Hanafi standard)</li>
            <li>It does not account for different scholarly opinions on specific assets</li>
            <li>Results are for estimation and educational purposes only</li>
            <li>Always consult a qualified scholar for personalized Zakah advice</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
