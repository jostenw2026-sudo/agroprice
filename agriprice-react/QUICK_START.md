# ⚡ AgriPrice - Quick Start Guide

**5 minutes pour un projet fonctionnel localement**

---

## 1️⃣ Clonez ou accédez au répertoire

```bash
cd agroprice-react
```

---

## 2️⃣ Installez les dépendances

```bash
npm install
```

**Durée**: ~2-3 minutes (selon votre connexion)

---

## 3️⃣ Configurez les variables d'environnement

Créez le fichier `.env.local` à la racine:

```bash
cp .env.example .env.local
```

Remplissez avec vos credentials Supabase:

```env
VITE_SUPABASE_URL=https://tfivnmqpvpbieqfekghg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Où trouver ces valeurs?**
1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Settings → API → Project URL + Anon Key

---

## 4️⃣ Démarrez le serveur de développement

```bash
npm run dev
```

**Output:**
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

## 5️⃣ Ouvrez votre navigateur

Allez à **http://localhost:5173**

---

## 🎯 Premiers pas

### 1. **Créez un compte**
- Email: `test@xp-nova.cm`
- Password: `TestPassword123!`
- Cliquez "Sign Up"

### 2. **Vous êtes dans le Dashboard!**
Vous verrez:
- 4 KPI cards (produits, sources, confiance, dernière sync)
- Graphiques de prix
- Sélecteur de devise (XAF/USD/EUR/CNY)
- Bouton "Refresh"

### 3. **Explorez les pages**
- **Produits**: Voir/ajouter/éditer les 25 produits
- **Prix**: Historique des prix avec filtres
- **Sources**: Crédibilité bancaire (4-Tier)
- **Variations**: Indices saisonniers mensuels
- **Rapports**: Export PDF professionnel
- **Paramètres**: Préférences utilisateur

---

## 🔥 Commandes principales

| Commande | Fonction |
|----------|----------|
| `npm run dev` | Serveur dev (port 5173) |
| `npm run build` | Build pour production |
| `npm run preview` | Preview du build local |
| `npm run type-check` | Vérifier les types TypeScript |

---

## 🆘 Troubleshooting

### ❌ Erreur: "VITE_SUPABASE_URL is not defined"
**Solution**: Vérifiez que `.env.local` existe et contient les bonnes valeurs

### ❌ "Cannot find module @supabase/supabase-js"
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Port 5173 déjà utilisé
**Solution**: Changez le port dans `vite.config.ts`:
```typescript
server: {
  port: 5174  // Nouveau port
}
```

### ❌ CORS error depuis Supabase
**Solution**: Vérifiez que vous utilisez l'ANON_KEY (non SECRET_KEY)

---

## 📁 Structure du projet

```
agriprice-react/
├── src/
│   ├── pages/              # Pages complètes
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Products.tsx
│   │   ├── Prices.tsx
│   │   ├── Sources.tsx
│   │   ├── Variations.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── components/         # Composants réutilisables
│   │   ├── KPICard.tsx
│   │   ├── PriceChart.tsx
│   │   ├── CurrencySelector.tsx
│   │   ├── PricesTable.tsx
│   │   └── Modal.tsx
│   ├── contexts/           # React Contexts
│   │   ├── AuthContext.tsx
│   │   └── DataContext.tsx
│   ├── lib/                # Utilities
│   │   └── supabase.ts     # Supabase client
│   ├── App.tsx             # Main router
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── README.md
├── FEATURES.md
├── DEPLOYMENT.md
├── ROADMAP.md
└── .env.example
```

---

## 🚀 Déployer en production (2 min)

### Vercel (Recommandé)

1. **Pousser sur GitHub**
```bash
git init
git add .
git commit -m "Initial AgriPrice commit"
git remote add origin https://github.com/YOUR_ORG/agriprice-react.git
git push -u origin main
```

2. **Importer dans Vercel**
- Allez sur https://vercel.com/new
- Importez votre repo GitHub
- Définissez les env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Cliquez "Deploy"

3. **Configurer le domaine**
- Domains → Ajouter `agropricecn.xp-nova.com`
- CNAME: `cname.vercel.com` (chez votre registrar DNS)

**Durée totale**: 2-3 minutes

---

## 📊 Data de test

Après première connexion, le Dashboard affiche:

| Métrique | Valeur |
|----------|--------|
| Produits | 25 |
| Sources | 21 |
| Confiance moyenne | 95%+ |
| Dernière sync | Maintenant |

Les prix sont **simulés** (démo). Pour données réelles:
1. Insertez dans table `prices` via Supabase Dashboard
2. Ou utilisez l'API `/insert-price` (Phase 4)

---

## 🔐 Sécurité

✅ **Déjà configuré**:
- HTTPS en production (Vercel)
- Password hashing (Supabase)
- Protected routes (authentification requise)
- CORS configuré

⚠️ **À faire avant production**:
- [ ] Activer RLS dans Supabase
- [ ] Configurer email provider (SendGrid/Mailgun)
- [ ] Ajouter 2FA option
- [ ] Configurer backup automatique

---

## 📚 Documentation complète

- **FEATURES.md** — Toutes les fonctionnalités détaillées
- **DEPLOYMENT.md** — Guide de déploiement complet
- **ROADMAP.md** — Phases futures (Phase 4-8)
- **README.md** — Architecture technique

---

## 🎓 Stack utilisé

| Technologie | Rôle |
|-------------|------|
| **React 18** | UI Framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **Tailwind CSS** | Styling |
| **Supabase** | Backend (Auth + DB) |
| **Recharts** | Data visualization |
| **jsPDF** | PDF generation |
| **date-fns** | Date handling |
| **Lucide React** | Icons |

---

## 💬 Support

**Besoin d'aide?**
- Documentation: Voir les fichiers .md dans le repo
- GitHub Issues: Reportez les bugs
- Email: support@xp-nova.cm
- Docs: docs.agriprice.xp-nova.com

---

## ✅ Checklist démarrage

- [ ] Dependencies installées (`npm install`)
- [ ] `.env.local` créé avec Supabase credentials
- [ ] Dev server lancé (`npm run dev`)
- [ ] Navigateur ouvert à `http://localhost:5173`
- [ ] Compte créé et login fonctionnel
- [ ] Dashboard visible
- [ ] Tous les pages accessibles via sidebar

🎉 **Félicitations! AgriPrice tourne localement**

---

**Version**: 1.0.0 (Phase 3 Complète)
**Dernière mise à jour**: 2 juin 2026
