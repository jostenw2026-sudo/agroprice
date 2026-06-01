# 🔧 Intégration Supabase - AgriPrice

## ÉTAPE 1 : Créer les tables Supabase

**1. Allez sur votre projet Supabase**
```
https://supabase.com
→ Votre projet
→ SQL Editor (en bas à gauche)
```

**2. Créez une nouvelle query**
- Cliquez sur "New query"
- Copiez tout le contenu de `SUPABASE_SETUP.sql`
- Collez-le dans l'éditeur SQL
- Cliquez "Run"

**3. Vérifiez la création**
```sql
SELECT COUNT(*) FROM products;          -- Doit afficher 25
SELECT COUNT(*) FROM sources;           -- Doit afficher 22
SELECT COUNT(*) FROM price_records;     -- Doit afficher 25+
```

---

## ÉTAPE 2 : Installer la dépendance Supabase

Dans votre terminal (où npm run dev tourne) :

```bash
# Appuyez sur Ctrl+C pour arrêter le dev server
# Puis exécutez :

npm install @supabase/supabase-js

# Relancez le dev server
npm run dev
```

---

## ÉTAPE 3 : Tester la connexion

Une fois `npm run dev` relancé :

1. **Ouvrez le navigateur**
   ```
   http://localhost:5173/
   ```

2. **Ouvrez la console (F12)**
   - Console tab
   - Vous devriez voir des logs Supabase

3. **Le Dashboard devrait maintenant afficher :**
   - ✅ Produits depuis la BD (au lieu de mock data)
   - ✅ Sources depuis la BD
   - ✅ Prix récents depuis la BD

---

## ÉTAPE 4 : Vérifier les données

Dans la console du navigateur (F12) :

```javascript
// Testez la connexion
import { supabase, fetchProducts } from './lib/supabase.ts'

// Récupérez les produits
const products = await fetchProducts()
console.log('Produits:', products)
```

---

## ✅ Checklist

- [ ] Étape 1 : Tables Supabase créées (SQL exécuté)
- [ ] Vérification : 25 produits, 22 sources créés
- [ ] Étape 2 : `npm install @supabase/supabase-js` exécuté
- [ ] Dev server relancé : `npm run dev`
- [ ] Dashboard affiche données live
- [ ] Console (F12) affiche "Supabase connected"

---

## 🚨 Si erreur

**"Module not found: @supabase/supabase-js"**
```bash
npm install @supabase/supabase-js
npm run dev
```

**"Cannot connect to Supabase"**
- Vérifiez l'URL : `https://glofwrhgzxqttshvxhcw.supabase.co`
- Vérifiez la clé anon (dans `src/lib/supabase.ts`)
- Vérifiez que votre IP est autorisée (Supabase → Settings → Network)

**"Table not found: products"**
- Réexécutez `SUPABASE_SETUP.sql` complètement
- Vérifiez dans Supabase que les tables existent (Tables → Browse)

---

## 📋 Prochaine étape

Une fois Supabase intégré :
- Déployer l'Edge Function `sync-prices` 
- Programmer les syncs automatiques
