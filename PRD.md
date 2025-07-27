# Document des Exigences Produit (PRD)

# CSE LES PEP 973 - Application Portail Web de Gestion

**Version:** 2.2  
**Date:** 27 Janvier 2025  
**Auteur:** Équipe Technique CSE Les PEP 973

**Mise à jour :** Migration de Clerk vers Supabase Auth + Ajout des scripts d'authentification et de test

## Table des matières

0. [Résumé Exécutif](#0-résumé-exécutif) ⭐ **NOUVEAU**
1. [Objectifs](#1-objectifs)
2. [Personas Utilisateurs](#2-personas-utilisateurs)
3. [Spécifications Fonctionnelles](#3-spécifications-fonctionnelles)
4. [Architecture Technique](#4-architecture-technique)
5. [Expérience Utilisateur (UX)](#5-expérience-utilisateur-ux)
6. [Règles Métiers et Workflows](#6-règles-métiers-et-workflows)
7. [Administration et Évolutivité](#7-administration-et-évolutivité)
8. [Sécurité et Conformité RGPD](#8-sécurité-et-conformité-rgpd)
9. [Reporting et Tableaux de Bord](#9-reporting-et-tableaux-de-bord)
10. [Gestion du Changement](#10-gestion-du-changement)
11. [Exigences Non-Fonctionnelles](#11-exigences-non-fonctionnelles)
12. [Gestion Proactive des Risques](#12-gestion-proactive-des-risques)
13. [Roadmap & Livrables](#13-roadmap--livrables)
14. [État d'Implémentation](#14-état-dimplémentation) ⭐ **NOUVEAU**

---

## 0. Résumé Exécutif

### 0.1 Stratégie Technique Évolutive

L'application CSE Les PEP 973 suit une **stratégie d'architecture évolutive** en 4 phases :

**Phase 1 (Actuelle) :** Supabase uniquement ✅

- Développement rapide avec écosystème complet
- Authentification, stockage, realtime intégrés
- Base solide pour les fonctionnalités core

**Phase 2 (Développement) :** Fonctionnalités avancées

- Dashboard utilisateur, tickets, remboursements
- Sondages et questionnaires
- Interface d'administration

**Phase 3 (Production) :** Optimisation et extensions

- PWA mobile, paiements en ligne
- Billetterie électronique
- Fonctionnalités communautaires

**Phase 4 (Évolution) :** Architecture hybride Supabase + Neon 🚀

- **Supabase** : Écosystème complet (Auth, Storage, Realtime)
- **Neon** : Analytics complexes et tableaux de bord
- **Synchronisation** : Temps réel entre les deux services
- **Optimisation** : Performance et coûts optimisés

### 0.2 Avantages de l'Approche Hybride

| Aspect              | Supabase  | Neon         | Avantage Hybride                   |
| ------------------- | --------- | ------------ | ---------------------------------- |
| **Développement**   | Rapide    | Complexe     | Développement rapide + Performance |
| **Coût**            | Fixe      | À l'usage    | Optimisation des coûts             |
| **Performance**     | Bonne     | Excellente   | Performance maximale               |
| **Fonctionnalités** | Complètes | Spécialisées | Écosystème complet + Analytics     |

### 0.3 Migration Authentification - Clerk → Supabase

**Raison de la migration :**

- Simplification de l'architecture technique
- Réduction des dépendances externes
- Meilleure intégration avec l'écosystème Supabase
- Contrôle total sur l'expérience utilisateur

**Avantages de Supabase Auth :**

- Authentification native avec JWT
- Gestion des rôles intégrée
- Politiques RLS (Row Level Security)
- Interface personnalisable
- Pas de dépendance tierce

**Outils de développement créés :**

- Scripts automatisés pour la création d'utilisateurs
- Tests d'authentification automatisés
- Workflow de développement standardisé
- Documentation complète des processus

### 0.4 Critères de Passage à la Phase 4

- 500+ utilisateurs actifs
- Besoin de rapports complexes
- Optimisation des coûts nécessaire
- Performance des requêtes critique

---

## 1. Objectifs

### 1.1 Vision du Produit

L'application web du CSE de l'association LES PEP GUYANE vise à moderniser et centraliser la gestion des activités du Comité Social et Économique. Cette plateforme permettra d'améliorer la communication interne, de simplifier les processus administratifs et d'offrir une meilleure expérience aux salariés bénéficiaires.

### 1.2 Objectifs Métier

| Objectif                                                | Description                                                                                  | KPI                                      | Statut        |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------- |
| Améliorer l'engagement des salariés                     | Augmenter la participation aux activités et événements du CSE                                | Taux de participation +30%               | 🚀 En cours   |
| Optimiser la gestion des tickets de cinéma              | Réduire le temps de traitement des commandes de tickets de cinéma                            | Temps moyen réduit de 75%                | 📋 Planifié   |
| Simplifier les remboursements des activités culturelles | Dématérialiser le processus de demande et validation de remboursement d'activités culturelle | Délai de traitement < 5 jours            | 📋 Planifié   |
| Centraliser la communication                            | Créer un point d'accès unique aux informations du CSE                                        | 90% des communications via la plateforme | ✅ Implémenté |

### 1.3 Critères de Succès

- Adoption par 85% des salariés dans les 3 premiers mois
- Réduction de 70% des tâches administratives manuelles
- Satisfaction utilisateur > 4.2/5 (enquête post-déploiement)
- Conformité RGPD complète ✅ **Implémenté**

---

## 2. Personas Utilisateurs

### 2.1 Salarié Standard

**Profil:** Employé des PEP 973 avec accès aux avantages du CSE  
**Besoins:**

- Consulter les actualités et événements du CSE ✅ **Implémenté**
- Commander des tickets de cinéma en Guyane (Cinéma AGORA (Cayenne) et Uranus (Kourou)) 📋 **Planifié**
- Soumettre des demandes de remboursement ( Remboursement d'entrée pour des activités culturelles déjà réalisées.) 📋 **Planifié**
- Mettre à jour ses informations personnelles (Ici **uniquement** le nombre des enfants, les dates de naissance des enfants, le numéro de téléphone et l'adresse mail personnel.)📋 **Planifié**

**Parcours utilisateur:**

1. L'utilisateur arrive sur une page de login. **Impléméneté**
2. Se connecte avec ses identifiants professionnels ✅ **Implémenté**
3. Consulte les actualités récentes du blog une fois qu'il est connecté à son espace personnel
4. Accède à son espace personnel pour suivre ses demandes Ces demandes de remboursement ou ces demandes de communication avec les membres gestionnaire du CSE. 📋 **Planifié**
5. Commande des tickets tickets cinéma ou soumet une demande de remboursement pour participation à un évènement culturel. Le salarié fournit la preuve de participation et un remboursement à hauteur de 50%.📋 **Planifié**

### 2.2 Salarié Très Occasionnel

**Profil:** Employé utilisant rarement les services du CSE  
**Besoins:**

- Interface simple et intuitive ✅ **Implémenté**
- Accès rapide aux fonctionnalités essentielles ✅ **Implémenté**
- Processus simplifiés avec minimum d'étapes ✅ **Implémenté**
- Aide contextuelle facilement accessible 📋 **Planifié**

**Parcours utilisateur:**

1. Se connecte avec ses identifiants professionnels ✅ **Implémenté**
2. Accède directement à la fonctionnalité recherchée via le menu principal ✅ **Implémenté**
3. Complète rapidement sa demande avec assistance guidée 📋 **Planifié**
4. Reçoit une confirmation claire de son action ✅ **Implémenté**

### 2.3 Salarié Régulier

**Profil:** Employé utilisant fréquemment les services du CSE  
**Besoins:**

- Accès rapide à l'historique de ses demandes 📋 **Planifié**
- Suivi détaillé de ses commandes de tickets cinéma et demandes de remboursements 📋 **Planifié**
- Notifications personnalisées sur les nouveaux avantages ✅ **Implémenté (Newsletter)**
- Gestion efficace de son profil et préférences 📋 **Planifié**

**Parcours utilisateur:**

1. Se connecte avec ses identifiants professionnels ✅ **Implémenté**
2. Consulte son tableau de bord personnalisé 📋 **Planifié**

### 2.4 Gestionnaire CSE

**Profil:** Membre du CSE chargé de la gestion quotidienne  
**Besoins:**

- Gérer le stock de tickets de cinémas
- Valider les commandes de tickets de cinéma
- Examiner les demandes de remboursement
- Publier des actualités sur le blog
- Peut créer des enquetes de satisfactions et des sondages

**Parcours utilisateur:**

1. Se connecte avec ses identifiants renforcés (2FA)
2. Accède au tableau de bord administratif
3. Traite les demandes en attente
4. Gère les stocks et publie du contenu

### 2.5 Trésorier

**Profil:** Responsable financier du CSE (Trésorier et Trésorier Adjoint)
**Besoins:**

- Valider les remboursements
- Suivre les dépenses et le budget
- Générer des rapports financiers
- Définir les règles de remboursement

**Parcours utilisateur:**

1. Se connecte avec authentification renforcée
2. Accède au module financier
3. Valide les demandes de remboursement
4. Génère des rapports et ajuste les paramètres

### 2.6 Administrateur

**Profil:** Responsable technique de la plateforme  
**Besoins:**

- Gérer les utilisateurs et leurs droits
- Configurer les paramètres système
- Surveiller les performances
- Effectuer des sauvegardes et maintenance

**Parcours utilisateur:**

1. Se connecte avec droits d'administration
2. Accède à la console d'administration
3. Gère les comptes utilisateurs et les paramètres
4. Surveille les métriques système

### 2.7 Élu du CSE

**Profil:** Membre élu représentant les salariés  
**Besoins:**

- Accès aux informations globales d'utilisation
- Consultation des rapports périodiques
- Communication facilitée avec les salariés
- Suivi des indicateurs clés de performance

**Parcours utilisateur:**

1. Se connecte avec ses identifiants spécifiques
2. Consulte le tableau de bord des élus
3. Accède aux rapports et statistiques d'utilisation
4. Communique avec les salariés via la plateforme

---

## 3. Spécifications Fonctionnelles

### 3.1 Authentification et Gestion des Utilisateurs

#### 3.1.1 Inscription et Connexion (Mise à jour Juillet 2025)

- **Inscription** : Seuls les utilisateurs préalablement injectés via un fichier Excel transmis par le service RH peuvent activer leur compte directement. L’inscription libre est désactivée.
- **Demande d’accès** : Un utilisateur non injecté peut faire une demande d’accès en renseignant : nom, prénom, email personnel, établissement d’affectation (liste déroulante des établissements ADPEP GUYANE). Cette demande notifie les administrateurs pour validation manuelle.
- **Restriction de domaine** : L’authentification avec un email du domaine `lepep973.org` est interdite (sauf pour les administrateurs). Seuls les emails personnels (Gmail, Hotmail, etc.) sont autorisés pour l’authentification standard.
- **Double authentification (2FA)** : La double authentification est obligatoire pour tous les utilisateurs via Clerk.
- **Gestion des établissements** : La liste des établissements ADPEP GUYANE est proposée dans le formulaire de demande d’accès.

#### 3.1.2 Gestion des Profils

- Édition des informations personnelles
- Gestion des préférences de notification
- Historique des activités
- Gestion des rôles et permissions

### 3.2 Espace Blog et Communication

#### 3.2.1 Publication d'Articles

- Éditeur WYSIWYG avec support multimédia
- Catégorisation des articles
- Planification des publications
- Statistiques de lecture

#### 3.2.2 Questionnaires et Sondages

- Création de formulaires personnalisés
- Support de questions à choix multiples, texte libre
- Sondages anonymes ou nominatifs
- Analyse des résultats et exportation

### 3.3 Gestion des Tickets

#### 3.3.1 Catalogue de Tickets

- Affichage des tickets disponibles avec description
- Indication de stock en temps réel
- Filtrage par catégorie et prix
- Historique des achats précédents

#### 3.3.2 Processus de Commande

- Panier d'achat multi-tickets
- Validation des limites par utilisateur
- Confirmation par email
- Suivi de statut de commande

#### 3.3.3 Distribution et Gestion

- Génération de QR codes pour tickets électroniques
- Système de validation lors de la distribution
- Gestion des annulations et remboursements
- Rapports de vente et distribution

#### 3.3.4 Gestion Avancée des Stocks

- Liste d'attente automatique lorsque les stocks sont épuisés
- Notifications aux utilisateurs quand les tickets redeviennent disponibles
- Règles claires pour les annulations tardives
- Alertes automatiques pour réapprovisionnement des stocks critiques

### 3.4 Remboursements Conditionnels

#### 3.4.1 Soumission de Demandes

- Formulaire de demande avec upload de justificatifs
- Calcul automatique du montant remboursable (50%, max 200€/an)
- Suivi de l'historique des demandes
- Notifications de statut

#### 3.4.2 Processus de Validation

- Workflow à deux niveaux (gestionnaire puis trésorier)
- Interface d'examen des justificatifs
- Commentaires internes pour chaque demande
- Traçabilité des décisions

#### 3.4.3 Suivi Budgétaire

- Tableau de bord des remboursements par période
- Suivi des plafonds individuels
- Alertes de dépassement budgétaire
- Rapports financiers exportables

#### 3.4.4 Gestion des Cas Exceptionnels

- Interface dédiée pour les remboursements exceptionnels
- Traçabilité spécifique des exceptions validées
- Notification d'atteinte de plafond (à 80% du maximum annuel)
- Documentation des cas de force majeure

### 3.5 Administration et Paramétrage

#### 3.5.1 Gestion des Paramètres

- Configuration des règles de remboursement
- Définition des limites de commande
- Personnalisation de l'interface
- Gestion des notifications système

#### 3.5.2 Reporting et Analytics

- Tableaux de bord interactifs
- Métriques d'utilisation et engagement
- Rapports périodiques automatisés
- Export des données au format Excel/CSV

#### 3.5.3 Import de Données

- Import Excel des bénéficiaires
- Validation et gestion des erreurs (doublons, incohérences)
- Génération de rapports post-import
- Possibilité de rollback en cas d'erreur

---

## 4. Architecture Technique

### 4.1 Stack Technologique

#### 4.1.1 Frontend

- **Framework:** Next.js 15 avec App Router
- **Langage:** TypeScript
- **Librairie CSS:** React avec Tailwind CSS, DaisyUI
- **Component System** : Shadcn
- **Icones** : Lineicons, React Icons
- **Application mobile** : ReactNative, Expo
- **État:** React Context et SWR pour la gestion des données
- **Formulaires:** React Hook Form avec Zod pour la validation

#### 4.1.2 Backend

- **Infrastructure:** Supabase
- **Base de données:** PostgreSQL
- **Authentification:** Clerk
- **Stockage:** Supabase Storage pour les fichiers
- **Stockage des images:** Unpic IMG, Imgur, Aws S3
- **API:** REST via Supabase et API Routes Next.js

#### 4.1.3 Déploiement

- **Hébergement:** Vercel
- **CI/CD:** GitHub Actions
- **Monitoring:** Vercel Analytics et Sentry
- **Domaine et SSL:** Vercel avec certificats automatiques

### 4.2 Schéma de Base de Données

La base de données PostgreSQL est structurée autour des entités principales suivantes:

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o{ REIMBURSEMENTS : requests
    USERS ||--o{ BLOG_POSTS : authors
    TICKETS ||--o{ ORDERS : contains
    SURVEYS ||--o{ SURVEY_QUESTIONS : has
    SURVEYS ||--o{ SURVEY_RESPONSES : receives

    USERS {
        uuid id PK
        string email
        string first_name
        string last_name
        string matricule
        enum role
        boolean is_active
    }

    TICKETS {
        uuid id PK
        string name
        string description
        decimal price
        integer stock
        boolean is_active
    }

    ORDERS {
        uuid id PK
        uuid user_id FK
        uuid ticket_id FK
        integer quantity
        enum status
    }

    REIMBURSEMENTS {
        uuid id PK
        uuid user_id FK
        decimal amount
        string description
        string proof_url
        enum status
        uuid approved_by FK
    }

    BLOG_POSTS {
        uuid id PK
        string title
        text content
        string category
        uuid author_id FK
        boolean is_published
    }

    SURVEYS {
        uuid id PK
        string title
        string description
        boolean is_anonymous
        date start_date
        date end_date
    }
```

### 4.3 Sécurité et Contrôle d'Accès

- **Authentification:** Supabase Auth avec JWT et refresh tokens
- **Autorisation:** Row Level Security (RLS) au niveau base de données
- **Rôles:** Système de permissions basé sur les rôles (RBAC)
- **Protection des données:** Chiffrement en transit (HTTPS) et au repos
- **Validation:** Validation côté client et serveur avec schémas Zod

### 4.4 Intégrations

- **Email:** Mailgun pour les notifications
- **Stockage:** Supabase Storage et AWS S3 pour les pièces justificatives

### 4.5 Architecture Hybride Future (Phase 3) 🚀

#### 4.5.1 Stratégie d'Évolution

L'application évoluera vers une **architecture hybride Supabase + Neon** pour optimiser les performances et les coûts :

```mermaid
graph TB
    subgraph "Phase 1 - Actuelle"
        A[Next.js App] --> B[Supabase]
        B --> C[PostgreSQL + Auth + Storage]
    end

    subgraph "Phase 2 - Développement"
        A --> B
        A --> D[Neon Analytics]
        B --> C
        D --> E[PostgreSQL Serverless]
    end

    subgraph "Phase 3 - Production"
        A --> B
        A --> D
        B --> C
        D --> E
        F[Sync Service] --> B
        F --> D
    end
```

#### 4.5.2 Répartition des Responsabilités

| Service      | Responsabilités                                                                                                                              | Avantages                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Supabase** | • Authentification et autorisation<br>• Stockage de fichiers<br>• Realtime subscriptions<br>• Edge Functions<br>• Interface d'administration | • Écosystème complet<br>• Développement rapide<br>• Fonctionnalités avancées |
| **Neon**     | • Requêtes analytiques complexes<br>• Rapports de performance<br>• Tableaux de bord administratifs<br>• Branching pour développement         | • Performance optimale<br>• Coût à l'usage<br>• Scalabilité automatique      |

#### 4.5.3 Cas d'Usage Neon

**Analytics et Reporting :**

```sql
-- Rapport complexe des remboursements par utilisateur
SELECT
  u.first_name,
  COUNT(r.id) as total_requests,
  SUM(CASE WHEN r.status = 'approved' THEN r.amount ELSE 0 END) as total_approved,
  AVG(r.amount) as average_amount
FROM users u
LEFT JOIN reimbursements r ON u.id = r.user_id
WHERE r.created_at >= NOW() - INTERVAL '1 year'
GROUP BY u.id, u.first_name
HAVING COUNT(r.id) > 0
ORDER BY total_approved DESC;
```

**Tableaux de Bord Administratifs :**

- Statistiques d'engagement par catégorie
- Analyse des tendances de consommation
- Rapports de performance par établissement
- Métriques de satisfaction utilisateur

**Optimisations de Performance :**

- Requêtes complexes avec agrégations
- Jointures multiples sur grandes tables
- Analyses temporelles et géographiques
- Calculs de KPI en temps réel

#### 4.5.4 Synchronisation des Données

**Stratégie de Sync :**

- **Temps réel** : Webhooks Supabase → Neon
- **Périodique** : Sync automatique toutes les 5 minutes
- **À la demande** : Sync manuel pour les données critiques

**Gestion des Conflits :**

- Supabase comme source de vérité
- Neon en lecture seule pour les analytics
- Rollback automatique en cas d'erreur

#### 4.5.5 Migration Progressive

**Phase 1 (Actuelle) :** Supabase uniquement ✅
**Phase 2 (Développement) :** Ajout Neon pour analytics
**Phase 3 (Production) :** Architecture hybride complète

**Critères de Passage à la Phase 2 :**

- 500+ utilisateurs actifs
- Besoin de rapports complexes
- Optimisation des coûts nécessaire
- Performance des requêtes critique
- **Authentification:** Supabase Auth
- **Paiements:** Stripe

---

## 5. Expérience Utilisateur (UX)

### 5.1 Principes Directeurs UX

- **Simplicité:** Interfaces épurées et intuitives
- **Accessibilité:** Conformité WCAG 2.1 niveau AA
- **Cohérence:** Patterns d'interaction uniformes
- **Feedback:** Retour visuel immédiat pour chaque action
- **Efficacité:** Minimisation des étapes pour les tâches fréquentes

### 5.2 Parcours Utilisateurs Optimisés

#### 5.2.1 Accès Rapide aux Remboursements

1. Accès direct depuis le tableau de bord
2. Formulaire simplifié avec aide contextuelle
3. Upload de justificatifs par glisser-déposer
4. Confirmation immédiate et suivi de statut clair

#### 5.2.2 Suivi des Commandes de Tickets

1. Visualisation claire de l'historique des commandes
2. Filtrage par statut et date
3. Notifications automatiques de changement de statut
4. Accès direct aux tickets électroniques

#### 5.2.3 Gestion des Notifications

- Paramétrage fin des notifications par type
- Regroupement intelligent des notifications
- Choix du canal (email, in-app, SMS)
- Fréquence personnalisable (instantanée, quotidienne, hebdomadaire)

### 5.3 Livrables UX

- **Maquettes interactives:** Prototype Figma pour validation utilisateur
- **Guide de style:** Composants UI, typographie, couleurs, iconographie
- **Tests utilisateurs:** Sessions de test avec représentants de chaque persona
- **Heatmaps:** Analyse des interactions pour optimisation continue

---

## 6. Règles Métiers et Workflows

### 6.1 Règles Métiers Consolidées

#### 6.1.1 Gestion des Tickets

- Limite de commande: 5 tickets par type par mois par salarié
- Période d'annulation: Jusqu'à 30 jours avant l'événement
- Gestion des listes d'attente: Priorité par ordre chronologique
- Réapprovisionnement: Alerte automatique à 20% du stock restant

#### 6.1.2 Remboursements

- Taux standard: 50% du montant des activités éligibles
- Plafond annuel: 200€ par salarié par année civile
- Notification d'atteinte de plafond: Alerte à 80% (160€)
- Délai de soumission: Jusqu'à 3 mois après la date de l'activité

### 6.2 Workflows Métiers Critiques

#### 6.2.1 Validation des Remboursements

```mermaid
flowchart TD
    A[Soumission demande] --> B{Vérification complétude}
    B -->|Incomplet| C[Retour au salarié]
    C --> A
    B -->|Complet| D[Vérification gestionnaire]
    D -->|Rejeté| E[Notification rejet]
    D -->|Approuvé| F[Validation trésorier]
    F -->|Rejeté| G[Notification rejet]
    F -->|Approuvé| H[Remboursement validé]
    H --> I[Notification validation]

    %% Gestion des relances
    J[5 jours sans action] --> K[Relance automatique]
    K --> L[Notification responsable]
```

#### 6.2.2 Gestion des Commandes de Tickets

```mermaid
flowchart TD
    A[Commande ticket] --> B{Vérification stock}
    B -->|Stock insuffisant| C[Proposition liste d'attente]
    C -->|Acceptée| D[Ajout liste d'attente]
    C -->|Refusée| E[Fin processus]
    B -->|Stock disponible| F[Réservation temporaire]
    F --> G[Confirmation commande]
    G --> H[Génération ticket électronique]
    H --> I[Notification disponibilité]

    %% Gestion stock critique
    J[Stock < 20%] --> K[Alerte gestionnaire]
    K --> L[Décision réapprovisionnement]
```

### 6.3 Livrables Règles Métiers

- **Fiches métiers:** Documentation détaillée avec exemples concrets
- **Diagrammes BPMN:** Représentation visuelle des processus critiques
- **Matrice de décision:** Arbre de décision pour les cas particuliers
- **Guide administrateur:** Procédures de modification des règles métiers

---

## 7. Administration et Évolutivité

### 7.1 Interface d'Administration

- **Tableau de bord:** Vue d'ensemble des métriques clés
- **Gestion utilisateurs:** Création, modification, désactivation
- **Configuration système:** Paramètres globaux et par module
- **Logs système:** Suivi des actions et erreurs

### 7.2 Paramétrage Autonome

- **Règles métiers:** Interface de modification sans intervention technique
- **Formulaires:** Éditeur de champs et validation
- **Notifications:** Configuration des modèles et déclencheurs
- **Workflows:** Ajustement des étapes et approbations

### 7.3 Modularité

- **Activation/désactivation:** Contrôle individuel des modules
- **Dépendances:** Gestion claire des relations entre modules
- **Versions:** Possibilité de déploiement progressif des fonctionnalités
- **Extensions:** Architecture permettant l'ajout de modules personnalisés

### 7.4 Livrables Administration

- **Back-office simplifié:** Interface administrateur intuitive
- **Documentation vidéo:** Tutoriels pour les tâches administratives courantes
- **Guide PDF:** Manuel complet d'administration système
- **Formation:** Sessions dédiées pour les administrateurs

---

## 8. Sécurité et Conformité RGPD

### 8.1 Politique d'Accès aux Données

- **Matrice RBAC:** Définition précise des droits par rôle
- **Principe du moindre privilège:** Accès limité au strict nécessaire
- **Séparation des responsabilités:** Validation multi-niveaux pour actions sensibles
- **Journalisation:** Traçabilité complète des accès et modifications

### 8.2 Protection des Données Sensibles

- **Chiffrement:** Données personnelles et justificatifs chiffrés au repos
- **Anonymisation:** Options d'anonymisation pour les rapports
- **Accès restreint:** Contrôle strict des accès aux justificatifs
- **Durée de conservation:** Politique claire de rétention des données

### 8.3 Conformité RGPD

- **Consentement:** Gestion explicite des consentements utilisateurs
- **Droit à l'oubli:** Procédure automatisée de suppression des données
- **Portabilité:** Export des données personnelles au format standard
- **Registre de traitement:** Documentation complète des traitements de données

### 8.4 Livrables Sécurité et RGPD

- **Matrice RGPD:** Tableau Excel détaillant les traitements et conformité
- **Politique de confidentialité:** Document légal pour les utilisateurs
- **Procédures de sécurité:** Guide des bonnes pratiques pour administrateurs
- **Plan d'audit:** Calendrier des vérifications périodiques

---

## 9. Reporting et Tableaux de Bord

### 9.1 Tableaux de Bord Utilisateurs

- **Salarié:** Suivi des demandes, plafond de remboursement, tickets disponibles
- **Gestionnaire:** Demandes en attente, stocks critiques, activité récente
- **Trésorier:** État des remboursements, budget consommé, projections
- **Administrateur:** Métriques système, activité utilisateurs, performances

### 9.2 Rapports Automatisés

- **Rapports quotidiens:** Activité de la journée, alertes, tâches en attente
- **Rapports hebdomadaires:** Synthèse d'activité, tendances, prévisions
- **Rapports trimestriels:** Analyse approfondie pour les élus du CSE
- **Rapports annuels:** Bilan complet d'utilisation et recommandations

### 9.3 Métriques Clés

- **Engagement:** Taux d'utilisation par service, fréquence de connexion
- **Performance:** Temps de traitement, taux de validation, délais moyens
- **Satisfaction:** Feedback utilisateurs, taux de complétion, abandons
- **Financier:** Budget consommé, économies réalisées, projections

### 9.4 Livrables Reporting

- **Tableaux de bord interactifs:** Interfaces Power BI ou équivalent
- **Modèles de rapports:** Templates personnalisables par rôle
- **Documentation:** Guide d'interprétation des métriques
- **Formation:** Sessions d'analyse pour les décideurs

---

## 10. Gestion du Changement

### 10.1 Plan de Communication

- **Annonce préalable:** Communication progressive avant lancement
- **Présentation:** Webinaires de démonstration par module
- **Supports:** Vidéos tutorielles, guides PDF, infographies
- **Feedback:** Canaux dédiés pour questions et suggestions

### 10.2 Formation Utilisateurs

- **Sessions par profil:** Formation adaptée à chaque type d'utilisateur
- **Ateliers pratiques:** Exercices sur cas réels
- **Certification:** Validation des compétences pour administrateurs
- **Support continu:** Assistance post-formation

### 10.3 Adoption Progressive

- **Utilisateurs pilotes:** Groupe test représentatif
- **Déploiement par phase:** Introduction progressive des fonctionnalités
- **Période de transition:** Coexistence temporaire avec anciens systèmes
- **Mesure d'adoption:** Suivi des métriques d'utilisation et ajustements

### 10.4 Livrables Gestion du Changement

- **Kit de communication:** Emails types, affiches, présentations
- **FAQ dynamique:** Base de connaissances évolutive
- **Guide utilisateur:** Manuel complet par profil
- **Plan de formation:** Calendrier et contenu des sessions

---

## 11. Exigences Non-Fonctionnelles

### 11.1 Performance

- **Temps de chargement:** < 2 secondes pour la page d'accueil
- **Temps de réponse API:** < 500ms pour 95% des requêtes
- **Capacité:** Support de 500 utilisateurs simultanés
- **Optimisation:** Images optimisées, code minifié, lazy loading

### 11.2 Disponibilité et Fiabilité

- **SLA:** 99.9% de disponibilité
- **Sauvegarde:** Quotidienne avec rétention de 30 jours
- **Reprise après sinistre:** RTO < 4 heures, RPO < 24 heures
- **Monitoring:** Alertes en temps réel sur incidents

### 11.3 Sécurité et Conformité

- **RGPD:** Conformité complète (consentement, droit à l'oubli)
- **Audit:** Journalisation des actions sensibles
- **Vulnérabilités:** Scan régulier et correction prioritaire
- **Données sensibles:** Chiffrement des données personnelles

### 11.4 Accessibilité et Compatibilité

- **Accessibilité:** Conformité WCAG 2.1 niveau AA
- **Responsive:** Support mobile, tablette et desktop
- **Navigateurs:** Chrome, Firefox, Safari, Edge (2 dernières versions)
- **Offline:** Fonctionnalités de base disponibles hors connexion

### 11.5 Maintenance et Évolutivité

- **Code:** Documentation complète et tests automatisés
- **Architecture:** Modulaire pour faciliter les extensions
- **Déploiement:** Zero-downtime deployments
- **Scalabilité:** Architecture permettant la montée en charge

---

## 12. Gestion Proactive des Risques

### 12.1 Matrice des Risques

| Risque identifié                           | Niveau | Impact   | Probabilité | Solution préventive proposée                                                      |
| ------------------------------------------ | ------ | -------- | ----------- | --------------------------------------------------------------------------------- |
| Faible adoption par les salariés           | Moyen  | Élevé    | Moyenne     | Communication renforcée, vidéos tutorielles, sessions de formation                |
| Erreurs fréquentes d'import Excel          | Élevé  | Moyen    | Élevée      | Vérifications automatiques renforcées, modèles standardisés, validation préalable |
| Sécurité des données (fuites potentielles) | Élevé  | Critique | Faible      | Audits périodiques, authentification 2FA stricte, chiffrement renforcé            |
| Retard de validation des remboursements    | Moyen  | Moyen    | Élevée      | Relances automatiques, rappels réguliers, escalade hiérarchique                   |
| Indisponibilité du système                 | Élevé  | Élevé    | Faible      | Architecture redondante, monitoring proactif, plan de continuité                  |
| Résistance au changement                   | Moyen  | Élevé    | Moyenne     | Formation approfondie, accompagnement personnalisé, communication des bénéfices   |

### 12.2 Plan de Mitigation

- **Identification précoce:** Mécanismes de détection des problèmes potentiels
- **Réponse graduée:** Procédures adaptées au niveau de risque
- **Responsabilités claires:** Attribution des rôles en cas d'incident
- **Révision périodique:** Mise à jour régulière de la matrice des risques

### 12.3 Plan de Continuité

- **Procédures dégradées:** Modes de fonctionnement alternatifs
- **Restauration:** Processus de récupération après incident
- **Communication de crise:** Modèles et canaux prédéfinis
- **Tests réguliers:** Simulation d'incidents pour validation des procédures

---

## 13. Roadmap & Livrables

### 13.1 Phases de Développement

#### Phase 1: MVP (T3 2025)

- Authentification et gestion des profils
- Catalogue de tickets et commandes basiques
- Formulaires de remboursement simples
- Blog avec fonctionnalités essentielles

#### Phase 2: Fonctionnalités Avancées (T4 2025)

- Système de questionnaires et sondages
- Workflow complet de validation des remboursements
- Tableau de bord analytique
- Notifications avancées

#### Phase 3: Optimisation et Extensions (T1 2026)

- Application mobile (PWA)
- Intégration de paiements en ligne
- Système de billetterie électronique
- Fonctionnalités communautaires

#### Phase 4: Architecture Hybride et Analytics Avancés (T2 2026) 🚀

- **Migration vers Neon** pour les requêtes complexes
- **Tableaux de bord administratifs** avec analytics temps réel
- **Rapports de performance** détaillés par établissement
- **Optimisation des coûts** avec facturation à l'usage
- **Synchronisation automatique** Supabase ↔ Neon

### 13.2 Jalons Clés

| Jalon   | Date       | Livrables                                             |
| ------- | ---------- | ----------------------------------------------------- |
| Kickoff | 01/08/2025 | Document de spécifications finalisé                   |
| Alpha   | 15/09/2025 | Prototype fonctionnel pour tests internes             |
| Beta    | 01/11/2025 | Version test pour groupe d'utilisateurs pilotes       |
| MVP     | 15/12/2025 | Lancement de la version minimale viable               |
| V1.0    | 01/02/2026 | Version complète avec toutes les fonctionnalités core |

### 13.3 Stratégie de Test et Validation

- **Tests unitaires:** Couverture > 80% du code
- **Tests d'intégration:** Validation des workflows critiques
- **Tests utilisateurs:** Sessions avec représentants de chaque persona
- **Beta testing:** Groupe pilote de 20 utilisateurs pendant 3 semaines

### 13.4 Plan de Formation et Déploiement

- **Documentation:** Guide utilisateur et administrateur
- **Formation:** Sessions dédiées pour chaque type d'utilisateur
- **Support:** Mise en place d'un système de tickets et FAQ
- **Déploiement:** Stratégie progressive avec période de coexistence

---

## 14. État d'Implémentation

### 14.1 Modules Complètement Implémentés ✅

#### **Authentification et Sécurité**

- ✅ **Intégration Clerk** : Authentification moderne avec JWT
- ✅ **Restriction de domaine** : Blocage des emails `@lepep973.org`
- ✅ **Demande d'accès** : Formulaire pour utilisateurs non injectés
- ✅ **Middleware sécurisé** : Protection des routes et gestion des rôles
- ✅ **Politiques RLS** : Sécurité au niveau des lignes en base de données

#### **Blog et Communication**

- ✅ **Système d'articles** : Publication, catégorisation, gestion
- ✅ **Commentaires** : Système complet avec réponses et modération
- ✅ **Réactions/Likes** : Système de likes avec compteur temps réel
- ✅ **Articles similaires** : Algorithme intelligent de recommandations
- ✅ **Newsletter** : Inscription, gestion des abonnements, notifications

#### **Interface Utilisateur**

- ✅ **Design System** : shadcn/ui + Tailwind CSS
- ✅ **Layouts responsives** : Mobile-first, accessible
- ✅ **Composants typés** : TypeScript strict, réutilisables
- ✅ **Navigation moderne** : App Router Next.js 15

#### **Base de Données**

- ✅ **Schéma PostgreSQL** : Tables optimisées avec index
- ✅ **Migrations versionnées** : Historique complet des changements
- ✅ **Types auto-générés** : Synchronisation TypeScript/Supabase
- ✅ **Politiques de sécurité** : RLS configuré pour toutes les tables

### 14.2 Modules en Développement 🚀

#### **Dashboard Utilisateur**

- 🚀 **Tableau de bord personnalisé** (Prochaine étape)
- 🚀 **Gestion de profil** (Prochaine étape)
- 🚀 **Historique des activités** (Prochaine étape)

### 14.3 Modules Planifiés 📋

#### **Gestion des Tickets**

- 📋 **Catalogue de tickets** : Cinéma, loisirs, transport
- 📋 **Système de commande** : Panier, validation, confirmation
- 📋 **Gestion des stocks** : Limitation, disponibilité
- 📋 **Distribution** : Retrait, envoi, suivi

#### **Remboursements**

- 📋 **Formulaire de demande** : Upload de justificatifs
- 📋 **Workflow de validation** : Gestionnaire → Trésorerie
- 📋 **Calcul automatique** : 50% plafonné à 200€/an
- 📋 **Suivi temps réel** : Statut, historique, notifications

#### **Sondages et Questionnaires**

- 📋 **Création de sondages** : Questions multiples, logique conditionnelle
- 📋 **Distribution** : Email, notifications, relances
- 📋 **Analyse des résultats** : Graphiques, export Excel
- 📋 **Anonymisation** : Respect RGPD

#### **Administration**

- 📋 **Interface d'administration** : Gestion complète
- 📋 **Import Excel** : Bénéficiaires, validation, erreurs
- 📋 **Reporting avancé** : Power BI, métriques, KPI
- 📋 **Audit et logs** : Traçabilité complète

### 14.4 Architecture Technique Actuelle

#### **Stack Technologique**

```typescript
Frontend: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
Backend: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
Auth: Clerk + JWT + RLS
Déploiement: Vercel + GitHub Actions
Monitoring: Vercel Analytics + Sentry (prévu)
```

#### **Évolution Future - Architecture Hybride** 🚀

**Phase 1 (Actuelle) :** Supabase uniquement ✅

```typescript
// Architecture actuelle
Next.js App → Supabase (PostgreSQL + Auth + Storage + Realtime)
```

**Phase 2 (Développement) :** Ajout Neon pour analytics

```typescript
// Architecture hybride
Next.js App → Supabase (écosystème complet)
Next.js App → Neon (requêtes complexes + analytics)
```

**Phase 3 (Production) :** Architecture hybride complète

```typescript
// Architecture optimisée
Next.js App → Supabase (Auth + Storage + Realtime)
Next.js App → Neon (Analytics + Reporting + Performance)
Sync Service → Synchronisation automatique Supabase ↔ Neon
```

**Critères de passage à la Phase 2 :**

- 500+ utilisateurs actifs
- Besoin de rapports complexes
- Optimisation des coûts nécessaire
- Performance des requêtes critique

#### **Structure de la Base de Données**

```sql
-- Tables principales implémentées
✅ users (Utilisateurs et rôles)
✅ blog_posts (Articles de blog)
✅ blog_comments (Commentaires avec réponses)
✅ blog_reactions (Système de likes)
✅ newsletter_subscriptions (Abonnements newsletter)
✅ demande_acces (Demandes d'accès utilisateurs)

-- Tables planifiées
📋 tickets (Catalogue des tickets)
📋 orders (Commandes des tickets)
📋 reimbursements (Demandes de remboursement)
📋 surveys (Sondages et questionnaires)
📋 survey_responses (Réponses aux sondages)
```

#### **Sécurité et Conformité**

- ✅ **RGPD** : Politiques de confidentialité, consentement
- ✅ **RLS** : Sécurité au niveau des lignes
- ✅ **Validation** : Zod + React Hook Form
- ✅ **Chiffrement** : JWT, HTTPS, variables d'environnement

### 14.5 Métriques de Développement

| Métrique                 | Valeur      | Status      |
| ------------------------ | ----------- | ----------- |
| **Modules implémentés**  | 4/8 (50%)   | ✅          |
| **Pages fonctionnelles** | 6/15 (40%)  | 🚀          |
| **Tests de couverture**  | 0%          | 📋 Planifié |
| **Performance**          | Optimisé    | ✅          |
| **Accessibilité**        | WCAG 2.1 AA | ✅          |
| **SEO**                  | Optimisé    | ✅          |

### 14.6 Scripts de Développement et Tests

#### **Scripts d'Authentification et Utilisateurs**

```bash
# Créer un nouvel utilisateur via API Supabase
npm run create-user

# Mettre à jour le mot de passe d'un utilisateur existant
npm run update-user

# Tester l'authentification avec un utilisateur
npm run test-auth
```

#### **Utilisation des Scripts**

**Créer un Utilisateur de Test :**

```bash
npm run create-user
# Crée : user@toto.com / password123 / rôle: salarie
```

**Mettre à Jour un Utilisateur Existant :**

```bash
npm run update-user
# Utile si l'utilisateur existe déjà dans Supabase
# mais n'a pas de mot de passe configuré
```

**Tester l'Authentification :**

```bash
npm run test-auth
# Vérifie : connexion, récupération utilisateur, accès table users, déconnexion
```

#### **Identifiants de Test par Défaut**

```bash
Email: user@toto.com
Mot de passe: password123
Rôle: salarie
```

#### **Workflow de Test Complet**

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

### 14.7 Prochaines Étapes Prioritaires

1. **Finaliser les migrations Supabase** et résoudre les erreurs TypeScript
2. **Implémenter le dashboard utilisateur** avec profil et historique
3. **Développer le module tickets** avec catalogue et commandes
4. **Créer le système de remboursements** avec workflow complet
5. **Intégrer les sondages** et questionnaires
6. **Mettre en place l'administration** et l'import Excel
7. **Déployer en production** avec monitoring complet

### 14.8 Outils de Développement et Tests

#### **Scripts Automatisés**

- ✅ **Création d'utilisateurs** : Script automatisé via API Supabase
- ✅ **Tests d'authentification** : Validation complète du workflow de connexion
- ✅ **Mise à jour d'utilisateurs** : Gestion des mots de passe et profils
- ✅ **Workflow de test** : Processus automatisé de validation

#### **Environnement de Développement**

- ✅ **Variables d'environnement** : Configuration centralisée (.env.local)
- ✅ **Scripts npm** : Commandes standardisées pour le développement
- ✅ **Tests automatisés** : Validation des fonctionnalités critiques
- ✅ **Documentation** : Guides détaillés pour les développeurs

#### **Dépannage et Support**

- ✅ **Logs détaillés** : Messages d'erreur informatifs
- ✅ **Validation de configuration** : Vérification des variables d'environnement
- ✅ **Gestion d'erreurs** : Solutions pour les problèmes courants
- ✅ **Workflow de test** : Processus étape par étape

### 14.9 Défis Techniques Résolus

- ✅ **Architecture modulaire** : Composants réutilisables et maintenables
- ✅ **Performance** : Optimisation Next.js 15 et chargement lazy
- ✅ **Sécurité** : Authentification robuste et protection des données
- ✅ **Expérience utilisateur** : Interface moderne et intuitive
- ✅ **Scalabilité** : Infrastructure Supabase + Vercel
- ✅ **Outils de développement** : Scripts automatisés et tests

---

## Annexes

### A. Glossaire

- **CSE:** Comité Social et Économique
- **2FA:** Authentification à Deux Facteurs
- **RLS:** Row Level Security (Sécurité au Niveau des Lignes)
- **RBAC:** Role-Based Access Control (Contrôle d'Accès Basé sur les Rôles)
- **SLA:** Service Level Agreement (Accord de Niveau de Service)
- **RTO:** Recovery Time Objective (Objectif de Temps de Reprise)
- **RPO:** Recovery Point Objective (Objectif de Point de Reprise)
- **UX:** User Experience (Expérience Utilisateur)
- **BPMN:** Business Process Model and Notation (Modélisation des Processus Métier)

### B. Références

- Réglementation CSE: [Lien vers la documentation légale]
- Documentation Supabase: https://supabase.com/docs
- Documentation Next.js: https://nextjs.org/docs
- Normes RGPD: https://www.cnil.fr/fr/rgpd-par-ou-commencer
- Guide WCAG 2.1: https://www.w3.org/TR/WCAG21/

### C. Livrables Complémentaires

- Maquettes Figma: [Lien vers le projet Figma]
- Diagrammes BPMN: [Lien vers les diagrammes]
- Matrice RGPD: [Lien vers le document Excel]
- Kit de communication: [Lien vers les ressources]

---

_Document approuvé par:_

- [Nom], Président du CSE
- [Nom], Responsable Technique
- [Nom], Représentant des Utilisateurs

_Date d'approbation: [Date]_
