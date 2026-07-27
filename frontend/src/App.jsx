import React, { useState, useEffect } from 'react';
import HeaderFilters from './components/HeaderFilters';
import LastYearDetails from './components/LastYearDetails';
import ObjectiveAndGuardrails from './components/ObjectiveAndGuardrails';
import OptimizationResults from './components/OptimizationResults';
import GranularChanges from './components/GranularChanges';
import DeepDiveTable from './components/DeepDiveTable';

export default function App() {
  const [filters, setFilters] = useState({
    market: 'UK - ENGLAND',
    retailer: 'AMAZON',
    category: 'PETCARE',
    brand: 'ALL',
    mediaLever: 'ALL'
  });

  const [baselineData, setBaselineData] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch baseline on initial load or when confirm button is clicked with new filters
  const fetchBaseline = async (newFilters = filters) => {
    try {
      setLoading(true);
      setFilters(newFilters);
      const res = await fetch(
        `/api/baseline?market=${newFilters.market}&retailer=${newFilters.retailer}&category=${newFilters.category}`
      );
      const data = await res.json();
      setBaselineData(data);

      // Auto-run initial optimization with updated confirmed filters
      runOptimization({
        objective: 'Maximize Sales',
        useGuardrails: false,
        targetMode: 'budget',
        targetValue: 15000000,
        guardrails: {}
      }, newFilters);
    } catch (err) {
      console.error('Error fetching baseline data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaseline();
  }, []);

  const runOptimization = async (optConfig, activeFilters = filters) => {
    try {
      setLoading(true);
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...activeFilters,
          ...optConfig
        })
      });
      const data = await res.json();
      setResultsData(data);
    } catch (err) {
      console.error('Error running optimization:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f0f5ff] px-6 py-6">
      
      {/* App Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Media Budget Optimizer
        </h1>
        {loading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 py-1.5 px-3 rounded-lg border border-blue-200 animate-pulse">
            Calculating optimal allocation...
          </div>
        )}
      </header>

      {/* Filter Bar */}
      <HeaderFilters
        filters={filters}
        onConfirm={fetchBaseline}
      />

      {/* Baseline Details */}
      <LastYearDetails baselineData={baselineData} />

      {/* Objective & Input Guardrails */}
      <ObjectiveAndGuardrails onOptimize={runOptimization} />

      {/* Optimization Outputs & Charts */}
      <OptimizationResults resultsData={resultsData} />

      {/* Granular Changes */}
      <GranularChanges
        granularSpend={resultsData?.granularSpend}
        granularSales={resultsData?.granularSales}
      />

      {/* Deep Dive Breakdown Table */}
      <DeepDiveTable deepDiveData={resultsData?.deepDive} />

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-400 pb-8">
        Media Budget Optimizer &bull; Powered by Flask & React
      </footer>

    </div>
  );
}
