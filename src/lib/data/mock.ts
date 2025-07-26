/**
 * Données mockées pour le développement
 * À remplacer par de vraies données Supabase en production
 */

import { BlogPost, User } from "@/types";

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: "admin-1",
    email: "admin@exemple.com",
    first_name: "Admin",
    last_name: "CSE",
    matricule: "ADM001",
    role: "admin",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    address: null,
    phone: null,
  },
  {
    id: "user-1",
    email: "user@exemple.com",
    first_name: "Jean",
    last_name: "Dupont",
    matricule: "USR001",
    role: "salarie",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    address: null,
    phone: null,
  },
];

// Mock Blog Posts
export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Bienvenue sur le blog du CSE !",
    content: `Découvrez toutes les actualités, événements et avantages du CSE Les PEP 973.

Notre nouveau portail numérique vous permet de :
- Consulter les dernières actualités
- Commander vos tickets et bons d'achat
- Demander des remboursements
- Participer aux événements organisés
- Vous tenir informé des décisions du CSE

N'hésitez pas à explorer toutes les fonctionnalités disponibles et à nous faire part de vos commentaires pour améliorer votre expérience.`,
    category: "Actualités",
    author_id: "admin-1",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 jour
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    published_at: new Date(Date.now() - 86400000).toISOString(),
    is_published: true,
  },
  {
    id: "2",
    title: "Nouveaux tickets disponibles",
    content: `Bonne nouvelle ! Les tickets cinéma et loisirs sont à nouveau disponibles en stock.

**Tickets disponibles :**
- Cinéma Pathé : 8€ au lieu de 12€
- Piscine municipale : 3€ au lieu de 6€
- Musée départemental : Gratuit (valeur 8€)
- Parc zoologique : 15€ au lieu de 25€

Les commandes sont ouvertes dès maintenant et limitées à 4 tickets par personne et par mois. Les tickets sont valables 6 mois à compter de la date d'achat.

Pour commander, rendez-vous dans votre espace personnel ou contactez directement le CSE.`,
    category: "Tickets",
    author_id: "admin-1",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 jours
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    published_at: new Date(Date.now() - 172800000).toISOString(),
    is_published: true,
  },
  {
    id: "3",
    title: "Remboursements simplifiés",
    content: `Le processus de remboursement a été entièrement revu pour plus de simplicité et de rapidité.

**Nouveautés :**
- Dépôt des justificatifs directement en ligne
- Suivi en temps réel de votre demande
- Délai de traitement réduit à 15 jours maximum
- Notification automatique par email

**Rappel des conditions :**
- Remboursement jusqu'à 50% du montant
- Plafond annuel de 200€ par salarié
- Activités culturelles, sportives et de loisirs éligibles
- Justificatifs obligatoires (factures, tickets)

Le nouveau système est disponible dès maintenant dans votre espace personnel.`,
    category: "Remboursements",
    author_id: "admin-1",
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 jours
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    published_at: new Date(Date.now() - 259200000).toISOString(),
    is_published: true,
  },
  {
    id: "4",
    title: "Réunion mensuelle du CSE - Février 2025",
    content: `La prochaine réunion du CSE aura lieu le vendredi 28 février 2025 à 14h00 en salle de réunion.

**Ordre du jour :**
1. Bilan des activités de janvier
2. Budget et comptes 2024
3. Nouvelles activités proposées
4. Questions diverses

La réunion est ouverte à tous les salariés. Les représentants du personnel présenteront les dernières décisions et projets du CSE.

Un compte-rendu sera publié dans les 48h suivant la réunion.`,
    category: "Actualités",
    author_id: "admin-1",
    created_at: new Date(Date.now() - 345600000).toISOString(), // 4 jours
    updated_at: new Date(Date.now() - 345600000).toISOString(),
    published_at: new Date(Date.now() - 345600000).toISOString(),
    is_published: true,
  },
  {
    id: "5",
    title: "Nouvelle convention partenaire - Restaurant Le Palmier",
    content: `Le CSE a signé un nouveau partenariat avec le restaurant Le Palmier pour offrir des réductions exclusives à tous les salariés.

**Avantages :**
- 15% de réduction sur tous les repas
- 20% de réduction les mardis et mercredis
- Menu spécial CSE à 18€ (entrée + plat + dessert)
- Réservation prioritaire pour les événements privés

**Comment en bénéficier :**
- Présenter votre badge salarié
- Ou montrer cette annonce sur votre téléphone
- Réservation conseillée au 05 96 XX XX XX

La convention est effective immédiatement et valable jusqu'au 31 décembre 2025.`,
    category: "Avantages",
    author_id: "admin-1",
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 jours
    updated_at: new Date(Date.now() - 432000000).toISOString(),
    published_at: new Date(Date.now() - 432000000).toISOString(),
    is_published: true,
  },
];

// Categories de blog
export const BLOG_CATEGORIES = [
  "Actualités",
  "Tickets",
  "Remboursements",
  "Avantages",
  "Événements",
  "Partenaires",
];

// Établissements ADPEP GUYANE
export const ETABLISSEMENTS_ADPEP = [
  "SESSAD Les Nénuphars",
  "IME Kanawa",
  "ITEP Bois d'Inde",
  "SESSAD Pro Transition",
  "ESAT Les Ateliers",
  "Foyer d'Hébergement",
  "Service d'Aide à Domicile",
  "CAMSP Cayenne",
  "CMPP Saint-Laurent",
  "Siège Social ADPEP",
];

// Statuts des demandes d'accès
export const STATUTS_DEMANDE = [
  { value: "en_attente", label: "En attente" },
  { value: "approuve", label: "Approuvé" },
  { value: "refuse", label: "Refusé" },
];

// Rôles utilisateurs
export const USER_ROLES = [
  { value: "salarie", label: "Salarié" },
  { value: "gestionnaire", label: "Gestionnaire" },
  { value: "admin", label: "Administrateur" },
  { value: "tresorerie", label: "Trésorerie" },
];
