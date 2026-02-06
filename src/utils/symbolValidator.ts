// utils/symbolValidator.ts
export const validateSymbol = (symbol: string): boolean => {
  // Basic validation - you can extend this based on your needs
  if (!symbol) return false;
  
  // Check if it's a valid trading pair format (e.g., BTCUSDT, ETHUSDT)
  const symbolRegex = /^[A-Z]{3,10}[A-Z]{3,10}$/;
  return symbolRegex.test(symbol.toUpperCase());
};

export const normalizeSymbol = (symbol: string): string => {
  // Remove any spaces and convert to uppercase
  return symbol.replace(/\s+/g, '').toUpperCase();
};

// Common crypto symbols for validation
export const COMMON_CRYPTO_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT',
  'SOLUSDT', 'DOGEUSDT', 'DOTUSDT', 'AVAXUSDT', 'MATICUSDT',
  'LTCUSDT', 'LINKUSDT', 'UNIUSDT', 'ATOMUSDT', 'ETCUSDT'
];