# 🌾 AgriPrice - Fonctionnalités Détaillées

## Vue d'ensemble

AgriPrice est une **plateforme de veille tarifaire agricole B2B** intégrant 25 produits camerounais avec 21 sources internationales vérifiées. Architecture production-ready avec authentification bancaire, conversion multi-devises, et export professionnel.

---

## 🔐 Authentification & Comptes

### Système d'authentification
- **Supabase Auth** (Email/Password)
- Sessions persistantes avec tokens JWT
- Auto-check d'utilisateur au montage de l'app
- Listeners en temps réel pour changements d'état auth

### Données de compte
- Email et rôle utilisateur
- Historique de connexion
- Préférences utilisateur (devise, langue, notifications)
- Sessions illimitées avec expiration configurable

---

## 📊 Dashboard Principal

### KPI Cards (4)
1. **Produits Tracés**: 25 variétés camerounaises
2. **Sources Vérifiées**: 21 sources B2B internationales
3. **Confiance Moyenne**: 95%+ (Tier 1/2)
4. **Dernière Sync**: Timestamp (auto-refresh 5 min)

### Charts Interactifs
- **30-Day Line Chart**: Tendance prix moyen (XAF/USD/EUR/CNY)
- **7-Day Bar Chart**: Volumes et volatilité hebdomadaire
- Tooltips avec contexte (région, source, confiance)
- Responsive sur tous écrans

### Filtrage & Contrôles
- **Currency Selector**: Bascule XAF/USD/EUR/CNY (conversion live)
- **Refresh Button**: Force sync immédiate des prix
- **Regional Filter**: Asie / Europe / Amérique du Nord
- **Period Toggle**: Last 7d / 30d / 90d

---

## 🛍️ Gestion des Produits (Products.tsx)

### Fonctionnalités
- **Search**: Recherche par nom français ou chinois
- **Filter**: Catégories (Céréales, Légumes, Fruits, Cultures commerciales)
- **CRUD Complet**:
  - Ajouter nouveau produit
  - Editer nom_fr, nom_cn, catégorie
  - Supprimer avec confirmation
  - Activer/désactiver produit

### Tableau Produits
| Colonne | Contenu | Éditable |
|---------|---------|----------|
| Nom FR | Maïs, Riz, Manioc... | ✓ |
| Nom CN | 玉米, 米, 木薯... | ✓ |
| Catégorie | Céréale, Légume... | ✓ |
| Status | Active / Inactive | ✓ |
| Actions | Edit, Delete | ✓ |

### Modal Form
- 3 champs: name_fr, name_cn, category
- Validation avant submit
- Confirmation avant suppression
- Feedback utilisateur (loading, errors)

---

## 💰 Historique des Prix (Prices.tsx)

### Filtres & Tri
- **Product Filter**: Multi-select (tous produits)
- **Date Range**: All / 7d / 30d / 90d
- **Sort**: Par date, prix, région
- **Export**: Télécharger les données visibles

### Stats Cards (4)
| Stat | Calcul | Affichage |
|------|--------|-----------|
| Avg | Moyenne prix période | 0.00 XAF |
| Min | Prix minimum | 0.00 XAF |
| Max | Prix maximum | 0.00 XAF |
| Change | % variation | +/- 0% |

### Tableau Complet
| Colonne | Type | Source |
|---------|------|--------|
| Product | Texte | Supabase |
| Source | Badge | Supabase |
| Form | Texte | Supabase |
| Quality Grade | Badge (A/B/C) | Supabase |
| Price (XAF) | Monétaire | Dynamique |
| Price (USD) | Monétaire | Convertie |
| Price (CNY) | Monétaire | Convertie |
| Date | Timestamp | Supabase |
| Trend | ↑↓→ Icon | Calculé |

### Modal d'entrée manuelle
- 3 colonnes prix: XAF, USD, CNY
- Grading: A (Premium), B (Standard), C (Budget)
- Date picker + validation
- Submit→Supabase insert

---

## 🏦 Crédibilité des Sources (Sources.tsx)

### Framework 4-Tier
| Tier | Confiance | Couleur | Exemple |
|------|-----------|---------|---------|
| TIER 1 | 95-100% | Emerald | FAO GIEWS, MINADER |
| TIER 2 | 80-94% | Blue | ICE Futures, Euronext |
| TIER 3 | 70-79% | Amber | Exchanges régionaux |
| TIER 4 | 60-69% | Red | Traders indépendants |

### Données par source
- **Nom & Pays** d'origine
- **Crédibilité Score** (7/10 → 9.7/10)
- **Fréquence** de mise à jour (Daily/Weekly/Monthly)
- **Région** (Asia/Europe/North America)
- **URL** de la source (clickable)

### Audit Trail
- Dernière vérification: timestamp
- Historique 7 jours
- Conformité: Basel III, ISO 20000, SWIFT
- Rétention: 7 ans minimum

### Actions
- **Détails**: Affiche historique complet
- **Certificat**: Export PDF de certification bancaire

---

## 📈 Variations Saisonnières (Variations.tsx)

### Sélection produit
- Dropdown des 25 produits
- Indices mensuels pré-calculés (base 100)

### Statistiques
| Métrique | Calcul | Exemple |
|----------|--------|---------|
| Pic annuel | Max indice | 130% (oct-nov) |
| Creux annuel | Min indice | 75% (jan-fev) |
| Moyenne | Base 100 | 100% |
| Volatilité | Peak-Trough | 55% écart |

### Visualisations
1. **Courbe Saisonnière** (LineChart)
   - Indice mensuel (courbe principale)
   - Moyenne annuelle (ligne pointillée)
   - Annotations peaks/troughs

2. **Écarts Mensuels** (BarChart)
   - Barres colorées par mois
   - Légende vs moyenne

### Tableau Détail
- 12 lignes (Jan-Dec)
- Indice, Écart vs Moyenne, Tendance (↑↓→)
- Recommandations stockage en bas

---

## 📋 Rapports & Exports (Reports.tsx)

### 4 Rapports Professionnels

#### 1. **Analyse des Prix**
- Volatilité régionale (Asie/Europe/N-Amérique)
- Top 5 produits volatiles
- Tendances court/moyen terme
- Format: PDF professionnel

#### 2. **Audit des Sources**
- Distribution Tier 1-4
- Nombre de sources par niveau
- Conformité (Basel III, SWIFT)
- Rétention d'audit 7 ans

#### 3. **Tendances Saisonnières**
- Indices mensuels moyens
- Pics et creux saisonniers
- Patterns de consommation
- Recommandations stockage

#### 4. **Synthèse Marché**
- 25 produits tracés
- 21 sources vérifiées
- 3 régions couvertes
- 4 devises supportées
- Opportunités identifiées

### Génération PDF
- Date/Période de l'analyse
- Header XP-NOVA branded
- Footer avec mention "Confidentiel"
- Timestamps et signatures
- Format A4 prêt pour impression

### Contrôles d'export
- **Date Range**: 7d / 30d / 90d
- **Format**: PDF (autres formats en Phase 4)
- **Filename**: `AgriPrice-{type}-{date}.pdf`
- **Compression**: Actif pour upload

---

## ⚙️ Paramètres Utilisateur (Settings.tsx)

### Affichage
- **Devise par défaut**: XAF / USD / EUR / CNY
- **Langue**: FR / EN / 中文 (Phase 4)
- **Format de date**: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD

### Notifications
- **Alertes Email**: Toggle on/off
- **Digest Quotidien**: Toggle on/off
- **Alerte Seuil Prix**: Toggle + threshold % configurable
- Historique notifications (derniers 30 jours)

### Sécurité
- **Partage Données**: Toggle pour analyses anonymes
- **2FA**: Toggle (SMS OTP)
- **Expiration Session**: Minutes (par défaut 30)
- **Change Password**: Formulaire séparé

### Infos Compte
- Email (read-only)
- Rôle (Admin/User - read-only)
- Organisme (read-only)
- Date d'inscription
- Dernier login

---

## 💱 Système de Conversion de Devises

### Taux de Change Supabase
Table `exchange_rates` avec:
- Base currency (XAF)
- Target currencies (USD, EUR, CNY)
- Rate (ex: 1 XAF = 0.00156 USD)
- Last updated timestamp

### Conversion live
```typescript
convertPrice(priceXAF: number, toCurrency: string): number
// Exemple: convertPrice(1000000, 'USD') → 1560
```

### Fallback defaults
Si Supabase indisponible:
- XAF = 1
- USD = 0.00156
- EUR = 0.00148
- CNY = 0.011

### Auto-refresh
- Taux refreshés toutes les 24h
- Manuel refresh possible depuis Settings
- Affichage du timestamp "Dernière mise à jour"

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** (< 640px): Single column, collapsed nav
- **Tablet** (640px - 1024px): 2-column grid
- **Desktop** (> 1024px): Full 3-column grid

### Adaptations
- Currency selector: Full label (desktop) → Symbol (mobile)
- Tables: Horizontal scroll sur mobile
- Sidebar: Collapsible sur mobile
- Charts: Responsive height/width

---

## 🔄 Flux de Données

```
┌─────────────────┐
│  React Frontend │
│   (Vite + TS)   │
└────────┬────────┘
         │ HTTPS/WebSocket
         ▼
┌─────────────────┐
│ Supabase Client │
│ (JS SDK)        │
└────────┬────────┘
         │ REST API + Realtime
         ▼
┌─────────────────┐
│   Supabase      │
│ (Auth + DB)     │
│                 │
│ Tables:         │
│ - users         │
│ - products      │
│ - sources       │
│ - prices        │
│ - alerts        │
│ - exchange_rates│
└─────────────────┘
```

---

## 🎨 Palette de couleurs

| Usage | Couleur | Tailwind |
|-------|---------|----------|
| Primary | Emerald | `emerald-500/600` |
| Secondary | Slate | `slate-700/800` |
| Success | Emerald | `emerald-400` |
| Warning | Amber | `amber-400` |
| Error | Red | `red-400` |
| Info | Blue | `blue-400` |
| Background | Slate-900 | Dark theme |
| Text | Slate-300 | Light text |

---

## 🚀 Performance

### Optimisations
- Code-splitting automatique (Vite)
- Lazy loading des pages
- Image optimization
- Debounced API calls
- Cached exchange rates

### Cibles
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Lighthouse Score: > 90

---

## 📞 Support Utilisateur

### Dans l'app
- Tooltips explicatifs sur chaque section
- Textes d'aide sous les filtres
- Modales d'info "À propos"
- Boutons "Besoin d'aide?"

### Externe
- Documentation: docs.agriprice.xp-nova.com
- Email: support@xp-nova.cm
- Status page: status.agriprice.xp-nova.com
- Bug reports: issues@xp-nova.cm
