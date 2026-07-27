import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function MultiSelectDropdown({
  options,
  selected = [],
  onChange,
  compact = false,
  showSelectAll = true,
  showCheckboxes = true
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allSelected = selected.length === options.length;

  const handleToggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const handleToggleOption = (option) => {
    if (!showCheckboxes) {
      // Single-select mode: select item & close popover
      onChange([option]);
      setIsOpen(false);
      return;
    }

    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const getDisplayText = () => {
    if (selected.length === 0) return 'Select';
    if (selected.length === options.length && showSelectAll) return 'ALL';
    if (selected.length === 1) return selected[0];
    return `${selected.length} selected`;
  };

  return (
    <div className={`relative w-full ${isOpen ? 'z-50' : 'z-30'}`} ref={dropdownRef}>
      {/* Target Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-slate-50 border border-slate-300 text-slate-800 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          compact ? 'py-1.5 px-3 text-xs' : 'py-2 px-3 text-sm'
        }`}
      >
        <span className="truncate">{getDisplayText()}</span>
        <ChevronDown className={`text-slate-500 transition-transform ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[190px] bg-white rounded-xl shadow-2xl border border-slate-200/90 z-50 p-2.5">
          
          {/* Select All Row (conditional) */}
          {showSelectAll && showCheckboxes && (
            <div
              onClick={handleToggleAll}
              className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg hover:bg-slate-100/80 cursor-pointer transition-colors mb-1"
            >
              <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${allSelected ? 'bg-slate-900 text-white' : 'border border-slate-400 bg-white'}`}>
                {allSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-sm font-semibold text-slate-900">Select All</span>
            </div>
          )}

          {/* Individual Options List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {options.map((option) => {
              const isChecked = selected.includes(option);
              return (
                <div
                  key={option}
                  onClick={() => handleToggleOption(option)}
                  className={`flex items-center px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-blue-50/80 text-blue-700 font-bold'
                      : 'hover:bg-slate-100/80 text-slate-800 font-medium'
                  }`}
                >
                  {showCheckboxes && (
                    <div className={`w-4 h-4 mr-3 rounded-md flex items-center justify-center transition-colors ${isChecked ? 'bg-slate-900 text-white' : 'border border-slate-400 bg-white'}`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  )}
                  <span className="text-sm">{option}</span>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
