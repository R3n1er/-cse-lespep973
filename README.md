# CSE LES PEP GUYANE - Application Portail Web de Gestion

## 🎯 **État Actuel du Projet**

### **Phase 1 : MVP - En Cours de Développement** ✅

L'application est actuellement en **Phase 1** de développement avec les fonctionnalités suivantes :

#### **✅ Modules Implémentés**

**🔐 Authentification et Sécurité**

- Authentification Supabase avec JWT
- Gestion des rôles utilisateurs
- Middleware sécurisé avec gestion des rôles
- Politiques RLS (Row Level Security)
- Formulaires de connexion et inscription

**📝 Blog et Communication**

- Système d'articles avec catégorisation
- Commentaires avec réponses et modération
- Système de likes/réactions temps réel
- Articles similaires (algorithme de recommandations)
- Newsletter avec gestion des abonnements

**🎨 Interface Utilisateur**

- Design System moderne (shadcn/ui + Tailwind CSS)
- Layouts responsives (mobile-first)
- Composants TypeScript typés
- Navigation moderne (Next.js 15 App Router)

**🗄️ Base de Données**

- Schéma PostgreSQL optimisé avec index
- Migrations versionnées
- Types auto-générés TypeScript/Supabase
- Politiques de sécurité RLS

#### **🚀 Modules en Développement (Prochaines Étapes)**

**🏠 Dashboard Utilisateur**

- Tableau de bord personnalisé
- Gestion de profil utilisateur
- Historique des activités

#### **📋 Modules Planifiés**

**🎫 Gestion des Tickets**

- Catalogue de tickets (cinéma, loisirs, transport)
- Système de commande avec panier
- Gestion des stocks et disponibilité
- Distribution et suivi

**💰 Remboursements**

- Formulaire de demande avec upload
- Workflow de validation (Gestionnaire → Trésorerie)
- Calcul automatique (50% plafonné à 200€/an)
- Suivi temps réel

**📊 Sondages et Questionnaires**

- Création de sondages personnalisés
- Distribution et notifications
- Analyse des résultats
- Respect RGPD

**⚙️ Administration**

- Interface d'administration complète
- Import Excel des bénéficiaires
- Reporting avancé
- Audit et logs

## 🏗️ **Architecture Technique**

### **Stack Actuelle**

```typescript
Frontend: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
Backend: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
Auth: Supabase Auth + JWT + RLS
Déploiement: Vercel + GitHub Actions
```

### **Évolution Future - Architecture Hybride** 🚀

**Phase 4 (T2 2026) :** Supabase + Neon

- **Supabase** : Écosystème complet (Auth, Storage, Realtime)
- **Neon** : Analytics complexes et tableaux de bord
- **Synchronisation** : Temps réel entre les services

## 🚀 **Installation et Démarrage**

### **Prérequis**

- Node.js 18+
- npm ou yarn
- Compte Supabase

### **Installation**

1. **Cloner le projet**

```bash
git clone https://github.com/R3n1er/-cse-lespep973.git
cd cse-lespep973
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

```bash
cp env.example .env.local
# Éditer .env.local avec vos clés
```

4. **Démarrer le serveur de développement**

```bash
npm run dev
```

### **Variables d'Environnement Requises**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 📊 **Métriques de Développement**

| Métrique                 | Valeur      | Status |
| ------------------------ | ----------- | ------ |
| **Modules implémentés**  | 4/8 (50%)   | ✅     |
| **Pages fonctionnelles** | 6/15 (40%)  | 🚀     |
| **Tests de couverture**  | 0%          | 📋     |
| **Performance**          | Optimisé    | ✅     |
| **Accessibilité**        | WCAG 2.1 AA | ✅     |
| **SEO**                  | Optimisé    | ✅     |

## 🎯 **Roadmap**

### **Phase 1 : MVP (T3 2025)** - ✅ En cours

- Authentification et gestion des profils
- Blog avec fonctionnalités essentielles
- Interface utilisateur moderne

### **Phase 2 : Fonctionnalités Avancées (T4 2025)** - 📋 Planifié

- Dashboard utilisateur
- Système de tickets
- Remboursements
- Sondages et questionnaires

### **Phase 3 : Optimisation et Extensions (T1 2026)** - 📋 Planifié

- Application mobile (PWA)
- Intégration de paiements
- Billetterie électronique

### **Phase 4 : Architecture Hybride (T2 2026)** - 🚀 Futur

- Analytics avancés avec Neon
- Tableaux de bord administratifs
- Optimisation des coûts

## 🔧 **Scripts Disponibles**

### **Scripts de Développement**

```bash
npm run dev          # Démarrage en développement
npm run build        # Build de production
npm run start        # Démarrage en production
npm run lint         # Vérification du code
```

### **Scripts d'Authentification et Utilisateurs**

```bash
npm run create-user  # Créer un nouvel utilisateur via API Supabase
npm run update-user  # Mettre à jour le mot de passe d'un utilisateur existant
npm run test-auth    # Tester l'authentification avec un utilisateur
```

### **Utilisation des Scripts d'Utilisateurs**

#### **Créer un Utilisateur de Test**

```bash
# Créer un nouvel utilisateur avec mot de passe
npm run create-user

# L'utilisateur sera créé avec :
# - Email: user@toto.com
# - Mot de passe: password123
# - Rôle: salarie
```

#### **Mettre à Jour un Utilisateur Existant**

```bash
# Mettre à jour le mot de passe d'un utilisateur existant
npm run update-user

# Utile si l'utilisateur existe déjà dans Supabase
# mais n'a pas de mot de passe configuré
```

#### **Tester l'Authentification**

```bash
# Tester la connexion avec les identifiants
npm run test-auth

# Vérifie :
# - Connexion réussie
# - Récupération de l'utilisateur
# - Accès à la table users
# - Déconnexion
```

### **Identifiants de Test par Défaut**

```bash
Email: user@toto.com
Mot de passe: password123
Rôle: salarie
```

**🌐 Testez la connexion sur :** http://localhost:3000 (ou 3001 si le port 3000 est occupé)

## 🧪 **Tests et Développement**

### **Test de l'Authentification**

1. **Démarrer l'application** :

   ```bash
   npm run dev
   ```

2. **Créer un utilisateur de test** (si nécessaire) :

   ```bash
   npm run create-user
   ```

3. **Tester l'authentification** :

   ```bash
   npm run test-auth
   ```

4. **Accéder à l'interface** :
   - Ouvrez http://localhost:3000 (ou 3001)
   - Connectez-vous avec `user@toto.com` / `password123`
   - Explorez le dashboard

### **Workflow de Test Complet**

```bash
# 1. Installation et configuration
npm install
cp env.example .env.local
# Éditer .env.local avec vos clés Supabase

# 2. Création d'un utilisateur de test
npm run create-user

# 3. Test de l'authentification
npm run test-auth

# 4. Démarrage de l'application
npm run dev

# 5. Test de l'interface utilisateur
# Ouvrir http://localhost:3000 et se connecter
```

### **Dépannage**

#### **Erreurs Courantes**

- **"Variables d'environnement manquantes"** → Vérifiez votre fichier `.env.local`
- **"Utilisateur déjà existant"** → Utilisez `npm run update-user` au lieu de `create-user`
- **"Erreur de connexion"** → Vérifiez vos clés Supabase dans `.env.local`

#### **Vérification de la Configuration**

```bash
# Vérifier que les variables sont chargées
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 📁 **Structure du Projet**

```
src/
├── app/                 # Pages Next.js 15 (App Router)
│   ├── (auth)/         # Routes d'authentification
│   ├── (dashboard)/    # Routes du dashboard
│   ├── (public)/       # Routes publiques
│   ├── blog/           # Blog et articles
│   └── newsletter/     # Newsletter
├── components/         # Composants React
│   ├── ui/            # Composants UI (shadcn/ui)
│   ├── blog/          # Composants spécifiques au blog
│   ├── forms/         # Formulaires
│   └── layout/        # Layouts
├── lib/               # Utilitaires et configuration
│   ├── supabase/      # Configuration Supabase
│   ├── utils/         # Fonctions utilitaires
│   └── data/          # Données mockées
└── types/             # Types TypeScript
```

## 🤝 **Contribution**

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 **Licence**

Ce projet est développé pour le CSE Les PEP 973.

## 📞 **Support**

Pour toute question ou support, contactez l'équipe technique du CSE Les PEP 973.

---

**Dernière mise à jour :** 27 Janvier 2025  
**Version :** 2.2  
**Statut :** Phase 1 - Développement actif 🚀
