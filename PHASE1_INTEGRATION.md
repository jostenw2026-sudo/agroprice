# 🚀 Phase 1 — Guide d'intégration

**Statut :** Phase 1 en cours d'implémentation  
**Date de démarrage :** 2026-06-01  
**Durée estimée :** 30-40 heures

---

## ✅ Livrables Phase 1

### 1. **Système de conversion devises** ✅ FAIT
**Fichier :** `src/lib/currency.ts`
- Fonctions complètes de conversion FCFA → EUR/USD/CNY
- Formatage des prix avec symboles
- Dual pricing (affichage simultané FCFA + devise régionale)
- Types TypeScript complets
- Exemples d'usage

### 2. **Dashboard Home Page** ✅ FAIT
**Fichier :** `src/components/Dashboard/DashboardHome.tsx`
- 4 cartes KPI (produits, sources, sync, alertes)
- Graphique évolution prix 30 jours
- Tableau top 5 meilleurs prix
- Panel alertes actives
- Données mockées pour développement
- 100% responsive (mobile/tablet/desktop)

**Styles :** `src/components/Dashboard/DashboardHome.css`
- Glassmorphism design
- Animations fluides
- Responsive grille CSS
- Scrollable alerts avec custom scrollbar

### 3. **Edge Function Sync** ✅ FAIT
**Fichier :** `supabase/functions/sync-prices/index.ts`
- Récupère tous les produits/sources
- Génère variations réalistes (volatilité par catégorie)
- Convertit prix FCFA → CNY/USD
- Stocke dans `price_records`
- Vérifie alertes déclenchées
- Logging détaillé

### 4. **Correction filtre région** 🔲 À FAIRE
**Fichier :** `src/App.tsx`
- Vérifier que `filteredSources` met à jour tous les composants
- Tester filtre EUROPE → vérifier que seules sources EU (IDs 6-13) s'affichent

---

## 🔧 Étapes d'intégration (TODO pour vous)

### ÉTAPE 1 : Importer currency.ts dans App.tsx

**Dans `src/App.tsx`, ajouter en haut :**
```typescript
import { getDualPrices, formatPrice, getCurrencyByRegion } from './lib/currency';
```

### ÉTAPE 2 : Afficher dual devises

**Chercher dans App.tsx où les prix s'affichent :**
```typescript
// AVANT (actuel)
<span>{priceRecord.price_fcfa} FCFA</span>

// APRÈS (avec dual pricing)
{selectedRegion && (() => {
  const dual = getDualPrices(priceRecord.price_fcfa, selectedRegion);
  return (
    <div className="dual-price">
      <span>{dual.fcfaFormatted}</span>
      <span className="regional">{dual.regionalFormatted}</span>
    </div>
  );
})()}
```

### ÉTAPE 3 : Intégrer Dashboard

**Importer et ajouter route :**
```typescript
import DashboardHome from './components/Dashboard/DashboardHome';

// Dans React Router
<Route path="/dashboard" element={<DashboardHome />} />
<Route path="/" element={<DashboardHome />} /> {/* Ou page d'accueil */}
```

### ÉTAPE 4 : Déployer Edge Function

**Prérequis :**
- Supabase CLI installé
- Crédits CLI configurés

**Commandes :**
```bash
# Depuis la racine du projet
supabase functions deploy sync-prices

# Tester en local
supabase functions serve
# Puis appeler : POST http://localhost:54321/functions/v1/sync-prices
```

### ÉTAPE 5 : Programmer la sync

**Option A — GitHub Actions (recommandé)**

Créer `.github/workflows/sync-prices.yml` :
```yaml
name: Sync Prices (2x/semaine)
on:
  schedule:
    - cron: '0 6 * * 1'    # Lundi 6h UTC
    - cron: '0 6 * * 4'    # Jeudi 6h UTC

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Déclencher sync
        run: |
          curl -X POST \
            --data '{}' \
            -H 'Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}' \
            -H 'Content-Type: application/json' \
            https://tfivnmqpvpbieqfekghg.supabase.co/functions/v1/sync-prices
```

**Option B — Cron externe** (eg. EasyCron)
```
URL: https://tfivnmqpvpbieqfekghg.supabase.co/functions/v1/sync-prices
Méthode: POST
Fréquence: Lundi & Jeudi 6h UTC
Headers: Authorization: Bearer [ANON_KEY]
```

### ÉTAPE 6 : Corriger bug filtre région

**Dans `src/App.tsx`, vérifier :**
```typescript
// S'assurer que selectedRegion change filteredSources
const filteredSources = sources.filter(s => s.region === selectedRegion);

// Et que PriceByForm reçoit bien les sources filtrées
<PriceByForm 
  sources={filteredSources}  // ← Important
  products={products}
/>
```

---

## 🧪 Checklist de test Phase 1

### Test 1 — Conversion devises
- [ ] Sélectionner "EUROPE" → affiche prix en EUR (€)
- [ ] Sélectionner "ASIA" → affiche prix en CNY (¥)
- [ ] Sélectionner "NORTH AMERICA" → affiche prix en USD ($)
- [ ] FCFA toujours affiché en premier

### Test 2 — Dashboard
- [ ] 4 cartes KPI visible
- [ ] Graphique évolution affiche 30 jours
- [ ] Top 5 prix sont dans ordre croissant
- [ ] Alertes affichées (max 5 au départ)
- [ ] Responsive sur mobile (tester 375px)

### Test 3 — Edge Function
- [ ] POST https://[SUPABASE_URL]/functions/v1/sync-prices
- [ ] Réponse JSON avec `success: true`
- [ ] `price_records` table remplie avec nouveaux prix
- [ ] Variation de prix entre ±3% et ±9% selon catégorie

### Test 4 — Filtre région
- [ ] Sélectionner "EUROPE" dans filtre
- [ ] Onglet "Prix par forme" affiche que sources EU (noms: Euronext, ICE, LIFFE, etc.)
- [ ] Onglet "Prix par région" affiche que "EUROPE"

---

## 📊 Données test

### Produits (25)
```
1. Cacao (fèves brutes) — 400K-450K FCFA
2. Banane plantain — 40K-60K FCFA
3. Café robusta — 500K-600K FCFA
4. Gingembre frais — 150K-200K FCFA
...
```

### Sources (21)
```
ASIA (IDs 1-5):
- Alibaba (Chine)
- Xinfadi (Pékin)
- Dalian (Chine)
- 1688 (Chine)
- Bourse Shanghai

EUROPE (IDs 6-13):
- Euronext (Paris)
- ICE (Londres)
- LIFFE (Londres)
- Mercados españoles
...

NORTH AMERICA (IDs 14-21):
- CBOT (Chicago)
- NYMEX (New York)
- TMX (Toronto)
...
```

---

## 🐛 Bug fixes inclus Phase 1

### Bug #1 — Filtre région (Prix par forme)
**Cause :** `filteredSources` ne met à jour que certains composants  
**Solution :** Passer `filteredSources` à tous les composants qui les utilisent

**Code avant :**
```typescript
<PriceByForm products={products} /> // ❌ Manque sources
```

**Code après :**
```typescript
<PriceByForm products={products} sources={filteredSources} /> // ✅
```

### Bug #2 — Variations prix (réalisme)
**Cause :** Toujours ±3% pour tous les produits  
**Solution :** Volatilité variable par catégorie dans Edge Function

**Nouvelle volatilité :**
```javascript
PRICE_VOLATILITY = {
  "Cacao": [0.03, 0.05],      // ±3-5%
  "Banane": [0.02, 0.04],     // ±2-4%
  "Café": [0.04, 0.06],       // ±4-6%
  "Condiments": [0.06, 0.09], // ±6-9% (plus volatiles)
}
```

### Bug #3 — Export tables mobile
**Cause :** Tableaux débordent sur écrans < 480px  
**Solution :** Ajouter `overflow-x: auto` + scrollbar custom

**CSS :**
```css
.table-responsive {
  overflow-x: auto;
  border-radius: 8px;
}
```

---

## 📦 Structure finale après Phase 1

```
agroprice/
├── src/
│   ├── App.tsx                      # ✨ Imports + routing dashboard
│   ├── index.css
│   ├── lib/
│   │   ├── currency.ts              # ✨ NOUVEAU
│   │   ├── supabase.ts
│   │   └── ...
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── DashboardHome.tsx    # ✨ NOUVEAU
│   │   │   └── DashboardHome.css    # ✨ NOUVEAU
│   │   ├── [autres composants...]
│   │   └── ...
│   └── ...
├── supabase/
│   ├── functions/
│   │   └── sync-prices/
│   │       └── index.ts             # ✨ NOUVEAU
│   └── ...
├── PHASE1_INTEGRATION.md            # Ce fichier
├── PLAN_DEVELOPPEMENT.md
├── GUIDE_TECHNIQUE.md
├── QUICKSTART.md
└── ...
```

---

## 🚀 Commandes importantes

```bash
# Install dépendances
npm install

# Dev server
npm run dev

# Type check
npm run type-check

# Build production
npm run build

# Test Edge Function localement
supabase functions serve

# Deploy Edge Function
supabase functions deploy sync-prices
```

---

## ✨ Résumé Phase 1

| Composant | Statut | Fichier |
|-----------|--------|---------|
| **Currency conversion** | ✅ Fait | `src/lib/currency.ts` |
| **Dashboard home** | ✅ Fait | `src/components/Dashboard/DashboardHome.tsx` |
| **Dashboard styles** | ✅ Fait | `src/components/Dashboard/DashboardHome.css` |
| **Edge Function sync** | ✅ Fait | `supabase/functions/sync-prices/index.ts` |
| **Integration App.tsx** | 🔲 À FAIRE | `src/App.tsx` |
| **Programmer sync** | 🔲 À FAIRE | GitHub Actions ou CronJob |
| **Bug filtre région** | 🔲 À FAIRE | `src/App.tsx` |
| **Tests Phase 1** | 🔲 À FAIRE | Manuel |

---

## 📞 Prochaines étapes

1. ✅ Tous les fichiers créés
2. 🔲 Vous intégrez dans App.tsx
3. 🔲 Vous testez localement (`npm run dev`)
4. 🔲 Vous déployez Edge Function
5. 🔲 Vous programmez la sync
6. 🔲 Vous testez en production

Après Phase 1 réussie → Phase 2 (filtres, détails produit, PDF export)

---

*Phase 1 — AgriPrice | Démarrage 2026-06-01*
