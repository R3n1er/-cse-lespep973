# CSE Les PEP 973 - Application Web de Gestion

Application web pour la gestion des activités du Comité Social et Économique (CSE) des PEP 973.

## Technologies utilisées

- **Frontend** : Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend** : Supabase (PostgreSQL, Auth, Storage)
- **Déploiement** : Vercel

## Fonctionnalités

- **Espace Blog** : Publication d'articles et d'actualités
- **Vitrine du CSE** : Présentation du CSE, ses membres et ses rôles
- **Gestion des Tickets** : Vente et distribution de tickets pour événements
- **Gestion des Bénéficiaires** : Import Excel et gestion des profils
- **Publication d'Actualités et Questionnaires** : Diffusion d'informations et enquêtes
- **Remboursements Conditionnels** : Remboursement de 50% (plafonné à 200€/an)
- **Authentification Sécurisée** : Connexion avec 2FA
- **Espace Profil Salarié** : Gestion des informations personnelles
- **Administration Fonctionnelle** : Gestion des règles métiers
- **Reporting et Tableau de Bord** : Indicateurs et statistiques

## Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Compte Vercel (pour le déploiement)

## Installation

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/votre-organisation/cse-lespep973.git
   cd cse-lespep973
   ```

2. Installer les dépendances :

   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configurer les variables d'environnement :

   - Copier le fichier `.env.local.example` en `.env.local`
   - Remplir les variables avec vos informations Supabase

4. Lancer le serveur de développement :

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Configuration de Supabase

1. Créer un projet sur [Supabase](https://supabase.com)
2. Exécuter les migrations SQL dans l'éditeur SQL de Supabase :
   - Utiliser le fichier `supabase/migrations/20250725_initial_schema.sql`
3. Configurer l'authentification :
   - Activer l'authentification par email/mot de passe
   - Activer l'authentification avec Google
   - Configurer les redirections OAuth

## Structure du projet

```
/
├── public/              # Fichiers statiques
├── src/
│   ├── app/             # Routes et pages Next.js
│   │   ├── (auth)/      # Routes d'authentification
│   │   ├── (public)/    # Pages publiques
│   │   └── (dashboard)/ # Interface d'administration
│   ├── components/      # Composants React
│   │   ├── ui/          # Composants UI (shadcn)
│   │   ├── forms/       # Composants de formulaires
│   │   └── layout/      # Composants de mise en page
│   ├── lib/             # Utilitaires et configuration
│   │   └── supabase/    # Configuration Supabase
│   └── types/           # Types TypeScript
└── supabase/
    └── migrations/      # Migrations SQL
```

## Rôles utilisateurs

- **Salarié** : Accès aux fonctionnalités de base (tickets, remboursements, profil)
- **Gestionnaire** : Gestion des tickets, validation des remboursements
- **Trésorerie** : Validation finale des remboursements
- **Administrateur** : Accès complet à toutes les fonctionnalités

## Déploiement

### Déploiement sur Vercel

1. Connecter votre dépôt GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel
3. Déployer l'application

### Configuration des variables d'environnement

- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme de votre projet Supabase
- `NEXT_PUBLIC_APP_URL` : URL de votre application déployée

## Maintenance et mises à jour

- Mettre à jour les dépendances régulièrement
- Vérifier les mises à jour de sécurité
- Sauvegarder la base de données régulièrement

## Licence

Ce projet est sous licence [MIT](LICENSE).

## Contact

Pour toute question ou suggestion, veuillez contacter l'équipe de développement à l'adresse suivante : dev@lespep973.org
# -cse-lespep973
# -cse-lespep973
