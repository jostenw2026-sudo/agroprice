import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tfivnmqpvpbieqfekghg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmaXZubXFwdnBiaWVxZmVrZ2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MzUwNTYsImV4cCI6MjAxNTIxMTA1Nn0.2L7rVSQ_VXr1CwTb4r0G-bN9QvvZ4m_4X-Q5v7K8d5c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Type definitions
export interface Product {
  id: number
  name_fr: string
  name_cn: string
  name_en?: string
  category: string
  is_active: boolean
  created_at?: string
}

export interface Source {
  id: number
  name: string
  url: string
  region: 'Asia' | 'Europe' | 'North America'
  country: string
  created_at?: string
}

export interface PriceRecord {
  id: number
  product_id: number
  source_id: number
  price_cny: number
  price_usd: number
  price_fcfa: number
  product_form: string
  quality_grade: string
  recorded_at: string
  created_at?: string
}

export interface Alert {
  id: number
  product_id: number
  target_price_fcfa: number
  alert_type: 'above' | 'below'
  is_active: boolean
  created_at?: string
}

export interface ExchangeRate {
  id: number
  from_currency: string
  to_currency: string
  rate: number
  updated_at: string
}

export interface UserTrackedProduct {
  id: number
  user_id: string
  product_id: number
  product_form: string
  is_active: boolean
  created_at?: string
}

// Auth helpers
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  })
}

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Product queries
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name_fr', { ascending: true })
  
  if (error) throw error
  return data as Product[]
}

export const getProductById = async (id: number) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as Product
}

// Source queries
export const getSources = async () => {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .order('region', { ascending: true })
  
  if (error) throw error
  return data as Source[]
}

export const getSourcesByRegion = async (region: string) => {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('region', region)
    .order('country', { ascending: true })
  
  if (error) throw error
  return data as Source[]
}

// Price record queries
export const getPriceRecords = async (productId?: number, limit: number = 100) => {
  let query = supabase.from('price_records').select('*')
  
  if (productId) {
    query = query.eq('product_id', productId)
  }
  
  const { data, error } = await query
    .order('recorded_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as PriceRecord[]
}

export const getLatestPrices = async () => {
  const { data, error } = await supabase
    .rpc('get_latest_prices')
  
  if (error) throw error
  return data
}

// Alert queries
export const getUserAlerts = async (userId: string) => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
  
  if (error) throw error
  return data as Alert[]
}

// Exchange rate queries
export const getExchangeRates = async () => {
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
  
  if (error) throw error
  return data as ExchangeRate[]
}

// User tracked products
export const getUserTrackedProducts = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_tracked_products')
    .select('*, products(*)')
    .eq('user_id', userId)
    .eq('is_active', true)
  
  if (error) throw error
  return data as UserTrackedProduct[]
}

export const addTrackedProduct = async (
  userId: string,
  productId: number,
  productForm: string
) => {
  const { data, error } = await supabase
    .from('user_tracked_products')
    .insert({
      user_id: userId,
      product_id: productId,
      product_form: productForm,
      is_active: true,
    })
    .select()
  
  if (error) throw error
  return data?.[0] as UserTrackedProduct
}

export const removeTrackedProduct = async (id: number) => {
  const { error } = await supabase
    .from('user_tracked_products')
    .update({ is_active: false })
    .eq('id', id)
  
  if (error) throw error
}
