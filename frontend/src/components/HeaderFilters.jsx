import React, { useState, useEffect } from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';

const MARKET_OPTIONS = ['UK-ENGLAND', 'US-USA', 'DE-GERMANY', 'FR-FRANCE', 'IT-ITALY', 'ES-SPAIN'];
const RETAILER_OPTIONS = ['AMAZON', 'WALMART', 'TESCO', 'ASDA'];
const CATEGORY_OPTIONS = ['PETCARE', 'COFFEE'];
const BRAND_OPTIONS = ['Felix', 'Gourmet', 'Purina One', 'Pro Plan', 'Bakers', 'Winalot', 'Dentalife'];
const MEDIA_LEVER_OPTIONS = ['Search', 'Display'];

export default function HeaderFilters({ filters, onConfirm }) {
  // Local pending state - changes are only applied when user clicks Confirm
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleConfirmClick = () => {
    onConfirm(tempFilters);
  };

  const selectedMarkets = Array.isArray(tempFilters.market)
    ? tempFilters.market
    : tempFilters.market
      ? [MARKET_OPTIONS.find(m => m.split('-')[0].trim() === tempFilters.market) || MARKET_OPTIONS[0]]
      : [MARKET_OPTIONS[0]];

  const selectedRetailers = Array.isArray(tempFilters.retailer)
    ? tempFilters.retailer
    : tempFilters.retailer
      ? [tempFilters.retailer]
      : [RETAILER_OPTIONS[0]];

  const selectedCategories = Array.isArray(tempFilters.category)
    ? tempFilters.category
    : tempFilters.category
      ? [tempFilters.category]
      : [CATEGORY_OPTIONS[0]];

  const selectedBrands = Array.isArray(tempFilters.brand)
    ? tempFilters.brand
    : tempFilters.brand === 'ALL' || !tempFilters.brand
      ? BRAND_OPTIONS
      : [tempFilters.brand];

  const selectedMediaLevers = Array.isArray(tempFilters.mediaLever)
    ? tempFilters.mediaLever
    : tempFilters.mediaLever === 'ALL' || !tempFilters.mediaLever
      ? MEDIA_LEVER_OPTIONS
      : [tempFilters.mediaLever];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 mb-6 relative z-30 flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-wrap items-end gap-3 sm:gap-4">

        {/* MARKET (No Checkboxes & No Select All) */}
        <div className="w-36 relative z-40">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Market
          </label>
          <MultiSelectDropdown
            options={MARKET_OPTIONS}
            selected={selectedMarkets}
            showSelectAll={false}
            showCheckboxes={false}
            onChange={(newSelected) => handleChange('market', newSelected.length > 0 ? newSelected : [MARKET_OPTIONS[0]])}
          />
        </div>

        {/* RETAILER (No Checkboxes & No Select All) */}
        <div className="w-36 relative z-40">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Retailer
          </label>
          <MultiSelectDropdown
            options={RETAILER_OPTIONS}
            selected={selectedRetailers}
            showSelectAll={false}
            showCheckboxes={false}
            onChange={(newSelected) => handleChange('retailer', newSelected.length > 0 ? newSelected : [RETAILER_OPTIONS[0]])}
          />
        </div>

        {/* CATEGORY (No Checkboxes & No Select All) */}
        <div className="w-36 relative z-40">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Category
          </label>
          <MultiSelectDropdown
            options={CATEGORY_OPTIONS}
            selected={selectedCategories}
            showSelectAll={false}
            showCheckboxes={false}
            onChange={(newSelected) => handleChange('category', newSelected.length > 0 ? newSelected : [CATEGORY_OPTIONS[0]])}
          />
        </div>

        {/* BRAND (With Checkboxes & Select All) */}
        <div className="w-36 relative z-40">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Brand
          </label>
          <MultiSelectDropdown
            options={BRAND_OPTIONS}
            selected={selectedBrands}
            showSelectAll={true}
            showCheckboxes={true}
            onChange={(newSelected) => handleChange('brand', newSelected)}
          />
        </div>

        {/* MEDIA LEVER (With Checkboxes & Select All) */}
        <div className="w-36 relative z-40">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Media Lever
          </label>
          <MultiSelectDropdown
            options={MEDIA_LEVER_OPTIONS}
            selected={selectedMediaLevers}
            showSelectAll={true}
            showCheckboxes={true}
            onChange={(newSelected) => handleChange('mediaLever', newSelected)}
          />
        </div>

      </div>

      {/* CONFIRM BUTTON - Triggers dashboard refresh on click */}
      <div>
        <button
          onClick={handleConfirmClick}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-2 px-8 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Confirm
        </button>
      </div>

    </div>
  );
}
