import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface PriceChartProps {
  data: any[]
  title: string
  height?: number
  chartType?: 'line' | 'bar'
  currencyLabel?: string
}

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  title,
  height = 350,
  chartType = 'line',
  currencyLabel = 'FCFA',
}) => {
  const ChartComponent = chartType === 'line' ? LineChart : BarChart

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>

      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            label={{ value: currencyLabel, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />

          {chartType === 'line' ? (
            <>
              <Line
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="Prix"
              />
              <Line
                type="monotone"
                dataKey="avgPrice"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Moyenne"
              />
            </>
          ) : (
            <Bar dataKey="price" fill="#22c55e" name="Prix" />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}
