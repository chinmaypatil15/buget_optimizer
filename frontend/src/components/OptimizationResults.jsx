import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function OptimizationResults({ resultsData }) {
  const [viewMode, setViewMode] = useState('Absolute'); // 'Absolute' or 'Share'

  if (!resultsData) return null;

  const { newMetrics, waterfall, brandSpendSales } = resultsData;

  const formatCurrency = (val) =>
    `£${val?.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

  const renderBadge = (pct) => {
    const isPositive = pct >= 0;
    return (
      <div
        className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md mt-1 ${
          isPositive
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-3 h-3 text-emerald-600" />
        ) : (
          <TrendingDown className="w-3 h-3 text-rose-600" />
        )}
        <span>{isPositive ? `+${pct}%` : `${pct}%`}</span>
      </div>
    );
  };

  return (
    <div className="mb-8">
      
      {/* 5 KPI Cards for Optimized Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">New Budget</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {formatCurrency(newMetrics?.budget)}
          </div>
          {renderBadge(newMetrics?.pct_budget)}
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">New Total Volume</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {newMetrics?.volume?.toLocaleString()}
          </div>
          {renderBadge(newMetrics?.pct_volume)}
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">New Total Sales</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {formatCurrency(newMetrics?.sales)}
          </div>
          {renderBadge(newMetrics?.pct_sales)}
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">New Total NNS</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {formatCurrency(newMetrics?.nns)}
          </div>
          {renderBadge(newMetrics?.pct_nns)}
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">New ROI</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {newMetrics?.roi?.toFixed(2)}
          </div>
          {renderBadge(newMetrics?.pct_roi)}
        </div>
      </div>

      {/* Section Title & View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-slate-800">
          New vs Last Year - Spend & Sales
        </h2>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('Absolute')}
            className={`py-1 px-3 rounded-lg text-xs font-bold transition-colors ${
              viewMode === 'Absolute'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            View Absolute
          </button>
          <button
            onClick={() => setViewMode('Share')}
            className={`py-1 px-3 rounded-lg text-xs font-bold transition-colors ${
              viewMode === 'Share'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            View Share
          </button>
        </div>
      </div>

      {/* 3 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Waterfall Chart */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">
            Budget Change (Waterfall)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfall}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `£${(v / 1000000).toFixed(1)}M`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(v) => [formatCurrency(v), 'Amount']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New vs Last Year Spend */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">
            New vs Last Year Spend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandSpendSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brand" tick={{ fontSize: 10 }} />
                <YAxis
                  tickFormatter={(v) => `£${(v / 1000000).toFixed(1)}M`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(v) => [formatCurrency(v)]} />
                <Legend />
                <Bar dataKey="lastYearBudget" name="Last Year Budget" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="newBudget" name="New Budget" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New vs Last Year TOTAL SALES */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">
            New vs Last Year TOTAL SALES
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandSpendSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brand" tick={{ fontSize: 10 }} />
                <YAxis
                  tickFormatter={(v) => `£${(v / 1000000).toFixed(1)}M`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(v) => [formatCurrency(v)]} />
                <Legend />
                <Bar dataKey="lastYearSales" name="Last Year TOTAL SALES" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="newSales" name="New TOTAL SALES" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
