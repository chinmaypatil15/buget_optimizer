import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { formatCurrency, formatCurrencyShort } from '../utils/currencyHelper';

export default function LastYearDetails({ baselineData, market = 'UK' }) {
  if (!baselineData) return null;

  const { metrics, brandShares, saturationCurve } = baselineData;

  // Stacked bar dataset matching Image 2 (horizontal 100% stacked bar chart)
  const brandShareData = [
    {
      category: 'Brand Share',
      ...(brandShares || {
        Felix: 14.3,
        Gourmet: 14.3,
        'Purina One': 14.3,
        'Pro Plan': 14.3,
        Bakers: 14.3,
        Winalot: 14.3,
        Dentalife: 14.2
      })
    }
  ];

  const brandColors = {
    Felix: '#3b82f6',
    Gourmet: '#93c5fd',
    'Purina One': '#1d4ed8',
    'Pro Plan': '#60a5fa',
    Bakers: '#a5b4fc',
    Winalot: '#38bdf8',
    Dentalife: '#bae6fd'
  };

  const maxInv = saturationCurve && saturationCurve.length > 0
    ? saturationCurve[saturationCurve.length - 1].investment
    : 24000000;

  const maxSales = saturationCurve && saturationCurve.length > 0
    ? Math.max(...saturationCurve.map((p) => p.incrementalSales)) * 1.05
    : 8500000;

  const xTicks = React.useMemo(() => {
    const step = maxInv / 10;
    return Array.from({ length: 11 }, (_, i) => Math.round(i * step));
  }, [maxInv]);

  const yLeftTicks = React.useMemo(() => {
    const step = maxSales / 4;
    return Array.from({ length: 5 }, (_, i) => Math.round(i * step));
  }, [maxSales]);

  const renderCustomYAxisLabel = (props) => {
    const { viewBox } = props;
    if (!viewBox) return null;
    const { x, y, height } = viewBox;
    return (
      <g transform={`translate(${x + 25}, ${y + height / 2})`}>
        <text
          x={0}
          y={-7}
          textAnchor="end"
          fontSize={12}
          fontWeight={500}
          fill="#475569"
        >
          Last Year
        </text>
        <text
          x={0}
          y={11}
          textAnchor="end"
          fontSize={12}
          fontWeight={500}
          fill="#475569"
        >
          Budget
        </text>
      </g>
    );
  };

  const renderLegendContent = (props) => {
    const { payload } = props;
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, pt: 1 }}>
        {payload?.map((entry, index) => (
          <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <svg width="24" height="12" viewBox="0 0 24 12">
              <line x1="0" y1="6" x2="24" y2="6" stroke={entry.color} strokeWidth="1.5" />
              <circle cx="12" cy="6" r="3" fill="#ffffff" stroke={entry.color} strokeWidth="1.5" />
            </svg>
            <Typography variant="caption" sx={{ fontSize: '0.72rem', color: entry.color, fontWeight: 600 }}>
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 4, width: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
        Last Year Details
      </Typography>

      {/* 5 KPI Metric Cards Row - 100% Full Width CSS Grid */}
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
            Last Year Budget
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {formatCurrency(metrics?.budget, market)}
          </Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, width: '100%' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
            Last Year Total Volume
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {metrics?.volume?.toLocaleString()}
          </Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, width: '100%' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
            Last Year Total Sales
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {formatCurrency(metrics?.sales, market)}
          </Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, width: '100%' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
            Last Year Total NNS
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {formatCurrency(metrics?.nns, market)}
          </Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, width: '100%' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
            Last Year ROI
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {metrics?.roi?.toFixed(2)}
          </Typography>
        </Paper>
      </Box>

      {/* 2 Side-by-side Charts - 100% Full Width CSS Grid */}
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
        {/* Brand Share Chart */}
        <Paper elevation={0} sx={{ p: 2.5, width: '100%' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
            Last Year Budget - Brand Share
          </Typography>
          <Box sx={{ height: 260, width: '100%', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                layout="vertical"
                data={brandShareData}
                margin={{ top: 20, right: 25, left: 80, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#cbd5e1" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#94a3b8' }}
                  tickLine={{ stroke: '#94a3b8' }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={false}
                  axisLine={{ stroke: '#94a3b8' }}
                  tickLine={false}
                  label={renderCustomYAxisLabel}
                />
                <Tooltip formatter={(v, name) => [`${v}%`, name]} />
                <Legend iconType="square" wrapperStyle={{ fontSize: '0.75rem', paddingTop: '12px' }} />
                {Object.keys(brandColors).map((brand) => (
                  <Bar
                    key={brand}
                    dataKey={brand}
                    stackId="brandStack"
                    fill={brandColors[brand]}
                    barSize={80}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Saturation Curve Chart */}
        <Paper elevation={0} sx={{ p: 2.5, width: '100%' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
            Saturation Curve
          </Typography>
          <Box sx={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={saturationCurve} margin={{ top: 15, right: 15, left: 15, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis
                  type="number"
                  dataKey="investment"
                  domain={[0, maxInv]}
                  ticks={xTicks}
                  interval={0}
                  tickFormatter={(v) => formatCurrencyShort(v, market)}
                  tick={{ fontSize: 10, fill: '#475569' }}
                  axisLine={{ stroke: '#64748b' }}
                  tickLine={{ stroke: '#64748b' }}
                  label={{ value: 'Investment', position: 'insideBottom', offset: -4, fontSize: 10, fill: '#475569' }}
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, maxSales]}
                  ticks={yLeftTicks}
                  interval={0}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                  tick={{ fontSize: 10, fill: '#475569' }}
                  axisLine={{ stroke: '#64748b' }}
                  tickLine={{ stroke: '#64748b' }}
                  label={{ value: 'Incremental Sales', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#475569' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 3.6]}
                  ticks={[0, 0.9, 1.8, 2.7, 3.6]}
                  interval={0}
                  tickFormatter={(v) => (v === 0 ? '0' : v.toFixed(1))}
                  tick={{ fontSize: 10, fill: '#475569' }}
                  axisLine={{ stroke: '#64748b' }}
                  tickLine={{ stroke: '#64748b' }}
                  label={{ value: 'ROI', angle: 90, position: 'insideRight', fontSize: 10, fill: '#475569' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0].payload;
                      const inv = dataPoint.investment ?? label;
                      const sales = dataPoint.incrementalSales;
                      const roi = dataPoint.roi;

                      return (
                        <Box
                          sx={{
                            bgcolor: '#ffffff',
                            p: 1.5,
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            minWidth: 170
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
                            {typeof inv === 'number' ? Math.round(inv) : inv}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2563eb', mb: 0.5 }}>
                            Incremental Sales : {sales !== undefined ? Math.round(sales) : ''}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444' }}>
                            ROI : {typeof roi === 'number' ? roi.toFixed(2) : roi}
                          </Typography>
                        </Box>
                      );
                    }
                    return null;
                  }}
                />
                <Legend content={renderLegendContent} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="incrementalSales"
                  name="Incremental Sales"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="roi"
                  name="ROI"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
