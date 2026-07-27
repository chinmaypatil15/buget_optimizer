import React, { useState } from 'react';

export default function ObjectiveAndGuardrails({ onOptimize }) {
  const [objective, setObjective] = useState('Maximize Sales');
  const [useGuardrails, setUseGuardrails] = useState(false);

  // Guardrail state ranges
  const [searchSponsoredProduct, setSearchSponsoredProduct] = useState([70, 90]);
  const [searchSponsoredBrand, setSearchSponsoredBrand] = useState([20, 30]);
  const [searchSponsoredVideo, setSearchSponsoredVideo] = useState([5, 10]);

  const [displayOnsite, setDisplayOnsite] = useState([50, 70]);
  const [displayOffsite, setDisplayOffsite] = useState([30, 50]);

  // Target input state
  const [targetMode, setTargetMode] = useState('budget'); // 'budget' or 'target'
  const [targetValue, setTargetValue] = useState('15000000');

  const handleOptimizeClick = () => {
    onOptimize({
      objective,
      useGuardrails,
      targetMode,
      targetValue: parseFloat(targetValue) || 12000000,
      guardrails: {
        searchSponsoredProduct,
        searchSponsoredBrand,
        searchSponsoredVideo,
        displayOnsite,
        displayOffsite
      }
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-8">
      
      {/* Objective Buttons */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-800 mb-3">
          What is your Objective
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setObjective('Maximize Sales')}
            className={`py-2.5 px-6 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              objective === 'Maximize Sales'
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Maximize Sales
          </button>
          <button
            onClick={() => setObjective('Maximize ROI')}
            className={`py-2.5 px-6 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              objective === 'Maximize ROI'
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Maximize ROI
          </button>
        </div>
      </div>

      {/* Guardrails Radio Toggle */}
      <div className="mb-6 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-6 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="guardrail_opt"
              checked={!useGuardrails}
              onChange={() => setUseGuardrails(false)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-800">
              Optimize without guardrails
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="guardrail_opt"
              checked={useGuardrails}
              onChange={() => setUseGuardrails(true)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-800">
              Optimize with guardrails
            </span>
          </label>
        </div>

        {/* Guardrails Sliders Section */}
        {useGuardrails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
            
            {/* Search Guardrails */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Search Budget Guardrails</h4>
              <p className="text-xs text-slate-500 mb-4">
                Adjust share of Paid Search tactics in the total search budget
              </p>

              <div className="space-y-4 text-xs font-medium">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Sponsored Product Share</span>
                    <span className="text-blue-600 font-bold">{searchSponsoredProduct[0]}% to {searchSponsoredProduct[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={searchSponsoredProduct[1]}
                    onChange={(e) => setSearchSponsoredProduct([70, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Sponsored Brand Share</span>
                    <span className="text-blue-600 font-bold">{searchSponsoredBrand[0]}% to {searchSponsoredBrand[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={searchSponsoredBrand[1]}
                    onChange={(e) => setSearchSponsoredBrand([20, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Sponsored Video Share</span>
                    <span className="text-blue-600 font-bold">{searchSponsoredVideo[0]}% to {searchSponsoredVideo[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={searchSponsoredVideo[1]}
                    onChange={(e) => setSearchSponsoredVideo([5, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Display Guardrails */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Display Budget Guardrails</h4>
              <p className="text-xs text-slate-500 mb-4">
                Adjust share of RDM tactics in the total RDM budget
              </p>

              <div className="space-y-4 text-xs font-medium">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Onsite Budget Share</span>
                    <span className="text-blue-600 font-bold">{displayOnsite[0]}% to {displayOnsite[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="90"
                    value={displayOnsite[1]}
                    onChange={(e) => setDisplayOnsite([50, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Offsite Budget Share</span>
                    <span className="text-blue-600 font-bold">{displayOffsite[0]}% to {displayOffsite[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={displayOffsite[1]}
                    onChange={(e) => setDisplayOffsite([30, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Target Input & Optimize Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-end justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="target_mode"
                checked={targetMode === 'budget'}
                onChange={() => setTargetMode('budget')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Input New Budget (£)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="target_mode"
                checked={targetMode === 'target'}
                onChange={() => setTargetMode('target')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target (£)
              </span>
            </label>
          </div>

          <input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder={targetMode === 'budget' ? 'e.g. 15000000' : 'e.g. 35000000'}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 py-2.5 px-4 rounded-xl font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <button
            onClick={handleOptimizeClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Optimize Budget
          </button>
        </div>
      </div>

    </div>
  );
}
