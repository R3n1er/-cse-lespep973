# 📝 Scripts d'Utilisateurs - CSE Les PEP 973

## 🎯 **Vue d'Ensemble**

Ce document décrit les scripts automatisés pour la gestion des utilisateurs dans l'application CSE Les PEP 973. Ces scripts facilitent le développement et les tests en permettant de créer, mettre à jour et tester des utilisateurs via l'API Supabase.

## 🔧 **Scripts Disponibles**

### **1. Création d'Utilisateur**

```bash
npm run create-user
```

**Fonction :** Crée un nouvel utilisateur avec mot de passe via l'API Supabase.

**Utilisateur créé par défaut :**

- **Email :** `user@toto.com`
- **Mot de passe :** `password123`
- **Rôle :** `salarie`
- **Statut :** Actif et confirmé

**Fichier :** `scripts/create-user.ts`

### **2. Mise à Jour d'Utilisateur**

```bash
npm run update-user
```

**Fonction :** Met à jour le mot de passe d'un utilisateur existant.

**Cas d'usage :**

- Utilisateur créé manuellement dans Supabase sans mot de passe
- Réinitialisation de mot de passe pour tests
- Activation d'un compte existant

**Fichier :** `scripts/update-user-password.ts`

### **3. Test d'Authentification**

```bash
npm run test-auth
```

**Fonction :** Teste le workflow complet d'authentification.

**Tests effectués :**

- ✅ Connexion avec email/mot de passe
- ✅ Récupération des données utilisateur
- ✅ Accès à la table `users`
- ✅ Déconnexion

**Fichier :** `scripts/test-auth.ts`

## 🚀 **Workflow de Développement**

### **Étape 1 : Configuration**

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp env.example .env.local

# Éditer .env.local avec vos clés Supabase
```

### **Étape 2 : Création d'Utilisateur**

```bash
# Créer un utilisateur de test
npm run create-user
```

**Sortie attendue :**

```
🚀 Création de l'utilisateur user@toto.com...
✅ Utilisateur créé avec succès!
📧 Email: user@toto.com
🆔 ID: d4871481-52c3-485d-8987-79ebbcbc1680
✅ Utilisateur ajouté à la table users
👤 Rôle: salarie

🎉 Utilisateur prêt pour les tests!
📝 Identifiants de connexion:
   Email: user@toto.com
   Mot de passe: password123
```

### **Étape 3 : Test d'Authentification**

```bash
# Tester l'authentification
npm run test-auth
```

**Sortie attendue :**

```
🧪 Test d'authentification...
📧 Email: user@toto.com
🔑 Mot de passe: password123

🔄 Tentative de connexion...
✅ Connexion réussie!
👤 Utilisateur: user@toto.com
🆔 ID: d4871481-52c3-485d-8987-79ebbcbc1680

🔄 Test de récupération de l'utilisateur...
✅ Utilisateur récupéré avec succès

🔄 Test de déconnexion...
✅ Déconnexion réussie

🎉 Tous les tests d'authentification sont passés!
```

### **Étape 4 : Test de l'Interface**

```bash
# Démarrer l'application
npm run dev
```

**Accès :** http://localhost:3000 (ou 3001 si le port 3000 est occupé)

## 🔍 **Dépannage**

### **Erreurs Courantes**

#### **1. Variables d'Environnement Manquantes**

```bash
❌ Variables d'environnement manquantes!
Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies dans .env.local
```

**Solution :**

```bash
# Vérifier le fichier .env.local
cat .env.local

# Vérifier les variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

#### **2. Utilisateur Déjà Existant**

```bash
❌ Erreur lors de la création: A user with this email address has already been registered
```

**Solution :**

```bash
# Utiliser le script de mise à jour
npm run update-user
```

#### **3. Erreur de Connexion**

```bash
❌ Erreur de connexion: Invalid login credentials
```

**Solutions :**

1. Vérifier que l'utilisateur existe
2. Vérifier le mot de passe
3. Réexécuter `npm run update-user`

### **Vérification de la Configuration**

#### **1. Vérifier les Clés Supabase**

```bash
# Dans votre dashboard Supabase
# Settings → API
# Copier :
# - Project URL → NEXT_PUBLIC_SUPABASE_URL
# - anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
# - service_role secret → SUPABASE_SERVICE_ROLE_KEY
```

#### **2. Vérifier l'Utilisateur dans Supabase**

```bash
# Dans votre dashboard Supabase
# Authentication → Users
# Vérifier que user@toto.com existe et est confirmé
```

## 📋 **Personnalisation**

### **Modifier les Identifiants par Défaut**

Éditez les fichiers de scripts pour changer les identifiants :

```typescript
// Dans scripts/create-user.ts
const { data, error } = await supabase.auth.admin.createUser({
  email: "votre-email@example.com", // ← Modifier ici
  password: "votre-mot-de-passe", // ← Modifier ici
  email_confirm: true,
  user_metadata: {
    first_name: "Votre", // ← Modifier ici
    last_name: "Nom", // ← Modifier ici
    matricule: "VOTRE001", // ← Modifier ici
  },
});
```

### **Créer Plusieurs Utilisateurs**

Créez un script personnalisé :

```typescript
// scripts/create-multiple-users.ts
const users = [
  { email: "user1@example.com", password: "pass1", role: "salarie" },
  { email: "user2@example.com", password: "pass2", role: "gestionnaire" },
  { email: "admin@example.com", password: "admin123", role: "admin" },
];

for (const user of users) {
  // Logique de création
}
```

## 🔒 **Sécurité**

### **Bonnes Pratiques**

1. **Ne jamais commiter** les fichiers `.env.local`
2. **Utiliser des mots de passe forts** en production
3. **Limiter l'accès** aux clés `service_role`
4. **Supprimer les utilisateurs de test** après utilisation

### **Variables d'Environnement Sensibles**

```bash
# .env.local (NE PAS COMMITER)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici  # ← Très sensible !
```

## 📚 **Références**

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [API Supabase Admin](https://supabase.com/docs/reference/javascript/auth-admin)
- [Variables d'Environnement Next.js](https://nextjs.org/docs/basic-features/environment-variables)

## 🤝 **Support**

Pour toute question sur les scripts d'utilisateurs :

1. Vérifiez ce document
2. Consultez les logs d'erreur
3. Vérifiez la configuration Supabase
4. Contactez l'équipe technique

---

**Dernière mise à jour :** 27 Janvier 2025  
**Version :** 1.0  
**Auteur :** Équipe Technique CSE Les PEP 973
