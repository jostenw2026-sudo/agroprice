import React, { useState, useMemo } from 'react'
import { useData } from '../contexts/DataContext'
import { Modal } from '../components/Modal'
import { Plus, TrendingUp, TrendingDown, Loader } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const Prices: React.FC = () => {
  const { priceRecords, products, sources, loading } = useData()
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [dateFilter, setDateFilter] = useState('all') // all, 7d, 30d, 90d
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    product_id: '',
    source_id: '',
    price_fcfa: '',
    price_usd: '',
    price_cny: '',
    product_form: '',
    quality_grade: '',
  })

  // Filter price records
  const filteredPrices = useMemo(() => {
    let filtered = priceRecords

    // By product
    if (selectedProduct) {
      filtered = filtered.filter((p) => p.product_id === selectedProduct)
    }

    // By date
    const daysAgo = {
      all: 365,
      '7d': 7,
      '30d': 30,
      '90d': 90,
    }
    const cutoffDate = new Date(new Date().getTime() - daysAgo[dateFilter as keyof typeof daysAgo] * 24 * 60 * 60 * 1000)
    filtered = filtered.filter((p) => new Date(p.recorded_at) >= cutoffDate)

    return filtered.slice(0, 50) // Top 50
  }, [priceRecords, selectedProduct, dateFilter])

  // Calculate stats
  const stats = useMemo(() => {
    if (filteredPrices.length === 0) return { avg: 0, min: 0, max: 0, change: 0 }

    const prices = filteredPrices.map((p) => p.price_fcfa)
    const avg = prices.reduce((a, b) => a + b) / prices.length
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const first = prices[prices.length - 1]
    const last = prices[0]
    const change = ((last - first) / first) * 100

    return { avg, min, max, change }
  }, [filteredPrices])

  const handleAddPrice = () => {
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement Supabase insert
    console.log('Submit price:', formData)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Gestion des Prix</h2>
          <p className="text-slate-400">Historique et mise à jour des prix</p>
        </div>
        <button
          onClick={handleAddPrice}
          className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Ajouter Prix
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card">
          <p className="text-slate-400 text-sm mb-1">Moyenne</p>
          <p className="text-2xl font-bold text-white">₣ {Math.round(stats.avg)}</p>
        </div>
        <div className="card">
          <p className="text-slate-400 text-sm mb-1">Minimum</p>
          <p className="text-2xl font-bold text-emerald-400">₣ {Math.round(stats.min)}</p>
        </div>
        <div className="card">
          <p className="text-slate-400 text-sm mb-1">Maximum</p>
          <p className="text-2xl font-bold text-red-400">₣ {Math.round(stats.max)}</p>
        </div>
        <div className="card">
          <p className="text-slate-400 text-sm mb-1">Variation</p>
          <div className="flex items-baseline gap-1">
            {stats.change > 0 ? (
              <>
                <TrendingUp className="w-5 h-5 text-red-400" />
                <p className="text-2xl font-bold text-red-400">{stats.change.toFixed(1)}%</p>
              </>
            ) : (
              <>
                <TrendingDown className="w-5 h-5 text-emerald-400" />
                <p className="text-2xl font-bold text-emerald-400">{stats.change.toFixed(1)}%</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-4">
          {/* Product Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">Produit</label>
            <select
              value={selectedProduct || ''}
              onChange={(e) => setSelectedProduct(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Tous les produits</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name_fr}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">Période</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tous</option>
              <option value="7d">7 jours</option>
              <option value="30d">30 jours</option>
              <option value="90d">90 jours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price History Table */}
      <div className="card overflow-x-auto">
        <h3 className="text-lg font-semibold text-white mb-4">
          Historique ({filteredPrices.length} records)
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
            <p className="text-slate-400 mt-3">Chargement...</p>
          </div>
        ) : filteredPrices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Aucun prix trouvé</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Produit</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Source</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Forme</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Qualité</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-300">FCFA</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-300">USD</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-300">CNY</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrices.map((record) => {
                const product = products.find((p) => p.id === record.product_id)
                const source = sources.find((s) => s.id === record.source_id)

                return (
                  <tr
                    key={record.id}
                    className="border-b border-slate-700/50 hover:bg-slate-800/30 transition"
                  >
                    <td className="px-4 py-3 font-medium text-white">{product?.name_fr || '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{source?.name || '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{record.product_form}</td>
                    <td className="px-4 py-3 text-slate-300">{record.quality_grade}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-400">
                      ₣ {record.price_fcfa.toLocaleString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-400">
                      $ {record.price_usd.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-yellow-400">
                      ¥ {record.price_cny.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {format(new Date(record.recorded_at), 'dd MMM HH:mm', { locale: fr })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Price Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter Nouveau Prix"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Produit</label>
              <select
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Sélectionner</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name_fr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Source</label>
              <select
                value={formData.source_id}
                onChange={(e) => setFormData({ ...formData, source_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Sélectionner</option>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Forme</label>
              <input
                type="text"
                placeholder="ex: frais, poudre, lyophilisé"
                value={formData.product_form}
                onChange={(e) => setFormData({ ...formData, product_form: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Qualité</label>
              <select
                value={formData.quality_grade}
                onChange={(e) => setFormData({ ...formData, quality_grade: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Sélectionner</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Prix FCFA</label>
              <input
                type="number"
                placeholder="0"
                value={formData.price_fcfa}
                onChange={(e) => setFormData({ ...formData, price_fcfa: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Prix USD</label>
              <input
                type="number"
                placeholder="0"
                step="0.01"
                value={formData.price_usd}
                onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Prix CNY</label>
              <input
                type="number"
                placeholder="0"
                step="0.01"
                value={formData.price_cny}
                onChange={(e) => setFormData({ ...formData, price_cny: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700 text-white hover:bg-slate-600 font-medium transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Prices
