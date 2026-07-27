import React from 'react';

export default function DeepDiveTable({ deepDiveData }) {
  if (!deepDiveData || deepDiveData.length === 0) return null;

  const formatCurrency = (val) =>
    `£${Math.round(val)?.toLocaleString('en-GB')}`;

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-12">
      <h3 className="text-sm font-bold text-slate-800 mb-4">
        New vs Last Year Budget - Deep Dive
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            {/* Header Row 1 */}
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <th className="py-3 px-3 border-r border-slate-200" rowSpan={2}>Brand</th>
              <th className="py-3 px-3 text-center border-r border-slate-200 text-blue-700 bg-blue-50/50" colSpan={6}>
                Total Search +
              </th>
              <th className="py-3 px-3 text-center text-blue-700 bg-sky-50/50" colSpan={6}>
                Total Display +
              </th>
            </tr>

            {/* Header Row 2 */}
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500">
              {/* Search Columns */}
              <th className="py-2 px-2 text-right">Last Year Budget</th>
              <th className="py-2 px-2 text-right">New Budget</th>
              <th className="py-2 px-2 text-right">% Budget Change</th>
              <th className="py-2 px-2 text-right">Last Year TOTAL SALES</th>
              <th className="py-2 px-2 text-right">New TOTAL SALES</th>
              <th className="py-2 px-2 text-right border-r border-slate-200">% TOTAL SALES Change</th>

              {/* Display Columns */}
              <th className="py-2 px-2 text-right">Last Year Budget</th>
              <th className="py-2 px-2 text-right">New Budget</th>
              <th className="py-2 px-2 text-right">% Budget Change</th>
              <th className="py-2 px-2 text-right">Last Year TOTAL SALES</th>
              <th className="py-2 px-2 text-right">New TOTAL SALES</th>
              <th className="py-2 px-2 text-right">% TOTAL SALES Change</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {deepDiveData.map((row) => (
              <tr key={row.brand} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-900 border-r border-slate-200">
                  {row.brand}
                </td>

                {/* Total Search + */}
                <td className="py-3 px-2 text-right font-medium text-slate-700">
                  {formatCurrency(row.search_last_budget)}
                </td>
                <td className="py-3 px-2 text-right font-medium text-slate-700">
                  {formatCurrency(row.search_new_budget)}
                </td>
                <td className="py-3 px-2 text-right font-bold text-emerald-600">
                  +{row.search_pct_budget}%
                </td>
                <td className="py-3 px-2 text-right font-medium text-slate-700">
                  {formatCurrency(row.search_last_sales)}
                </td>
                <td className="py-3 px-2 text-right font-medium text-slate-700">
                  {formatCurrency(row.search_new_sales)}
                </td>
                <td className="py-3 px-2 text-right font-bold text-emerald-600 border-r border-slate-200">
                  +{row.search_pct_sales}%
                </td>

                {/* Total Display + */}
                <td className="py-3 px-2 text-right font-medium text-slate-700">
                  {formatCurrency(row.display_last_budget)}
                </td>
                <td className="py-3 px-2 text-right font-medium text-slate-700">
                  {formatCurrency(row.display_new_budget)}
                </td>
                <td className="py-3 px-2 text-right font-bold text-emerald-600">
                  +{row.display_pct_budget}%
                </td>
                <td className="py-3 px-2 text-right font-medium text-slate-700">
                  {formatCurrency(row.display_last_sales)}
                </td>
                <td className="py-3 px-2 text-right font-medium text-slate-700">
                  {formatCurrency(row.display_new_sales)}
                </td>
                <td className="py-3 px-2 text-right font-bold text-emerald-600">
                  +{row.display_pct_sales}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
