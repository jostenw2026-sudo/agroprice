import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatPrice } from '../../lib/currency';
import './DashboardHome.css';

// ============================================
// INTERFACES
// ============================================

interface KPIData {
  productsCount: number;
  sourcesCount: number;
  lastSyncTime: string;
  activeAlertsCount: number;
}

interface PriceEvolution {
  date: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
}

interface TopPrice {
  id: string;
  productName: string;
  sourceName: string;
  priceFcfa: number;
  recordedAt: string;
  region: string;
}

interface Alert {
  id: string;
  productName: string;
  targetPrice: number;
  alertType: 'above' | 'below';
  createdAt: string;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function DashboardHome() {
  const [kpis, setKpis] = useState<KPIData>({
    productsCount: 0,
    sourcesCount: 0,
    lastSyncTime: new Date().toISOString(),
    activeAlertsCount: 0,
  });

  const [evolution, setEvolution] = useState<PriceEvolution[]>([]);
  const [topPrices, setTopPrices] = useState<TopPrice[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      // Récupérer les données du localStorage (simulation Supabase)
      const sbUrl = localStorage.getItem('sb_url');
      const sbKey = localStorage.getItem('sb_key');

      if (!sbUrl || !sbKey) {
        // Données mockées pour développement
        loadMockData();
        return;
      }

      // TODO: Appeler l'API Supabase réelle
      // Pour l'instant, on charge des données mockées
      loadMockData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur chargement données');
      loadMockData(); // Fallback
    } finally {
      setLoading(false);
    }
  }

  function loadMockData() {
    // KPIs mockées
    setKpis({
      productsCount: 25,
      sourcesCount: 21,
      lastSyncTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      activeAlertsCount: 5,
    });

    // Evolution prix 30j (mock data)
    const evolutionData: PriceEvolution[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const basePrice = 450000 + Math.random() * 50000;
      evolutionData.push({
        date: date.toLocaleDateString('fr-FR'),
        avgPrice: Math.round(basePrice),
        minPrice: Math.round(basePrice * 0.95),
        maxPrice: Math.round(basePrice * 1.05),
      });
    }
    setEvolution(evolutionData);

    // Top 5 meilleurs prix
    const topData: TopPrice[] = [
      {
        id: '1',
        productName: 'Cacao (fèves brutes)',
        sourceName: 'Alibaba (Chine)',
        priceFcfa: 385000,
        recordedAt: new Date().toISOString(),
        region: 'ASIA',
      },
      {
        id: '2',
        productName: 'Banane plantain',
        sourceName: 'Xinfadi (Chine)',
        priceFcfa: 42000,
        recordedAt: new Date().toISOString(),
        region: 'ASIA',
      },
      {
        id: '3',
        productName: 'Café robusta',
        sourceName: 'Euronext (Paris)',
        priceFcfa: 520000,
        recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        region: 'EUROPE',
      },
      {
        id: '4',
        productName: 'Gingembre frais',
        sourceName: 'CBOT (Chicago)',
        priceFcfa: 156000,
        recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        region: 'NORTH AMERICA',
      },
      {
        id: '5',
        productName: 'Noix de coco',
        sourceName: 'Dalian (Chine)',
        priceFcfa: 78000,
        recordedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        region: 'ASIA',
      },
    ];
    setTopPrices(topData);

    // Alertes mockées
    const alertsData: Alert[] = [
      {
        id: '1',
        productName: 'Cacao',
        targetPrice: 400000,
        alertType: 'below',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        productName: 'Café',
        targetPrice: 550000,
        alertType: 'above',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        productName: 'Banane',
        targetPrice: 50000,
        alertType: 'above',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setAlerts(alertsData);
  }

  if (loading) {
    return <div className="dashboard-loading">Chargement du dashboard...</div>;
  }

  return (
    <div className="dashboard-home">
      {/* Header */}
      <div className="dashboard-header">
        <h1>📊 Dashboard AgriPrice</h1>
        <p className="subtitle">Suivi des prix agricoles camerounais</p>
      </div>

      {/* KPI Cards */}
      <section className="kpi-section">
        <h2>Vue d'ensemble</h2>
        <div className="kpi-grid">
          <KPICard
            label="Produits suivis"
            value={kpis.productsCount}
            icon="📦"
            color="#059669"
          />
          <KPICard
            label="Sources actives"
            value={kpis.sourcesCount}
            icon="🌐"
            color="#2563eb"
          />
          <KPICard
            label="Dernière sync"
            value={formatSyncTime(kpis.lastSyncTime)}
            icon="🔄"
            color="#7c3aed"
          />
          <KPICard
            label="Alertes actives"
            value={kpis.activeAlertsCount}
            icon="🚨"
            color="#dc2626"
          />
        </div>
      </section>

      {/* Evolution Chart */}
      <section className="chart-section">
        <h2>📈 Évolution des prix (30 jours)</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={evolution}>
              <defs>
                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => (value / 1000).toFixed(0) + 'K'}
              />
              <Tooltip
                formatter={(value) => formatPrice(value as number, 'FCFA')}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line
                type="monotone"
                dataKey="avgPrice"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
                name="Prix moyen (FCFA)"
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="minPrice"
                stroke="#10b981"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Prix min"
              />
              <Line
                type="monotone"
                dataKey="maxPrice"
                stroke="#d1fae5"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Prix max"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Top Prices Table */}
      <section className="table-section">
        <h2>💹 Top 5 meilleurs prix</h2>
        <div className="table-responsive">
          <table className="prices-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Source (Région)</th>
                <th>Prix FCFA</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {topPrices.map((price) => (
                <tr key={price.id}>
                  <td>
                    <strong>{price.productName}</strong>
                  </td>
                  <td>
                    {price.sourceName}
                    <span className="region-badge">{price.region}</span>
                  </td>
                  <td className="price-cell">
                    <span className="price-value">
                      {formatPrice(price.priceFcfa, 'FCFA')}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(price.recordedAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Alerts Panel */}
      <section className="alerts-section">
        <h2>
          🚨 Alertes actives <span className="badge">{alerts.length}</span>
        </h2>
        <div className="alerts-list">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <p className="no-alerts">Aucune alerte active pour le moment</p>
          )}
        </div>
      </section>

      {/* Error display */}
      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

// ============================================
// SOUS-COMPOSANTS
// ============================================

interface KPICardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

function KPICard({ label, value, icon, color }: KPICardProps) {
  return (
    <div className="kpi-card" style={{ borderTopColor: color }}>
      <span className="kpi-icon">{icon}</span>
      <p className="kpi-label">{label}</p>
      <p className="kpi-value" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

interface AlertCardProps {
  alert: Alert;
}

function AlertCard({ alert }: AlertCardProps) {
  const alertIcon = alert.alertType === 'above' ? '📈' : '📉';
  const alertLabel =
    alert.alertType === 'above' ? 'Au-dessus de' : 'Au-dessous de';

  return (
    <div className="alert-card">
      <div className="alert-icon">{alertIcon}</div>
      <div className="alert-content">
        <h4>{alert.productName}</h4>
        <p>
          <span className="alert-label">{alertLabel}</span>
          <span className="alert-price">{formatPrice(alert.targetPrice, 'FCFA')}</span>
        </p>
      </div>
      <span className="alert-date">
        {formatDateRelative(alert.createdAt)}
      </span>
    </div>
  );
}

// ============================================
// HELPERS
// ============================================

function formatSyncTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `Il y a ${diffMins}m`;
  } else if (diffHours < 24) {
    return `Il y a ${diffHours}h`;
  } else {
    return `Il y a ${diffDays}j`;
  }
}

function formatDateRelative(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Aujourd\'hui';
  if (diffDays === 1) return 'Hier';
  return `Il y a ${diffDays}j`;
}
