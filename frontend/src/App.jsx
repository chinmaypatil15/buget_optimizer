import React, { useState, useEffect } from 'react';
import HeaderFilters from './components/HeaderFilters';
import LastYearDetails from './components/LastYearDetails';
import ObjectiveAndGuardrails from './components/ObjectiveAndGuardrails';
import OptimizationResults from './components/OptimizationResults';
import GranularChanges from './components/GranularChanges';
import DeepDiveTable from './components/DeepDiveTable';

export default function App() {
  const [filters, setFilters] = useState({
    market: 'UK',
    retailer: 'AMAZON',
    category: 'PETCARE',
    brand: 'ALL',
    mediaLever: 'ALL'
  });

  const [baselineData, setBaselineData] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch baseline on initial load and when filters confirm
  const fetchBaseline = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/baseline?market=${filters.market}&retailer=${filters.retailer}&category=${filters.category}`
      );
      const data = await res.json();
      setBaselineData(data);

      // Auto-run initial optimization with default £15,000,000 budget
      runOptimization({
        objective: 'Maximize Sales',
        useGuardrails: false,
        targetMode: 'budget',
        targetValue: 15000000,
        guardrails: {}
      });
    } catch (err) {
      console.error('Error fetching baseline data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaseline();
  }, []);

  const runOptimization = async (optConfig) => {
    try {
      setLoading(true);
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...filters,
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* App Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
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
        setFilters={setFilters}
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
