import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://glofwrhgzxqttshvxhcw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsb2Z3cmhnenhxdHRzaHZ4aGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTQzNDEsImV4cCI6MjA5NTg5MDM0MX0.AQx_V6TkxH8_PWhkXIJoyHnc8kyMXPQJCyRqNnCa0js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Types Supabase
export interface Product {
  id: string
  name_fr: string
  category: string
}

export interface Source {
  id: string
  name: string
  region: string
}

export interface PriceRecord {
  id: string
  product_id: string
  source_id: string
  price_fcfa: number
  price_cny: number
  price_usd: number
  product_form: string
  quality_grade: string
  recorded_at: string
}

export interface Alert {
  id: string
  product_id: string
  user_id: string
  alert_type: 'above' | 'below'
  target_price: number
  is_active: boolean
  created_at: string
}

// Fonctions d'accès aux données
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
  
  if (error) {
    console.error('Erreur fetch products:', error)
    return []
  }
  return data || []
}

export const fetchSources = async (): Promise<Source[]> => {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
  
  if (error) {
    console.error('Erreur fetch sources:', error)
    return []
  }
  return data || []
}

export const fetchRecentPrices = async (days: number = 30): Promise<PriceRecord[]> => {
  const dateThreshold = new Date()
  dateThreshold.setDate(dateThreshold.getDate() - days)
  
  const { data, error } = await supabase
    .from('price_records')
    .select('*')
    .gte('recorded_at', dateThreshold.toISOString())
    .order('recorded_at', { ascending: false })
  
  if (error) {
    console.error('Erreur fetch prices:', error)
    return []
  }
  return data || []
}

export const fetchActiveAlerts = async (userId: string): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
  
  if (error) {
    console.error('Erreur fetch alerts:', error)
    return []
  }
  return data || []
}

export const subscribeToAlerts = (userId: string, callback: (alerts: Alert[]) => void) => {
  return supabase
    .channel(`alerts:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'alerts',
        filter: `user_id=eq.${userId}`
      },
      () => {
        fetchActiveAlerts(userId).then(callback)
      }
    )
    .subscribe()
}
