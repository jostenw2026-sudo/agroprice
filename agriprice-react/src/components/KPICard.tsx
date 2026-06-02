import React from 'react'

interface KPICardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'stable'
}

export const KPICard: React.FC<KPICardProps> = ({
  icon,
  label,
  value,
  subtitle,
  trend,
}) => {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-slate-400 text-sm mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            {trend && (
              <span className={`text-xs font-medium ${
                trend === 'up' ? 'text-emerald-400' :
                trend === 'down' ? 'text-red-400' :
                'text-slate-400'
              }`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}
