import { useState, useCallback } from 'react'
import { emailService, AlertConfig, DigestConfig } from '../lib/email'

export interface NotificationSettings {
  alerts: AlertConfig
  digest: DigestConfig
  emailNotifications: boolean
  pushNotifications: boolean
  thresholdPercent: number
}

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    alerts: {
      enabled: true,
      email: '',
      priceThreshold: 5,
      frequency: 'daily',
      products: [],
    },
    digest: {
      enabled: true,
      email: '',
      frequency: 'daily',
      includeAlerts: true,
      includePriceChanges: true,
      includeSeasonalTrends: true,
    },
    emailNotifications: true,
    pushNotifications: false,
    thresholdPercent: 5,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Save notification settings
   */
  const saveSettings = useCallback(
    async (newSettings: NotificationSettings) => {
      setLoading(true)
      setError(null)
      try {
        // In production, this would POST to your API
        // POST /api/notifications/settings
        console.log('Saving notification settings:', newSettings)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setSettings(newSettings)
        console.log('✅ Notification settings saved')
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error saving settings'
        setError(message)
        console.error('Error saving settings:', err)
        return false
      } finally {
        setLoading(false)
      }
    },
    []
  )

  /**
   * Send test alert email
   */
  const sendTestAlert = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)
    try {
      const success = await emailService.sendPriceAlert(
        email,
        'Maïs',
        450000,
        475000,
        'XAF'
      )
      if (!success) {
        throw new Error('Failed to send test alert')
      }
      console.log('✅ Test alert sent')
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error sending test alert'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Send test digest email
   */
  const sendTestDigest = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)
    try {
      const success = await emailService.sendDailyDigest(email, {
        topMovers: [
          { product: 'Maïs', change: 5.2, price: 475000 },
          { product: 'Riz', change: -3.1, price: 520000 },
          { product: 'Arachide', change: 2.8, price: 380000 },
        ],
        avgPrice: 425000,
        newsCount: 3,
        alertsCount: 2,
      })
      if (!success) {
        throw new Error('Failed to send test digest')
      }
      console.log('✅ Test digest sent')
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error sending test digest'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Enable/disable price alerts
   */
  const toggleAlerts = useCallback(
    (enabled: boolean) => {
      setSettings(prev => ({
        ...prev,
        alerts: { ...prev.alerts, enabled },
      }))
    },
    []
  )

  /**
   * Enable/disable daily digest
   */
  const toggleDigest = useCallback(
    (enabled: boolean) => {
      setSettings(prev => ({
        ...prev,
        digest: { ...prev.digest, enabled },
      }))
    },
    []
  )

  /**
   * Update price threshold for alerts
   */
  const setThreshold = useCallback(
    (percent: number) => {
      setSettings(prev => ({
        ...prev,
        thresholdPercent: percent,
        alerts: { ...prev.alerts, priceThreshold: percent },
      }))
    },
    []
  )

  /**
   * Add product to alert watchlist
   */
  const addProductToWatch = useCallback(
    (productId: string) => {
      setSettings(prev => ({
        ...prev,
        alerts: {
          ...prev.alerts,
          products: [...(prev.alerts.products || []), productId],
        },
      }))
    },
    []
  )

  /**
   * Remove product from alert watchlist
   */
  const removeProductFromWatch = useCallback(
    (productId: string) => {
      setSettings(prev => ({
        ...prev,
        alerts: {
          ...prev.alerts,
          products: (prev.alerts.products || []).filter(p => p !== productId),
        },
      }))
    },
    []
  )

  /**
   * Get notification status
   */
  const getStatus = () => {
    return {
      alertsEnabled: settings.alerts.enabled,
      digestEnabled: settings.digest.enabled,
      threshold: settings.thresholdPercent,
      watchedProducts: settings.alerts.products?.length || 0,
    }
  }

  return {
    settings,
    loading,
    error,
    saveSettings,
    sendTestAlert,
    sendTestDigest,
    toggleAlerts,
    toggleDigest,
    setThreshold,
    addProductToWatch,
    removeProductFromWatch,
    getStatus,
  }
}
