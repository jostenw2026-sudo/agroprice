import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Prices from './pages/Prices'
import { Sources } from './pages/Sources'
import Variations from './pages/Variations'
import { Reports } from './pages/Reports'
import Exports from './pages/Exports'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import PasswordReset from './pages/PasswordReset'
import EmailVerification from './pages/EmailVerification'
import { LogOut } from 'lucide-react'

const Sidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen glass border-r border-slate-700/50 overflow-y-auto">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <span className="text-lg">🌾</span>
          </div>
          <h1 className="text-xl font-bold text-white">AgriPrice</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {[
            { label: '📊 Dashboard', href: '/' },
            { label: '🛍️ Produits', href: '/products', disabled: false },
            { label: '💰 Prix', href: '/prices', disabled: false },
            { label: '📈 Variations', href: '/variations', disabled: false },
            { label: '🏦 Sources', href: '/sources', disabled: false },
            { label: '📋 Rapports', href: '/reports', disabled: false },
            { label: '📥 Exports', href: '/exports', disabled: false },
            { label: '🔔 Notifications', href: '/notifications', disabled: false },
            { label: '⚙️ Paramètres', href: '/settings', disabled: false },
          ].map((item) => (
            <a
              key={item.href}
              href={item.disabled ? '#' : item.href}
              className={`block px-4 py-2.5 rounded-lg transition ${
                item.disabled
                  ? 'text-slate-500 cursor-not-allowed'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              {item.label}
              {item.disabled && <span className="text-xs ml-2">(Phase 3)</span>}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-700/50"></div>

        {/* Info */}
        <div className="mb-6 p-3 rounded-lg bg-slate-800/50">
          <p className="text-xs text-slate-400">Version 1.0.0</p>
          <p className="text-xs text-slate-500 mt-1">React + Supabase</p>
        </div>
      </div>

      {/* Footer - Logout Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition text-sm font-medium flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 mb-4">
            <span className="text-2xl animate-spin">⌛</span>
          </div>
          <p className="text-slate-300">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {user ? (
        <>
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <DataProvider>
                  <Dashboard />
                </DataProvider>
              </ProtectedLayout>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedLayout>
                <DataProvider>
                  <Products />
                </DataProvider>
              </ProtectedLayout>
            }
          />
          <Route
            path="/prices"
            element={
              <ProtectedLayout>
                <DataProvider>
                  <Prices />
                </DataProvider>
              </ProtectedLayout>
            }
          />
          <Route
            path="/sources"
            element={
              <ProtectedLayout>
                <DataProvider>
                  <Sources />
                </DataProvider>
              </ProtectedLayout>
            }
          />
          <Route
            path="/variations"
            element={
              <ProtectedLayout>
                <DataProvider>
                  <Variations />
                </DataProvider>
              </ProtectedLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedLayout>
                <DataProvider>
                  <Reports />
                </DataProvider>
              </ProtectedLayout>
            }
          />
          <Route
            path="/exports"
            element={
              <ProtectedLayout>
                <DataProvider>
                  <Exports />
                </DataProvider>
              </ProtectedLayout>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedLayout>
                <DataProvider>
                  <Notifications />
                </DataProvider>
              </ProtectedLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedLayout>
                <DataProvider>
                  <Settings />
                </DataProvider>
              </ProtectedLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
