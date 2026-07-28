import React, { useState } from 'react';
import { Paper, Box, Typography, Chip, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList
} from 'recharts';
import { formatCurrency, formatCurrencyShort } from '../utils/currencyHelper';

export default function OptimizationResults({ resultsData, market = 'UK', selectedBrands = 'ALL' }) {
  const [viewMode, setViewMode] = useState('Absolute'); // 'Absolute' or 'Share'

  if (!resultsData) return null;

  const metrics = resultsData.metrics || resultsData.newMetrics || {};
  const rawWaterfall = resultsData.waterfall || [];
  const spendComparison = resultsData.spendComparison || resultsData.brandSpendSales || [];
  const salesComparison = resultsData.salesComparison || resultsData.brandSpendSales || [];

  // Filter spend & sales comparison charts by selected brands matching Image 2
  const filterBrands = (items) => {
    if (!items || !Array.isArray(items)) return [];
    if (selectedBrands === 'ALL' || !selectedBrands) return items;
    const activeBrands = Array.isArray(selectedBrands) ? selectedBrands : [selectedBrands];
    if (activeBrands.length === 0) return items;
    return items.filter((item) => {
      const bName = String(item.brand || item.name || item.tactic || '');
      return activeBrands.some((b) => String(b).toLowerCase() === bName.toLowerCase() || bName.toLowerCase().includes(String(b).toLowerCase()));
    });
  };

  const filteredSpendComparison = filterBrands(spendComparison);
  const filteredSalesComparison = filterBrands(salesComparison);

  // Compute Waterfall range data for floating bars and top labels
  const lastYearVal = rawWaterfall.find((w) => w.name && w.name.toLowerCase().includes('last year'))?.value ?? rawWaterfall[0]?.value ?? 0;
  const changeVal = rawWaterfall.find((w) => w.name && w.name.toLowerCase().includes('change'))?.value ?? rawWaterfall[1]?.value ?? 0;
  const newBudgetVal = rawWaterfall.find((w) => w.name && w.name.toLowerCase().includes('new'))?.value ?? rawWaterfall[2]?.value ?? (lastYearVal + changeVal);

  const waterfallData = [
    {
      name: 'Last Year Budget',
      range: [0, lastYearVal],
      rawAmount: lastYearVal,
      displayValue: formatCurrency(lastYearVal, market, 0)
    },
    {
      name: 'Budget Change',
      range: changeVal >= 0
        ? [lastYearVal, lastYearVal + changeVal]
        : [lastYearVal + changeVal, lastYearVal],
      rawAmount: changeVal,
      displayValue: formatCurrency(changeVal, market, 0)
    },
    {
      name: 'New Budget',
      range: [0, newBudgetVal],
      rawAmount: newBudgetVal,
      displayValue: formatCurrency(newBudgetVal, market, 0)
    }
  ];

  const renderBadge = (pct) => {
    if (pct === undefined || pct === null) return null;
    const isPositive = pct >= 0;
    return (
      <Chip
        icon={isPositive ? <TrendingUpIcon style={{ fontSize: 14 }} /> : <TrendingDownIcon style={{ fontSize: 14 }} />}
        label={isPositive ? `+${pct}%` : `${pct}%`}
        size="small"
        sx={{
          mt: 0.75,
          fontWeight: 700,
          fontSize: '0.6875rem',
          height: 22,
          bgcolor: isPositive ? '#ecfdf5' : '#fff1f2',
          color: isPositive ? '#047857' : '#be123c',
          border: `1px solid ${isPositive ? '#a7f3d0' : '#fecdd3'}`,
          '& .MuiChip-icon': {
            color: isPositive ? '#047857' : '#be123c',
            ml: 0.5
          }
        }}
      />
    );
  };

  const getPct = (primaryKey, fallbackKey) => {
    if (metrics[primaryKey] !== undefined) return metrics[primaryKey];
    return metrics[fallbackKey];
  };

  // Helper to build 100% horizontal stacked share data from comparison array matching 2nd image
  const buildShareData = (items, row1Label, row2Label) => {
    if (!items || items.length === 0) return { shareData: [], brandKeys: [] };

    const totalLastYear = items.reduce((sum, item) => sum + (item.lastYear || 0), 0);
    const totalNew = items.reduce((sum, item) => sum + (item.newBudget || item.newSales || 0), 0);

    const row1Obj = { category: row1Label };
    const row2Obj = { category: row2Label };
    const brandKeys = [];

    items.forEach((item) => {
      const bName = item.brand || item.name || item.tactic || 'Brand';
      brandKeys.push(bName);

      const lyPct = totalLastYear > 0 ? ((item.lastYear || 0) / totalLastYear) * 100 : 0;
      const newPct = totalNew > 0 ? (((item.newBudget || item.newSales || 0)) / totalNew) * 100 : 0;

      row1Obj[bName] = parseFloat(lyPct.toFixed(1));
      row2Obj[bName] = parseFloat(newPct.toFixed(1));
    });

    return {
      shareData: [row1Obj, row2Obj],
      brandKeys
    };
  };

  const BRAND_COLORS = [
    '#3b82f6', // Felix (blue)
    '#93c5fd', // Gourmet (light blue)
    '#1d4ed8', // Bakers (dark blue)
    '#818cf8', // Purina One (indigo)
    '#a5b4fc', // Pro Plan (periwinkle)
    '#38bdf8', // Winalot (sky blue)
    '#0284c7'  // Dentalife (deep sky blue)
  ];

  const { shareData: spendShareData, brandKeys: spendBrandKeys } = buildShareData(
    filteredSpendComparison,
    'Last Year Budget',
    'New Budget'
  );

  const { shareData: salesShareData, brandKeys: salesBrandKeys } = buildShareData(
    filteredSalesComparison,
    'Last Year TOTAL SALES',
    'Optimized TOTAL SALES'
  );

  return (
    <Box sx={{ mb: 4, width: '100%' }}>
      
      {/* 5 KPI Cards for Optimized Results - 100% Full Width CSS Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(5, 1fr)'
          },
          gap: 2,
          mb: 3,
          width: '100%'
        }}
      >
        <Paper elevation={0} sx={{ p: 2.5, width: '100%' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
            New Budget
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {formatCurrency(metrics.budget, market)}
          </Typography>
          {renderBadge(getPct('budgetChangePct', 'pct_budget'))}
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, width: '100%' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
            New Total Volume
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {metrics.volume?.toLocaleString()}
          </Typography>
          {renderBadge(getPct('volumeChangePct', 'pct_volume'))}
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, width: '100%' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
            New Total Sales
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {formatCurrency(metrics.sales, market)}
          </Typography>
          {renderBadge(getPct('salesChangePct', 'pct_sales'))}
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, width: '100%' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
            New Total NNS
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {formatCurrency(metrics.nns, market)}
          </Typography>
          {renderBadge(getPct('nnsChangePct', 'pct_nns'))}
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, width: '100%' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
            New ROI
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {metrics.roi?.toFixed(2)}
          </Typography>
          {renderBadge(getPct('roiChangePct', 'pct_roi'))}
        </Paper>
      </Box>

      {/* SINGLE OUTER PAPER CONTAINER wrapping 3 sub-charts matching Image 2 */}
      <Paper elevation={0} sx={{ p: 3, width: '100%' }}>
        
        {/* Title and View Mode Toggle Header */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            New vs Last Year - Spend & Sales
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              onClick={() => setViewMode('Absolute')}
              sx={{
                px: 2,
                py: 0.5,
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '6px',
                textTransform: 'none',
                bgcolor: viewMode === 'Absolute' ? '#2563eb' : '#ffffff',
                color: viewMode === 'Absolute' ? '#ffffff' : '#0f172a',
                border: viewMode === 'Absolute' ? '1px solid #2563eb' : '1px solid #e2e8f0',
                boxShadow: 'none',
                '&:hover': { bgcolor: viewMode === 'Absolute' ? '#1d4ed8' : '#f8fafc' }
              }}
            >
              View Absolute
            </Button>
            <Button
              size="small"
              onClick={() => setViewMode('Share')}
              sx={{
                px: 2,
                py: 0.5,
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '6px',
                textTransform: 'none',
                bgcolor: viewMode === 'Share' ? '#2563eb' : '#ffffff',
                color: viewMode === 'Share' ? '#ffffff' : '#0f172a',
                border: viewMode === 'Share' ? '1px solid #2563eb' : '1px solid #e2e8f0',
                boxShadow: 'none',
                '&:hover': { bgcolor: viewMode === 'Share' ? '#1d4ed8' : '#f8fafc' }
              }}
            >
              View Share
            </Button>
          </Box>
        </Box>

        {/* 3 Charts Grid inside single outer container */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'repeat(3, 1fr)'
            },
            gap: 3,
            width: '100%'
          }}
        >
          {/* Waterfall Chart */}
          <Box sx={{ width: '100%' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 2 }}>
              Budget Change (Waterfall)
            </Typography>
            <Box sx={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} margin={{ top: 25, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(v) => formatCurrencyShort(v, market)}
                    tick={{ fontSize: 11 }}
                    domain={[0, (dataMax) => Math.ceil(dataMax * 1.15)]}
                  />
                  <Tooltip
                    formatter={(value, name, item) => [
                      formatCurrency(item.payload?.rawAmount ?? (Array.isArray(value) ? Math.abs(value[1] - value[0]) : value), market, 0),
                      'Amount'
                    ]}
                  />
                  <Bar dataKey="range" fill="#4ba0fd" radius={[2, 2, 0, 0]}>
                    <LabelList
                      dataKey="displayValue"
                      position="top"
                      style={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* New vs Last Year Spend */}
          <Box sx={{ width: '100%' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 2 }}>
              New vs Last Year Spend
            </Typography>
            <Box sx={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                {viewMode === 'Absolute' ? (
                  <BarChart data={filteredSpendComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="brand" tick={{ fontSize: 10 }} />
                    <YAxis
                      tickFormatter={(v) => formatCurrencyShort(v, market)}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip formatter={(v) => [formatCurrency(v, market)]} />
                    <Legend />
                    <Bar dataKey="lastYear" name="Last Year Budget" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="newBudget" name="New Budget" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <BarChart
                    layout="vertical"
                    data={spendShareData}
                    margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis type="category" dataKey="category" width={80} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="square"
                      iconSize={10}
                      wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                    />
                    {spendBrandKeys.map((brandName, idx) => (
                      <Bar
                        key={brandName}
                        dataKey={brandName}
                        name={brandName}
                        stackId="spendShare"
                        fill={BRAND_COLORS[idx % BRAND_COLORS.length]}
                      />
                    ))}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* New vs Last Year TOTAL SALES */}
          <Box sx={{ width: '100%' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 2 }}>
              New vs Last Year TOTAL SALES
            </Typography>
            <Box sx={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                {viewMode === 'Absolute' ? (
                  <BarChart data={filteredSalesComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="brand" tick={{ fontSize: 10 }} />
                    <YAxis
                      tickFormatter={(v) => formatCurrencyShort(v, market)}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip formatter={(v) => [formatCurrency(v, market)]} />
                    <Legend />
                    <Bar dataKey="lastYear" name="Last Year TOTAL SALES" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="newBudget" name="New TOTAL SALES" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <BarChart
                    layout="vertical"
                    data={salesShareData}
                    margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis type="category" dataKey="category" width={95} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="square"
                      iconSize={10}
                      wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                    />
                    {salesBrandKeys.map((brandName, idx) => (
                      <Bar
                        key={brandName}
                        dataKey={brandName}
                        name={brandName}
                        stackId="salesShare"
                        fill={BRAND_COLORS[idx % BRAND_COLORS.length]}
                      />
                    ))}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </Box>
          </Box>

        </Box>

      </Paper>

    </Box>
  );
}
