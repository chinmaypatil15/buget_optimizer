import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, CircularProgress, Chip, Button, Avatar } from '@mui/material';
import theme from './theme';
import HeaderFilters from './components/HeaderFilters';
import LastYearDetails from './components/LastYearDetails';
import ObjectiveAndGuardrails from './components/ObjectiveAndGuardrails';
import OptimizationResults from './components/OptimizationResults';
import GranularChanges from './components/GranularChanges';
import DeepDiveTable from './components/DeepDiveTable';
import LoginPage from './components/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

function MainAppContent() {
  const { user, loading: authLoading, logout } = useAuth();

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
    if (user) {
      fetchBaseline();
    }
  }, [user]);

  const runOptimization = async (optConfig, activeFilters = filters) => {
    try {
      setLoading(true);
      const payload = {
        ...optConfig,
        market: activeFilters.market,
        retailer: activeFilters.retailer,
        category: activeFilters.category,
        brand: activeFilters.brand,
        mediaLever: activeFilters.mediaLever
      };

      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      setResultsData(data);
      setHasOptimized(true);

      setTimeout(() => {
        const resultsElement = document.getElementById('optimization-results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } catch (err) {
      console.error('Error running optimization:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8fafc' }}>
        <CircularProgress size={40} sx={{ color: '#2563eb' }} />
      </Box>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', pb: 6, width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
        
        {/* Top User Authentication Header Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.5,
            mb: 2,
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Media Budget Optimizer
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: '20px' }}>
              <Avatar sx={{ width: 26, height: 26, bgcolor: '#2563eb', fontSize: '0.75rem', fontWeight: 700 }}>
                {user.fullName ? user.fullName[0].toUpperCase() : user.username[0].toUpperCase()}
              </Avatar>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
                {user.fullName || user.username}
              </Typography>
              <Chip
                label={user.role || 'User'}
                size="small"
                sx={{ height: 18, fontSize: '0.625rem', fontWeight: 800, bgcolor: '#dbeafe', color: '#1d4ed8' }}
              />
            </Box>

            <Button
              size="small"
              onClick={logout}
              startIcon={<LogoutIcon fontSize="small" />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                color: '#64748b',
                borderRadius: '6px',
                px: 1.5,
                '&:hover': { bgcolor: '#f1f5f9', color: '#ef4444' }
              }}
            >
              Sign Out
            </Button>
          </Box>
        </Box>

        {/* Filters Header Section */}
        <HeaderFilters filters={filters} onApplyFilters={fetchBaseline} loading={loading} />

        {/* Baseline Metrics Cards & Charts Section */}
        <LastYearDetails baselineData={baselineData} market={filters.market} />

        {/* Objective & Guardrails Section */}
        <ObjectiveAndGuardrails
          onOptimize={runOptimization}
          market={filters.market}
          retailer={filters.retailer}
          mediaLever={filters.mediaLever}
        />

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
              retailer={filters.retailer}
              selectedHeaderBrands={filters.brand}
            />

            {/* Deep Dive Breakdown Table */}
            <DeepDiveTable deepDiveData={resultsData?.deepDive} market={filters.market} retailer={filters.retailer} />
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

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
