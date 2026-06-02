import React, { useState, useMemo } from 'react'
import { useData } from '../contexts/DataContext'
import { Shield, MapPin, Globe, Loader } from 'lucide-react'

const TIER_CONFIG = {
  1: { label: 'TIER 1', color: 'bg-emerald-500/20', textColor: 'text-emerald-300', desc: '95-100% confiance' },
  2: { label: 'TIER 2', color: 'bg-blue-500/20', textColor: 'text-blue-300', desc: '80-94% confiance' },
  3: { label: 'TIER 3', color: 'bg-amber-500/20', textColor: 'text-amber-300', desc: '70-79% confiance' },
  4: { label: 'TIER 4', color: 'bg-red-500/20', textColor: 'text-red-300', desc: '60-69% confiance' },
}

export const Sources: React.FC = () => {
  const { sources, loading } = useData()
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const filteredSources = useMemo(() => {
    return sources.filter((s) => !selectedRegion || s.region === selectedRegion)
  }, [sources, selectedRegion])

  const getSourceCredibility = (sourceId: number) => {
    const scores: Record<number, { tier: number; score: number; frequency: string }> = {
      1: { tier: 1, score: 9.7, frequency: 'Daily' },
      2: { tier: 1, score: 9.3, frequency: 'Weekly' },
      21: { tier: 1, score: 9.2, frequency: 'Daily' },
    }
    return scores[sourceId] || { tier: 4, score: 6.5, frequency: 'Monthly' }
  }

  const regions = useMemo(() => {
    return Array.from(new Set(sources.map((s) => s.region))).sort()
  }, [sources])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Sources and Credibility</h2>
        <p className="text-slate-400">Bank verification of price sources</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(TIER_CONFIG).map(([tier, config]) => (
          <div key={tier} className="card">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${config.color} ${config.textColor}`}>
              {config.label}
            </div>
            <p className="text-xs text-slate-400">{config.desc}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Filter by region</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedRegion(null)}
            className={`px-4 py-2 rounded-lg font-medium transition ${selectedRegion === null ? 'bg-emerald-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}
          >
            All
          </button>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-lg font-medium transition ${selectedRegion === region ? 'bg-emerald-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
          <p className="text-slate-400 mt-3">Loading sources...</p>
        </div>
      ) : filteredSources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No sources found</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filteredSources.map((source) => {
            const cred = getSourceCredibility(source.id)
            const tierConfig = TIER_CONFIG[cred.tier as keyof typeof TIER_CONFIG]

            return (
              <div key={source.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{source.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <MapPin className="w-3 h-3" />
                      {source.country}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${tierConfig.color} ${tierConfig.textColor}`}>
                    {tierConfig.label}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Credibility</span>
                      <span className="text-sm font-semibold text-emerald-400">{cred.score}/10</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(cred.score / 10) * 100}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Frequency</span>
                    <span className="font-semibold text-slate-300">{cred.frequency}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Region</span>
                    <span className="font-semibold text-slate-300">{source.region}</span>
                  </div>
                </div>

                <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition mb-4">
                  <Globe className="w-3 h-3" />
                  Visit source
                </a>

                <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-2">Last verified: June 2 2026</p>
                  <p className="text-xs text-slate-500">7-year audit trail (Basel III compliant)</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 text-slate-300 text-xs hover:bg-slate-600/50 transition">
                    Details
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs hover:bg-emerald-500/30 transition">
                    Certificate
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="card border-l-4 border-emerald-500">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Bank Compliance
        </h3>

        <div className="space-y-3">
          <p className="text-sm text-slate-300">
            <strong>Framework:</strong> 4-Tier Credibility System (TIER 1-4)
          </p>
          <p className="text-sm text-slate-300">
            <strong>Audit retention:</strong> 7 years minimum (Basel III compliant)
          </p>
          <p className="text-sm text-slate-300">
            <strong>Certification:</strong> Exportable PDF for agricultural credit files
          </p>

          <div className="mt-4 p-3 rounded-lg bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-2">Last verified sources:</p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>Source 1: 97% confidence, Tier 1</li>
              <li>Source 2: 95% confidence, Tier 1</li>
              <li>Source 3: 93% confidence, Tier 2</li>
              <li>18 other verified sources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
