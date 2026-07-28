/**
 * Currency Helper Utility for Market-based Currency Formatting
 */

export const getCurrencySymbol = (market) => {
  if (!market) return '£';
  const m = String(market).split('-')[0].trim().toUpperCase();
  if (m === 'US' || m === 'USA') return '$';
  if (m === 'UK' || m === 'ENGLAND' || m === 'GB') return '£';
  if (['DE', 'FR', 'IT', 'ES', 'GERMANY', 'FRANCE', 'ITALY', 'SPAIN'].includes(m)) return '€';
  return '£';
};

export const formatCurrency = (val, market = 'UK', digits = 0) => {
  if (val === undefined || val === null || isNaN(val)) return `${getCurrencySymbol(market)}0`;
  const symbol = getCurrencySymbol(market);
  const formattedNum = Number(val).toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
  return `${symbol}${formattedNum}`;
};

export const formatCurrencyShort = (val, market = 'UK') => {
  if (val === undefined || val === null || isNaN(val)) return `${getCurrencySymbol(market)}0`;
  const symbol = getCurrencySymbol(market);
  const isNeg = val < 0;
  const absVal = Math.abs(val);
  if (absVal >= 1000000) {
    return `${isNeg ? '-' : ''}${symbol}${(absVal / 1000000).toFixed(1)}M`;
  }
  if (absVal >= 1000) {
    return `${isNeg ? '-' : ''}${symbol}${(absVal / 1000).toFixed(0)}K`;
  }
  return `${isNeg ? '-' : ''}${symbol}${absVal.toFixed(0)}`;
};
