# 🎯 Démarrage Phase 1 — AgriPrice

**Date :** 2026-06-01  
**Statut :** 🟢 Tous les fichiers Phase 1 sont créés et prêts

---

## 📋 Résumé — Ce qui a été créé

### ✅ Fichiers créés (5)

1. **`src/lib/currency.ts`** (280 lignes)
   - Conversion devises complète
   - Types TypeScript stricts
   - Fonctions formatage prix
   - Ready-to-use dans composants

2. **`src/components/Dashboard/DashboardHome.tsx`** (380 lignes)
   - 4 KPI cards
   - Graphique Recharts 30j
   - Tableau top 5 prix
   - Panel alertes
   - Données mockées (prêt pour Supabase)

3. **`src/components/Dashboard/DashboardHome.css`** (400 lignes)
   - Glassmorphism design
   - Animations fluides
   - 100% responsive
   - Custom scrollbars

4. **`supabase/functions/sync-prices/index.ts`** (200 lignes)
   - Edge Function serverless
   - Génère variations réalistes
   - Volatilité par catégorie
   - Détecte alertes

5. **`PHASE1_INTEGRATION.md`**
   - Guide étape par étape
   - Tests à effectuer
   - Commandes bash

---

## 🚀 Démarrage immédiat (5 étapes)

### 1️⃣ Cloner les fichiers (déjà fait)
Les fichiers sont dans :
```
C:\Users\joste_w9bpyny\OneDrive\_XPNOVA\Agri-cameroun-chine\Selon Claude\agroprice\
```

### 2️⃣ Installer les dépendances
```bash
cd agroprice
npm install
# Optionnel si manquant:
npm install recharts jspdf jspdf-autotable date-fns
```

### 3️⃣ Démarrer le dev server
```bash
npm run dev
# Ouvre : http://localhost:5173
```

### 4️⃣ Intégrer dans App.tsx

**Ouvrir `src/App.tsx` et ajouter :**

```typescript
// En haut du fichier
import { getDualPrices, formatPrice } from './lib/currency';
import DashboardHome from './components/Dashboard/DashboardHome';

// Dans le routing principal (remplacer l'accueil)
<Route path="/" element={<DashboardHome />} />
<Route path="/dashboard" element={<DashboardHome />} />
```

### 5️⃣ Tester en local
- Ouvrir http://localhost:5173
- Dashboard affiche 4 KPI cards
- Graphique évolution 30j visible
- Tableau top 5 prix visible
- Alertes panel visible

---

## 🔧 Intégration Supabase (Optional pour dev)

### A. Déployer Edge Function
```bash
# Depuis la racine du projet
supabase functions deploy sync-prices

# Vérifier déploiement
supabase functions list
```

### B. Tester la sync
```bash
# Option 1 - API call
curl -X POST https://tfivnmqpvpbieqfekghg.supabase.co/functions/v1/sync-prices \
  -H "Authorization: Bearer [VOTRE_ANON_KEY]" \
  -H "Content-Type: application/json"

# Option 2 - Voir les logs
supabase functions logs sync-prices
```

### C. Programmer la sync (2x/semaine)
Créer `.github/workflows/sync-prices.yml` :
```yaml
name: Sync Prices
on:
  schedule:
    - cron: '0 6 * * 1'  # Lundi 6h UTC
    - cron: '0 6 * * 4'  # Jeudi 6h UTC

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - run: curl -X POST https://tfivnmqpvpbieqfekghg.supabase.co/functions/v1/sync-prices \
          -H "Authorization: Bearer ${{ secrets.SUPABASE_KEY }}"
```

---

## 🎨 Affichage dual devises (Optionnel)

Si vous voulez afficher FCFA + devise régionale côte à côte :

**Chercher dans App.tsx :**
```typescript
// Ancien affichage
<span>{priceRecord.price_fcfa} FCFA</span>

// Nouveau (ajouter)
{selectedRegion && (() => {
  const dual = getDualPrices(priceRecord.price_fcfa, selectedRegion);
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <span>{dual.fcfaFormatted}</span>
      <span style={{ color: '#6b7280' }}>({dual.regionalFormatted})</span>
    </div>
  );
})()}
```

---

## 🧪 Checklist de validation

### Local (npm run dev)
- [ ] Dashboard s'affiche sans erreurs
- [ ] 4 KPI cards visibles
- [ ] Graphique affiche data
- [ ] Tableau top 5 visible
- [ ] Alertes panel visible
- [ ] Mobile responsive (F12 → toggle device)

### TypeScript
```bash
npm run type-check
# Aucune erreur
```

### Build
```bash
npm run build
# ✅ dist/ créé sans erreurs
```

### Supabase (optionnel)
- [ ] Edge Function déployée
- [ ] POST sync-prices retourne `{ success: true }`
- [ ] `price_records` table remplie

---

## 📁 Structure finale

```
agroprice/
├── src/
│   ├── lib/
│   │   └── currency.ts          ✅ NEW
│   ├── components/
│   │   └── Dashboard/
│   │       ├── DashboardHome.tsx    ✅ NEW
│   │       └── DashboardHome.css    ✅ NEW
│   └── App.tsx                  🔲 À MODIFIER
├── supabase/
│   └── functions/
│       └── sync-prices/
│           └── index.ts         ✅ NEW
├── PHASE1_INTEGRATION.md        ✅ NEW
├── PLAN_DEVELOPPEMENT.md        ✅
├── GUIDE_TECHNIQUE.md           ✅
├── QUICKSTART.md                ✅
└── ...
```

---

## 🚀 Prochaine étape

Après validation Phase 1 (30-40h) :

### Phase 2 — Améliorations UX (20-25h)
- 🟡 Recherche & filtres avancés
- 🟡 Page détail produit
- 🟡 Export PDF professionnel
- 🟡 Mot de passe oublié
- 🔧 Bugs mineurs

---

## 💡 Tips

### Dev rapide
```bash
# Code changes → reload auto
npm run dev

# Check types while coding
npm run type-check --watch  # Si supporté
```

### Debug
- F12 → Console → localStorage affiche credentials
- Network → voir appels Supabase
- React DevTools → voir composants

### Styling
- Modifier `DashboardHome.css` → refresh auto
- Tested sur Chrome, Firefox, Safari mobile

---

## 📞 Aide

**Lire en priorité :**
1. Ce fichier (DEMARRAGE_PHASE1.md)
2. PHASE1_INTEGRATION.md
3. GUIDE_TECHNIQUE.md

**Fichiers utiles :**
- PLAN_DEVELOPPEMENT.md — vue globale
- QUICKSTART.md — commandes bash
- RESUME_EXECUTIF.md — contexte business

---

## ⏱️ Timeline estimé

```
Jour 1 (4h)
├─ Lire DEMARRAGE_PHASE1.md
├─ npm install
├─ npm run dev (vérifier)
└─ Intégrer App.tsx

Jour 2 (4h)
├─ Tester Dashboard en local
├─ Tester responsive (mobile)
├─ Corriger bugs mineurs
└─ npm run build

Jour 3 (4h)
├─ Déployer Edge Function
├─ Tester sync
├─ Programmer GitHub Actions
└─ Tester production

Jour 4-5 (10h)
├─ Ajustements final
├─ Tests complets
└─ Prêt pour Phase 2 ✨
```

---

**Bon développement! 🚀**

Pour commencer : `npm run dev` dans le terminal  
Puis ouvrir : http://localhost:5173

*Démarrage Phase 1 — AgriPrice 2026-06-01*
