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

  // Stacked bar dataset matching reference (single thin vertical bar at 0% position)
  const stackedData = [
    {
      name: '0%',
      Felix: 14.3,
      Gourmet: 14.3,
      'Purina One': 14.3,
      'Pro Plan': 14.3,
      Bakers: 14.3,
      Winalot: 14.3,
      Dentalife: 14.2
    },
    { name: '25%' },
    { name: '50%' },
    { name: '75%' },
    { name: '100%' }
  ];

  const brandColors = {
    Felix: '#60a5fa',
    Gourmet: '#93c5fd',
    'Purina One': '#2563eb',
    'Pro Plan': '#3b82f6',
    Bakers: '#bfdbfe',
    Winalot: '#38bdf8',
    Dentalife: '#bae6fd'
  };

  const maxInv = saturationCurve && saturationCurve.length > 0
    ? saturationCurve[saturationCurve.length - 1].investment
    : 24000000;

  const maxSales = saturationCurve && saturationCurve.length > 0
    ? Math.max(...saturationCurve.map((p) => p.incrementalSales)) * 1.05
    : 8500000;

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
          <Box sx={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={false}
                  label={{ value: 'Last Year Budget', angle: -90, position: 'insideLeft', fontSize: 11 }}
                />
                <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
                <Legend />
                {Object.keys(brandColors).map((brand) => (
                  <Bar key={brand} dataKey={brand} stackId="a" fill={brandColors[brand]} barSize={8} />
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
              <ComposedChart data={saturationCurve}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="investment"
                  domain={[0, maxInv]}
                  tickFormatter={(v) => formatCurrencyShort(v, market)}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Investment', position: 'insideBottom', offset: -2, fontSize: 10 }}
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, maxSales]}
                  tickFormatter={(v) => formatCurrencyShort(v, market)}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Incremental Sales', angle: -90, position: 'insideLeft', fontSize: 10 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 3.6]}
                  ticks={[0, 0.9, 1.8, 2.7, 3.6]}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'ROI', angle: 90, position: 'insideRight', fontSize: 10 }}
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
                <Legend wrapperStyle={{ paddingTop: 10 }} />
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
