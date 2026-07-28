import React, { useState } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function MultiSelectDropdown({
  options = [],
  selected = [],
  onChange,
  showSelectAll = true,
  showCheckboxes = true,
  compact = false
}) {
  const isAllSelected = options.length > 0 && selected.length === options.length;

  const handleSelectAllToggle = (e) => {
    e.stopPropagation();
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const handleOptionToggle = (option) => {
    if (!showCheckboxes) {
      // Single select behavior
      onChange([option]);
      return;
    }

    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const renderDisplayText = () => {
    if (!selected || selected.length === 0) return 'Select';
    if (showCheckboxes && isAllSelected) return 'ALL';
    if (selected.length === 1) return selected[0];
    return `${selected.length} Selected`;
  };

  return (
    <FormControl fullWidth size="small">
      <Select
        multiple={showCheckboxes}
        value={showCheckboxes ? selected : (selected[0] || '')}
        displayEmpty
        renderValue={() => (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: compact ? '0.75rem' : '0.8125rem',
              color: 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {renderDisplayText()}
          </Typography>
        )}
        IconComponent={KeyboardArrowDownIcon}
        sx={{
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          py: compact ? 0.25 : 0.5,
          '& .MuiSelect-select': {
            py: compact ? '4px' : '6px',
            px: '12px'
          },
          '& fieldset': {
            borderColor: '#e2e8f0',
            borderRadius: '6px'
          },
          '&:hover fieldset': {
            borderColor: '#cbd5e1'
          },
          '&.Mui-focused fieldset': {
            borderColor: '#2563eb'
          }
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: '6px',
              mt: 0.5,
              maxHeight: 280,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }
          }
        }}
      >
        {/* Select All Option if enabled */}
        {showSelectAll && showCheckboxes && (
          <MenuItem
            onClick={handleSelectAllToggle}
            sx={{
              py: 0.5,
              px: 1.5,
              borderBottom: '1px solid #f1f5f9',
              '&:hover': { backgroundColor: '#f8fafc' }
            }}
          >
            <Checkbox
              checked={isAllSelected}
              indeterminate={selected.length > 0 && selected.length < options.length}
              size="small"
              sx={{ color: '#0f172a', '&.Mui-checked': { color: '#0f172a' }, p: 0.5, mr: 1 }}
            />
            <ListItemText
              primary="Select All"
              primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}
            />
          </MenuItem>
        )}

        {/* Option Items */}
        {options.map((option) => {
          const isChecked = selected.includes(option);
          return (
            <MenuItem
              key={option}
              value={option}
              onClick={() => handleOptionToggle(option)}
              sx={{
                py: 0.5,
                px: 1.5,
                '&:hover': { backgroundColor: '#f8fafc' },
                '&.Mui-selected': { backgroundColor: '#f1f5f9' }
              }}
            >
              {showCheckboxes && (
                <Checkbox
                  checked={isChecked}
                  size="small"
                  sx={{ color: '#0f172a', '&.Mui-checked': { color: '#0f172a' }, p: 0.5, mr: 1 }}
                />
              )}
              <ListItemText
                primary={option}
                primaryTypographyProps={{
                  fontSize: '0.8125rem',
                  fontWeight: isChecked ? 600 : 500,
                  color: isChecked ? '#0f172a' : '#475569'
                }}
              />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
