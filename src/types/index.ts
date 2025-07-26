// Types pour l'application CSE Les PEP 973
// Généré automatiquement depuis la base de données Supabase

import { Database } from "@/lib/supabase/types";

// Types de base extraits de la base de données
export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type BlogPostInsert =
  Database["public"]["Tables"]["blog_posts"]["Insert"];
export type BlogPostUpdate =
  Database["public"]["Tables"]["blog_posts"]["Update"];

export type BlogComment = Database["public"]["Tables"]["blog_comments"]["Row"];
export type BlogCommentInsert =
  Database["public"]["Tables"]["blog_comments"]["Insert"];
export type BlogCommentUpdate =
  Database["public"]["Tables"]["blog_comments"]["Update"];

export type NewsletterSubscription =
  Database["public"]["Tables"]["newsletter_subscriptions"]["Row"];
export type NewsletterSubscriptionInsert =
  Database["public"]["Tables"]["newsletter_subscriptions"]["Insert"];
export type NewsletterSubscriptionUpdate =
  Database["public"]["Tables"]["newsletter_subscriptions"]["Update"];

// Types pour les nouveaux modules selon PRD v2.1

// Types pour les tickets de cinéma
export type CinemaLocation = "agora_cayenne" | "uranus_kourou";
export type TicketStatus = "available" | "reserved" | "sold" | "expired";
export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface CinemaTicket {
  id: string;
  cinema: CinemaLocation;
  cinema_name: string;
  ticket_type: string;
  price: number;
  cse_price: number;
  stock_quantity: number;
  available_from: string;
  available_until: string;
  description?: string;
  terms_conditions?: string;
  created_at: string;
  updated_at: string;
}

export interface CinemaOrder {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  delivery_method: string;
  delivery_address?: string;
  notes?: string;
  ordered_at: string;
  confirmed_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CinemaOrderItem {
  id: string;
  order_id: string;
  ticket_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

// Types étendus avec relations
export interface CinemaOrderWithItems extends CinemaOrder {
  items: (CinemaOrderItem & { ticket: CinemaTicket })[];
  user: Pick<User, "first_name" | "last_name" | "email">;
}

export interface CinemaOrderItemWithTicket extends CinemaOrderItem {
  ticket: CinemaTicket;
}

// Types pour les informations des enfants (PRD)
export interface ChildInfo {
  name: string;
  birthDate: string; // Format: YYYY-MM-DD
}

// Type utilisateur étendu avec les nouveaux champs PRD
export interface UserProfile extends User {
  personal_email?: string;
  children_count?: number;
  children_birth_dates?: ChildInfo[];
}

// Types pour les remboursements (selon PRD - activités culturelles)
export interface CulturalReimbursement {
  id: string;
  user_id: string;
  activity_name: string;
  activity_date: string;
  activity_location: string;
  original_amount: number;
  reimbursement_amount: number; // 50% du montant original
  receipt_url: string;
  proof_documents: string[];
  status:
    | "pending"
    | "manager_approved"
    | "treasury_approved"
    | "paid"
    | "rejected";
  submitted_at: string;
  manager_reviewed_at?: string;
  manager_reviewed_by?: string;
  treasury_reviewed_at?: string;
  treasury_reviewed_by?: string;
  paid_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CulturalReimbursementInsert {
  user_id: string;
  activity_name: string;
  activity_date: string;
  activity_location: string;
  original_amount: number;
  receipt_url: string;
  proof_documents?: string[];
}

export interface CulturalReimbursementUpdate {
  activity_name?: string;
  activity_date?: string;
  activity_location?: string;
  original_amount?: number;
  receipt_url?: string;
  proof_documents?: string[];
  status?: string;
  manager_reviewed_at?: string;
  manager_reviewed_by?: string;
  treasury_reviewed_at?: string;
  treasury_reviewed_by?: string;
  paid_at?: string;
  rejection_reason?: string;
}

// Types utilitaires pour les interfaces
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  totalPages: number;
}

// Types pour les statistiques utilisateur
export interface UserStats {
  total_orders: number;
  total_spent: number;
  pending_reimbursements: number;
  total_reimbursed: number;
  newsletter_subscribed: boolean;
  last_activity: string;
}

// Types pour les commentaires avec relations
export interface BlogCommentWithUser extends BlogComment {
  user: Pick<User, "first_name" | "last_name">;
  replies?: BlogCommentWithUser[];
}

// Types pour les réactions de blog
export type BlogReaction =
  Database["public"]["Tables"]["blog_reactions"]["Row"];
export type BlogReactionInsert =
  Database["public"]["Tables"]["blog_reactions"]["Insert"];
export type BlogReactionUpdate =
  Database["public"]["Tables"]["blog_reactions"]["Update"];

// Types pour les demandes d'accès
export type DemandeAcces = Database["public"]["Tables"]["demande_acces"]["Row"];
export type DemandeAccesInsert =
  Database["public"]["Tables"]["demande_acces"]["Insert"];
export type DemandeAccesUpdate =
  Database["public"]["Tables"]["demande_acces"]["Update"];

// Types pour les rôles utilisateur étendus (PRD v2.1)
export type UserRole = "salarie" | "gestionnaire" | "admin" | "tresorerie";

// Constantes pour les cinémas de Guyane
export const CINEMAS = {
  agora_cayenne: {
    name: "Cinéma AGORA",
    location: "Cayenne",
    address: "Avenue de la Liberté, Cayenne",
  },
  uranus_kourou: {
    name: "Cinéma Uranus",
    location: "Kourou",
    address: "Rue des Colibris, Kourou",
  },
} as const;

// Types pour les formulaires
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterForm {
  email: string;
  first_name?: string;
  last_name?: string;
}

// Types pour les erreurs
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Types pour les notifications
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
}

// Export par défaut pour compatibilité
export type { Database as default };
