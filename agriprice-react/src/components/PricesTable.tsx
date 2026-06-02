import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PriceTableRow {
  id: number
  productName: string
  productForm: string
  source: string
  price: number
  currency: string
  change?: number
  confidence: number
  region: string
  lastUpdated: string
}

interface PricesTableProps {
  data: PriceTableRow[]
  loading?: boolean
  currency?: string
}

export const PricesTable: React.FC<PricesTableProps> = ({
  data,
  loading = false,
  currency = 'XAF',
}) => {
  const getCurrencySymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      XAF: '₣',
      USD: '$',
      EUR: '€',
      CNY: '¥',
    }
    return symbols[curr] || curr
  }

  const getRegionColor = (region: string) => {
    const colors: Record<string, string> = {
      'Asia': 'badge-blue',
      'Europe': 'badge-green',
      'North America': 'badge-red',
    }
    return colors[region] || 'badge-blue'
  }

  if (loading) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-400">Chargement des prix...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-400">Aucun prix disponible</p>
      </div>
    )
  }

  return (
    <div className="card overflow-x-auto">
      <h3 className="text-lg font-semibold text-white mb-4">Prix Actuels</h3>
      
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800/50">
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Produit</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Forme</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Source</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Région</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-300">Prix</th>
            <th className="px-4 py-3 text-center font-semibold text-slate-300">Variation</th>
            <th className="px-4 py-3 text-center font-semibold text-slate-300">Confiance</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Mis à jour</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={`${row.id}-${idx}`}
              className="border-b border-slate-700/50 hover:bg-slate-800/30 transition"
            >
              <td className="px-4 py-3 font-medium text-white">{row.productName}</td>
              <td className="px-4 py-3 text-slate-300">{row.productForm}</td>
              <td className="px-4 py-3 text-slate-300">{row.source}</td>
              <td className="px-4 py-3">
                <span className={`badge ${getRegionColor(row.region)}`}>
                  {row.region}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-emerald-400">
                {getCurrencySymbol(currency)} {row.price.toLocaleString('fr-FR', {
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="px-4 py-3 text-center">
                {row.change !== undefined && (
                  <div className="flex items-center justify-center gap-1">
                    {row.change > 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">{row.change.toFixed(1)}%</span>
                      </>
                    ) : row.change < 0 ? (
                      <>
                        <TrendingDown className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">{row.change.toFixed(1)}%</span>
                      </>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center">
                  <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${row.confidence}%` }}
                    />
                  </div>
                  <span className="ml-2 text-xs font-medium text-slate-300">
                    {row.confidence}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-400 text-xs">
                {new Date(row.lastUpdated).toLocaleDateString('fr-FR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
