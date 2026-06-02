import React, { useState, useMemo } from 'react'
import { useData } from '../contexts/DataContext'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Loader, TrendingUp, Calendar } from 'lucide-react'

// Seasonal price indices for 25 Cameroon products
const SEASONAL_INDICES: Record<string, number[]> = {
  'Maïs': [85, 82, 88, 95, 105, 115, 120, 118, 110, 100, 90, 85],
  'Riz': [90, 88, 85, 90, 100, 110, 115, 112, 105, 95, 92, 90],
  'Manioc': [92, 90, 88, 90, 95, 105, 115, 118, 115, 105, 95, 92],
  'Arachide': [88, 85, 82, 85, 90, 100, 110, 115, 118, 110, 100, 88],
  'Soja': [85, 83, 80, 82, 90, 105, 115, 120, 118, 110, 95, 85],
  'Haricot': [90, 88, 85, 88, 95, 105, 115, 120, 118, 108, 98, 90],
  'Sorgho': [87, 85, 82, 85, 92, 102, 112, 118, 115, 105, 92, 87],
  'Mil': [86, 84, 81, 84, 91, 101, 111, 117, 114, 104, 91, 86],
  'Fonio': [89, 87, 84, 87, 94, 104, 114, 119, 116, 106, 94, 89],
  'Banane plantain': [95, 92, 90, 95, 105, 115, 125, 128, 125, 115, 105, 95],
  'Tomate': [100, 98, 95, 92, 85, 80, 85, 95, 110, 125, 130, 120],
  'Oignon': [98, 95, 92, 88, 82, 80, 85, 95, 108, 120, 125, 110],
  'Piment': [105, 102, 99, 95, 88, 82, 85, 98, 115, 130, 135, 120],
  'Aubergine': [102, 99, 96, 92, 85, 78, 80, 95, 112, 128, 132, 115],
  'Courgette': [100, 97, 94, 90, 82, 75, 78, 92, 110, 125, 130, 112],
  'Carotte': [96, 93, 90, 88, 85, 85, 90, 100, 115, 125, 128, 110],
  'Betterave': [94, 91, 88, 86, 83, 83, 88, 98, 113, 123, 126, 108],
  'Cacao': [92, 90, 88, 92, 100, 110, 120, 125, 120, 110, 98, 92],
  'Café': [91, 89, 87, 91, 99, 109, 119, 124, 119, 109, 97, 91],
  'Arachide de bouche': [86, 83, 80, 83, 88, 98, 108, 113, 116, 108, 98, 86],
  'Niébé': [88, 85, 82, 85, 90, 100, 110, 115, 118, 110, 100, 88],
  'Coprah': [90, 88, 86, 88, 95, 105, 115, 120, 118, 108, 98, 90],
  'Huile de palme': [89, 87, 85, 87, 94, 104, 114, 119, 117, 107, 97, 89],
  'Noix de coco': [91, 89, 87, 89, 96, 106, 116, 121, 119, 109, 99, 91],
  'Ananas': [98, 95, 92, 90, 88, 85, 88, 98, 110, 125, 130, 120],
}

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

export const Variations: React.FC = () => {
  const { products, loading } = useData()
  const [selectedProduct, setSelectedProduct] = useState<string>('')

  // Get seasonal data for selected product
  const seasonalData = useMemo(() => {
    if (!selectedProduct) return []
    
    const indices = SEASONAL_INDICES[selectedProduct] || []
    return MONTHS.map((month, idx) => ({
      month,
      indice: indices[idx] || 100,
      moyenneAnnuelle: 100,
    }))
  }, [selectedProduct])

  // Calculate statistics
  const stats = useMemo(() => {
    if (seasonalData.length === 0) return null
    
    const indices = seasonalData.map(d => d.indice)
    const max = Math.max(...indices)
    const min = Math.min(...indices)
    const avg = Math.round(indices.reduce((a, b) => a + b, 0) / indices.length)
    const variation = max - min

    return { max, min, avg, variation }
  }, [seasonalData])

  // Get available products
  const availableProducts = useMemo(() => {
    return Object.keys(SEASONAL_INDICES).filter(p => products.some(prod => prod.name_fr.includes(p) || p.includes(prod.name_fr)))
  }, [products])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Variations & Saisonnalité</h2>
        <p className="text-slate-400">Indices de prix mensuels (Base 100 = moyenne annuelle)</p>
      </div>

      {/* Product Selector */}
      {loading ? (
        <div className="text-center py-12">
          <Loader className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
          <p className="text-slate-400 mt-3">Chargement...</p>
        </div>
      ) : (
        <>
          <div className="card">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Sélectionner un produit</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- Choisir un produit --</option>
              {availableProducts.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && stats && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="card">
                  <p className="text-xs text-slate-400 mb-2">Pic annuel</p>
                  <p className="text-2xl font-bold text-emerald-400">{stats.max}%</p>
                  <p className="text-xs text-slate-500 mt-1">Indice maximum</p>
                </div>
                <div className="card">
                  <p className="text-xs text-slate-400 mb-2">Creux annuel</p>
                  <p className="text-2xl font-bold text-red-400">{stats.min}%</p>
                  <p className="text-xs text-slate-500 mt-1">Indice minimum</p>
                </div>
                <div className="card">
                  <p className="text-xs text-slate-400 mb-2">Moyenne annuelle</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.avg}%</p>
                  <p className="text-xs text-slate-500 mt-1">Base 100</p>
                </div>
                <div className="card">
                  <p className="text-xs text-slate-400 mb-2">Volatilité</p>
                  <p className="text-2xl font-bold text-amber-400">{stats.variation}%</p>
                  <p className="text-xs text-slate-500 mt-1">Écart pic-creux</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-2 gap-6">
                {/* Line Chart */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Courbe saisonnière
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={seasonalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="indice"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Indice mensuel"
                      />
                      <Line
                        type="monotone"
                        dataKey="moyenneAnnuelle"
                        stroke="#64748b"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Moyenne annuelle"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Écarts mensuels
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={seasonalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Bar
                        dataKey="indice"
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                        name="Indice du mois"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Breakdown Table */}
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Détail par mois</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-3 px-4 font-semibold text-slate-300">Mois</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-300">Indice</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-300">vs Moyenne</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-300">Tendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seasonalData.map((data, idx) => {
                        const diff = data.indice - 100
                        const trend = diff > 0 ? '↑' : diff < 0 ? '↓' : '→'
                        const trendColor = diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-slate-400'

                        return (
                          <tr key={idx} className="border-b border-slate-700/20 hover:bg-slate-700/20 transition">
                            <td className="py-3 px-4 text-slate-300">{data.month}</td>
                            <td className="py-3 px-4 text-right text-white font-semibold">{data.indice}%</td>
                            <td className={`py-3 px-4 text-right font-semibold ${trendColor}`}>
                              {diff > 0 ? '+' : ''}{diff}%
                            </td>
                            <td className={`py-3 px-4 text-right font-semibold text-xl ${trendColor}`}>{trend}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Insights */}
              <div className="card border-l-4 border-emerald-500">
                <h3 className="text-lg font-semibold text-white mb-3">Recommandations</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Pic de prix: {MONTHS[seasonalData.findIndex(d => d.indice === stats.max)]} (indice {stats.max}%)</li>
                  <li>• Creux de prix: {MONTHS[seasonalData.findIndex(d => d.indice === stats.min)]} (indice {stats.min}%)</li>
                  <li>• Volatilité: {stats.variation}% écart pic-creux — {stats.variation > 30 ? 'Très saisonnier' : stats.variation > 15 ? 'Modérément saisonnier' : 'Peu saisonnier'}</li>
                  <li>• Stratégie stockage: Accumuler au creux ({MONTHS[seasonalData.findIndex(d => d.indice === stats.min)]}) pour écouler au pic</li>
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Variations
