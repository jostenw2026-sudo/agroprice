# 🚀 AgriPrice - Guide de Déploiement

## Phase 3 Complète ✓

Toutes les pages et fonctionnalités sont maintenant implémentées et prêtes pour la production.

---

## 📋 Checklist Pré-Déploiement

- [x] **Phase 1: Structure & Authentification**
  - [x] Login/Sign-up avec Supabase
  - [x] AuthContext + useAuth hook
  - [x] Protected routes

- [x] **Phase 2: Dashboard & Real-time Data**
  - [x] KPI cards (productsCount, sourcesCount, avgConfidence, lastSync)
  - [x] Price charts (30-day line, 7-day bar)
  - [x] Currency selector (XAF/USD/EUR/CNY)
  - [x] Automatic refresh every 5 minutes
  - [x] DataContext + Supabase integration

- [x] **Phase 3: Fonctionnalités Complètes**
  - [x] **Products.tsx** — CRUD produits (search, filter, add/edit/delete)
  - [x] **Prices.tsx** — Historique prix (date range filters, stats, manual entry)
  - [x] **Sources.tsx** — Crédibilité bancaire (4-Tier system, audit trail, certification)
  - [x] **Variations.tsx** — Indices saisonniers (line/bar charts, monthly breakdown)
  - [x] **Reports.tsx** — Export PDF (4 rapports professionnels)
  - [x] **Settings.tsx** — Préférences utilisateur (devise, langue, notifications)

---

## 🎯 Stack Technique

| Composant | Technologie | Version |
|-----------|------------|---------|
| **Frontend** | React + TypeScript | 18 |
| **Build** | Vite | Latest |
| **Styling** | Tailwind CSS | 3 |
| **State** | React Context API | — |
| **Charts** | Recharts | Latest |
| **Icons** | Lucide React | Latest |
| **PDF** | jsPDF | Latest |
| **Dates** | date-fns | Latest |
| **Backend** | Supabase | Hosted |
| **Auth** | Supabase Auth | Email/Password |
| **Database** | PostgreSQL (Supabase) | 15 |

---

## 🚀 Déploiement Local

### 1. **Installation des dépendances**

```bash
cd agriprice-react
npm install
```

### 2. **Configuration des variables d'environnement**

Créez `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=https://tfivnmqpvpbieqfekghg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ SÉCURITÉ:** Ces clés sont publiques (ANON_KEY). Assurez-vous que :
- Row Level Security (RLS) est activé dans Supabase
- Les politiques d'accès limitent les données aux utilisateurs authentifiés

### 3. **Lancer le serveur de développement**

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5173`

### 4. **Build pour la production**

```bash
npm run build
npm run preview  # Preview local du build
```

---

## 🌐 Déploiement Production (agropricecn.xp-nova.com)

### Option A: **Vercel (Recommandé)**

1. **Connectez votre repo GitHub**
   - Push le code sur GitHub
   - Importez le repo dans Vercel

2. **Variables d'environnement dans Vercel**
   ```
   VITE_SUPABASE_URL=https://tfivnmqpvpbieqfekghg.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

3. **Configuration du domaine**
   - Dans Vercel: Settings → Domains
   - Ajoutez `agropricecn.xp-nova.com`
   - Configurez le CNAME:
     ```
     CNAME: cname.vercel.com
     ```
   - DNS chez votre registrar: 
     ```
     CNAME agropricecn → cname.vercel.com
     ```

4. **Deploy automatique**
   - Chaque push sur `main` déclenche un build
   - Tests + build + deploy en ~2-3 minutes

### Option B: **Netlify**

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option C: **Self-hosted (Railway/Render)**

**Railway:**
```bash
railway link
railway up
```

**Render:**
- Connectez votre GitHub repo
- Créez un Web Service
- Build command: `npm install && npm run build`
- Start command: `npm run preview`

---

## 🔐 Checklist Sécurité

- [ ] **Supabase RLS activé**
  ```sql
  ALTER TABLE products ENABLE ROW LEVEL SECURITY;
  ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
  ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
  ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
  ```

- [ ] **Politiques d'accès**
  - Les utilisateurs ne peuvent voir que leurs propres données
  - Les admins ont accès complet

- [ ] **HTTPS forcé**
  - Vercel/Netlify: automatique
  - Self-hosted: configurez SSL/TLS

- [ ] **CORS correctement configuré**
  - Allowed origins: `https://agropricecn.xp-nova.com`

- [ ] **Secrets en variables d'environnement**
  - Jamais en `.env` (local uniquement)
  - Jamais committé dans Git

---

## 📊 Architecture Production

```
┌─────────────────────────────────────────┐
│         Browser (User)                   │
│      https://agropricecn.xp-nova.com    │
└────────────┬────────────────────────────┘
             │
             │ HTTPS (TLS 1.3)
             │
┌────────────▼────────────────────────────┐
│         Vercel Edge Network              │
│  (Automatic global CDN)                  │
└────────────┬────────────────────────────┘
             │
             │ HTTPS
             │
┌────────────▼────────────────────────────┐
│       Supabase Hosted                    │
│  ┌─────────────────────────────────┐   │
│  │ Auth: Email/Password             │   │
│  │ Database: PostgreSQL 15          │   │
│  │ Storage: S3-compatible           │   │
│  │ Realtime: WebSocket              │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 🧪 Testing Avant Production

### Frontend Tests
```bash
npm run test           # Unit tests (si configuré)
npm run build          # Vérifier qu'il n'y a pas d'erreurs TS
```

### Manual Testing Checklist
- [ ] Login/Signup fonctionnent
- [ ] Dashboard charge et rafraîchit
- [ ] Filtres produits/prix/sources fonctionnent
- [ ] Changement de devise convertit correctement
- [ ] Export PDF génère un fichier valide
- [ ] Responsive sur mobile/tablet
- [ ] Pas de console errors

### Performance
```bash
npm run build
# Vérifiez la taille des bundles:
# main.js devrait être < 500KB
# vendor.js devrait être < 200KB
```

---

## 📞 Support & Maintenance

### En cas de problème

1. **Vérifiez les logs**
   - Frontend: DevTools → Console
   - Backend: Supabase Dashboard → Logs

2. **Vérifiez la connectivité**
   ```bash
   curl https://tfivnmqpvpbieqfekghg.supabase.co/rest/v1/products
   ```

3. **Redémarrage**
   - Vercel: Redeploy depuis le dashboard
   - Self-hosted: Restart le service

### Monitoring Recommandé

- **Uptime**: Uptime Robot ou Pingdom
- **Performance**: Vercel Analytics (inclus)
- **Logs**: Sentry pour les erreurs JS
- **APM**: Datadog ou New Relic (optionnel)

---

## 📝 Prochaines Étapes

### Phase 4 (À venir)
- [ ] Page "Exports" pour multi-format (CSV, Excel, JSON)
- [ ] Notifications email (alertes de prix, digest quotidien)
- [ ] Reset de mot de passe oublié
- [ ] User profile + avatar
- [ ] Dark mode toggle
- [ ] Multi-language i18n
- [ ] API REST pour intégrations tierces

### Infrastructure
- [ ] Mise en cache Redis pour les prix
- [ ] Queue jobs (Bull/RabbitMQ) pour exports
- [ ] Monitoring en production
- [ ] Backup automatique Supabase
- [ ] CI/CD GitHub Actions

---

## 📦 Version & Historique

**AgriPrice v1.0.0** — 2 juin 2026

- ✅ Phase 1: Auth + Protected Routes
- ✅ Phase 2: Dashboard + Real-time Data
- ✅ Phase 3: Complete CRUD + Reports
- 🚀 Ready for Production

---

## 📧 Contact

**XP-NOVA Engineering**
- Email: support@xp-nova.cm
- Docs: docs.agriprice.xp-nova.com
- Status: status.agriprice.xp-nova.com
