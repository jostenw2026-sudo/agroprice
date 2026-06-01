/**
 * Système de conversion et gestion des devises
 * AgriPrice — Suivi des prix agricoles camerounais
 */

// ============================================
// TAUX DE CHANGE (Base: FCFA = 1)
// ============================================

export const EXCHANGE_RATES = {
  FCFA: 1,
  EUR: 655,      // 1 EUR = 655 FCFA
  USD: 615,      // 1 USD = 615 FCFA
  CNY: 85,       // 1 CNY = 85 FCFA
} as const;

// ============================================
// SYMBOLES DE DEVISE
// ============================================

export const CURRENCY_SYMBOLS = {
  FCFA: 'FCFA',
  EUR: '€',
  USD: '$',
  CNY: '¥',
} as const;

// ============================================
// DEVISE PAR RÉGION
// ============================================

export const REGION_CURRENCY = {
  ASIA: 'CNY',
  EUROPE: 'EUR',
  'NORTH AMERICA': 'USD',
} as const;

// ============================================
// TYPES
// ============================================

export type CurrencyCode = keyof typeof CURRENCY_SYMBOLS;
export type Region = keyof typeof REGION_CURRENCY;

// ============================================
// FONCTION DE CONVERSION
// ============================================

/**
 * Convertit un prix en FCFA vers une autre devise
 * @param priceFcfa - Le prix en FCFA
 * @param toCurrency - La devise cible (EUR, USD, CNY, FCFA)
 * @returns Le prix converti (arrondi à 2 décimales)
 */
export function convertPrice(
  priceFcfa: number,
  toCurrency: CurrencyCode
): number {
  if (!priceFcfa || isNaN(priceFcfa)) return 0;

  const rate = EXCHANGE_RATES[toCurrency] || 1;
  return Math.round((priceFcfa / rate) * 100) / 100;
}

// ============================================
// DEVISE PAR RÉGION
// ============================================

/**
 * Retourne la devise de base selon la région
 * @param region - La région (ASIA, EUROPE, NORTH AMERICA)
 * @returns Le code devise (EUR, USD, CNY)
 */
export function getCurrencyByRegion(region: string): CurrencyCode {
  return (
    REGION_CURRENCY[region as Region] || 'FCFA'
  ) as CurrencyCode;
}

// ============================================
// FORMATAGE DES PRIX
// ============================================

/**
 * Formate un prix avec symbole et séparateurs
 * @param amount - Le montant
 * @param currency - Le code devise (EUR, USD, CNY, FCFA)
 * @returns Chaîne formatée (ex: "€12.50" ou "5 000 FCFA")
 */
export function formatPrice(
  amount: number,
  currency: CurrencyCode = 'FCFA'
): string {
  if (!amount || isNaN(amount)) return '0 ' + currency;

  const symbol = CURRENCY_SYMBOLS[currency];

  if (currency === 'FCFA') {
    // Format : "5 000 FCFA"
    return `${amount.toLocaleString('fr-FR')} ${symbol}`;
  }

  // Format : "€12.50" ou "$15.99"
  return `${symbol}${amount.toFixed(2)}`;
}

// ============================================
// FONCTION AVANCÉE : DUAL PRICING
// ============================================

interface DualPriceResult {
  fcfa: number;
  regional: number;
  regionalCurrency: CurrencyCode;
  fcfaFormatted: string;
  regionalFormatted: string;
  rate: number;
}

/**
 * Retourne un prix en double devise (FCFA + régionale)
 * Utile pour afficher simultanément les deux prix
 * @param priceFcfa - Le prix en FCFA
 * @param region - La région sélectionnée
 * @returns Objet avec prix et formattage pour les deux devises
 */
export function getDualPrices(
  priceFcfa: number,
  region: string
): DualPriceResult {
  const regionalCurrency = getCurrencyByRegion(region);
  const regionalPrice = convertPrice(priceFcfa, regionalCurrency);
  const rate = EXCHANGE_RATES[regionalCurrency];

  return {
    fcfa: priceFcfa,
    regional: regionalPrice,
    regionalCurrency,
    fcfaFormatted: formatPrice(priceFcfa, 'FCFA'),
    regionalFormatted: formatPrice(regionalPrice, regionalCurrency),
    rate,
  };
}

// ============================================
// HELPERS STATISTIQUES
// ============================================

/**
 * Calcule le prix moyen en FCFA et convertit en devise
 * @param prices - Array de prix en FCFA
 * @param currency - La devise cible
 * @returns Le prix moyen converti
 */
export function averagePrice(
  prices: number[],
  currency: CurrencyCode = 'FCFA'
): number {
  if (!prices || prices.length === 0) return 0;
  const sum = prices.reduce((a, b) => a + b, 0);
  const average = sum / prices.length;
  return convertPrice(average, currency);
}

/**
 * Trouve le prix min/max dans un tableau et convertit
 * @param prices - Array de prix en FCFA
 * @param currency - La devise cible
 * @returns { min, max } convertis
 */
export function priceRange(
  prices: number[],
  currency: CurrencyCode = 'FCFA'
): { min: number; max: number } {
  if (!prices || prices.length === 0) return { min: 0, max: 0 };
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return {
    min: convertPrice(min, currency),
    max: convertPrice(max, currency),
  };
}

// ============================================
// VARIATION PRIX
// ============================================

/**
 * Calcule la variation en pourcentage entre deux prix
 * @param oldPrice - Prix ancien en FCFA
 * @param newPrice - Prix nouveau en FCFA
 * @returns Variation en pourcentage (ex: 5.2 pour +5.2%)
 */
export function priceVariation(
  oldPrice: number,
  newPrice: number
): number {
  if (oldPrice === 0) return 0;
  return Math.round(((newPrice - oldPrice) / oldPrice) * 10000) / 100;
}

/**
 * Retourne un label de tendance avec couleur
 * @param variation - Variation en pourcentage
 * @returns { label: string; color: string; icon: string }
 */
export function getTrendLabel(variation: number): {
  label: string;
  color: string;
  icon: string;
} {
  if (variation > 5) {
    return { label: 'Hausse', color: '#dc2626', icon: '📈' };
  } else if (variation < -5) {
    return { label: 'Baisse', color: '#059669', icon: '📉' };
  } else {
    return { label: 'Stable', color: '#6b7280', icon: '→' };
  }
}

// ============================================
// CONSTANTS & UTILITIES
// ============================================

/**
 * Liste des régions disponibles
 */
export const REGIONS = Object.keys(REGION_CURRENCY) as Region[];

/**
 * Liste des devises disponibles
 */
export const CURRENCIES = Object.keys(CURRENCY_SYMBOLS) as CurrencyCode[];

/**
 * Vérifie si une devise est valide
 */
export function isValidCurrency(currency: string): currency is CurrencyCode {
  return currency in CURRENCY_SYMBOLS;
}

/**
 * Vérifie si une région est valide
 */
export function isValidRegion(region: string): region is Region {
  return region in REGION_CURRENCY;
}

// ============================================
// EXPORT POUR USAGE DANS COMPOSANTS
// ============================================

/**
 * Configuration complète pour un dropdown région
 */
export const REGION_OPTIONS = REGIONS.map(region => ({
  value: region,
  label: region,
  currency: REGION_CURRENCY[region],
  symbol: CURRENCY_SYMBOLS[REGION_CURRENCY[region]],
}));

/**
 * Configuration complète pour un dropdown devise
 */
export const CURRENCY_OPTIONS = CURRENCIES.map(currency => ({
  value: currency,
  label: currency,
  symbol: CURRENCY_SYMBOLS[currency],
}));
