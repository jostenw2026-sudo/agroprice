import React, { useState } from 'react'
import { Download, FileJson, Table2, FileText } from 'lucide-react'
import { useData } from '../contexts/DataContext'

interface ExportFormat {
  id: 'csv' | 'excel' | 'json'
  name: string
  description: string
  icon: React.ReactNode
  color: string
}

const Exports: React.FC = () => {
  const { products, sources, priceRecords } = useData()
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'json' | null>(null)
  const [exportType, setExportType] = useState<'prices' | 'products' | 'sources'>('prices')
  const [isExporting, setIsExporting] = useState(false)

  const formats: ExportFormat[] = [
    {
      id: 'csv',
      name: 'CSV',
      description: 'Format tabulaire pour Excel/Sheets',
      icon: <Table2 className="w-6 h-6" />,
      color: 'emerald',
    },
    {
      id: 'excel',
      name: 'Excel (.xlsx)',
      description: 'Classeur avec formatage avancé',
      icon: <FileText className="w-6 h-6" />,
      color: 'blue',
    },
    {
      id: 'json',
      name: 'JSON',
      description: 'Format structuré pour API/intégration',
      icon: <FileJson className="w-6 h-6" />,
      color: 'amber',
    },
  ]

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return ''

    const headers = Object.keys(data[0])
    const csvHeaders = headers.join(',')
    const csvRows = data.map(row =>
      headers.map(header => {
        const value = row[header]
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`
        }
        return value
      }).join(',')
    )

    return [csvHeaders, ...csvRows].join('\n')
  }

  const convertToJSON = (data: any[]): string => {
    return JSON.stringify(data, null, 2)
  }

  const generateExcelXML = (data: any[]): string => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Data">
    <Table>`

    if (data.length > 0) {
      // Headers
      const headers = Object.keys(data[0])
      xml += '\n    <Row>'
      headers.forEach(header => {
        xml += `\n      <Cell><Data ss:Type="String">${header}</Data></Cell>`
      })
      xml += '\n    </Row>'

      // Rows
      data.forEach(row => {
        xml += '\n    <Row>'
        headers.forEach(header => {
          const value = row[header]
          const type = typeof value === 'number' ? 'Number' : 'String'
          xml += `\n      <Cell><Data ss:Type="${type}">${value}</Data></Cell>`
        })
        xml += '\n    </Row>'
      })
    }

    xml += `\n    </Table>
  </Worksheet>
</Workbook>`
    return xml
  }

  const handleExport = async (format: 'csv' | 'excel' | 'json') => {
    setIsExporting(true)

    try {
      let data: any[] = []
      let filename = ''

      if (exportType === 'prices') {
        data = priceRecords || []
        filename = `AgriPrice_Prices_${new Date().toISOString().split('T')[0]}`
      } else if (exportType === 'products') {
        data = products || []
        filename = `AgriPrice_Products_${new Date().toISOString().split('T')[0]}`
      } else if (exportType === 'sources') {
        data = sources || []
        filename = `AgriPrice_Sources_${new Date().toISOString().split('T')[0]}`
      }

      let content = ''
      let mimeType = 'text/plain'
      let extension = ''

      if (format === 'csv') {
        content = convertToCSV(data)
        mimeType = 'text/csv;charset=utf-8;'
        extension = '.csv'
      } else if (format === 'excel') {
        content = generateExcelXML(data)
        mimeType = 'application/vnd.ms-excel;charset=utf-8;'
        extension = '.xls'
      } else if (format === 'json') {
        content = convertToJSON(data)
        mimeType = 'application/json;charset=utf-8;'
        extension = '.json'
      }

      // Create blob and download
      const blob = new Blob([content], { type: mimeType })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename + extension)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Simulate API call to log export
      console.log(`Export ${format.toUpperCase()}: ${exportType} (${data.length} rows)`)
    } catch (err) {
      console.error('Export error:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">📥 Exports Avancés</h1>
        <p className="text-slate-400">Téléchargez vos données en CSV, Excel ou JSON</p>
      </div>

      {/* Export Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: 'prices', label: '💰 Prix', count: priceRecords?.length || 0 },
          { id: 'products', label: '🛍️ Produits', count: products?.length || 0 },
          { id: 'sources', label: '🏦 Sources', count: sources?.length || 0 },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setExportType(type.id as any)}
            className={`p-4 rounded-lg transition ${
              exportType === type.id
                ? 'bg-emerald-500/20 border border-emerald-500/50'
                : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50'
            }`}
          >
            <p className="text-lg font-semibold text-white">{type.label}</p>
            <p className="text-sm text-slate-400">{type.count} enregistrements</p>
          </button>
        ))}
      </div>

      {/* Format Selection */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Format d'export</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              className={`p-6 rounded-lg border transition ${
                selectedFormat === format.id
                  ? `bg-${format.color}-500/20 border-${format.color}-500/50`
                  : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'
              }`}
            >
              <div className={`text-${format.color}-400 mb-3`}>{format.icon}</div>
              <h3 className="text-lg font-semibold text-white">{format.name}</h3>
              <p className="text-sm text-slate-400 mt-2">{format.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Export Buttons */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Télécharger maintenant</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => handleExport(format.id)}
              disabled={isExporting}
              className={`px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                format.color === 'emerald'
                  ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50'
                  : format.color === 'blue'
                  ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 disabled:opacity-50'
                  : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 disabled:opacity-50'
              }`}
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Export...' : `Export ${format.name}`}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">✨ Fonctionnalités</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>✅ Export complet de toutes vos données</li>
            <li>✅ Format tabulaire (CSV, Excel)</li>
            <li>✅ Format structuré (JSON)</li>
            <li>✅ Téléchargement instantané</li>
            <li>✅ Noms de fichiers avec date</li>
            <li>✅ Compatible Excel/Google Sheets</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">💡 Cas d'usage</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>📊 Analyse dans Excel/Sheets</li>
            <li>🔗 Intégration API (JSON)</li>
            <li>📧 Partage avec partenaires</li>
            <li>🏦 Demande de crédit bancaire</li>
            <li>📈 Rapports personnalisés</li>
            <li>🔄 Sauvegarde & archivage</li>
          </ul>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-emerald-300 mb-2">ℹ️ À Savoir</h3>
        <p className="text-sm text-emerald-200">
          Les exports incluent TOUTES les colonnes de votre tableau (dates, devises, credentials source, etc.).
          Les fichiers sont téléchargés en local — aucune copie n'est stockée sur nos serveurs.
          Phase 4 : exports avancés avec colonnes personnalisables et scheduling.
          <strong> Prochainement:</strong> Scheduled exports par email et intégrations API.
        </p>
      </div>
    </div>
  )
}

export default Exports
