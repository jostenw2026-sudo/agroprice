# 📋 Plan de Développement — AgriPrice

**Projet :** AgriPrice — Suivi des prix agricoles camerounais sur marchés B2B internationaux  
**Stack :** React 18 + TypeScript + Vite + Supabase + Recharts  
**Déploiement :** hszleapqihvxg.kimi.page → agropricecn.xp-nova.com  
**Responsable :** Josten (XP-NOVA)  

---

## 📊 Vue d'ensemble des priorités

```
PHASE 1 (Semaine 1-2) — Corrections critiques + Fondations
├─ 🔴 HIGH 1 : Affichage devises régionales (EUR, CNY, FCFA)
├─ 🔴 HIGH 2 : Sync automatisée des prix (Edge Function)
├─ 🔴 HIGH 3 : Dashboard home page (KPIs + graphiques)
└─ 🔧 BUG FIX 1 : Filtre région (Prix par forme)

PHASE 2 (Semaine 3-4) — Amélioration UX
├─ 🟡 MEDIUM 4 : Recherche & filtres avancés
├─ 🟡 MEDIUM 5 : Détail produit & comparaison sources
├─ 🟡 MEDIUM 6 : Export PDF professionnel
└─ 🔧 BUG FIX 2 & 3 : Variations réalistes + Scroll mobile

PHASE 3 (Semaine 5-6) — Fonctionnalités avancées
├─ 🟡 MEDIUM 7 : Mot de passe oublié
├─ 🟢 LOW 8 : Notifications email
├─ 🟢 LOW 9 : Comparaison multi-produits
└─ 🟢 LOW 10 : i18n (FR/EN/CN)
```

---

## 🔴 PHASE 1 — PRIORITÉS CRITIQUES

### ✅ Tâche #1 : Affichage des devises régionales

**Objectif :** Afficher les prix dans la devise locale selon la région sélectionnée

**Spécifications :**
- Zone ASIA → CNY + FCFA (conversion au taux actuel)
- Zone EUROPE → EUR + FCFA
- Zone NORTH AMERICA → USD + FCFA
- Symbole de devise affiché dynamiquement (€, ¥, $, FCFA)

**Fichiers à modifier :**
- `src/App.tsx` → Ajouter logique de conversion + symboles
- `src/lib/supabase.ts` → Récupérer taux changes actuels

**Taux de change estimés (FCFA = 1) :**
```
1 EUR = 655 FCFA
1 USD = 615 FCFA
1 CNY = 85 FCFA
```

---

### ✅ Tâche #2 : Sync automatisée des prix

**Objectif :** Récupérer/simuler les prix de manière réaliste et automatisée

**Deux approches :**

#### Option A : Supabase Edge Function (recommandée)
- Créer fonction TypeScript qui tourne 2x par semaine (lundi + jeudi)
- Générer variations réalistes (±3-7% selon produit)
- Écrire dans `price_records`
- Déclencher alertes si seuil atteint

#### Option B : Script Node.js local + cron
- Script NPM task
- Exécutable via `npm run sync:prices`
- Idéal pour développement/test

**Variations réalistes par catégorie :**
```
Fruits (cacao, banane) : ±3% (moins volatiles)
Légumes : ±5% (moyennement volatiles)
Condiments : ±7% (plus volatiles)
Huiles : ±6%
```

---

### ✅ Tâche #3 : Dashboard Home Page

**Objectif :** Vue d'ensemble centrale avec KPIs et tendances

**Layout :**

```
┌─────────────────────────────────────────────────────┐
│ Dashboard AgriPrice                                 │
├─────────────────────────────────────────────────────┤
│
│  📊 KPI Cards (4 colonnes)
│  ├─ Produits suivis (25)
│  ├─ Sources actives (21)
│  ├─ Dernière sync (il y a 2h)
│  └─ Alertes actives (5)
│
│  📈 Graphique — Évolution prix 30 jours
│  └─ Sélectionner produit(s) pour overlay
│
│  💹 Tableau — Top 5 meilleurs prix (FCFA)
│  └─ Colonnes : Produit | Forme | Prix | Source | Date
│
│  🚨 Panel — Alertes actives
│  └─ Afficher alertes "above/below" déclenchées
│
└─────────────────────────────────────────────────────┘
```

**Données requises :**
- COUNT products, sources
- LAST sync timestamp
- AVG price evolution (30j)
- TOP prices par produit/source
- Active alerts list

---

### 🔧 Bug Fix #1 : Filtre région (Prix par forme)

**Problème :** Le filtre région ne s'applique pas aux prix dans l'onglet "Prix par forme"

**Cause probable :** Les données filtrées ne sont pas passées correctement au composant

**Solution :** 
- Vérifier state management du filtre région
- S'assurer que `filteredSources` met à jour aussi le composant "Prix par forme"
- Tester avec region="EUROPE" puis vérifier que seules sources EU (IDs 6-13) s'affichent

---

## 🟡 PHASE 2 — AMÉLIORATIONS UX

### Tâche #4 : Recherche & filtres avancés

**Composants :**
- Barre de recherche (cherche dans `name_fr` et `name_cn`)
- Dropdown catégories
- Chips régions (multi-sélection optionnelle)
- Reset filters button

**Logique :**
```javascript
const filtered = products.filter(p => 
  (search === '' || p.name_fr.includes(search) || p.name_cn.includes(search)) &&
  (categoryFilter === '' || p.category === categoryFilter) &&
  (regionFilter.length === 0 || regionFilter.includes(p.region))
);
```

---

### Tâche #5 : Détail produit & comparaison sources

**Route :** `/product/:productId`

**Contenu :**
- Infos produit (FR/CN, catégorie)
- Graphique historique complet (90j)
- Tableau comparatif sources (prix actuel, min, max, date)
- Formulaire pour ajouter/modifier alerte

---

### Tâche #6 : Export PDF professionnel

**Libr­aries :** `jspdf` + `jspdf-autotable`

**Contenu du PDF :**
- Logo/branding XP-NOVA
- Date de génération
- Tableau prices actuels (produit, source, prix FCFA/EUR/USD, date)
- Graphique mini (2-3 derniers jours)
- Pied de page (confidentialité, contact)

---

## 🟢 PHASE 3 — FONCTIONNALITÉS AVANCÉES

### Tâche #7 : Mot de passe oublié

**Flux :**
1. Lien "Mot de passe oublié?" sur login
2. Formulaire email
3. Email automatique avec lien reset (via Supabase)
4. Page reset avec nouveau mot de passe
5. Confirmation succès

---

### Tâche #8 : Notifications email

**Types :**
- Email alerte au franchissement seuil
- Digest hebdomadaire (vendredi 9h) avec tendances

**Configuration Supabase :**
- Ajouter colonne `email_notifications` (boolean) à `alerts`
- Edge Function déclenche email via service (SendGrid, Brevo, AWS SES)

---

### Tâche #9 : Comparaison multi-produits

**Fonctionnalité :**
- Bouton "Comparer" sur chaque produit (multiple select)
- Vue graphique côte à côte (3 max pour lisibilité)
- Tableau comparatif prices min/max/avg

---

## 🛠️ Corrections de bugs

### Bug #1 : Variations de prix (réalisme)
**Actuel :** Variations trop similaires (toujours ±3%)  
**Solution :** Utiliser `Math.random()` pour varier par catégorie + histoire de prix

### Bug #2 : Scroll mobile (exports)
**Actuel :** Tableaux d'export débordent sur mobile  
**Solution :** Wrapper `<div style="overflow-x: auto">` + media query

### Bug #3 : Affichage devise secondaire
Faire en sorte que FCFA s'affiche toujours en premier, devise régionale en 2e colonne

---

## 📐 Architecture cible

```
src/
├── components/
│   ├── Auth/
│   │   ├── LoginForm.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ResetPassword.tsx
│   ├── Dashboard/
│   │   ├── KPICards.tsx
│   │   ├── PriceChart.tsx
│   │   ├── AlertsPanel.tsx
│   │   └── DashboardHome.tsx
│   ├── Products/
│   │   ├── ProductList.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── ProductComparison.tsx
│   │   └── SearchFilter.tsx
│   ├── Prices/
│   │   ├── PriceByForm.tsx
│   │   ├── PriceChart.tsx
│   │   └── PriceComparison.tsx
│   ├── Alerts/
│   │   ├── AlertForm.tsx
│   │   └── AlertsList.tsx
│   ├── Export/
│   │   ├── CSVExport.tsx
│   │   └── PDFExport.tsx
│   └── Layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase.ts
│   ├── api.ts (helpers requêtes)
│   ├── currency.ts (conversion devises)
│   ├── constants.ts (taux, symboles)
│   └── types.ts (interfaces TS)
├── hooks/
│   ├── useAuth.ts
│   ├── usePrices.ts
│   ├── useAlerts.ts
│   └── useCurrency.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── Products.tsx
│   ├── Prices.tsx
│   ├── Alerts.tsx
│   └── Settings.tsx
├── styles/
│   ├── index.css (global + glassmorphism)
│   └── variables.css (colors, fonts)
└── App.tsx
```

---

## 📝 Checklist d'implémentation

### Phase 1 (Immédiat)
- [ ] Setup: Dépendances npm (recharts, jspdf si nécessaire)
- [ ] HIGH 1: Fonctions conversion devises + symboles
- [ ] HIGH 2: Edge Function ou script sync
- [ ] HIGH 3: Dashboard home component
- [ ] BUG FIX 1: Vérifier filtre région

### Phase 2 (Semaines 2-3)
- [ ] MEDIUM 4: SearchFilter component
- [ ] MEDIUM 5: ProductDetail page + route
- [ ] MEDIUM 6: PDFExport utility
- [ ] BUG FIX 2 & 3: Variations réalistes + scroll mobile

### Phase 3+ (Semaines 4+)
- [ ] MEDIUM 7: ForgotPassword flow
- [ ] LOW 8: Email notifications
- [ ] LOW 9: ProductComparison component
- [ ] LOW 10: i18n setup (react-i18next)

---

## 🚀 Déploiement

1. Build local : `npm run build`
2. Test: `npm run preview`
3. Push dossier `dist/` sur Hostinger (hszleapqihvxg.kimi.page)
4. Configurer CNAME : `agropricecn.xp-nova.com` → `hszleapqihvxg.kimi.page`
5. Test en production

---

## 📞 Support & Questions

**Supabase Dashboard :** https://supabase.com/dashboard/project/tfivnmqpvpbieqfekghg

**Contact :** jostenw2026@gmail.com

---

*Dernière mise à jour : 2026-06-01*
