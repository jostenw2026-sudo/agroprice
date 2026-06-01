# 🚀 Déployer Edge Function sync-prices

## ⚠️ Problème

Le chemin Windows a des backslashes (`\`) mais Supabase CLI utilise des slashes (`/`).

---

## ✅ Solution

### **Option 1 : Utiliser le répertoire agroprice (RECOMMANDÉ)**

```bash
# 1. Assurez-vous d'être dans le dossier agroprice
cd ~/onedrive/_xpnova/Agri-cameroun-chine/Selon\ Claude/agroprice

# 2. Vérifiez que la structure existe
ls -la supabase/functions/sync-prices/

# Vous devriez voir :
# index.ts

# 3. Déployez
supabase functions deploy sync-prices

# 4. Testez
supabase functions invoke sync-prices --no-verify
```

---

### **Option 2 : Créer le répertoire à la bonne place (si erreur persiste)**

Si le dossier `supabase/functions/sync-prices/` n'existe pas :

```bash
# Allez au dossier agroprice
cd ~/onedrive/_xpnova/Agri-cameroun-chine/Selon\ Claude/agroprice

# Créez la structure
mkdir -p supabase/functions/sync-prices

# Copiez le fichier index.ts (depuis le dossier project)
# Vérifiez que index.ts est bien présent
ls supabase/functions/sync-prices/index.ts

# Puis déployez
supabase functions deploy sync-prices
```

---

## 📋 Commandes complètes (copier-coller)

```bash
# 1. Naviguez au bon dossier
cd ~/onedrive/_xpnova/Agri-cameroun-chine/Selon\ Claude/agroprice

# 2. Vérifiez la structure
ls -la supabase/functions/sync-prices/

# 3. Déployez
supabase functions deploy sync-prices

# 4. Vous verrez :
# ✓ Deploying function 'sync-prices'...
# ✓ Function 'sync-prices' deployed successfully

# 5. Testez l'invocation
supabase functions invoke sync-prices --no-verify
```

---

## ✅ Résultat attendu

```json
{
  "success": true,
  "timestamp": "2026-06-01T12:00:00Z",
  "data": {
    "productsCount": 25,
    "sourcesCount": 21,
    "pricesInserted": 125,
    "alertsTriggered": 3
  }
}
```

---

## 🚨 Si erreur "Le chemin d'accès spécifié est introuvable"

**Cause :** Le dossier `supabase/functions/sync-prices/` n'existe pas au bon endroit.

**Solution :**
1. Vérifiez que vous êtes dans le bon dossier : `pwd` doit afficher `agroprice`
2. Vérifiez que `index.ts` existe : `ls supabase/functions/sync-prices/index.ts`
3. Si absent, consultez `PLAN_DEVELOPPEMENT.md` pour retrouver où créer le fichier

---

## 📌 Notes

- Docker n'est pas nécessaire pour ce déploiement
- L'Edge Function s'exécutera sur les serveurs Supabase
- Vous pouvez l'invoquer manuellement ou programmer via GitHub Actions / cron
