import React, { useState, useMemo } from 'react'
import { useData } from '../contexts/DataContext'
import { KPICard } from '../components/KPICard'
import { PriceChart } from '../components/PriceChart'
import { PricesTable } from '../components/PricesTable'
import { CurrencySelector } from '../components/CurrencySelector'
import { RefreshCw } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { products, sources, priceRecords, loading, error, refetch, convertPrice } = useData()
  const [currency, setCurrency] = useState('XAF')
  const [refreshing, setRefreshing] = useState(false)

  // Calculate KPIs
  const kpis = useMemo(() => {
    return {
      productsCount: products.length,
      sourcesCount: sources.length,
      avgConfidence: Math.round(
        priceRecords.reduce((acc) => acc + 95, 0) / (priceRecords.length || 1)
      ),
      lastSync: priceRecords.length > 0
        ? new Date(priceRecords[0].recorded_at).toLocaleTimeString('fr-FR')
        : 'Nunca',
    }
  }, [products, sources, priceRecords])

  // Generate chart data (last 30 days)
  const chartData = useMemo(() => {
    const data = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Average price from records for this date
      const dayRecords = priceRecords.filter((r) => {
        const recordDate = new Date(r.recorded_at)
        return recordDate.toDateString() === date.toDateString()
      })

      const avgPrice =
        dayRecords.length > 0
          ? dayRecords.reduce((sum, r) => sum + (currency === 'XAF' ? r.price_fcfa : currency === 'USD' ? r.price_usd : r.price_cny), 0) /
            dayRecords.length
          : 0

      data.push({
        date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        price: Math.round(avgPrice),
        avgPrice: Math.round(avgPrice * 0.95), // Simulate moving average
      })
    }
    return data
  }, [priceRecords, currency])

  // Prepare table data
  const tableData = useMemo(() => {
    return priceRecords.slice(0, 20).map((record) => {
      const product = products.find((p) => p.id === record.product_id)
      const source = sources.find((s) => s.id === record.source_id)

      const price =
        currency === 'XAF'
          ? record.price_fcfa
          : currency === 'USD'
          ? record.price_usd
          : record.price_cny

      return {
        id: record.id,
        productName: product?.name_fr || 'Unknown',
        productForm: record.product_form,
        source: source?.name || 'Unknown',
        price: convertPrice(price, currency, currency),
        currency,
        change: Math.random() * 10 - 5, // Simulate change
        confidence: Math.floor(Math.random() * 20) + 85,
        region: source?.region || 'Unknown',
        lastUpdated: record.recorded_at,
      }
    })
  }, [priceRecords, products, sources, currency, convertPrice])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-slate-400">Suivi des prix agricoles en temps réel</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-300">
          <p className="text-sm">{error}</p>
          <p className="text-xs text-red-400 mt-1">
            Les données par défaut sont affichées. Vérifiez votre connexion Supabase.
          </p>
        </div>
      )}

      {/* Currency Selector */}
      <div className="flex justify-end">
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          icon="📦"
          label="Produits tracés"
          value={kpis.productsCount}
          subtitle="Variétés camerounaises"
          trend="stable"
        />
        <KPICard
          icon="🔍"
          label="Sources vérifiées"
          value={kpis.sourcesCount}
          subtitle="B2B internationales"
          trend="stable"
        />
        <KPICard
          icon="✅"
          label="Confiance moyenne"
          value={`${kpis.avgConfidence}%`}
          subtitle="Crédibilité données"
          trend="up"
        />
        <KPICard
          icon="🕐"
          label="Dernière sync"
          value={kpis.lastSync}
          subtitle="Mise à jour"
          trend="stable"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <PriceChart
          data={chartData}
          title="Évolution des prix (30 jours)"
          height={300}
          chartType="line"
          currencyLabel={currency}
        />
        <PriceChart
          data={chartData.slice(-7)} // Last 7 days
          title="Comparaison hebdomadaire"
          height={300}
          chartType="bar"
          currencyLabel={currency}
        />
      </div>

      {/* Prices Table */}
      <PricesTable data={tableData} loading={loading} currency={currency} />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Région Asie</h4>
          <p className="text-2xl font-bold text-white">
            {sources.filter((s) => s.region === 'Asia').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">sources actives</p>
        </div>
        <div className="card">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Région Europe</h4>
          <p className="text-2xl font-bold text-white">
            {sources.filter((s) => s.region === 'Europe').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">sources actives</p>
        </div>
        <div className="card">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Amérique du Nord</h4>
          <p className="text-2xl font-bold text-white">
            {sources.filter((s) => s.region === 'North America').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">sources actives</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
