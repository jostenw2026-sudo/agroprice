import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Save, Bell, Globe, Lock, Loader } from 'lucide-react'

export const Settings: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    // Display
    defaultCurrency: 'XAF',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    
    // Notifications
    emailAlerts: true,
    dailyDigest: true,
    priceThreshold: true,
    thresholdValue: 10,
    
    // Privacy
    shareData: false,
    twoFactor: false,
    sessionTimeout: 30,
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Paramètres</h2>
        <p className="text-slate-400">Gérez vos préférences et votre compte</p>
      </div>

      {/* Account Info */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Compte
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-400">Email</label>
            <div className="mt-1 px-4 py-2.5 rounded-lg bg-slate-700/30 border border-slate-600 text-slate-300">
              {user?.email || 'Non connecté'}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400">Rôle</label>
            <div className="mt-1 px-4 py-2.5 rounded-lg bg-slate-700/30 border border-slate-600 text-slate-300">
              Administrateur
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400">Organisme</label>
            <div className="mt-1 px-4 py-2.5 rounded-lg bg-slate-700/30 border border-slate-600 text-slate-300">
              XP-NOVA Engineering
            </div>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Affichage
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="currency" className="block text-sm font-semibold text-slate-300 mb-2">
              Devise par défaut
            </label>
            <select
              id="currency"
              value={settings.defaultCurrency}
              onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="XAF">XAF (Franc CFA)</option>
              <option value="USD">USD (Dollar US)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="CNY">CNY (Yuan Chinois)</option>
            </select>
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-semibold text-slate-300 mb-2">
              Langue
            </label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateFormat" className="block text-sm font-semibold text-slate-300 mb-2">
              Format de date
            </label>
            <select
              id="dateFormat"
              value={settings.dateFormat}
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h3>

        <div className="space-y-4">
          {/* Email Alerts Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Alertes par email</p>
              <p className="text-sm text-slate-400">Recevoir les notifications importantes</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, emailAlerts: !settings.emailAlerts })}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.emailAlerts ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                  settings.emailAlerts ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Daily Digest Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Digest quotidien</p>
              <p className="text-sm text-slate-400">Synthèse journalière des changements</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, dailyDigest: !settings.dailyDigest })}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.dailyDigest ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                  settings.dailyDigest ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Price Threshold Alert */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Alerte seuil prix</p>
              <p className="text-sm text-slate-400">Notification si prix change de plus de X%</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, priceThreshold: !settings.priceThreshold })}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.priceThreshold ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                  settings.priceThreshold ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {settings.priceThreshold && (
            <div>
              <label htmlFor="threshold" className="block text-sm font-semibold text-slate-300 mb-2">
                Seuil de variation (%)
              </label>
              <input
                id="threshold"
                type="number"
                value={settings.thresholdValue}
                onChange={(e) => setSettings({ ...settings, thresholdValue: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Confidentialité & Sécurité
        </h3>

        <div className="space-y-4">
          {/* Data Sharing Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Partager les données</p>
              <p className="text-sm text-slate-400">Autoriser analyses anonymes et benchmarks</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, shareData: !settings.shareData })}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.shareData ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                  settings.shareData ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Two Factor Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Authentification 2FA</p>
              <p className="text-sm text-slate-400">Sécurité renforcée avec vérification SMS</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.twoFactor ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                  settings.twoFactor ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Session Timeout */}
          <div>
            <label htmlFor="timeout" className="block text-sm font-semibold text-slate-300 mb-2">
              Expiration de session (minutes)
            </label>
            <input
              id="timeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition font-semibold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Enregistrer les modifications
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-sm">
          ✓ Paramètres enregistrés avec succès
        </div>
      )}

      {/* Info Box */}
      <div className="card border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold text-white mb-3">À propos</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>
            <strong>Version:</strong> 1.0.0 (React + Supabase)
          </li>
          <li>
            <strong>Dernière mise à jour:</strong> 2 juin 2026
          </li>
          <li>
            <strong>Support:</strong> support@xp-nova.cm
          </li>
          <li>
            <strong>Documentation:</strong> docs.agriprice.xp-nova.com
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Settings
