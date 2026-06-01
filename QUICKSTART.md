# ⚡ QuickStart — AgriPrice Development

## 🎯 En 5 minutes

### 1. Clone/setup des fichiers

```bash
# Aller dans le dossier du projet
cd C:\Users\joste_w9bpyny\OneDrive\_XPNOVA\Agri-cameroun-chine\Selon Claude\agroprice

# Installer dépendances
npm install

# Ajouter dépendances supplémentaires (si manquant)
npm install recharts jspdf jspdf-autotable date-fns
```

### 2. Vérifier l'environnement

```bash
# Vérifier Node.js version (doit être 16+)
node --version

# Vérifier npm
npm --version
```

### 3. Lancer le dev server

```bash
npm run dev
```

Ouvrir : **http://localhost:5173**

### 4. Vérifier la connexion Supabase

Dans le navigateur (console) :
```javascript
// Doit afficher les credentials
localStorage.getItem('sb_url')
localStorage.getItem('sb_key')
```

---

## 🚀 Démarrer la Phase 1

### Étape 1 : Currency Conversion (1h)

**Fichier à créer :** `src/lib/currency.ts`

Copier le code du **Guide technique** section 2️⃣

```bash
# Vérifier que TypeScript compile
npm run build
```

### Étape 2 : Intégrer dans App.tsx (30 min)

Ouvrir `src/App.tsx` et importer :
```typescript
import { getDualPrices } from './lib/currency';
```

Chercher où les prix s'affichent et ajouter :
```typescript
const dual = getDualPrices(priceRecord.price_fcfa, selectedRegion);
```

### Étape 3 : Sync automatisée (1.5h)

**Option A — Edge Function Supabase (recommandé)**
1. Aller sur https://supabase.com/dashboard/project/tfivnmqpvpbieqfekghg
2. Functions → Create new function
3. Nommer : `sync-prices`
4. Copier le code du **Guide technique** section 3️⃣
5. Deploy
6. Test via dashboard

**Option B — Script local (dev/test)**
```bash
# Créer src/scripts/sync-prices.ts
# Exécuter : npm run sync:prices
```

### Étape 4 : Dashboard Home (1h)

**Fichier à créer :** `src/components/Dashboard/DashboardHome.tsx`

Copier du **Guide technique** section 4️⃣

Ajouter dans `App.tsx` :
```typescript
import DashboardHome from './components/Dashboard/DashboardHome';

// Dans le routing
<Route path="/dashboard" element={<DashboardHome />} />
```

---

## 📋 Checklist Phase 1

- [ ] `src/lib/currency.ts` créé
- [ ] Imports ajoutés à `App.tsx`
- [ ] Affichage devises OK (tester page prix)
- [ ] Edge Function déployée
- [ ] Sync testée (prices_records table remplie)
- [ ] `DashboardHome.tsx` créé
- [ ] Dashboard page fonctionnelle
- [ ] Bug filtre région corrigé
- [ ] Build sans erreurs : `npm run build`

---

## 🐛 Debug rapide

### Erreur : "Cannot find module '@supabase/supabase-js'"

```bash
npm install @supabase/supabase-js
```

### Erreur : "Recharts not found"

```bash
npm install recharts
```

### Supabase credentials vides

1. Ouvrir browser devtools (F12)
2. Aller dans Application → LocalStorage
3. Vérifier `sb_url` et `sb_key` présents
4. Si vides, refaire login
5. Si bug persiste : vérifier `src/lib/supabase.ts`

### Dev server ne démarre pas

```bash
# Supprimer cache Vite
rm -rf node_modules/.vite

# Relancer
npm run dev
```

---

## 🔗 Ressources importantes

| Ressource | URL |
|-----------|-----|
| **Supabase Dashboard** | https://supabase.com/dashboard/project/tfivnmqpvpbieqfekghg |
| **App en production** | https://hszleapqihvxg.kimi.page |
| **Docs Supabase** | https://supabase.com/docs |
| **Docs Recharts** | https://recharts.org |
| **Docs Vite** | https://vitejs.dev |

---

## 📝 Commandes utiles

```bash
# Dev server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Format code
npm run format

# Lint
npm run lint
```

---

## 🎓 Structure de fichiers utile

```
src/
├── App.tsx                          # Point d'entrée principal
├── main.tsx                         # Bootstrapping React
├── index.css                        # Styles globaux
├── lib/
│   ├── supabase.ts                 # Client Supabase
│   └── currency.ts                 # 🆕 Conversion devises
├── components/
│   ├── Dashboard/
│   │   └── DashboardHome.tsx       # 🆕 Dashboard
│   ├── [autres composants...]
│   └── ...
└── pages/
    └── [futures pages...]
```

---

## ✨ Astuce de développement

### Hot Reload des styles CSS
Modifier `src/index.css` et voir les changements sans refresh

### Debug React Components
Installer React DevTools pour Chrome/Firefox

### Test de requêtes Supabase
Utiliser le SQL Editor dans Supabase dashboard

---

## 📞 Questions?

1. **Lire d'abord :** `PLAN_DEVELOPPEMENT.md` et `GUIDE_TECHNIQUE.md`
2. **Chercher :** Ctrl+F dans ces documents
3. **Contacter :** jostenw2026@gmail.com

---

## 🚀 Suivant

Une fois Phase 1 complétée :
1. **Commit & push** les changements (git)
2. **Build & test** : `npm run build && npm run preview`
3. **Déployer** sur Hostinger
4. **Commencer Phase 2** (recherche, détails produit)

Bonne chance! 💪

---

*QuickStart — AgriPrice 2026-06-01*
