# 🔧 Guide de Correction RLS - CSE Les PEP 973

## 🚨 **Problème Identifié**

- **Erreur** : `infinite recursion detected in policy for relation "users"`
- **Impact** : Empêche l'accès aux données utilisateur après authentification
- **Cause** : Politiques RLS mal configurées sur la table `users`

---

## 📋 **Solution : Correction Manuelle via Dashboard Supabase**

### **Étape 1 : Accéder au Dashboard Supabase**

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Connectez-vous à votre compte
3. Sélectionnez le projet **CSE Les PEP 973**

### **Étape 2 : Ouvrir l'Éditeur SQL**

1. Dans le menu de gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur **"New query"** pour créer une nouvelle requête

### **Étape 3 : Exécuter le Script de Correction**

Copiez et collez le script suivant dans l'éditeur SQL :

```sql
-- Script de correction RLS pour CSE Les PEP 973
-- Date: 27 Janvier 2025

-- 1. Désactiver temporairement RLS sur users pour éviter la récursion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Supprimer les politiques problématiques
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 3. Créer une politique simple et sécurisée
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 4. Réactiver RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. Vérification
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
```

### **Étape 4 : Exécuter le Script**

1. Cliquez sur le bouton **"Run"** (▶️) dans l'éditeur SQL
2. Attendez que l'exécution se termine
3. Vérifiez les résultats dans la section "Results"

### **Étape 5 : Vérifier la Correction**

Vous devriez voir dans les résultats :

- `ALTER TABLE` : Confirmation de désactivation/réactivation RLS
- `DROP POLICY` : Confirmation de suppression des politiques
- `CREATE POLICY` : Confirmation de création des nouvelles politiques
- `SELECT` : Liste des politiques actives sur la table `users`

---

## 🧪 **Test de la Correction**

### **Test Automatique**

```bash
# Exécuter le test d'authentification
npm run test-auth
```

### **Test Manuel**

1. Allez sur http://localhost:3000
2. Connectez-vous avec :
   - **Email** : `user@toto.com`
   - **Mot de passe** : `password123`
3. Vérifiez que vous pouvez accéder au dashboard
4. Vérifiez que les données utilisateur s'affichent correctement

---

## 🔍 **Vérification des Résultats**

### **Résultats Attendus**

- ✅ **Authentification** : Connexion réussie
- ✅ **Accès aux données** : Récupération du profil utilisateur
- ✅ **Navigation** : Accès au dashboard sans erreur
- ✅ **Affichage** : Données utilisateur visibles

### **Messages de Succès**

```
✅ Connexion réussie!
✅ Utilisateur récupéré avec succès
✅ Accès à la table users réussi
```

---

## 🚨 **En Cas de Problème**

### **Si l'erreur persiste**

1. Vérifiez que le script SQL s'est bien exécuté
2. Vérifiez les politiques dans la section "Authentication" > "Policies"
3. Essayez de désactiver complètement RLS temporairement :

```sql
-- Désactiver RLS complètement (temporaire)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### **Si vous ne pouvez pas accéder au dashboard**

1. Vérifiez les logs du serveur de développement
2. Vérifiez la console du navigateur
3. Testez avec `npm run test-auth`

---

## 📊 **Mise à Jour du TODO**

Une fois la correction appliquée, mettez à jour le fichier TODO :

```bash
# Marquer la tâche comme complétée
npm run update-todo report
```

Puis modifiez manuellement dans `TODO.md` :

- [x] **Correction des politiques RLS** ✅
- [x] **Test de l'authentification** ✅

---

## 🔗 **Liens Utiles**

- **Dashboard Supabase** : [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **Documentation RLS** : [https://supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security)
- **Application locale** : http://localhost:3000

---

## 📞 **Support**

Si vous rencontrez des difficultés :

1. Vérifiez les logs d'erreur
2. Consultez la documentation Supabase
3. Testez avec les scripts fournis

---

**Dernière mise à jour** : 27 Janvier 2025  
**Statut** : ⚠️ En attente de correction manuelle
