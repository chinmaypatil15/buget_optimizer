import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MultiSelectDropdown from './MultiSelectDropdown';
import DualRangeSlider from './DualRangeSlider';
import { getCurrencySymbol, formatCurrency } from '../utils/currencyHelper';

const SALES_KPI_OPTIONS = ['TOTAL SALES', 'NNS'];

export default function ObjectiveAndGuardrails({ onOptimize, market = 'UK', retailer = 'AMAZON', mediaLever = 'ALL' }) {
  const [objective, setObjective] = useState('Maximize Sales');
  const [useGuardrails, setUseGuardrails] = useState(false);

  const isSearchDisabled = String(mediaLever).toUpperCase() === 'DISPLAY';
  const isDisplayDisabled = String(mediaLever).toUpperCase() === 'SEARCH';

  const currencySymbol = getCurrencySymbol(market);

  // Dynamic multiplier for last year budget depending on market
  const getMarketMultiplier = (m) => {
    const code = String(m).split('-')[0].trim().toUpperCase();
    if (code === 'US' || code === 'USA') return 1.8;
    if (code === 'GERMANY' || code === 'DE') return 1.2;
    if (code === 'FRANCE' || code === 'FR') return 0.9;
    return 1.0;
  };

  const marketMult = getMarketMultiplier(market);
  const lastYearBudgetNum = 12000000 * marketMult;

  // Target input mode: 'lastYear', 'newBudget', or 'salesTarget'
  const [targetMode, setTargetMode] = useState('newBudget');
  const [newBudgetVal, setNewBudgetVal] = useState('15000000');
  const [salesTargetVal, setSalesTargetVal] = useState('');
  const [targetSubMode, setTargetSubMode] = useState('target'); // 'target' or 'pct'
  const [newBudgetSubMode, setNewBudgetSubMode] = useState('budget'); // 'budget' or 'pct'
  const [salesKPI, setSalesKPI] = useState('TOTAL SALES');

  // BRAND Budget Guardrail state ranges (£/$/€) matching reference image
  const [purinaOneRange, setPurinaOneRange] = useState([5000000, 9000000]);
  const [benefulRange, setBenefulRange] = useState([0, 5000000]);
  const [fancyFeastRange, setFancyFeastRange] = useState([0, 5000000]);
  const [proPlanRange, setProPlanRange] = useState([0, 5000000]);

  const [dogChowRange, setDogChowRange] = useState([0, 5000000]);
  const [friskiesRange, setFriskiesRange] = useState([0, 5000000]);
  const [catChowRange, setCatChowRange] = useState([0, 5000000]);
  const [gourmetRange, setGourmetRange] = useState([0, 5000000]);

  // Search Guardrail state ranges (%) matching reference image
  const [searchSponsoredProduct, setSearchSponsoredProduct] = useState([70, 90]);
  const [searchSponsoredBrand, setSearchSponsoredBrand] = useState([20, 30]);
  const [searchSponsoredVideo, setSearchSponsoredVideo] = useState([5, 10]);

  // Display Guardrail state ranges (%) matching reference image
  const [displayOnsite, setDisplayOnsite] = useState([50, 70]);
  const [displayOffsite, setDisplayOffsite] = useState([30, 50]);

  const handleOptimizeClick = () => {
    let finalTargetMode = 'budget';
    let finalTargetVal = 15000000;

    if (targetMode === 'lastYear') {
      finalTargetMode = 'budget';
      finalTargetVal = lastYearBudgetNum;
    } else if (targetMode === 'newBudget') {
      finalTargetMode = 'budget';
      finalTargetVal = parseFloat(newBudgetVal) || 15000000;
    } else if (targetMode === 'salesTarget') {
      finalTargetMode = 'target';
      if (targetSubMode === 'pct') {
        const pct = parseFloat(salesTargetVal) || 0;
        const lastYearSales = 25200000 * marketMult;
        finalTargetVal = lastYearSales * (1 + pct / 100);
      } else {
        finalTargetVal = parseFloat(salesTargetVal) || 35000000;
      }
    }

    onOptimize({
      objective,
      useGuardrails,
      targetMode: finalTargetMode,
      targetValue: finalTargetVal,
      salesKPI: objective === 'Maximize ROI' ? 'ROI' : salesKPI,
      guardrailsData: {
        brandRanges: {
          purinaOne: purinaOneRange,
          beneful: benefulRange,
          fancyFeast: fancyFeastRange,
          proPlan: proPlanRange,
          dogChow: dogChowRange,
          friskies: friskiesRange,
          catChow: catChowRange,
          gourmet: gourmetRange
        },
        searchSponsoredProduct,
        searchSponsoredBrand,
        searchSponsoredVideo,
        displayOnsite,
        displayOffsite
      }
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4, width: '100%' }}>
      
      {/* CARD 1: WHAT IS YOUR OBJECTIVE */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
          What is your Objective
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            size="small"
            onClick={() => setObjective('Maximize Sales')}
            sx={{
              borderRadius: '6px',
              px: 3,
              py: 0.75,
              fontWeight: 700,
              fontSize: '0.8125rem',
              textTransform: 'none',
              bgcolor: objective === 'Maximize Sales' ? '#2563eb' : '#ffffff',
              color: objective === 'Maximize Sales' ? '#ffffff' : '#0f172a',
              border: objective === 'Maximize Sales' ? '1px solid #2563eb' : '1px solid #e2e8f0',
              boxShadow: 'none',
              '&:hover': { bgcolor: objective === 'Maximize Sales' ? '#1d4ed8' : '#f8fafc' }
            }}
          >
            Maximize Sales
          </Button>
          <Button
            size="small"
            onClick={() => setObjective('Maximize ROI')}
            sx={{
              borderRadius: '6px',
              px: 3,
              py: 0.75,
              fontWeight: 700,
              fontSize: '0.8125rem',
              textTransform: 'none',
              bgcolor: objective === 'Maximize ROI' ? '#2563eb' : '#ffffff',
              color: objective === 'Maximize ROI' ? '#ffffff' : '#0f172a',
              border: objective === 'Maximize ROI' ? '1px solid #2563eb' : '1px solid #e2e8f0',
              boxShadow: 'none',
              '&:hover': { bgcolor: objective === 'Maximize ROI' ? '#1d4ed8' : '#f8fafc' }
            }}
          >
            Maximize ROI
          </Button>
        </Box>
      </Paper>

      {/* CARD 2: BUDGET AND TARGET */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
        
        {/* Header Title & Date Range Notes */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', pb: 2, mb: 3, borderBottom: '1px solid #f1f5f9', width: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Budget and Target
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.6875rem' }}>
              Last Year: Jan-25 to Dec-25
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.6875rem' }}>
              Next Year: Jan-26 to Dec-26
            </Typography>
          </Box>
        </Box>

        {/* 3 Budget/Target Column Options with OR Dividers - 100% Full Width CSS Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr auto 1fr auto 1fr'
            },
            alignItems: 'flex-start',
            gap: 2,
            mb: 3,
            width: '100%'
          }}
        >
          {/* Column 1: Use Last Year Budget */}
          <Box sx={{ width: '100%', opacity: targetMode === 'lastYear' ? 1 : 0.75, transition: 'opacity 0.2s ease' }}>
            <Box
              onClick={() => {
                setTargetMode('lastYear');
                setNewBudgetVal('');
                setSalesTargetVal('');
              }}
              sx={{ display: 'flex', alignItems: 'center', minHeight: 24, mb: 0.75, cursor: 'pointer' }}
            >
              <Radio
                size="small"
                checked={targetMode === 'lastYear'}
                onChange={() => {
                  setTargetMode('lastYear');
                  setNewBudgetVal('');
                  setSalesTargetVal('');
                }}
                sx={{ p: 0, mr: 0.75, color: '#94a3b8', '&.Mui-checked': { color: '#2563eb' } }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: targetMode === 'lastYear' ? 'text.primary' : 'text.secondary',
                  cursor: 'pointer'
                }}
              >
                Use Last Year Budget ({currencySymbol})
              </Typography>
            </Box>
            <TextField
              fullWidth
              size="small"
              disabled={targetMode !== 'lastYear'}
              value={formatCurrency(lastYearBudgetNum, market)}
              onClick={() => {
                setTargetMode('lastYear');
                setNewBudgetVal('');
                setSalesTargetVal('');
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  bgcolor: targetMode === 'lastYear' ? '#ffffff' : '#f8fafc',
                  '& fieldset': {
                    borderColor: targetMode === 'lastYear' ? '#2563eb' : '#e2e8f0',
                    borderWidth: targetMode === 'lastYear' ? 2 : 1
                  }
                },
                '& input': { fontWeight: 600, color: targetMode === 'lastYear' ? '#334155' : '#94a3b8', cursor: targetMode === 'lastYear' ? 'pointer' : 'not-allowed' }
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.75, fontSize: '0.6875rem', minHeight: 18 }}>
              Media Spend for last year is {formatCurrency(lastYearBudgetNum, market)}
            </Typography>
          </Box>

          {/* OR 1 */}
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', px: 1, textAlign: 'center', mt: '40px' }}>
            OR
          </Typography>

          {/* Column 2: Input New Budget */}
          <Box sx={{ width: '100%', opacity: targetMode === 'newBudget' ? 1 : 0.75, transition: 'opacity 0.2s ease' }}>
            <Box
              onClick={() => {
                setTargetMode('newBudget');
                setSalesTargetVal('');
              }}
              sx={{ display: 'flex', alignItems: 'center', minHeight: 24, mb: 0.75, cursor: 'pointer' }}
            >
              <Radio
                size="small"
                checked={targetMode === 'newBudget'}
                onChange={() => {
                  setTargetMode('newBudget');
                  setSalesTargetVal('');
                }}
                sx={{ p: 0, mr: 0.75, color: '#94a3b8', '&.Mui-checked': { color: '#2563eb' } }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: targetMode === 'newBudget' ? 'text.primary' : 'text.secondary',
                  cursor: 'pointer'
                }}
              >
                Input New Budget ({currencySymbol})
              </Typography>
            </Box>
            <TextField
              fullWidth
              size="small"
              type="number"
              disabled={targetMode !== 'newBudget'}
              placeholder="Enter amount"
              value={newBudgetVal}
              onChange={(e) => {
                setNewBudgetVal(e.target.value);
                setSalesTargetVal('');
                setTargetMode('newBudget');
              }}
              onFocus={() => {
                setTargetMode('newBudget');
                setSalesTargetVal('');
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  bgcolor: targetMode === 'newBudget' ? '#ffffff' : '#f8fafc',
                  '& fieldset': {
                    borderColor: targetMode === 'newBudget' ? '#2563eb' : '#e2e8f0',
                    borderWidth: targetMode === 'newBudget' ? 2 : 1
                  }
                }
              }}
            />
            <Box sx={{ minHeight: 18, mt: 0.75 }} />
          </Box>

          {/* OR 2 */}
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', px: 1, textAlign: 'center', mt: '40px' }}>
            OR
          </Typography>

          {/* Column 3: Input Sales Target */}
          <Box sx={{ width: '100%', opacity: targetMode === 'salesTarget' ? 1 : 0.75, transition: 'opacity 0.2s ease' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 24, mb: 0.75 }}>
              <Box
                onClick={() => {
                  setTargetMode('salesTarget');
                  setNewBudgetVal('');
                }}
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <Radio
                  size="small"
                  checked={targetMode === 'salesTarget'}
                  onChange={() => {
                    setTargetMode('salesTarget');
                    setNewBudgetVal('');
                  }}
                  sx={{ p: 0, mr: 0.75, color: '#94a3b8', '&.Mui-checked': { color: '#2563eb' } }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: targetMode === 'salesTarget' ? 'text.primary' : 'text.secondary',
                    cursor: 'pointer'
                  }}
                >
                  {targetSubMode === 'pct' ? 'Input Sales Target (% Increase)' : `Input Sales Target (${currencySymbol})`}
                </Typography>
              </Box>

              {/* Target / % Toggle Pill */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Button
                  size="small"
                  disabled={targetMode !== 'salesTarget'}
                  onClick={() => setTargetSubMode('target')}
                  sx={{
                    minWidth: 0,
                    px: 1,
                    py: 0.25,
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    textTransform: 'none',
                    bgcolor: targetSubMode === 'target' ? '#2563eb' : '#ffffff',
                    color: targetSubMode === 'target' ? '#ffffff' : '#0f172a',
                    border: targetSubMode === 'target' ? '1px solid #2563eb' : '1px solid #e2e8f0',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: targetSubMode === 'target' ? '#1d4ed8' : '#f8fafc' }
                  }}
                >
                  Target ({currencySymbol})
                </Button>
                <Button
                  size="small"
                  disabled={targetMode !== 'salesTarget'}
                  onClick={() => setTargetSubMode('pct')}
                  sx={{
                    minWidth: 0,
                    px: 1,
                    py: 0.25,
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    textTransform: 'none',
                    bgcolor: targetSubMode === 'pct' ? '#2563eb' : '#ffffff',
                    color: targetSubMode === 'pct' ? '#ffffff' : '#0f172a',
                    border: targetSubMode === 'pct' ? '1px solid #2563eb' : '1px solid #e2e8f0',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: targetSubMode === 'pct' ? '#1d4ed8' : '#f8fafc' }
                  }}
                >
                  % Increase
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              size="small"
              type="number"
              disabled={targetMode !== 'salesTarget'}
              placeholder={targetSubMode === 'target' ? `Sales target in ${currencySymbol}` : '% increase'}
              value={salesTargetVal}
              onChange={(e) => {
                setSalesTargetVal(e.target.value);
                setNewBudgetVal('');
                setTargetMode('salesTarget');
              }}
              onFocus={() => {
                setTargetMode('salesTarget');
                setNewBudgetVal('');
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  bgcolor: targetMode === 'salesTarget' ? '#ffffff' : '#f8fafc',
                  '& fieldset': {
                    borderColor: targetMode === 'salesTarget' ? '#2563eb' : '#e2e8f0',
                    borderWidth: targetMode === 'salesTarget' ? 2 : 1
                  }
                }
              }}
            />
            {targetSubMode === 'pct' ? (
              <Typography variant="caption" sx={{ color: targetMode === 'salesTarget' ? '#2563eb' : '#94a3b8', fontWeight: 600, display: 'block', mt: 0.75, fontSize: '0.6875rem', minHeight: 18 }}>
                Calculated Target: {formatCurrency((25200000 * marketMult) * (1 + (parseFloat(salesTargetVal) || 0) / 100), market)}
              </Typography>
            ) : (
              <Box sx={{ minHeight: 18, mt: 0.75 }} />
            )}
          </Box>
        </Box>

        {/* Select Sales KPI to Optimize */}
        <Box sx={{ maxWidth: 280, mb: 3, position: 'relative', zIndex: 40 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.75 }}>
            Select Sales KPI to Optimize
          </Typography>

          {objective === 'Maximize ROI' ? (
            <Box
              sx={{
                width: '100%',
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                color: '#94a3b8',
                py: 1,
                px: 2,
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'not-allowed',
                userSelect: 'none'
              }}
            >
              <span>ROI</span>
              <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#cbd5e1' }} />
            </Box>
          ) : (
            <MultiSelectDropdown
              options={SALES_KPI_OPTIONS}
              selected={[salesKPI]}
              showSelectAll={false}
              showCheckboxes={false}
              onChange={(newSelected) => setSalesKPI(newSelected[0] || 'TOTAL SALES')}
            />
          )}
        </Box>

        {/* Radio Options: Guardrails */}
        <Box sx={{ mb: 3, width: '100%' }}>
          <RadioGroup
            row
            value={useGuardrails ? 'with_guardrails' : 'without_guardrails'}
            onChange={(e) => setUseGuardrails(e.target.value === 'with_guardrails')}
          >
            <FormControlLabel
              value="without_guardrails"
              control={<Radio size="small" color="primary" />}
              label={<Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>Optimize without guardrails</Typography>}
              sx={{ mr: 4 }}
            />
            <FormControlLabel
              value="with_guardrails"
              control={<Radio size="small" color="primary" />}
              label={<Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>Optimize with guardrails</Typography>}
            />
          </RadioGroup>

          {/* SET BUSINESS GUARDRAILS PANEL */}
          {useGuardrails && (
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mt: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', width: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', mb: 3 }}>
                Set Business Guardrails
              </Typography>

              {/* BRAND Budget Guardrails */}
              <Box sx={{ mb: 2, width: '100%' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '0.05em', display: 'block' }}>
                  BRAND BUDGET GUARDRAILS ({currencySymbol})
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', display: 'block', mb: 1 }}>
                  Set Brand level constraints around Search/RDM budgets.
                </Typography>

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
                  {/* Left Column */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
                    <DualRangeSlider
                      label="PURINA ONE"
                      min={0}
                      max={30000000}
                      value={purinaOneRange}
                      onChange={setPurinaOneRange}
                      isCurrency={true}
                      market={market}
                    />
                    <DualRangeSlider
                      label="BENEFUL"
                      min={0}
                      max={30000000}
                      value={benefulRange}
                      onChange={setBenefulRange}
                      isCurrency={true}
                      market={market}
                    />
                    <DualRangeSlider
                      label="FANCY FEAST"
                      min={0}
                      max={30000000}
                      value={fancyFeastRange}
                      onChange={setFancyFeastRange}
                      isCurrency={true}
                      market={market}
                    />
                    <DualRangeSlider
                      label="PRO PLAN"
                      min={0}
                      max={30000000}
                      value={proPlanRange}
                      onChange={setProPlanRange}
                      isCurrency={true}
                      market={market}
                    />
                  </Box>

                  {/* Right Column */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
                    <DualRangeSlider
                      label="DOG CHOW"
                      min={0}
                      max={30000000}
                      value={dogChowRange}
                      onChange={setDogChowRange}
                      isCurrency={true}
                      market={market}
                    />
                    <DualRangeSlider
                      label="FRISKIES"
                      min={0}
                      max={30000000}
                      value={friskiesRange}
                      onChange={setFriskiesRange}
                      isCurrency={true}
                      market={market}
                    />
                    <DualRangeSlider
                      label="CAT CHOW LINE"
                      min={0}
                      max={30000000}
                      value={catChowRange}
                      onChange={setCatChowRange}
                      isCurrency={true}
                      market={market}
                    />
                    <DualRangeSlider
                      label="GOURMET"
                      min={0}
                      max={30000000}
                      value={gourmetRange}
                      onChange={setGourmetRange}
                      isCurrency={true}
                      market={market}
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

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
                {/* Search Budget Guardrails */}
                <Box
                  sx={{
                    width: '100%',
                    position: 'relative',
                    opacity: isSearchDisabled ? 0.75 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSearchDisabled && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 10,
                        cursor: 'not-allowed',
                        pointerEvents: 'all'
                      }}
                      title="Search Budget Guardrails disabled for selected Media Lever"
                    />
                  )}
                  <Typography variant="caption" sx={{ fontWeight: 800, color: isSearchDisabled ? 'text.secondary' : 'text.primary', letterSpacing: '0.05em', display: 'block' }}>
                    SEARCH BUDGET GUARDRAILS
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', display: 'block', mb: 1 }}>
                    Adjust share of Paid Search tactics in the total search budget
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
                    <DualRangeSlider
                      label="Sponsored Product Share"
                      min={0}
                      max={100}
                      value={searchSponsoredProduct}
                      onChange={setSearchSponsoredProduct}
                      disabled={isSearchDisabled}
                    />
                    <DualRangeSlider
                      label="Sponsored Brand Share"
                      min={0}
                      max={100}
                      value={searchSponsoredBrand}
                      onChange={setSearchSponsoredBrand}
                      disabled={isSearchDisabled}
                    />
                    <DualRangeSlider
                      label={retailer === 'AMAZON' ? "Sponsored Display Share" : "Sponsored Video Share"}
                      min={0}
                      max={100}
                      value={searchSponsoredVideo}
                      onChange={setSearchSponsoredVideo}
                      disabled={isSearchDisabled}
                    />
                  </Box>
                </Box>

                {/* Display Budget Guardrails */}
                <Box
                  sx={{
                    width: '100%',
                    position: 'relative',
                    opacity: isDisplayDisabled ? 0.75 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isDisplayDisabled && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 10,
                        cursor: 'not-allowed',
                        pointerEvents: 'all'
                      }}
                      title="Display Budget Guardrails disabled for selected Media Lever"
                    />
                  )}
                  <Typography variant="caption" sx={{ fontWeight: 800, color: isDisplayDisabled ? 'text.secondary' : 'text.primary', letterSpacing: '0.05em', display: 'block' }}>
                    DISPLAY BUDGET GUARDRAILS
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', display: 'block', mb: 1 }}>
                    Adjust share of RDM tactics in the total RDM budget
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
                    <DualRangeSlider
                      label="Onsite Budget Share"
                      min={0}
                      max={100}
                      value={displayOnsite}
                      onChange={setDisplayOnsite}
                      disabled={isDisplayDisabled}
                    />
                    <DualRangeSlider
                      label="Offsite Budget Share"
                      min={0}
                      max={100}
                      value={displayOffsite}
                      onChange={setDisplayOffsite}
                      disabled={isDisplayDisabled}
                    />
                  </Box>
                </Box>

              </Box>

            </Paper>
          )}
        </Box>

        {/* Action Button */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOptimizeClick}
            sx={{
              px: 4,
              py: 1.25,
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.9375rem',
              textTransform: 'none',
              bgcolor: '#2563eb',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1d4ed8' }
            }}
          >
            Optimize Budget
          </Button>
        </Box>

      </Paper>

    </Box>
  );
}
