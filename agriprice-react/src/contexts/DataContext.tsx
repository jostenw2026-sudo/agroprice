import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  getProducts,
  getSources,
  getPriceRecords,
  getExchangeRates,
  Product,
  Source,
  PriceRecord,
  ExchangeRate,
} from '../lib/supabase'

interface DataContextType {
  products: Product[]
  sources: Source[]
  priceRecords: PriceRecord[]
  exchangeRates: ExchangeRate[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  convertPrice: (price: number, fromCurrency: string, toCurrency: string) => number
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [sources, setSources] = useState<Source[]>([])
  const [priceRecords, setPriceRecords] = useState<PriceRecord[]>([])
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Exchange rates default (if Supabase not available)
  const defaultRates: Record<string, Record<string, number>> = {
    XAF: { USD: 0.00156, EUR: 0.00148, CNY: 0.011, XAF: 1 },
    USD: { XAF: 641.03, EUR: 0.95, CNY: 7.08, USD: 1 },
    EUR: { XAF: 656.94, USD: 1.05, CNY: 7.45, EUR: 1 },
    CNY: { XAF: 90.52, USD: 0.141, EUR: 0.134, CNY: 1 },
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [prods, srcs, prices, rates] = await Promise.all([
        getProducts(),
        getSources(),
        getPriceRecords(undefined, 100),
        getExchangeRates(),
      ])

      setProducts(prods)
      setSources(srcs)
      setPriceRecords(prices)
      setExchangeRates(rates)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Error loading data')
      // Set default/empty data on error
      setProducts([])
      setSources([])
      setPriceRecords([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Refetch every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const convertPrice = (price: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return price

    // Try to use Supabase rates if available
    if (exchangeRates.length > 0) {
      const rate = exchangeRates.find(
        (r) => r.from_currency === fromCurrency && r.to_currency === toCurrency
      )
      if (rate) return price * rate.rate
    }

    // Fall back to default rates
    const rates = defaultRates[fromCurrency]
    if (rates && rates[toCurrency]) {
      return price * rates[toCurrency]
    }

    // If no rate found, return original price
    console.warn(`No conversion rate found: ${fromCurrency} → ${toCurrency}`)
    return price
  }

  const value: DataContextType = {
    products,
    sources,
    priceRecords,
    exchangeRates,
    loading,
    error,
    refetch: fetchData,
    convertPrice,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
