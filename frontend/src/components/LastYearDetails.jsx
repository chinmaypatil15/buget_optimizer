import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';

export default function LastYearDetails({ baselineData }) {
  if (!baselineData) return null;

  const { metrics, brandShares, saturationCurve } = baselineData;

  const formatCurrency = (val) =>
    `£${val?.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

  // Stacked bar dataset matching Image 2 (single thin vertical bar at 0% position)
  const stackedData = [
    {
      name: '0%',
      Felix: 14.3,
      Gourmet: 14.3,
      'Purina One': 14.3,
      'Pro Plan': 14.3,
      Bakers: 14.3,
      Winalot: 14.3,
      Dentalife: 14.2
    },
    { name: '25%' },
    { name: '50%' },
    { name: '75%' },
    { name: '100%' }
  ];

  const brandColors = {
    Felix: '#60a5fa',
    Gourmet: '#93c5fd',
    'Purina One': '#2563eb',
    'Pro Plan': '#3b82f6',
    Bakers: '#bfdbfe',
    Winalot: '#38bdf8',
    Dentalife: '#bae6fd'
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Last Year Details</h2>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Last Year Budget</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {formatCurrency(metrics?.budget)}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Last Year Total Volume</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {metrics?.volume?.toLocaleString()}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Last Year Total Sales</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {formatCurrency(metrics?.sales)}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Last Year Total NNS</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {formatCurrency(metrics?.nns)}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Last Year ROI</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {metrics?.roi?.toFixed(2)}
          </div>
        </div>
      </div>

      {/* 2 Side-by-side Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Brand Share Chart */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Last Year Budget - Brand Share</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={false}
                  label={{ value: 'Last Year Budget', angle: -90, position: 'insideLeft', fontSize: 11 }}
                />
                <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
                <Legend />
                {Object.keys(brandColors).map((brand) => (
                  <Bar key={brand} dataKey={brand} stackId="a" fill={brandColors[brand]} barSize={8} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Saturation Curve Chart */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Saturation Curve</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={saturationCurve}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="investmentM"
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Investment', position: 'insideBottom', offset: -2, fontSize: 10 }}
                />
                {/* Left YAxis - Incremental Sales */}
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Incremental Sales', angle: -90, position: 'insideLeft', fontSize: 10 }}
                />
                {/* Right YAxis - ROI */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 3.6]}
                  ticks={[0, 0.9, 1.8, 2.7, 3.6]}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'ROI', angle: 90, position: 'insideRight', fontSize: 10 }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'Incremental Sales' ? formatCurrency(value) : value,
                    name
                  ]}
                />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="incrementalSales"
                  name="Incremental Sales"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="roi"
                  name="ROI"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
