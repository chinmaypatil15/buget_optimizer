import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  ReferenceLine
} from 'recharts';
import MultiSelectDropdown from './MultiSelectDropdown';
import { formatCurrencyShort, formatCurrency, getCurrencySymbol } from '../utils/currencyHelper';

const ALL_BRANDS = ['Felix', 'Gourmet', 'Purina One', 'Pro Plan', 'Bakers', 'Winalot', 'Dentalife'];
const GRANULARITY_OPTIONS = ['Aggregated', 'Detailed'];

export default function GranularChanges({
  granularSpend,
  granularSales,
  detailedSpend,
  detailedSales,
  market = 'UK',
  retailer = 'AMAZON',
  selectedHeaderBrands = 'ALL'
}) {
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [granularity, setGranularity] = useState('Aggregated');
  const [mode, setMode] = useState('Absolute'); // 'Absolute' or '%'

  const searchThirdTactic = retailer === 'AMAZON' ? 'Sponsored Display' : 'Sponsored Video';

  // Compute dynamic brand options based on selectedHeaderBrands from top header dropdown
  const availableBrandOptions = React.useMemo(() => {
    if (!selectedHeaderBrands || selectedHeaderBrands === 'ALL') {
      return ['ALL', ...ALL_BRANDS];
    }
    if (Array.isArray(selectedHeaderBrands)) {
      if (selectedHeaderBrands.length === 0 || selectedHeaderBrands.length === ALL_BRANDS.length) {
        return ['ALL', ...ALL_BRANDS];
      }
      return ['ALL', ...selectedHeaderBrands];
    }
    if (typeof selectedHeaderBrands === 'string') {
      return ['ALL', selectedHeaderBrands];
    }
    return ['ALL', ...ALL_BRANDS];
  }, [selectedHeaderBrands]);

  // Keep selectedBrand valid when available options change
  useEffect(() => {
    if (selectedBrand !== 'ALL' && !availableBrandOptions.includes(selectedBrand)) {
      setSelectedBrand('ALL');
    }
  }, [availableBrandOptions, selectedBrand]);

  const defaultAggregatedSpend = granularSpend && granularSpend.length > 0 ? granularSpend : [
    { tactic: 'Total Search', value: 320000, pctValue: 8 },
    { tactic: 'Total Display', value: -120000, pctValue: -5 }
  ];

  const defaultAggregatedSales = granularSales && granularSales.length > 0 ? granularSales : [
    { tactic: 'Total Search', value: 768000, pctValue: 12 },
    { tactic: 'Total Display', value: -288000, pctValue: -7.5 }
  ];

  const defaultDetailedSpend = detailedSpend && detailedSpend.length > 0 ? detailedSpend : [
    { tactic: 'Sponsored Product', value: 250000, pctValue: 12.5 },
    { tactic: 'Sponsored Brand', value: 80000, pctValue: 4.0 },
    { tactic: searchThirdTactic, value: -30000, pctValue: -1.5 },
    { tactic: 'Onsite Display', value: 90000, pctValue: 4.5 },
    { tactic: 'Offsite Display', value: -200000, pctValue: -10.0 }
  ];

  const defaultDetailedSales = detailedSales && detailedSales.length > 0 ? detailedSales : [
    { tactic: 'Sponsored Product', value: 600000, pctValue: 25.0 },
    { tactic: 'Sponsored Brand', value: 192000, pctValue: 8.0 },
    { tactic: searchThirdTactic, value: -72000, pctValue: -3.0 },
    { tactic: 'Onsite Display', value: 216000, pctValue: 9.0 },
    { tactic: 'Offsite Display', value: -480000, pctValue: -20.0 }
  ];

  const currentSpend = granularity === 'Detailed' ? defaultDetailedSpend : defaultAggregatedSpend;
  const currentSales = granularity === 'Detailed' ? defaultDetailedSales : defaultAggregatedSales;

  // Smart filter for spend and sales data based on selected brand
  const filterBySelectedBrands = (items) => {
    if (!items || items.length === 0) return [];
    if (!selectedBrand || selectedBrand === 'ALL') return items;

    // Check if any item in the array actually matches a known brand name
    const hasBrandSpecificItems = items.some(item => {
      const name = String(item.tactic || item.brand || '');
      return ALL_BRANDS.some(b => name.toLowerCase().includes(b.toLowerCase()));
    });

    // If items are brand-specific (e.g. Felix, Gourmet...), filter them by selectedBrand
    if (hasBrandSpecificItems) {
      return items.filter(item => {
        const name = String(item.tactic || item.brand || '');
        const matchesKnownBrand = ALL_BRANDS.some(b => name.toLowerCase().includes(b.toLowerCase()));
        if (!matchesKnownBrand) return true; // Keep general channel items if present
        return name.toLowerCase().includes(selectedBrand.toLowerCase());
      });
    }

    // Otherwise (e.g., general "Total Search", "Total Display" or Detailed tactics), keep all items so graph is not empty
    return items;
  };

  const filteredSpend = filterBySelectedBrands(currentSpend);
  const filteredSales = filterBySelectedBrands(currentSales);

  // Transform data based on active mode ('Absolute' vs '%')
  const transformDataForChart = (items, isSales = false) => {
    if (!items || items.length === 0) return [];
    return items.map((item) => {
      if (mode === '%') {
        let val = item.pctValue;
        if (val === undefined || val === null) {
          const tName = String(item.tactic || item.brand || '').toLowerCase();
          if (tName.includes('search')) val = isSales ? 12 : 8;
          else if (tName.includes('display')) val = isSales ? -7.5 : -5;
          else val = item.value ? Math.round((item.value / 4000000) * 100) : 0;
        }
        return {
          ...item,
          value: val,
          rawAbsolute: item.value
        };
      }
      return item;
    });
  };

  const chartSpendData = transformDataForChart(filteredSpend, false);
  const chartSalesData = transformDataForChart(filteredSales, true);

  // Helper to calculate SYMMETRIC dynamic ticks for Absolute mode
  const calculateSymmetricDynamicTicks = (items, defaultMax = 450000) => {
    let maxAbs = 0;
    if (items && items.length > 0) {
      items.forEach((item) => {
        const v = Math.abs(item.value || 0);
        if (v > maxAbs) maxAbs = v;
      });
    }

    if (maxAbs === 0) maxAbs = defaultMax;

    let step = 150000;
    if (maxAbs <= 150000) step = 50000;
    else if (maxAbs <= 350000) step = 150000;
    else if (maxAbs <= 750000) step = 250000;
    else if (maxAbs <= 1000000) step = 300000;
    else if (maxAbs <= 2000000) step = 500000;
    else {
      const rough = maxAbs / 3;
      const mag = Math.pow(10, Math.floor(Math.log10(rough)));
      step = Math.ceil(rough / mag) * mag;
    }

    const stepCount = Math.max(2, Math.ceil((maxAbs * 1.35) / step));
    const limit = stepCount * step;

    const ticks = [];
    for (let t = -limit; t <= limit + 0.1; t += step) {
      ticks.push(Math.round(t));
    }

    return {
      ticks,
      domain: [-limit, limit]
    };
  };

  // Helper to calculate SYMMETRIC dynamic percentage ticks with 0% in EXACT CENTER (50%) and dynamic end ticks
  const calculateSymmetricPctTicks = (chartData, defaultMaxPct = 15) => {
    let maxAbsPct = 0;
    if (chartData && chartData.length > 0) {
      chartData.forEach((item) => {
        const v = Math.abs(item.value || 0);
        if (v > maxAbsPct) maxAbsPct = v;
      });
    }

    if (maxAbsPct === 0) maxAbsPct = defaultMaxPct;

    // Pick a clean step size for percentage (5%, 10%, 15%, 25%, 50%...)
    let step = 5;
    if (maxAbsPct <= 10) step = 5;
    else if (maxAbsPct <= 20) step = 10;
    else if (maxAbsPct <= 40) step = 15;
    else if (maxAbsPct <= 60) step = 25;
    else if (maxAbsPct <= 100) step = 50;
    else {
      step = Math.ceil(maxAbsPct / 2 / 10) * 10;
    }

    // Number of steps on each side (symmetric around 0!)
    const stepCount = Math.max(2, Math.ceil((maxAbsPct * 1.3) / step));
    const limit = stepCount * step;

    const ticks = [];
    for (let t = -limit; t <= limit + 0.1; t += step) {
      ticks.push(Math.round(t));
    }

    return {
      ticks,
      domain: [-limit, limit]
    };
  };

  const spendInfo = calculateSymmetricDynamicTicks(filteredSpend, 450000);
  const salesInfo = calculateSymmetricDynamicTicks(filteredSales, 900000);

  const spendPctInfo = calculateSymmetricPctTicks(chartSpendData, 15);
  const salesPctInfo = calculateSymmetricPctTicks(chartSalesData, 15);

  const formatAxisTick = (v) => {
    if (mode === '%') return `${v}%`;
    const symbol = getCurrencySymbol(market);
    if (v === 0) return `${symbol}0K`;
    return formatCurrencyShort(v, market);
  };

  const xAxisSpendProps = mode === '%'
    ? { ticks: spendPctInfo.ticks, domain: spendPctInfo.domain }
    : { ticks: spendInfo.ticks, domain: spendInfo.domain };

  const xAxisSalesProps = mode === '%'
    ? { ticks: salesPctInfo.ticks, domain: salesPctInfo.domain }
    : { ticks: salesInfo.ticks, domain: salesInfo.domain };

  // Custom label renderer for horizontal diverging bar charts matching Image
  const renderHorizontalLabel = (props) => {
    const { x, y, width, height, value } = props;
    if (value === undefined || value === null) return null;
    const isPositive = value >= 0;
    const labelX = isPositive ? x + width + 6 : x + width - 6;
    const textAnchor = isPositive ? 'start' : 'end';

    const labelText = mode === '%'
      ? `${value}%`
      : formatCurrencyShort(value, market);

    return (
      <text
        x={labelX}
        y={y + height / 2 + 4}
        fill={isPositive ? '#10b981' : '#ef4444'}
        textAnchor={textAnchor}
        fontSize={11}
        fontWeight={600}
      >
        {labelText}
      </text>
    );
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 4, width: '100%' }}>
      
      {/* Title & Filter Controls */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
        New vs Last Year Spend & Sales
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 2, mb: 3 }}>
        
        {/* BRAND SINGLE-SELECT DROPDOWN MATCHING IMAGE 1 */}
        <Box sx={{ width: 180, position: 'relative', zIndex: 40 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
            BRAND
          </Typography>
          <MultiSelectDropdown
            compact={true}
            options={availableBrandOptions}
            selected={[selectedBrand]}
            showSelectAll={false}
            showCheckboxes={false}
            onChange={(newSelected) => setSelectedBrand(newSelected[0] || 'ALL')}
          />
        </Box>

        {/* MEDIA TACTIC GRANULARITY */}
        <Box sx={{ width: 180, position: 'relative', zIndex: 40 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
            MEDIA TACTIC GRANULARITY
          </Typography>
          <MultiSelectDropdown
            compact={true}
            options={GRANULARITY_OPTIONS}
            selected={[granularity]}
            showSelectAll={false}
            showCheckboxes={false}
            onChange={(newSelected) => setGranularity(newSelected[0] || 'Aggregated')}
          />
        </Box>

        {/* ABSOLUTE / % TOGGLE matching image bottom alignment */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="small"
            onClick={() => setMode('Absolute')}
            sx={{
              px: 2,
              height: '32px',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: '6px',
              textTransform: 'none',
              bgcolor: mode === 'Absolute' ? '#2563eb' : '#ffffff',
              color: mode === 'Absolute' ? '#ffffff' : '#0f172a',
              border: mode === 'Absolute' ? '1px solid #2563eb' : '1px solid #e2e8f0',
              boxShadow: 'none',
              '&:hover': { bgcolor: mode === 'Absolute' ? '#1d4ed8' : '#f8fafc' }
            }}
          >
            Absolute
          </Button>
          <Button
            size="small"
            onClick={() => setMode('%')}
            sx={{
              px: 2,
              height: '32px',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: '6px',
              textTransform: 'none',
              bgcolor: mode === '%' ? '#2563eb' : '#ffffff',
              color: mode === '%' ? '#ffffff' : '#0f172a',
              border: mode === '%' ? '1px solid #2563eb' : '1px solid #e2e8f0',
              boxShadow: 'none',
              '&:hover': { bgcolor: mode === '%' ? '#1d4ed8' : '#f8fafc' }
            }}
          >
            %
          </Button>
        </Box>

      </Box>

      {/* 2 Diverging Horizontal Bar Charts - 100% Full Width CSS Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr'
          },
          gap: 3,
          width: '100%'
        }}
      >
        {/* Change in Spend */}
        <Box sx={{ width: '100%' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
            Change in Spend
          </Typography>
          <Box sx={{ height: granularity === 'Detailed' ? 260 : 220, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartSpendData} layout="vertical" margin={{ top: 10, right: 45, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  ticks={xAxisSpendProps.ticks}
                  domain={xAxisSpendProps.domain}
                  tickFormatter={formatAxisTick}
                  tick={{ fontSize: 10, fill: '#475569' }}
                  axisLine={{ stroke: '#64748b', strokeWidth: 1.5 }}
                  tickLine={{ stroke: '#64748b', strokeWidth: 1.5 }}
                />
                <YAxis
                  type="category"
                  dataKey="tactic"
                  width={110}
                  tick={{ fontSize: 10, fill: '#475569' }}
                  axisLine={{ stroke: '#64748b', strokeWidth: 1.5 }}
                  tickLine={{ stroke: '#64748b', strokeWidth: 1.5 }}
                />
                <Tooltip formatter={(v) => [mode === '%' ? `${v}%` : formatCurrency(v, market), 'Change']} />
                <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1.5} />
                <Bar dataKey="value">
                  <LabelList dataKey="value" content={renderHorizontalLabel} />
                  {chartSpendData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value >= 0 ? '#10b981' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Change in Incremental Sales */}
        <Box sx={{ width: '100%' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
            Change in Incremental Sales
          </Typography>
          <Box sx={{ height: granularity === 'Detailed' ? 260 : 220, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartSalesData} layout="vertical" margin={{ top: 10, right: 45, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  ticks={xAxisSalesProps.ticks}
                  domain={xAxisSalesProps.domain}
                  tickFormatter={formatAxisTick}
                  tick={{ fontSize: 10, fill: '#475569' }}
                  axisLine={{ stroke: '#64748b', strokeWidth: 1.5 }}
                  tickLine={{ stroke: '#64748b', strokeWidth: 1.5 }}
                />
                <YAxis
                  type="category"
                  dataKey="tactic"
                  width={110}
                  tick={{ fontSize: 10, fill: '#475569' }}
                  axisLine={{ stroke: '#64748b', strokeWidth: 1.5 }}
                  tickLine={{ stroke: '#64748b', strokeWidth: 1.5 }}
                />
                <Tooltip formatter={(v) => [mode === '%' ? `${v}%` : formatCurrency(v, market), 'Change']} />
                <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1.5} />
                <Bar dataKey="value">
                  <LabelList dataKey="value" content={renderHorizontalLabel} />
                  {chartSalesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value >= 0 ? '#10b981' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

      </Box>

    </Paper>
  );
}
