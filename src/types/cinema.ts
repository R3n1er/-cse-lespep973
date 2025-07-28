// =====================================================
// TYPES CINEMA SYSTEM - CSE LES PEP 973
// Date: 29 Janvier 2025
// Version: 1.0
// =====================================================

/**
 * Interface pour les cinémas partenaires CSE
 */
export interface Cinema {
  id: string;
  name: "Agora" | "Uranus";
  location: "Cayenne" | "Kourou";
  address?: string;
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
    [key: string]: any;
  };
  reduced_price: number; // Prix CSE réduit
  regular_price: number; // Prix public
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Interface pour les commandes de tickets cinéma
 */
export interface CinemaOrder {
  id: string;
  user_id: string;
  cinema_id: string;
  cinema?: Cinema; // Relation optionnelle
  quantity: number; // 1-5 tickets max
  unit_price: number;
  total_amount: number;
  order_month: string; // Format YYYY-MM-01
  stripe_payment_intent_id?: string;
  status: CinemaOrderStatus;
  created_at: string;
  updated_at: string;
  tickets?: CinemaTicket[]; // Relation optionnelle
}

/**
 * Statuts possibles pour une commande
 */
export type CinemaOrderStatus = "pending" | "paid" | "cancelled" | "refunded";

/**
 * Interface pour les tickets individuels
 */
export interface CinemaTicket {
  id: string;
  order_id: string;
  order?: CinemaOrder; // Relation optionnelle
  ticket_code: string; // Code unique CSE + 8 chars
  qr_code_data: string; // Données QR code JSON
  is_used: boolean;
  used_at?: string;
  expires_at: string;
  created_at: string;
}

/**
 * Interface pour la vérification des quotas mensuels
 */
export interface QuotaCheck {
  used_tickets: number;
  remaining_quota: number;
  requested_quantity: number;
  can_order: boolean;
  target_month: string; // Format YYYY-MM-01
  max_quota: number; // Toujours 5
}

/**
 * Interface pour créer une nouvelle commande
 */
export interface CinemaOrderRequest {
  cinema_id: string;
  quantity: number; // 1-5
}

/**
 * Interface pour l'historique des commandes utilisateur
 */
export interface CinemaOrderHistory {
  order_id: string;
  cinema_name: string;
  cinema_location: string;
  quantity: number;
  total_amount: number;
  order_date: string; // Format ISO date
  status: CinemaOrderStatus;
  tickets_count: number;
  stripe_payment_intent_id?: string;
}

/**
 * Interface pour les statistiques cinéma (admin)
 */
export interface CinemaStats {
  total_orders: number;
  total_revenue: number;
  total_tickets_sold: number;
  orders_this_month: number;
  revenue_this_month: number;
  cinema_breakdown: CinemaBreakdown[];
}

/**
 * Interface pour le breakdown par cinéma
 */
export interface CinemaBreakdown {
  cinema_name: string;
  cinema_location: string;
  orders_count: number;
  total_revenue: number;
  tickets_sold: number;
}

/**
 * Interface pour les données QR code
 */
export interface QRCodeData {
  ticket_id: string;
  ticket_code: string;
  cinema_name: string;
  cinema_location: string;
  order_id: string;
  user_email: string;
  expires_at: string;
  generated_at: string;
}

/**
 * Interface pour la réponse de création de PaymentIntent Stripe
 */
export interface StripePaymentResponse {
  client_secret: string;
  order_id: string;
  amount: number; // En centimes
  currency: string;
}

/**
 * Interface pour les erreurs spécifiques au module cinéma
 */
export interface CinemaError {
  code: CinemaErrorCode;
  message: string;
  details?: any;
}

/**
 * Codes d'erreur spécifiques au module cinéma
 */
export type CinemaErrorCode =
  | "QUOTA_EXCEEDED"
  | "CINEMA_NOT_FOUND"
  | "CINEMA_INACTIVE"
  | "ORDER_NOT_FOUND"
  | "INVALID_QUANTITY"
  | "PAYMENT_FAILED"
  | "TICKET_EXPIRED"
  | "TICKET_ALREADY_USED"
  | "INSUFFICIENT_QUOTA";

/**
 * Interface pour les paramètres de recherche/filtrage
 */
export interface CinemaSearchParams {
  status?: CinemaOrderStatus;
  cinema_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

/**
 * Interface pour la pagination des résultats
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

/**
 * Interface pour les notifications/emails de tickets
 */
export interface TicketNotification {
  type:
    | "order_confirmation"
    | "payment_success"
    | "ticket_generated"
    | "ticket_reminder";
  order: CinemaOrder;
  tickets: CinemaTicket[];
  user_email: string;
  template_data: {
    user_name?: string;
    cinema_name: string;
    cinema_location: string;
    cinema_address?: string;
    total_amount: number;
    expires_at: string;
    ticket_codes: string[];
  };
}

/**
 * Interface pour la configuration du module cinéma
 */
export interface CinemaConfig {
  max_tickets_per_month: number;
  ticket_validity_days: number;
  payment_provider: "stripe";
  auto_generate_tickets: boolean;
  send_email_notifications: boolean;
  qr_code_format: "url" | "json";
}

/**
 * Type guards pour vérifier les types
 */
export const isCinemaOrderStatus = (
  status: any
): status is CinemaOrderStatus => {
  return ["pending", "paid", "cancelled", "refunded"].includes(status);
};

export const isCinemaName = (name: any): name is Cinema["name"] => {
  return ["Agora", "Uranus"].includes(name);
};

export const isCinemaLocation = (
  location: any
): location is Cinema["location"] => {
  return ["Cayenne", "Kourou"].includes(location);
};

/**
 * Constantes pour le module cinéma
 */
export const CINEMA_CONSTANTS = {
  MAX_TICKETS_PER_MONTH: 5,
  MIN_TICKETS_PER_ORDER: 1,
  MAX_TICKETS_PER_ORDER: 5,
  TICKET_VALIDITY_DAYS: 90,
  TICKET_CODE_PREFIX: "CSE",
  TICKET_CODE_LENGTH: 11, // CSE + 8 chars
  PAYMENT_CURRENCY: "EUR",
  CINEMA_LOCATIONS: {
    AGORA: "Cayenne",
    URANUS: "Kourou",
  } as const,
} as const;

/**
 * Messages d'erreur localisés
 */
export const CINEMA_ERROR_MESSAGES: Record<CinemaErrorCode, string> = {
  QUOTA_EXCEEDED: "Quota mensuel dépassé. Maximum 5 tickets par mois.",
  CINEMA_NOT_FOUND: "Cinéma non trouvé.",
  CINEMA_INACTIVE: "Ce cinéma n'est plus disponible.",
  ORDER_NOT_FOUND: "Commande non trouvée.",
  INVALID_QUANTITY: "Quantité invalide. Entre 1 et 5 tickets autorisés.",
  PAYMENT_FAILED: "Échec du paiement. Veuillez réessayer.",
  TICKET_EXPIRED: "Ce ticket a expiré.",
  TICKET_ALREADY_USED: "Ce ticket a déjà été utilisé.",
  INSUFFICIENT_QUOTA: "Quota insuffisant pour cette commande.",
};

/**
 * Export par défaut du type principal
 */
export type { Cinema as default };
