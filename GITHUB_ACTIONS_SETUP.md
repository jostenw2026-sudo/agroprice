# 🤖 GitHub Actions - Syncs automatiques

## ✅ Ce que ça fait

Toutes les **heures**, GitHub Actions va :
1. Exécuter l'Edge Function `sync-prices`
2. Générer nouvelles données de prix
3. Insérer dans Supabase
4. Déclencher alertes si seuils franchis

---

## 📋 Étapes de setup

### **ÉTAPE 1 : Créer un repository GitHub**

```
1. Allez sur https://github.com/new
2. Créez un repository :
   - Name: agroprice
   - Description: "Agricultural price tracking app"
   - Visibility: Public (gratuit) ou Private
3. Cliquez "Create repository"
```

---

### **ÉTAPE 2 : Récupérer la clé Supabase SERVICE_ROLE**

**⚠️ IMPORTANT :** Cette clé donne accès complet à votre BD. À garder secrète !

```
1. Allez sur https://supabase.com
2. Votre projet → Settings → API
3. Cherchez "service_role" (clé privée)
4. Copiez-la (vous en aurez besoin pour l'étape 3)
```

---

### **ÉTAPE 3 : Ajouter le secret GitHub**

```
1. Allez sur votre repository GitHub
2. Settings → Secrets and variables → Actions
3. Cliquez "New repository secret"
4. Créez :
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: (Collez la clé service_role d'étape 2)
5. Cliquez "Add secret"
```

---

### **ÉTAPE 4 : Pousser le code sur GitHub**

Dans votre terminal Git Bash :

```bash
# 1. Naviguez au dossier agroprice
cd ~/onedrive/_xpnova/Agri-cameroun-chine/Selon\ Claude/agroprice

# 2. Initialisez git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit - AgriPrice Phase 1"

# 3. Ajoutez le remote GitHub
git remote add origin https://github.com/YOUR_USERNAME/agroprice.git

# 4. Poussez le code
git branch -M main
git push -u origin main
```

---

### **ÉTAPE 5 : Vérifier que le workflow fonctionne**

```
1. Allez sur votre repository GitHub
2. Onglet "Actions"
3. Vous devriez voir "Sync Prices - Hourly" workflow
4. Cliquez sur "Run workflow" → "Run workflow"
5. Attendez 1-2 minutes
6. Vous devriez voir ✅ Success
```

---

## ✅ Checklist

- [ ] Repository GitHub créé
- [ ] Service role key récupérée de Supabase
- [ ] Secret SUPABASE_SERVICE_ROLE_KEY ajouté à GitHub
- [ ] Code poussé sur GitHub (git push)
- [ ] Workflow visible dans Actions
- [ ] Test manual du workflow réussi (✅ Success)

---

## 📊 Résultat

Une fois configuré, **toutes les heures** :

```
00:00 → Sync exécuté
01:00 → Sync exécuté
02:00 → Sync exécuté
...
23:00 → Sync exécuté
```

Vous verrez dans GitHub Actions → Sync Prices :
```
✅ Build 1 - Success
✅ Build 2 - Success
✅ Build 3 - Success
```

---

## 🔍 Déboguer

**Si workflow échoue :**

1. Allez sur Actions → Sync Prices - Hourly
2. Cliquez sur le run échoué
3. Vérifiez les logs
4. Erreurs courantes :
   - `401 Unauthorized` → Clé SECRET_ROLE_KEY mauvaise
   - `404 Not Found` → URL Edge Function incorrecte
   - `Connection timeout` → Réseau GitHub

---

## 📌 Notes

- Les syncs s'exécutent en UTC (attention au décalage horaire)
- Vous pouvez modifier le schedule (voir `cron` dans `.github/workflows/sync-prices.yml`)
- Vous pouvez exécuter manuellement : Actions → Sync Prices → "Run workflow"
- GitHub Actions est gratuit pour les repos publics

---

## 🚀 Prochaines étapes

1. ✅ Repository créé
2. ✅ Secrets configurés
3. ✅ Workflow en place
4. → Phase 2 : Recherche & Filtres avancés
