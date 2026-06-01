# 🛠️ Guide Technique — AgriPrice

## 1️⃣ Setup initial

### Dépendances recommandées

```bash
npm install recharts jspdf jspdf-autotable date-fns lucide-react
npm install -D @types/jspdf @types/jspdf-autotable
```

**Justification :**
- `recharts` : Graphiques (déjà utilisé, amélioration des charts)
- `jspdf` + `jspdf-autotable` : Export PDF professionnel
- `date-fns` : Formatage dates/heures (utile pour évolution 30j)
- `lucide-react` : Icones consommables
- Types TS pour jsPDF et autotable

---

## 2️⃣ Conversion devises — Implémentation

### Fichier `src/lib/currency.ts` (créer)

```typescript
// Taux de change relatifs au FCFA (base)
export const EXCHANGE_RATES = {
  FCFA: 1,
  EUR: 655,
  USD: 615,
  CNY: 85,
} as const;

export const CURRENCY_SYMBOLS = {
  FCFA: 'FCFA',
  EUR: '€',
  USD: '$',
  CNY: '¥',
} as const;

export const REGION_CURRENCY = {
  ASIA: 'CNY',
  EUROPE: 'EUR',
  'NORTH AMERICA': 'USD',
} as const;

/**
 * Convertit un prix FCFA vers la devise cible
 */
export function convertPrice(
  priceFcfa: number,
  toCurrency: keyof typeof CURRENCY_SYMBOLS
): number {
  const rate = EXCHANGE_RATES[toCurrency] || 1;
  return Math.round((priceFcfa / rate) * 100) / 100;
}

/**
 * Retourne la devise de base selon la région
 */
export function getCurrencyByRegion(region: string): string {
  return REGION_CURRENCY[region as keyof typeof REGION_CURRENCY] || 'FCFA';
}

/**
 * Formate un prix avec symbole
 */
export function formatPrice(
  amount: number,
  currency: string = 'FCFA'
): string {
  const symbol = CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || currency;
  
  if (currency === 'FCFA') {
    return `${amount.toLocaleString('fr-FR')} ${symbol}`;
  }
  
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Récupère les prix en double devise (FCFA + régionale)
 */
export function getDualPrices(priceFcfa: number, region: string) {
  const regionalCurrency = getCurrencyByRegion(region);
  const regionalPrice = convertPrice(priceFcfa, regionalCurrency as any);
  
  return {
    fcfa: priceFcfa,
    regional: regionalPrice,
    regionalCurrency,
    fcfaFormatted: formatPrice(priceFcfa, 'FCFA'),
    regionalFormatted: formatPrice(regionalPrice, regionalCurrency),
  };
}
```

---

### Utilisation dans `App.tsx`

```typescript
import { getDualPrices, REGION_CURRENCY } from './lib/currency';

// Dans le rendu des prix
{selectedRegion && (
  <div className="price-display">
    {priceRecord && (() => {
      const dual = getDualPrices(priceRecord.price_fcfa, selectedRegion);
      return (
        <div className="flex gap-4">
          <div>
            <span className="label">FCFA</span>
            <p className="price">{dual.fcfaFormatted}</p>
          </div>
          <div>
            <span className="label">{dual.regionalCurrency}</span>
            <p className="price">{dual.regionalFormatted}</p>
          </div>
        </div>
      );
    })()}
  </div>
)}
```

---

## 3️⃣ Sync automatisée — Edge Function Supabase

### Créer dans Supabase Console

**Path :** `functions/sync-prices/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl!, supabaseKey!);

const PRICE_VOLATILITY: Record<string, [number, number]> = {
  "Cacao": [0.03, 0.05],
  "Banane": [0.02, 0.04],
  "Café": [0.04, 0.06],
  "Légumes": [0.04, 0.06],
  "Huiles": [0.05, 0.08],
  "Condiments": [0.06, 0.09],
};

function getVolatility(category: string): [number, number] {
  return PRICE_VOLATILITY[category] || [0.03, 0.05];
}

function randomVariation(volatilityRange: [number, number]): number {
  const [min, max] = volatilityRange;
  const randomPercent = Math.random() * (max - min) + min;
  const direction = Math.random() > 0.5 ? 1 : -1;
  return 1 + (direction * randomPercent);
}

serve(async (req) => {
  try {
    // Récupérer tous les produits actifs
    const { data: products } = await supabase
      .from("products")
      .select("id, category")
      .eq("is_active", true);

    if (!products || products.length === 0) {
      return new Response("No products to sync", { status: 200 });
    }

    // Récupérer toutes les sources
    const { data: sources } = await supabase
      .from("sources")
      .select("id");

    if (!sources || sources.length === 0) {
      return new Response("No sources found", { status: 200 });
    }

    // Récupérer les derniers prix pour variation
    const { data: lastPrices } = await supabase
      .from("price_records")
      .select("product_id, source_id, price_fcfa")
      .order("recorded_at", { ascending: false })
      .limit(sources.length! * products.length!);

    const lastPriceMap = new Map();
    lastPrices?.forEach(record => {
      const key = `${record.product_id}-${record.source_id}`;
      if (!lastPriceMap.has(key)) {
        lastPriceMap.set(key, record.price_fcfa);
      }
    });

    // Générer nouveaux prix avec variations
    const newRecords = [];
    for (const product of products) {
      const volatility = getVolatility(product.category);
      
      for (const source of sources) {
        const key = `${product.id}-${source.id}`;
        const lastPrice = lastPriceMap.get(key) || 5000; // Default fallback
        const variation = randomVariation(volatility);
        const newPrice = Math.round(lastPrice * variation);

        newRecords.push({
          product_id: product.id,
          source_id: source.id,
          price_fcfa: newPrice,
          price_cny: Math.round(newPrice / 85),
          price_usd: Math.round(newPrice / 615),
          product_form: "fresh",
          quality_grade: "standard",
          recorded_at: new Date().toISOString(),
        });
      }
    }

    // Insérer les nouveaux prix
    const { error } = await supabase
      .from("price_records")
      .insert(newRecords);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    // Vérifier les alertes
    const { data: alerts } = await supabase
      .from("alerts")
      .select("id, product_id, target_price_fcfa, alert_type, user_id")
      .eq("is_active", true);

    if (alerts && alerts.length > 0) {
      // TODO: Déclencher notifications email si seuil atteint
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${newRecords.length} prices`,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
});
```

### Déployer & Programmer

```bash
# Déployer la fonction
supabase functions deploy sync-prices --project-id tfivnmqpvpbieqfekghg

# Programmer (via Supabase dashboard ou cron)
# Aller sur Functions > sync-prices > Logs & Invocations
# Ou créer un cron externe (GitHub Actions, Vercel Cron)
```

---

## 4️⃣ Dashboard Home Page

### Composant `src/components/Dashboard/DashboardHome.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../lib/currency';

interface KPIData {
  productsCount: number;
  sourcesCount: number;
  lastSyncTime: string;
  activeAlertsCount: number;
}

interface PriceEvolution {
  date: string;
  avgPrice: number;
}

export default function DashboardHome() {
  const [kpis, setKpis] = useState<KPIData>({
    productsCount: 0,
    sourcesCount: 0,
    lastSyncTime: '',
    activeAlertsCount: 0,
  });
  
  const [evolution, setEvolution] = useState<PriceEvolution[]>([]);
  const [topPrices, setTopPrices] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    // KPI 1: Nombre de produits
    const { count: productsCount } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    // KPI 2: Nombre de sources
    const { count: sourcesCount } = await supabase
      .from('sources')
      .select('id', { count: 'exact', head: true });

    // KPI 3: Dernière sync
    const { data: lastSync } = await supabase
      .from('price_records')
      .select('recorded_at')
      .order('recorded_at', { ascending: false })
      .limit(1);

    // KPI 4: Alertes actives
    const { count: alertsCount } = await supabase
      .from('alerts')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    // Evolution prix 30j
    const { data: priceData } = await supabase
      .from('price_records')
      .select('recorded_at, price_fcfa')
      .gte('recorded_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('recorded_at', { ascending: true });

    // Top 5 meilleurs prix
    const { data: topPricesData } = await supabase
      .from('price_records')
      .select('id, product_id, source_id, price_fcfa, recorded_at, products(name_fr), sources(name)')
      .order('price_fcfa', { ascending: true })
      .limit(5);

    // Alertes actives
    const { data: alertsData } = await supabase
      .from('alerts')
      .select('id, product_id, target_price_fcfa, alert_type, products(name_fr)')
      .eq('is_active', true);

    setKpis({
      productsCount: productsCount || 0,
      sourcesCount: sourcesCount || 0,
      lastSyncTime: lastSync?.[0]?.recorded_at || 'N/A',
      activeAlertsCount: alertsCount || 0,
    });

    // Transformer data pour graphique
    const grouped = {} as Record<string, number[]>;
    priceData?.forEach(record => {
      const date = record.recorded_at.split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(record.price_fcfa);
    });

    const evolutionData: PriceEvolution[] = Object.entries(grouped).map(([date, prices]) => ({
      date,
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    }));

    setEvolution(evolutionData);
    setTopPrices(topPricesData || []);
    setAlerts(alertsData || []);
  }

  return (
    <div className="dashboard-home">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard label="Produits" value={kpis.productsCount} icon="📦" />
        <KPICard label="Sources" value={kpis.sourcesCount} icon="🌐" />
        <KPICard label="Dernière sync" value={new Date(kpis.lastSyncTime).toLocaleString()} icon="🔄" />
        <KPICard label="Alertes actives" value={kpis.activeAlertsCount} icon="🚨" />
      </div>

      {/* Evolution Chart */}
      <div className="chart-section">
        <h3>📈 Évolution prix (30 jours)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={evolution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(val) => formatPrice(val as number)} />
            <Line type="monotone" dataKey="avgPrice" stroke="#059669" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Prices Table */}
      <div className="table-section">
        <h3>💹 Top 5 meilleurs prix</h3>
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Source</th>
              <th>Prix FCFA</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {topPrices.map((p, i) => (
              <tr key={i}>
                <td>{p.products?.name_fr}</td>
                <td>{p.sources?.name}</td>
                <td>{formatPrice(p.price_fcfa)}</td>
                <td>{new Date(p.recorded_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alerts Panel */}
      <div className="alerts-section">
        <h3>🚨 Alertes actives ({alerts.length})</h3>
        <div className="alerts-list">
          {alerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, icon }: { label: string; value: any; icon: string }) {
  return (
    <div className="kpi-card">
      <span className="kpi-icon">{icon}</span>
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
    </div>
  );
}

function AlertCard({ alert }: { alert: any }) {
  return (
    <div className="alert-card">
      <strong>{alert.products?.name_fr}</strong>
      <span className={`alert-type ${alert.alert_type}`}>
        {alert.alert_type === 'above' ? '↑ Au-dessus de' : '↓ Au-dessous de'}
      </span>
      <span className="price">{formatPrice(alert.target_price_fcfa)}</span>
    </div>
  );
}
```

### Styles CSS à ajouter à `src/index.css`

```css
.dashboard-home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.kpi-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.kpi-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.kpi-label {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.kpi-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #059669;
}

.chart-section,
.table-section,
.alerts-section {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
}

.alerts-list {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.alert-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(220, 38, 38, 0.1);
  border-left: 4px solid #dc2626;
  border-radius: 8px;
}

.alert-type {
  padding: 0.25rem 0.75rem;
  background: #dc2626;
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## 5️⃣ Bug Fix #1 — Filtre région

**Vérification :**

```typescript
// Dans App.tsx, debug le filtre
console.log('Selected region:', selectedRegion);
console.log('Filtered sources:', filteredSources.map(s => ({ id: s.id, name: s.name })));

// S'assurer que le composant "Prix par forme" reçoit les bonnes sources
<PriceByForm sources={filteredSources} />
```

---

## ✅ Next Steps

1. **Créer `src/lib/currency.ts`** et l'intégrer à `App.tsx`
2. **Déployer Edge Function** Supabase pour la sync
3. **Créer `DashboardHome.tsx`** et ajouter route `/dashboard`
4. **Corriger le filtre région**
5. **Tester en local** : `npm run dev`
6. **Build & déployer** : `npm run build` → Hostinger

---

*Guide technique — AgriPrice 2026-06-01*
