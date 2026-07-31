import React from 'react';
import { Box, Typography, Slider } from '@mui/material';
import { formatCurrency } from '../utils/currencyHelper';

export default function DualRangeSlider({
  label,
  min = 0,
  max = 100,
  value = [20, 80],
  onChange,
  isCurrency = false,
  market = 'UK',
  disabled = false
}) {
  const [minVal, maxVal] = value;
  const minDistance = isCurrency ? Math.round((max - min) * 0.02) || 100000 : 2;
  const stepVal = isCurrency ? 100000 : 1;

  const formatValue = (val) => {
    if (isCurrency) {
      return formatCurrency(val, market, 0);
    }
    return `${Math.round(val)}%`;
  };

  const handleSliderChange = (event, newValue, activeThumb) => {
    if (disabled || !Array.isArray(newValue)) return;

    let [newMin, newMax] = newValue;
    if (newMax - newMin < minDistance) {
      if (activeThumb === 0) {
        newMin = Math.min(newMin, max - minDistance);
        newMax = newMin + minDistance;
      } else {
        newMax = Math.max(newMax, min + minDistance);
        newMin = newMax - minDistance;
      }
    }
    onChange([newMin, newMax]);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 0.1, width: '100%', opacity: disabled ? 0.75 : 1 }}>
      {/* Column 1: Label Name */}
      <Box sx={{ width: 170, flexShrink: 0, pt: 0.1 }}>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: disabled ? 'text.secondary' : 'text.primary',
            letterSpacing: '0.02em',
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* Column 2: Slider Track (Top) + Range Value Text (Bottom) */}
      <Box sx={{ flexGrow: 1, minWidth: 0, px: 1 }}>
        <Slider
          value={value}
          onChange={handleSliderChange}
          min={min}
          max={max}
          step={stepVal}
          disabled={disabled}
          disableSwap={false}
          sx={{
            color: disabled ? '#94a3b8' : '#0b1329',
            height: 4,
            padding: '6px 0 2px 0',
            width: '100%',
            '&.Mui-disabled': {
              color: '#94a3b8'
            },
            '& .MuiSlider-track': {
              border: 'none',
              backgroundColor: disabled ? '#94a3b8' : '#0b1329',
              height: 4
            },
            '& .MuiSlider-rail': {
              opacity: 1,
              backgroundColor: disabled ? '#e2e8f0' : '#cbd5e1',
              height: 4
            },
            '& .MuiSlider-thumb': {
              height: 14,
              width: 14,
              backgroundColor: '#ffffff',
              border: disabled ? '1.5px solid #94a3b8' : '1.5px solid #0b1329',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
              '&.Mui-disabled': {
                backgroundColor: '#f1f5f9',
                border: '1.5px solid #cbd5e1'
              },
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: disabled ? 'none' : '0 0 0 6px rgba(11, 19, 41, 0.16)'
              }
            }
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.6875rem',
            fontWeight: 500,
            color: 'text.secondary',
            display: 'block',
            mt: -0.5
          }}
        >
          {formatValue(minVal)} to {formatValue(maxVal)}
        </Typography>
      </Box>
    </Box>
  );
}
