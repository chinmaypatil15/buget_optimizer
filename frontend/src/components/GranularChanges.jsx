import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import MultiSelectDropdown from './MultiSelectDropdown';

const BRAND_OPTIONS = ['Felix', 'Gourmet', 'Purina One', 'Pro Plan', 'Bakers', 'Winalot', 'Dentalife'];
const GRANULARITY_OPTIONS = ['Aggregated', 'Detailed'];

export default function GranularChanges({ granularSpend, granularSales }) {
  const [selectedBrands, setSelectedBrands] = useState(BRAND_OPTIONS);
  const [granularity, setGranularity] = useState('Aggregated');
  const [mode, setMode] = useState('Absolute'); // 'Absolute' or '%'

  const formatCurrencyK = (val) => {
    if (val === undefined || val === null) return '£0';
    const isNeg = val < 0;
    const absVal = Math.abs(val);
    if (absVal >= 1000000) {
      return `${isNeg ? '-' : ''}£${(absVal / 1000000).toFixed(1)}M`;
    }
    return `${isNeg ? '-' : ''}£${(absVal / 1000).toFixed(0)}K`;
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-8">
      
      {/* Title & Filter Controls */}
      <h3 className="text-sm font-bold text-slate-800 mb-4">
        New vs Last Year Spend & Sales
      </h3>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        
        {/* BRAND MULTI-SELECT DROPDOWN */}
        <div className="w-48 relative z-40">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Brand
          </label>
          <MultiSelectDropdown
            compact={true}
            options={BRAND_OPTIONS}
            selected={selectedBrands}
            showSelectAll={true}
            showCheckboxes={true}
            onChange={(newSelected) => setSelectedBrands(newSelected)}
          />
        </div>

        {/* MEDIA TACTIC GRANULARITY */}
        <div className="w-48 relative z-40">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Media Tactic Granularity
          </label>
          <MultiSelectDropdown
            compact={true}
            options={GRANULARITY_OPTIONS}
            selected={[granularity]}
            showSelectAll={false}
            showCheckboxes={false}
            onChange={(newSelected) => setGranularity(newSelected[0] || 'Aggregated')}
          />
        </div>

        {/* ABSOLUTE / % TOGGLE */}
        <div className="pt-4 flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setMode('Absolute')}
            className={`py-1 px-3 rounded-lg text-xs font-bold transition-colors ${
              mode === 'Absolute'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Absolute
          </button>
          <button
            onClick={() => setMode('%')}
            className={`py-1 px-3 rounded-lg text-xs font-bold transition-colors ${
              mode === '%'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            %
          </button>
        </div>

      </div>

      {/* 2 Diverging Horizontal Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Change in Spend */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-3">Change in Spend</h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={granularSpend} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => formatCurrencyK(v)} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="tactic" width={90} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [formatCurrencyK(v), 'Change']} />
                <Bar dataKey="value">
                  {granularSpend?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value >= 0 ? '#10b981' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Change in Incremental Sales */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-3">Change in Incremental Sales</h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={granularSales} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => formatCurrencyK(v)} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="tactic" width={90} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [formatCurrencyK(v), 'Change']} />
                <Bar dataKey="value">
                  {granularSales?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value >= 0 ? '#10b981' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
