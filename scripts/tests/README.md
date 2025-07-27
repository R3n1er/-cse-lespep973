# Tests et Scripts de Développement

Ce dossier contient tous les scripts de test et de développement pour l'application CSE Les PEP 973.

## 📁 Structure

```
scripts/tests/
├── README.md                 # Ce fichier
├── run-all-tests.ts         # Script principal pour exécuter tous les tests
├── test-auth.ts             # Test d'authentification Supabase
├── test-rls-fix.ts          # Test des politiques RLS
├── test-redirect.ts         # Test de redirection après connexion
├── test-ui-flow.ts          # Test du flux interface utilisateur
├── test-application.ts      # Test complet de l'application
└── clear-clerk-cookies.ts   # Nettoyage des cookies Clerk
```

## 🚀 Utilisation

### Exécuter tous les tests

```bash
npm run test-all
```

### Tests individuels

```bash
# Test d'authentification
npm run test-auth

# Test des politiques RLS
npm run test-rls-fix

# Test de redirection
npm run test-redirect

# Test du flux UI
npm run test-ui-flow

# Nettoyage des cookies Clerk
npm run clear-cookies
```

## 📋 Description des Tests

### 🔐 `test-auth.ts`

- **Objectif** : Vérifier l'authentification Supabase
- **Fonctionnalités testées** :
  - Connexion avec identifiants valides
  - Récupération des données utilisateur
  - Déconnexion
- **Identifiants de test** : `user@toto.com` / `password123`

### 🛡️ `test-rls-fix.ts`

- **Objectif** : Vérifier les politiques Row Level Security
- **Fonctionnalités testées** :
  - Accès aux données utilisateur
  - Mise à jour des profils
  - Protection des données

### 🔄 `test-redirect.ts`

- **Objectif** : Vérifier la redirection après connexion
- **Fonctionnalités testées** :
  - Redirection vers le dashboard
  - Gestion des sessions

### 🖥️ `test-ui-flow.ts`

- **Objectif** : Tester le flux complet de l'interface utilisateur
- **Fonctionnalités testées** :
  - Navigation dans l'application
  - Responsive design
  - Interactions utilisateur

### 🧪 `test-application.ts`

- **Objectif** : Test complet de l'application
- **Fonctionnalités testées** :
  - Toutes les fonctionnalités principales
  - Intégration des modules
  - Performance

### 🧹 `clear-clerk-cookies.ts`

- **Objectif** : Nettoyer les cookies Clerk persistants
- **Utilisation** : Résoudre les conflits d'authentification
- **Instructions** : Fournit des instructions pour nettoyer manuellement les cookies

## 🔧 Configuration

### Variables d'environnement requises

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Dépendances

- `tsx` : Pour exécuter les scripts TypeScript
- `@supabase/supabase-js` : Client Supabase
- `dotenv` : Gestion des variables d'environnement

## 📊 Interprétation des Résultats

### ✅ Succès

- Tous les tests passent
- Aucune erreur détectée
- L'application est fonctionnelle

### ⚠️ Avertissements

- Certains tests échouent
- Vérifier les logs d'erreur
- Corriger les problèmes identifiés

### ❌ Échecs

- Tests critiques en échec
- Problèmes d'authentification ou de base de données
- Nécessite une intervention

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de connexion Supabase**

   - Vérifier les variables d'environnement
   - Tester la connexion manuellement

2. **Cookies Clerk persistants**

   - Exécuter `npm run clear-cookies`
   - Nettoyer manuellement dans le navigateur

3. **Erreurs RLS**

   - Vérifier les politiques de base de données
   - Exécuter `npm run fix-rls`

4. **Tests qui échouent**
   - Vérifier les logs d'erreur
   - S'assurer que l'application est démarrée
   - Vérifier la connectivité réseau

## 📝 Ajout de Nouveaux Tests

Pour ajouter un nouveau test :

1. Créer le fichier dans `scripts/tests/`
2. Ajouter le script dans `package.json`
3. Mettre à jour `run-all-tests.ts`
4. Documenter dans ce README

## 🔄 Maintenance

- Exécuter les tests régulièrement
- Mettre à jour les identifiants de test si nécessaire
- Vérifier la compatibilité avec les nouvelles versions
- Maintenir la documentation à jour
