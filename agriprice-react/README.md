# AgriPrice - React + Supabase

Application web complète pour le suivi des prix agricoles camerounais sur les marchés B2B internationaux (Asie, Europe, Amérique du Nord).

**Stack Tech:**
- React 18 + TypeScript
- Vite (bundler ultrarapide)
- Supabase (authentification + base de données)
- Tailwind CSS (design glassmorphism)
- Recharts (graphiques interactifs)

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances

```bash
npm install
```

### 2. Lancer le serveur de développement

```bash
npm run dev
```

Accédez à `http://localhost:5173`

### 3. Build pour production

```bash
npm run build
```

La sortie est dans le dossier `dist/`

---

## 📁 Structure du Projet

```
agriprice-react/
├── src/
│   ├── lib/
│   │   └── supabase.ts          # Client Supabase + helpers
│   ├── contexts/
│   │   └── AuthContext.tsx      # Auth globale (React Context)
│   ├── pages/
│   │   └── Login.tsx            # Page de connexion
│   ├── App.tsx                  # App principale + routing
│   ├── main.tsx                 # Entry point React
│   └── index.css                # Styles globaux + Tailwind
├── index.html                   # HTML racine
├── vite.config.ts               # Config Vite
├── tailwind.config.js           # Config Tailwind
├── package.json                 # Dépendances
└── tsconfig.json                # Config TypeScript
```

---

## 🔐 Configuration Supabase

Credentials déjà configurés dans `src/lib/supabase.ts`:

```
Project URL: https://tfivnmqpvpbieqfekghg.supabase.co
Anon Key: (voir dans le fichier)
```

**Tables Supabase requises:**
- `products` (25 produits camerounais)
- `sources` (21 sources B2B)
- `price_records` (historique prix)
- `alerts` (alertes utilisateur)
- `user_tracked_products` (suivi personnalisé)
- `exchange_rates` (devises XAF/USD/EUR/CNY)

---

## 📋 Architecture Phases

### Phase 1 ✅ (ACTUELLE): Authentification + Structure
- ✅ Setup React + Vite + TypeScript
- ✅ Intégration Supabase Auth
- ✅ Context API pour l'authentification
- ✅ Page de login / inscription
- ✅ Navigation de base

### Phase 2 (NEXT): Dashboard + Données
- Dashboard avec KPIs (25 produits, 21 sources, 96% confiance)
- Tableau des prix actuels
- Sélecteur multidevise (XAF/USD/EUR/CNY)
- Synchronisation automatique des prix

### Phase 3 (APRÈS): Fonctionnalités Complètes
- Gestion des produits (CRUD)
- Variations saisonnières
- Recherche & filtres avancés
- Comparaison sources
- Export PDF professionnel
- Notifications email

---

## 🔄 Hooks et Contextes

### `useAuth()`

```tsx
const { user, loading, error, signIn, signUp, signOut } = useAuth()
```

- `user`: Utilisateur Supabase actuel (ou null)
- `loading`: Booléen de chargement
- `error`: Message d'erreur s'il y en a
- `signIn()`: Connexion
- `signUp()`: Inscription
- `signOut()`: Déconnexion

---

## 📊 Données Supabase

### Products (25 produits)
```
id | name_fr | name_cn | category | is_active
1  | Plantain | 大蕉 | Tropical Fruits | true
2  | Cacao | 可可 | Stimulants | true
...
```

### Sources (21 sources)
```
id | name | region | country
1  | China Alibaba | Asia | China
2  | ICE Futures | Europe | UK
...
```

### Price Records
```
id | product_id | source_id | price_cny | price_usd | price_fcfa | recorded_at
```

---

## 🎨 Design System

**Couleurs primaires:**
- Émeraude: `#22c55e` (boutons, accents)
- Slate: `#1e293b` (fond sombre)
- Blanc: `#ffffff` (texte principal)

**Composants:**
- `.glass` - Glassmorphism card
- `.btn-primary` - Bouton primaire
- `.badge` - Badge coloré
- `.alert` - Messages d'alerte

---

## 🚀 Déploiement

### Option 1: Vercel (Recommandé)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 3: Custom (agropricecn.xp-nova.com)
1. Build: `npm run build`
2. Upload `dist/` vers votre serveur
3. Configure CNAME vers hszleapqihvxg.kimi.page

---

## 📝 Variables d'Environnement

(Optionnel - déjà défini dans le code)

```env
VITE_SUPABASE_URL=https://tfivnmqpvpbieqfekghg.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

---

## 🐛 Débogage

### Console Supabase
https://supabase.com/dashboard/project/tfivnmqpvpbieqfekghg

### Authentification
- Vérifiez les utilisateurs dans `Auth > Users`
- Logs dans `Database > Logs`

### Erreurs Courantes

| Erreur | Solution |
|--------|----------|
| "CORS error" | Vérifiez CORS dans Supabase settings |
| "User not authenticated" | Vérifiez AuthProvider dans App |
| "Table not found" | Vérifiez création tables Supabase |

---

## 📦 Dépendances Principales

- `react`: UI library
- `@supabase/supabase-js`: Backend + Auth
- `react-router-dom`: Navigation
- `tailwindcss`: Styling
- `recharts`: Graphiques
- `lucide-react`: Icônes
- `jspdf`: Export PDF
- `date-fns`: Manipulation dates

---

## 🤝 Contribution

1. Créer une branche: `git checkout -b feature/nom-feature`
2. Commit: `git commit -am 'Ajoute feature'`
3. Push: `git push origin feature/nom-feature`
4. Pull Request

---

## 📞 Support

**Email:** compliance@xp-nova.cm  
**Support:** 24h max  
**Documentation:** voir `GUIDE_DEMARRAGE_COMPLET.md`

---

**Version:** 1.0.0  
**Date:** 2 juin 2026  
**Statut:** Phase 1 Complète ✅
