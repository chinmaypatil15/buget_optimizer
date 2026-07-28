import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { formatCurrency } from '../utils/currencyHelper';

export default function DeepDiveTable({ deepDiveData, market = 'UK' }) {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [displayExpanded, setDisplayExpanded] = useState(false);

  if (!deepDiveData || deepDiveData.length === 0) return null;

  const render6Subheaders = (isLastGroup = false) => (
    <>
      <TableCell align="right" sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', py: 0.75, px: 0.5, whiteSpace: 'nowrap' }}>Last Year Budget</TableCell>
      <TableCell align="right" sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', py: 0.75, px: 0.5, whiteSpace: 'nowrap' }}>New Budget</TableCell>
      <TableCell align="right" sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', py: 0.75, px: 0.5, whiteSpace: 'nowrap' }}>% Budget Change</TableCell>
      <TableCell align="right" sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', py: 0.75, px: 0.5, whiteSpace: 'nowrap' }}>Last Year TOTAL SALES</TableCell>
      <TableCell align="right" sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', py: 0.75, px: 0.5, whiteSpace: 'nowrap' }}>New TOTAL SALES</TableCell>
      <TableCell align="right" sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', py: 0.75, px: 0.5, whiteSpace: 'nowrap', borderRight: isLastGroup ? 'none' : '2px solid #e2e8f0' }}>% TOTAL SALES Change</TableCell>
    </>
  );

  const render6DataCells = (lastBudget, newBudget, pctChange, lastSales, newSales, salesPctChange, isLastGroup = false) => (
    <>
      <TableCell align="right" sx={{ fontSize: '0.72rem', color: 'text.primary', py: 1, px: 0.5, whiteSpace: 'nowrap' }}>{formatCurrency(lastBudget, market)}</TableCell>
      <TableCell align="right" sx={{ fontSize: '0.72rem', color: 'text.primary', py: 1, px: 0.5, whiteSpace: 'nowrap' }}>{formatCurrency(newBudget, market)}</TableCell>
      <TableCell align="right" sx={{ fontSize: '0.72rem', fontWeight: 700, color: (pctChange ?? 0) >= 0 ? '#059669' : '#dc2626', py: 1, px: 0.5, whiteSpace: 'nowrap' }}>
        {(pctChange ?? 0) >= 0 ? `+${pctChange}%` : `${pctChange}%`}
      </TableCell>
      <TableCell align="right" sx={{ fontSize: '0.72rem', color: 'text.primary', py: 1, px: 0.5, whiteSpace: 'nowrap' }}>{formatCurrency(lastSales, market)}</TableCell>
      <TableCell align="right" sx={{ fontSize: '0.72rem', color: 'text.primary', py: 1, px: 0.5, whiteSpace: 'nowrap' }}>{formatCurrency(newSales, market)}</TableCell>
      <TableCell align="right" sx={{ fontSize: '0.72rem', fontWeight: 700, color: (salesPctChange ?? 0) >= 0 ? '#059669' : '#dc2626', py: 1, px: 0.5, whiteSpace: 'nowrap', borderRight: isLastGroup ? 'none' : '2px solid #e2e8f0' }}>
        {(salesPctChange ?? 0) >= 0 ? `+${salesPctChange}%` : `${salesPctChange}%`}
      </TableCell>
    </>
  );

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
        New vs Last Year Budget - Deep Dive
      </Typography>

      <TableContainer sx={{ width: '100%', overflowX: (searchExpanded || displayExpanded) ? 'auto' : 'auto' }}>
        <Table size="small" sx={{ borderCollapse: 'collapse', width: '100%', minWidth: (searchExpanded || displayExpanded) ? 1800 : '100%' }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell
                rowSpan={2}
                sx={{
                  fontWeight: 800,
                  color: 'text.primary',
                  fontSize: '0.72rem',
                  letterSpacing: '0.05em',
                  borderBottom: '2px solid #e2e8f0',
                  py: 1,
                  px: 1,
                  whiteSpace: 'nowrap'
                }}
              >
                Brand
              </TableCell>

              {/* TOTAL SEARCH Header */}
              <TableCell
                colSpan={6}
                align="center"
                onClick={() => setSearchExpanded(!searchExpanded)}
                sx={{
                  fontWeight: 800,
                  color: '#2563eb',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid #e2e8f0',
                  borderRight: '2px solid #e2e8f0',
                  py: 1,
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: '#eff6ff' }
                }}
              >
                {searchExpanded ? 'Total Search \u2212' : 'Total Search +'}
              </TableCell>

              {/* Expanded Search Sub-tactics Headers */}
              {searchExpanded && (
                <>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0',
                      borderRight: '2px solid #e2e8f0',
                      py: 1,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Sponsored Product
                  </TableCell>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0',
                      borderRight: '2px solid #e2e8f0',
                      py: 1,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Sponsored Brand
                  </TableCell>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0',
                      borderRight: '2px solid #e2e8f0',
                      py: 1,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Sponsored Video
                  </TableCell>
                </>
              )}

              {/* TOTAL DISPLAY Header */}
              <TableCell
                colSpan={6}
                align="center"
                onClick={() => setDisplayExpanded(!displayExpanded)}
                sx={{
                  fontWeight: 800,
                  color: '#2563eb',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid #e2e8f0',
                  borderRight: displayExpanded ? '2px solid #e2e8f0' : 'none',
                  py: 1,
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: '#eff6ff' }
                }}
              >
                {displayExpanded ? 'Total Display \u2212' : 'Total Display +'}
              </TableCell>

              {/* Expanded Display Sub-tactics Headers */}
              {displayExpanded && (
                <>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0',
                      borderRight: '2px solid #e2e8f0',
                      py: 1,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Onsite Display
                  </TableCell>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0',
                      py: 1,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Offsite Display
                  </TableCell>
                </>
              )}
            </TableRow>

            {/* Subheaders Row */}
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              {/* Search Subheaders */}
              {render6Subheaders(false)}

              {/* Search Expanded Subheaders */}
              {searchExpanded && (
                <>
                  {render6Subheaders(false)}
                  {render6Subheaders(false)}
                  {render6Subheaders(false)}
                </>
              )}

              {/* Display Subheaders */}
              {render6Subheaders(!displayExpanded)}

              {/* Display Expanded Subheaders */}
              {displayExpanded && (
                <>
                  {render6Subheaders(false)}
                  {render6Subheaders(true)}
                </>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {deepDiveData.map((row) => {
              // Derived values matching image ratios if not directly passed
              const spLastB = row.spLastBudget ?? Math.round((row.searchLastBudget || 0) * 0.60);
              const spNewB = row.spNewBudget ?? Math.round((row.searchNewBudget || 0) * 0.60);
              const spPctB = row.spPctChange ?? row.searchPctChange;
              const spLastS = row.spLastSales ?? Math.round((row.searchLastSales || 0) * 0.60);
              const spNewS = row.spNewSales ?? Math.round((row.searchNewSales || 0) * 0.60);
              const spPctS = row.spSalesPctChange ?? row.searchSalesPctChange;

              const sbLastB = row.sbLastBudget ?? Math.round((row.searchLastBudget || 0) * 0.28);
              const sbNewB = row.sbNewBudget ?? Math.round((row.searchNewBudget || 0) * 0.28);
              const sbPctB = row.sbPctChange ?? row.searchPctChange;
              const sbLastS = row.sbLastSales ?? Math.round((row.searchLastSales || 0) * 0.28);
              const sbNewS = row.sbNewSales ?? Math.round((row.searchNewSales || 0) * 0.28);
              const sbPctS = row.sbSalesPctChange ?? row.searchSalesPctChange;

              const svLastB = row.svLastBudget ?? Math.round((row.searchLastBudget || 0) * 0.12);
              const svNewB = row.svNewBudget ?? Math.round((row.searchNewBudget || 0) * 0.12);
              const svPctB = row.svPctChange ?? row.searchPctChange;
              const svLastS = row.svLastSales ?? Math.round((row.searchLastSales || 0) * 0.12);
              const svNewS = row.svNewSales ?? Math.round((row.searchNewSales || 0) * 0.12);
              const svPctS = row.svSalesPctChange ?? row.searchSalesPctChange;

              const onsiteLastB = row.onsiteLastBudget ?? Math.round((row.displayLastBudget || 0) * 0.62);
              const onsiteNewB = row.onsiteNewBudget ?? Math.round((row.displayNewBudget || 0) * 0.62);
              const onsitePctB = row.onsitePctChange ?? row.displayPctChange;
              const onsiteLastS = row.onsiteLastSales ?? Math.round((row.displayLastSales || 0) * 0.62);
              const onsiteNewS = row.onsiteNewSales ?? Math.round((row.displayNewSales || 0) * 0.62);
              const onsitePctS = row.onsiteSalesPctChange ?? row.displaySalesPctChange;

              const offsiteLastB = row.offsiteLastBudget ?? Math.round((row.displayLastBudget || 0) * 0.38);
              const offsiteNewB = row.offsiteNewBudget ?? Math.round((row.displayNewBudget || 0) * 0.38);
              const offsitePctB = row.offsitePctChange ?? row.displayPctChange;
              const offsiteLastS = row.offsiteLastSales ?? Math.round((row.displayLastSales || 0) * 0.38);
              const offsiteNewS = row.offsiteNewSales ?? Math.round((row.displayNewSales || 0) * 0.38);
              const offsitePctS = row.offsiteSalesPctChange ?? row.displaySalesPctChange;

              return (
                <TableRow
                  key={row.brand}
                  sx={{
                    '&:hover': { bgcolor: '#f8fafc' },
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  {/* Brand Name */}
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem', color: 'text.primary', py: 1.25, whiteSpace: 'nowrap' }}>
                    {row.brand}
                  </TableCell>

                  {/* SEARCH Metrics */}
                  {render6DataCells(row.searchLastBudget, row.searchNewBudget, row.searchPctChange, row.searchLastSales, row.searchNewSales, row.searchSalesPctChange, false)}

                  {/* SEARCH Expanded Metrics */}
                  {searchExpanded && (
                    <>
                      {render6DataCells(spLastB, spNewB, spPctB, spLastS, spNewS, spPctS, false)}
                      {render6DataCells(sbLastB, sbNewB, sbPctB, sbLastS, sbNewS, sbPctS, false)}
                      {render6DataCells(svLastB, svNewB, svPctB, svLastS, svNewS, svPctS, false)}
                    </>
                  )}

                  {/* DISPLAY Metrics */}
                  {render6DataCells(row.displayLastBudget, row.displayNewBudget, row.displayPctChange, row.displayLastSales, row.displayNewSales, row.displaySalesPctChange, !displayExpanded)}

                  {/* DISPLAY Expanded Metrics */}
                  {displayExpanded && (
                    <>
                      {render6DataCells(onsiteLastB, onsiteNewB, onsitePctB, onsiteLastS, onsiteNewS, onsitePctS, false)}
                      {render6DataCells(offsiteLastB, offsiteNewB, offsitePctB, offsiteLastS, offsiteNewS, offsitePctS, true)}
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
