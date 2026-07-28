import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, CircularProgress, Chip } from '@mui/material';
import theme from './theme';
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
  const [hasOptimized, setHasOptimized] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch baseline on initial load or when confirm button is clicked with new filters
  const fetchBaseline = async (newFilters = filters) => {
    try {
      setLoading(true);
      setFilters(newFilters);
      setHasOptimized(false);
      setResultsData(null);
      const res = await fetch(
        `/api/baseline?market=${newFilters.market}&retailer=${newFilters.retailer}&category=${newFilters.category}&brand=${newFilters.brand}&mediaLever=${newFilters.mediaLever}`
      );
      const data = await res.json();
      setBaselineData(data);
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
      setHasOptimized(true);

      // Smooth scroll down to results section after optimizing
      setTimeout(() => {
        const resultsElement = document.getElementById('optimization-results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Error running optimization:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f5ff', px: 3, py: 3 }}>
        
        {/* App Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Media Budget Optimizer
          </Typography>
          {loading && (
            <Chip
              icon={<CircularProgress size={14} color="primary" />}
              label="Calculating optimal allocation..."
              size="small"
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 600, bgcolor: 'background.paper' }}
            />
          )}
        </Box>

        {/* Filter Bar */}
        <HeaderFilters
          filters={filters}
          onConfirm={fetchBaseline}
        />

        {/* Baseline Details */}
        <LastYearDetails baselineData={baselineData} market={filters.market} />

        {/* Objective & Input Guardrails */}
        <ObjectiveAndGuardrails onOptimize={runOptimization} market={filters.market} />

        {/* Optimization Outputs & Charts - ONLY DISPLAY AFTER CLICKING OPTIMIZE BUDGET */}
        {hasOptimized && resultsData && (
          <>
            <Box id="optimization-results-section">
              <OptimizationResults
                resultsData={resultsData}
                market={filters.market}
                selectedBrands={filters.brand}
              />
            </Box>

            {/* Granular Changes */}
            <GranularChanges
              granularSpend={resultsData?.granularSpend}
              granularSales={resultsData?.granularSales}
              detailedSpend={resultsData?.detailedSpend}
              detailedSales={resultsData?.detailedSales}
              market={filters.market}
              selectedHeaderBrands={filters.brand}
            />

            {/* Deep Dive Breakdown Table */}
            <DeepDiveTable deepDiveData={resultsData?.deepDive} market={filters.market} />
          </>
        )}

        {/* Footer */}
        <Box component="footer" sx={{ mt: 6, pb: 4, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Media Budget Optimizer &bull; Powered by Flask & React with Material UI
          </Typography>
        </Box>

      </Box>
    </ThemeProvider>
  );
}
