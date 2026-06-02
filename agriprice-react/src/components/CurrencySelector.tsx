import React from 'react'

interface CurrencySelectorProps {
  value: string
  onChange: (currency: string) => void
}

const CURRENCIES = [
  { code: 'XAF', label: 'XAF (FCFA)', symbol: '₣' },
  { code: 'USD', label: 'USD ($)', symbol: '$' },
  { code: 'EUR', label: 'EUR (€)', symbol: '€' },
  { code: 'CNY', label: 'CNY (¥)', symbol: '¥' },
]

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-slate-300">Devises:</label>
      <div className="flex gap-2">
        {CURRENCIES.map((currency) => (
          <button
            key={currency.code}
            onClick={() => onChange(currency.code)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              value === currency.code
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            <span className="hidden sm:inline">{currency.label}</span>
            <span className="sm:hidden">{currency.symbol}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
