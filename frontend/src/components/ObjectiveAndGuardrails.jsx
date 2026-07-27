import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import MultiSelectDropdown from './MultiSelectDropdown';
import DualRangeSlider from './DualRangeSlider';

const SALES_KPI_OPTIONS = ['TOTAL SALES', 'NNS'];

export default function ObjectiveAndGuardrails({ onOptimize }) {
  const [objective, setObjective] = useState('Maximize Sales');
  const [useGuardrails, setUseGuardrails] = useState(false);

  // Target input mode: 'lastYear', 'newBudget', or 'salesTarget'
  const [targetMode, setTargetMode] = useState('newBudget');
  const [newBudgetVal, setNewBudgetVal] = useState('15000000');
  const [salesTargetVal, setSalesTargetVal] = useState('');
  const [targetSubMode, setTargetSubMode] = useState('target'); // 'target' or 'pct'
  const [salesKPI, setSalesKPI] = useState('TOTAL SALES');

  // BRAND Budget Guardrail state ranges (£) matching reference image
  const [purinaOneRange, setPurinaOneRange] = useState([0, 30000000]);
  const [benefulRange, setBenefulRange] = useState([1800000, 5000000]);
  const [fancyFeastRange, setFancyFeastRange] = useState([1100000, 5000000]);
  const [proPlanRange, setProPlanRange] = useState([900000, 5000000]);

  const [dogChowRange, setDogChowRange] = useState([0, 30000000]);
  const [friskiesRange, setFriskiesRange] = useState([3300000, 30000000]);
  const [catChowRange, setCatChowRange] = useState([2900000, 5000000]);
  const [gourmetRange, setGourmetRange] = useState([2200000, 5000000]);

  // Search Guardrail state ranges (%) matching reference image
  const [searchSponsoredProduct, setSearchSponsoredProduct] = useState([0, 100]);
  const [searchSponsoredBrand, setSearchSponsoredBrand] = useState([20, 30]);
  const [searchSponsoredVideo, setSearchSponsoredVideo] = useState([5, 10]);

  // Display Guardrail state ranges (%) matching reference image
  const [displayOnsite, setDisplayOnsite] = useState([0, 100]);
  const [displayOffsite, setDisplayOffsite] = useState([30, 50]);

  const handleOptimizeClick = () => {
    let finalTargetMode = 'budget';
    let finalTargetVal = 15000000;

    if (targetMode === 'lastYear') {
      finalTargetMode = 'budget';
      finalTargetVal = 12000000;
    } else if (targetMode === 'newBudget') {
      finalTargetMode = 'budget';
      finalTargetVal = parseFloat(newBudgetVal) || 15000000;
    } else if (targetMode === 'salesTarget') {
      finalTargetMode = 'target';
      finalTargetVal = parseFloat(salesTargetVal) || 35000000;
    }

    onOptimize({
      objective,
      useGuardrails,
      targetMode: finalTargetMode,
      targetValue: finalTargetVal,
      salesKPI: objective === 'Maximize ROI' ? 'ROI' : salesKPI,
      guardrails: {
        brandRanges: {
          purinaOne: purinaOneRange,
          beneful: benefulRange,
          fancyFeast: fancyFeastRange,
          proPlan: proPlanRange,
          dogChow: dogChowRange,
          friskies: friskiesRange,
          catChow: catChowRange,
          gourmet: gourmetRange
        },
        searchSponsoredProduct,
        searchSponsoredBrand,
        searchSponsoredVideo,
        displayOnsite,
        displayOffsite
      }
    });
  };

  return (
    <div className="space-y-6 mb-8">
      
      {/* BOX 1: WHAT IS YOUR OBJECTIVE */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3">
          What is your Objective
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => setObjective('Maximize Sales')}
            className={`py-2 px-5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              objective === 'Maximize Sales'
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Maximize Sales
          </button>
          <button
            onClick={() => setObjective('Maximize ROI')}
            className={`py-2 px-5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              objective === 'Maximize ROI'
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Maximize ROI
          </button>
        </div>
      </div>

      {/* BOX 2: BUDGET AND TARGET */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        
        {/* Header Title & Date Range Notes */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            Budget and Target
          </h3>
          <div className="text-right text-[11px] font-medium text-slate-400">
            <div>Last Year: Jan-25 to Dec-25</div>
            <div>Next Year: Jan-26 to Dec-26</div>
          </div>
        </div>

        {/* 3 Budget/Target Column Options with OR Dividers */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center mb-6">
          
          {/* Column 1: Use Last Year Budget (£) */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Use Last Year Budget (£)
            </label>
            <input
              type="text"
              readOnly
              value="£12,000,000"
              onClick={() => setTargetMode('lastYear')}
              className={`w-full bg-slate-100 border text-slate-700 py-2.5 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
                targetMode === 'lastYear' ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-300'
              }`}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Media Spend for last year is £12,000,000
            </p>
          </div>

          {/* OR 1 */}
          <div className="lg:col-span-1 text-center font-extrabold text-xs text-slate-700">
            OR
          </div>

          {/* Column 2: Input New Budget (£) */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Input New Budget (£)
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={newBudgetVal}
              onChange={(e) => {
                setNewBudgetVal(e.target.value);
                setTargetMode('newBudget');
              }}
              onFocus={() => setTargetMode('newBudget')}
              className={`w-full bg-slate-50 border text-slate-900 py-2.5 px-4 rounded-xl text-sm font-medium focus:outline-none transition-all ${
                targetMode === 'newBudget' ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-300'
              }`}
            />
          </div>

          {/* OR 2 */}
          <div className="lg:col-span-1 text-center font-extrabold text-xs text-slate-700">
            OR
          </div>

          {/* Column 3: Input Sales Target (£) */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Input Sales Target (£)
              </label>
              
              {/* Target / % Toggle Pill */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-md text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setTargetSubMode('target')}
                  className={`px-2 py-0.5 rounded ${
                    targetSubMode === 'target' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Target (£)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetSubMode('pct')}
                  className={`px-2 py-0.5 rounded ${
                    targetSubMode === 'pct' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  % Increase
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder={targetSubMode === 'target' ? 'Sales target in £' : '% increase'}
              value={salesTargetVal}
              onChange={(e) => {
                setSalesTargetVal(e.target.value);
                setTargetMode('salesTarget');
              }}
              onFocus={() => setTargetMode('salesTarget')}
              className={`w-full bg-slate-50 border text-slate-900 py-2.5 px-4 rounded-xl text-sm font-medium focus:outline-none transition-all ${
                targetMode === 'salesTarget' ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-300'
              }`}
            />
          </div>

        </div>

        {/* Select Sales KPI to Optimize (Locked with ROI when Maximize ROI is selected) */}
        <div className="max-w-xs mb-6 relative z-40">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Select Sales KPI to Optimize
          </label>
          {objective === 'Maximize ROI' ? (
            <div className="relative">
              <div className="w-full bg-slate-50/80 border border-slate-200 text-slate-400 py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-between cursor-not-allowed select-none">
                <span>ROI</span>
                <ChevronDown className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          ) : (
            <MultiSelectDropdown
              options={SALES_KPI_OPTIONS}
              selected={[salesKPI]}
              showSelectAll={false}
              showCheckboxes={false}
              onChange={(newSelected) => setSalesKPI(newSelected[0] || 'TOTAL SALES')}
            />
          )}
        </div>

        {/* Radio Options: Guardrails */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-6">
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

          {/* SET BUSINESS GUARDRAILS PANEL */}
          {useGuardrails && (
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 mt-6 animate-in fade-in duration-150">
              <h4 className="text-base font-bold text-slate-900 mb-6">
                Set Business Guardrails
              </h4>

              {/* BRAND Budget Guardrails (£) */}
              <div className="mb-8">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  BRAND Budget Guardrails (£)
                </h5>
                <p className="text-xs text-slate-400 italic mb-4">
                  Set Brand level constraints around Search/RDM budgets.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <DualRangeSlider
                      label="PURINA ONE"
                      min={0}
                      max={30000000}
                      value={purinaOneRange}
                      onChange={setPurinaOneRange}
                      isCurrency={true}
                    />
                    <DualRangeSlider
                      label="BENEFUL"
                      min={0}
                      max={30000000}
                      value={benefulRange}
                      onChange={setBenefulRange}
                      isCurrency={true}
                    />
                    <DualRangeSlider
                      label="FANCY FEAST"
                      min={0}
                      max={30000000}
                      value={fancyFeastRange}
                      onChange={setFancyFeastRange}
                      isCurrency={true}
                    />
                    <DualRangeSlider
                      label="PRO PLAN"
                      min={0}
                      max={30000000}
                      value={proPlanRange}
                      onChange={setProPlanRange}
                      isCurrency={true}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <DualRangeSlider
                      label="DOG CHOW"
                      min={0}
                      max={30000000}
                      value={dogChowRange}
                      onChange={setDogChowRange}
                      isCurrency={true}
                    />
                    <DualRangeSlider
                      label="FRISKIES"
                      min={0}
                      max={30000000}
                      value={friskiesRange}
                      onChange={setFriskiesRange}
                      isCurrency={true}
                    />
                    <DualRangeSlider
                      label="CAT CHOW LINE"
                      min={0}
                      max={30000000}
                      value={catChowRange}
                      onChange={setCatChowRange}
                      isCurrency={true}
                    />
                    <DualRangeSlider
                      label="GOURMET"
                      min={0}
                      max={30000000}
                      value={gourmetRange}
                      onChange={setGourmetRange}
                      isCurrency={true}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200/60 pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                
                {/* Search Budget Guardrails */}
                <div>
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Search Budget Guardrails
                  </h5>
                  <p className="text-xs text-slate-400 italic mb-4">
                    Adjust share of Paid Search tactics in the total search budget
                  </p>

                  <div className="space-y-4">
                    <DualRangeSlider
                      label="Sponsored Product Share"
                      min={0}
                      max={100}
                      value={searchSponsoredProduct}
                      onChange={setSearchSponsoredProduct}
                    />
                    <DualRangeSlider
                      label="Sponsored Brand Share"
                      min={0}
                      max={100}
                      value={searchSponsoredBrand}
                      onChange={setSearchSponsoredBrand}
                    />
                    <DualRangeSlider
                      label="Sponsored Video Share"
                      min={0}
                      max={100}
                      value={searchSponsoredVideo}
                      onChange={setSearchSponsoredVideo}
                    />
                  </div>
                </div>

                {/* Display Budget Guardrails */}
                <div>
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Display Budget Guardrails
                  </h5>
                  <p className="text-xs text-slate-400 italic mb-4">
                    Adjust share of RDM tactics in the total RDM budget
                  </p>

                  <div className="space-y-4">
                    <DualRangeSlider
                      label="Onsite Budget Share"
                      min={0}
                      max={100}
                      value={displayOnsite}
                      onChange={setDisplayOnsite}
                    />
                    <DualRangeSlider
                      label="Offsite Budget Share"
                      min={0}
                      max={100}
                      value={displayOffsite}
                      onChange={setDisplayOffsite}
                    />
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* Action Button */}
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
