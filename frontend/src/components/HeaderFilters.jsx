import React from 'react';
import { ChevronDown } from 'lucide-react';
import MultiSelectDropdown from './MultiSelectDropdown';

const BRAND_OPTIONS = ['Felix', 'Gourmet', 'Purina One', 'Pro Plan', 'Bakers', 'Winalot', 'Dentalife'];
const MEDIA_LEVER_OPTIONS = ['Search', 'Display'];

export default function HeaderFilters({ filters, setFilters, onConfirm }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Convert filters.brand to array format if it's currently a string like 'ALL'
  const selectedBrands = Array.isArray(filters.brand)
    ? filters.brand
    : filters.brand === 'ALL' || !filters.brand
      ? BRAND_OPTIONS
      : [filters.brand];

  // Convert filters.mediaLever to array format if it's currently a string like 'ALL'
  const selectedMediaLevers = Array.isArray(filters.mediaLever)
    ? filters.mediaLever
    : filters.mediaLever === 'ALL' || !filters.mediaLever
      ? MEDIA_LEVER_OPTIONS
      : [filters.mediaLever];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 mb-6 relative z-30">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-end">

        {/* MARKET */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Market
          </label>
          <div className="relative">
            <select
              value={filters.market}
              onChange={(e) => handleChange('market', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2 px-3 pr-8 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UK">UK-ENGLAND</option>
              <option value="US">US-USA</option>
              <option value="DE">DE-GERMANY</option>
              <option value="FR">FR-FRANCE</option>
              <option value="IT">IT-ITALY</option>
              <option value="ES">ES-SPAIN</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* RETAILER */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Retailer
          </label>
          <div className="relative">
            <select
              value={filters.retailer}
              onChange={(e) => handleChange('retailer', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2 px-3 pr-8 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="AMAZON">AMAZON</option>
              <option value="WALMART">WALMART</option>
              <option value="TESCO">TESCO</option>
              <option value="ASDA">ASDA</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Category
          </label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-800 py-2 px-3 pr-8 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PETCARE">PETCARE</option>
              <option value="COFFEE">COFFEE</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* BRAND MULTI-SELECT DROPDOWN */}
        <div className="relative z-40">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Brand
          </label>
          <MultiSelectDropdown
            options={BRAND_OPTIONS}
            selected={selectedBrands}
            onChange={(newSelected) => handleChange('brand', newSelected)}
          />
        </div>

        {/* MEDIA LEVER MULTI-SELECT DROPDOWN */}
        <div className="relative z-40">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Media Lever
          </label>
          <MultiSelectDropdown
            options={MEDIA_LEVER_OPTIONS}
            selected={selectedMediaLevers}
            onChange={(newSelected) => handleChange('mediaLever', newSelected)}
          />
        </div>

        {/* CONFIRM BUTTON */}
        <div>
          <button
            onClick={onConfirm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
}
