import React, { useState } from 'react'
import { Bell, Mail, AlertCircle, CheckCircle, Send, Loader } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { Modal } from '../components/Modal'

const Notifications: React.FC = () => {
  const {
    settings,
    sendTestAlert,
    sendTestDigest,
    toggleAlerts,
    toggleDigest,
    setThreshold,
    addProductToWatch,
    removeProductFromWatch,
    getStatus,
  } = useNotifications()

  const [testEmail, setTestEmail] = useState('')
  const [showTestModal, setShowTestModal] = useState<'alert' | 'digest' | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  const status = getStatus()
  const products = [
    { id: 'mais', name: '🌽 Maïs' },
    { id: 'riz', name: '🍚 Riz' },
    { id: 'arachide', name: '🥜 Arachide' },
    { id: 'soja', name: '🌱 Soja' },
    { id: 'millet', name: '🌾 Millet' },
  ]

  const handleSendTestAlert = async () => {
    if (!testEmail) return
    setTestLoading(true)
    try {
      const success = await sendTestAlert(testEmail)
      setTestResult(success ? 'success' : 'error')
      if (success) {
        setTimeout(() => {
          setShowTestModal(null)
          setTestEmail('')
          setTestResult(null)
        }, 2000)
      }
    } finally {
      setTestLoading(false)
    }
  }

  const handleSendTestDigest = async () => {
    if (!testEmail) return
    setTestLoading(true)
    try {
      const success = await sendTestDigest(testEmail)
      setTestResult(success ? 'success' : 'error')
      if (success) {
        setTimeout(() => {
          setShowTestModal(null)
          setTestEmail('')
          setTestResult(null)
        }, 2000)
      }
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Bell className="w-8 h-8 text-emerald-400" />
          Centre de Notifications
        </h1>
        <p className="text-slate-400">Configurez vos alertes, digests et preferences email</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
          <p className="text-xs text-emerald-400 uppercase tracking-wide mb-2">Alertes Prix</p>
          <p className="text-2xl font-bold text-white">{status.alertsEnabled ? '🔔' : '🔕'}</p>
          <p className="text-xs text-slate-400 mt-2">{status.alertsEnabled ? 'Activées' : 'Désactivées'}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-4">
          <p className="text-xs text-blue-400 uppercase tracking-wide mb-2">Seuil</p>
          <p className="text-2xl font-bold text-white">{status.threshold}%</p>
          <p className="text-xs text-slate-400 mt-2">Variation minimum</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg p-4">
          <p className="text-xs text-purple-400 uppercase tracking-wide mb-2">Digest</p>
          <p className="text-2xl font-bold text-white">{status.digestEnabled ? '📧' : '🚫'}</p>
          <p className="text-xs text-slate-400 mt-2">{status.digestEnabled ? 'Quotidien' : 'Arrêté'}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-lg p-4">
          <p className="text-xs text-amber-400 uppercase tracking-wide mb-2">Surveille</p>
          <p className="text-2xl font-bold text-white">{status.watchedProducts}</p>
          <p className="text-xs text-slate-400 mt-2">Produits suivi</p>
        </div>
      </div>

      {/* Price Alerts */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-emerald-400" />
          Alertes de Prix
        </h2>

        <div className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
            <div>
              <p className="font-semibold text-white">Activer les alertes</p>
              <p className="text-sm text-slate-400">Recevoir une notification si le prix change</p>
            </div>
            <button
              onClick={() => toggleAlerts(!status.alertsEnabled)}
              className={`relative w-14 h-7 rounded-full transition ${
                status.alertsEnabled ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition ${
                  status.alertsEnabled ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>

          {/* Threshold Slider */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Seuil de Variation: <span className="text-emerald-400">{status.threshold}%</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={status.threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>1%</span>
              <span>Très sensible</span>
              <span>50%</span>
            </div>
          </div>

          {/* Alert Examples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { percent: 5, label: 'Sensible', color: 'emerald' },
              { percent: 10, label: 'Modéré', color: 'blue' },
              { percent: 20, label: 'Élevé', color: 'amber' },
            ].map(({ percent, label, color }) => (
              <button
                key={percent}
                onClick={() => setThreshold(percent)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  status.threshold === percent
                    ? `bg-${color}-500 text-white`
                    : `bg-slate-700/30 text-slate-300 hover:bg-slate-700/50`
                }`}
              >
                {label} ({percent}%)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Watchlist */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Produits à Surveiller</h2>
        <p className="text-sm text-slate-400 mb-4">Sélectionnez les produits pour lesquels vous voulez des alertes</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {products.map((product) => {
            const isWatched = settings.alerts.products?.includes(product.id) || false
            return (
              <button
                key={product.id}
                onClick={() => {
                  if (isWatched) {
                    removeProductFromWatch(product.id)
                  } else {
                    addProductToWatch(product.id)
                  }
                }}
                className={`px-4 py-3 rounded-lg font-medium transition ${
                  isWatched
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-700/30 border border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {isWatched ? '✓ ' : '○ '}
                {product.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Digest Configuration */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-400" />
          Digest Quotidien
        </h2>

        <div className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
            <div>
              <p className="font-semibold text-white">Recevoir le digest quotidien</p>
              <p className="text-sm text-slate-400">Résumé par email chaque matin</p>
            </div>
            <button
              onClick={() => toggleDigest(!status.digestEnabled)}
              className={`relative w-14 h-7 rounded-full transition ${
                status.digestEnabled ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition ${
                  status.digestEnabled ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>

          {/* Digest Content */}
          <div className="p-4 rounded-lg bg-slate-700/20 border border-slate-600/30">
            <p className="text-sm font-semibold text-white mb-3">Le digest inclut:</p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✓ Top 5 produits les plus volatiles</li>
              <li>✓ Changements de prix majeurs</li>
              <li>✓ Résumé des alertes déclenchées</li>
              <li>✓ Tendances saisonnières</li>
              <li>✓ Opportunités de marché</li>
            </ul>
          </div>

          {/* Frequency Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">Fréquence</label>
            <div className="flex gap-3">
              {[
                { value: 'daily', label: 'Quotidien' },
                { value: 'weekly', label: 'Hebdomadaire' },
              ].map((option) => (
                <button
                  key={option.value}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    settings.digest.frequency === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Test Emails */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">🧪 Tester les Emails</h2>
        <p className="text-sm text-slate-400 mb-6">Envoyer un email de test pour voir à quoi ressemblent les notifications</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Email de test</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="votre.email@example.com"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowTestModal('alert')}
              disabled={!testEmail}
              className="px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Envoyer alerte test
            </button>

            <button
              onClick={() => setShowTestModal('digest')}
              disabled={!testEmail}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Envoyer digest test
            </button>
          </div>
        </div>
      </div>

      {/* Error Messages */}

      {/* Test Modal */}
      <Modal
        isOpen={!!showTestModal}
        size="md"
        onClose={() => setShowTestModal(null)}
        title={showTestModal === 'alert' ? '📨 Envoyer Alerte Test' : '📧 Envoyer Digest Test'}
      >
        <div className="space-y-4">
          {testResult === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-white font-semibold">Email envoyé avec succès!</p>
                <p className="text-sm text-slate-400 mt-2">Vérifiez votre inbox</p>
              </div>
            ) : testResult === 'error' ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-white font-semibold">Erreur lors de l'envoi</p>
                <p className="text-sm text-slate-400 mt-2">Vérifiez votre adresse email</p>
              </div>
            ) : (
              <>
                <p className="text-slate-300 text-sm">
                  Un email de test sera envoyé à <strong>{testEmail}</strong>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      showTestModal === 'alert' ? handleSendTestAlert() : handleSendTestDigest()
                    }
                    disabled={testLoading}
                    className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                  >
                    {testLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowTestModal(null)}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 font-medium"
                  >
                    Annuler
                  </button>
                </div>
              </>
            )}
        </div>
      </Modal>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-3">ℹ️ À Propos des Notifications</h3>
        <ul className="space-y-2 text-sm text-blue-200">
          <li>✓ Les emails sont envoyés via <strong>SendGrid</strong> (fiable, sécurisé)</li>
          <li>✓ Vos paramètres sont sauvegardés automatiquement</li>
          <li>✓ Vous pouvez modifier vos préférences à tout moment</li>
          <li>✓ Désinscrivez-vous facilement via le lien dans chaque email</li>
          <li>✓ Les alertes respectent votre seuil de variation défini</li>
        </ul>
      </div>
    </div>
  )
}

export default Notifications
