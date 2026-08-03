import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import MultiSelectDropdown from './MultiSelectDropdown';

const MARKET_OPTIONS = ['UK', 'US', 'DE', 'FR', 'IT', 'ES'];
const RETAILER_OPTIONS = ['AMAZON', 'WALMART', 'TESCO', 'ASDA'];
const CATEGORY_OPTIONS = ['PETCARE', 'COFFEE'];
const BRAND_OPTIONS = ['Felix', 'Gourmet', 'Purina One', 'Pro Plan', 'Bakers', 'Winalot', 'Dentalife'];
const MEDIA_LEVER_OPTIONS = ['Search', 'Display'];

export default function HeaderFilters({ filters, onConfirm, onApplyFilters }) {
  // Local pending state - changes are only applied when user clicks Confirm
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleConfirmClick = () => {
    const callback = onConfirm || onApplyFilters;
    if (callback) {
      callback(tempFilters);
    }
  };

  const selectedMarkets = Array.isArray(tempFilters.market)
    ? tempFilters.market
    : tempFilters.market
      ? [MARKET_OPTIONS.find(m => m === tempFilters.market) || MARKET_OPTIONS[0]]
      : [MARKET_OPTIONS[0]];

  const selectedRetailers = Array.isArray(tempFilters.retailer)
    ? tempFilters.retailer
    : tempFilters.retailer
      ? [tempFilters.retailer]
      : [RETAILER_OPTIONS[0]];

  const selectedCategories = Array.isArray(tempFilters.category)
    ? tempFilters.category
    : tempFilters.category
      ? [tempFilters.category]
      : [CATEGORY_OPTIONS[0]];

  const selectedBrands = Array.isArray(tempFilters.brand)
    ? tempFilters.brand
    : tempFilters.brand === 'ALL' || !tempFilters.brand
      ? BRAND_OPTIONS
      : [tempFilters.brand];

  const selectedMediaLevers = Array.isArray(tempFilters.mediaLever)
    ? tempFilters.mediaLever
    : tempFilters.mediaLever === 'ALL' || !tempFilters.mediaLever
      ? MEDIA_LEVER_OPTIONS
      : [tempFilters.mediaLever];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        position: 'relative',
        zIndex: 30
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 2 }}>

        {/* MARKET */}
        <Box sx={{ width: 144 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}
          >
            MARKET
          </Typography>
          <MultiSelectDropdown
            options={MARKET_OPTIONS}
            selected={selectedMarkets}
            showSelectAll={false}
            showCheckboxes={false}
            onChange={(newSelected) => handleChange('market', newSelected.length > 0 ? newSelected : [MARKET_OPTIONS[0]])}
          />
        </Box>

        {/* RETAILER */}
        <Box sx={{ width: 144 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}
          >
            RETAILER
          </Typography>
          <MultiSelectDropdown
            options={RETAILER_OPTIONS}
            selected={selectedRetailers}
            showSelectAll={false}
            showCheckboxes={false}
            onChange={(newSelected) => handleChange('retailer', newSelected.length > 0 ? newSelected : [RETAILER_OPTIONS[0]])}
          />
        </Box>

        {/* CATEGORY */}
        <Box sx={{ width: 144 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}
          >
            CATEGORY
          </Typography>
          <MultiSelectDropdown
            options={CATEGORY_OPTIONS}
            selected={selectedCategories}
            showSelectAll={false}
            showCheckboxes={false}
            onChange={(newSelected) => handleChange('category', newSelected.length > 0 ? newSelected : [CATEGORY_OPTIONS[0]])}
          />
        </Box>

        {/* BRAND */}
        <Box sx={{ width: 144 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}
          >
            BRAND
          </Typography>
          <MultiSelectDropdown
            options={BRAND_OPTIONS}
            selected={selectedBrands}
            showSelectAll={true}
            showCheckboxes={true}
            onChange={(newSelected) => handleChange('brand', newSelected)}
          />
        </Box>

        {/* MEDIA LEVER */}
        <Box sx={{ width: 144 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}
          >
            MEDIA LEVER
          </Typography>
          <MultiSelectDropdown
            options={MEDIA_LEVER_OPTIONS}
            selected={selectedMediaLevers}
            showSelectAll={true}
            showCheckboxes={true}
            onChange={(newSelected) => handleChange('mediaLever', newSelected)}
          />
        </Box>

      </Box>

      {/* CONFIRM BUTTON */}
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmClick}
          sx={{
            px: 3,
            py: 0.75,
            borderRadius: '6px',
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: 'none',
            bgcolor: '#2563eb',
            '&:hover': { bgcolor: '#1d4ed8' }
          }}
        >
          Confirm
        </Button>
      </Box>

    </Paper>
  );
}
