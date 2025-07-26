import { Database } from "@/lib/supabase/config";

// Types pour les utilisateurs
export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type UserRole = "salarie" | "gestionnaire" | "admin" | "tresorerie";

// Types pour les tickets
export type Ticket = Database["public"]["Tables"]["tickets"]["Row"];
export type TicketInsert = Database["public"]["Tables"]["tickets"]["Insert"];
export type TicketUpdate = Database["public"]["Tables"]["tickets"]["Update"];

// Types pour les commandes
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

// Types pour les remboursements
export type Reimbursement =
  Database["public"]["Tables"]["reimbursements"]["Row"];
export type ReimbursementInsert =
  Database["public"]["Tables"]["reimbursements"]["Insert"];
export type ReimbursementUpdate =
  Database["public"]["Tables"]["reimbursements"]["Update"];

export type ReimbursementStatus = "pending" | "approved" | "rejected";

// Types pour les articles de blog
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type BlogPostInsert =
  Database["public"]["Tables"]["blog_posts"]["Insert"];
export type BlogPostUpdate =
  Database["public"]["Tables"]["blog_posts"]["Update"];

// Types pour les commentaires
export type BlogComment = Database["public"]["Tables"]["blog_comments"]["Row"];
export type BlogCommentInsert =
  Database["public"]["Tables"]["blog_comments"]["Insert"];
export type BlogCommentUpdate =
  Database["public"]["Tables"]["blog_comments"]["Update"];

// Interface étendue pour les commentaires avec relations
export interface BlogCommentWithUser extends BlogComment {
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  replies?: BlogCommentWithUser[];
}

// Types pour les abonnements newsletter
export type NewsletterSubscription =
  Database["public"]["Tables"]["newsletter_subscriptions"]["Row"];
export type NewsletterSubscriptionInsert =
  Database["public"]["Tables"]["newsletter_subscriptions"]["Insert"];
export type NewsletterSubscriptionUpdate =
  Database["public"]["Tables"]["newsletter_subscriptions"]["Update"];

// Types pour les formulaires
export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  matricule: string;
  phone?: string;
  address?: string;
};

export type ReimbursementFormValues = {
  amount: number;
  description: string;
  proofFile: File;
};

export type TicketOrderFormValues = {
  ticketId: string;
  quantity: number;
};

// Types pour les réponses d'API
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
