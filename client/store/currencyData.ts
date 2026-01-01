// ==================== MULTI-CURRENCY SYSTEM ====================

export interface Currency {
  code: string; // ISO 4217 code (USD, EGP, AED, etc.)
  name: string;
  nameAr: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  decimalPlaces: number;
  isBaseCurrency: boolean;
  isActive: boolean;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string; // Base currency (USD)
  toCurrency: string; // Target currency (EGP, AED, etc.)
  rate: number; // 1 USD = X EGP
  source: 'bank' | 'central_bank' | 'market' | 'manual';
  sourceName?: string; // e.g., "Central Bank of Egypt"
  lastUpdated: string;
  nextUpdate?: string;
  isValid: boolean;
  notes?: string;
}

export interface CurrencyConversion {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  convertedAmount: number;
  conversionDate: string;
}

// Base currencies
export const baseCurrencies: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    nameAr: 'الدولار الأمريكي',
    symbol: '$',
    symbolPosition: 'before',
    decimalPlaces: 2,
    isBaseCurrency: true,
    isActive: true,
  },
  {
    code: 'EGP',
    name: 'Egyptian Pound',
    nameAr: 'الجنيه المصري',
    symbol: 'E£',
    symbolPosition: 'before',
    decimalPlaces: 2,
    isBaseCurrency: false,
    isActive: true,
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    nameAr: 'درهم إماراتي',
    symbol: 'AED',
    symbolPosition: 'before',
    decimalPlaces: 2,
    isBaseCurrency: false,
    isActive: true,
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    nameAr: 'ريال سعودي',
    symbol: 'SAR',
    symbolPosition: 'before',
    decimalPlaces: 2,
    isBaseCurrency: false,
    isActive: true,
  },
  {
    code: 'EUR',
    name: 'Euro',
    nameAr: 'يورو',
    symbol: '€',
    symbolPosition: 'before',
    decimalPlaces: 2,
    isBaseCurrency: false,
    isActive: true,
  },
];

// Exchange rates (USD as base currency)
export const mockExchangeRates: ExchangeRate[] = [
  {
    id: 'exr-1',
    fromCurrency: 'USD',
    toCurrency: 'EGP',
    rate: 48.50, // 1 USD = 48.50 EGP (example rate - should be updated daily)
    source: 'central_bank',
    sourceName: 'Central Bank of Egypt',
    lastUpdated: new Date().toISOString().split('T')[0],
    isValid: true,
    notes: 'Updated daily from Central Bank of Egypt official rate',
  },
  {
    id: 'exr-2',
    fromCurrency: 'USD',
    toCurrency: 'AED',
    rate: 3.67, // Fixed peg
    source: 'bank',
    sourceName: 'UAE Central Bank',
    lastUpdated: new Date().toISOString().split('T')[0],
    isValid: true,
  },
  {
    id: 'exr-3',
    fromCurrency: 'USD',
    toCurrency: 'SAR',
    rate: 3.75, // Fixed peg
    source: 'bank',
    sourceName: 'Saudi Central Bank',
    lastUpdated: new Date().toISOString().split('T')[0],
    isValid: true,
  },
  {
    id: 'exr-4',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    rate: 0.92,
    source: 'market',
    sourceName: 'Forex Market',
    lastUpdated: new Date().toISOString().split('T')[0],
    isValid: true,
  },
];

// Helper functions
export const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return 1;
  
  // If converting FROM USD
  if (fromCurrency === 'USD') {
    const rate = mockExchangeRates.find(r => r.fromCurrency === 'USD' && r.toCurrency === toCurrency);
    return rate?.rate || 1;
  }
  
  // If converting TO USD
  if (toCurrency === 'USD') {
    const rate = mockExchangeRates.find(r => r.fromCurrency === 'USD' && r.toCurrency === fromCurrency);
    return rate ? 1 / rate.rate : 1;
  }
  
  // Converting between two non-USD currencies
  const fromRate = mockExchangeRates.find(r => r.fromCurrency === 'USD' && r.toCurrency === fromCurrency);
  const toRate = mockExchangeRates.find(r => r.fromCurrency === 'USD' && r.toCurrency === toCurrency);
  
  if (fromRate && toRate) {
    return toRate.rate / fromRate.rate;
  }
  
  return 1;
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return amount;
  const rate = getExchangeRate(fromCurrency, toCurrency);
  return amount * rate;
};

export const formatCurrency = (amount: number, currency: string, locale: string = 'en'): string => {
  const curr = baseCurrencies.find(c => c.code === currency);
  if (!curr) return `${amount.toFixed(2)} ${currency}`;
  
  const formatted = amount.toFixed(curr.decimalPlaces);
  
  if (curr.symbolPosition === 'before') {
    return `${curr.symbol}${formatted}`;
  } else {
    return `${formatted} ${curr.symbol}`;
  }
};

export const getCurrency = (code: string): Currency | undefined => {
  return baseCurrencies.find(c => c.code === code);
};



