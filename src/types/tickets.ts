// Types pour le module de gestion des tickets
// Date: 27 Janvier 2025

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "delivered"
  | "refunded";

export interface Ticket {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  max_per_user: number;
  category: "cinema" | "loisirs" | "culture" | "transport";
  cinema_location?: string;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  ticket_id: string;
  quantity: number;
  total_price: number;
  status: OrderStatus;
  notes?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntry {
  id: string;
  user_id: string;
  ticket_id: string;
  quantity: number;
  notified: boolean;
  created_at: string;
}

export interface OrderWithTicket extends Order {
  ticket: Ticket;
}

export interface TicketWithOrders extends Ticket {
  orders?: Order[];
  user_orders_count?: number;
  user_orders_this_month?: number;
}

export interface CartItem {
  ticket: Ticket;
  quantity: number;
  total_price: number;
}

export interface TicketFilters {
  category?: string;
  price_min?: number;
  price_max?: number;
  in_stock?: boolean;
  search?: string;
}

export interface TicketStats {
  total_tickets: number;
  total_orders: number;
  total_revenue: number;
  popular_tickets: TicketWithOrders[];
  low_stock_tickets: Ticket[];
}

// Types pour les formulaires
export interface OrderFormData {
  ticket_id: string;
  quantity: number;
  notes?: string;
}

export interface TicketFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  max_per_user: number;
  category: string;
  cinema_location?: string;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
}

// Types pour les notifications
export interface TicketNotification {
  type:
    | "stock_low"
    | "order_confirmed"
    | "order_cancelled"
    | "waitlist_available";
  ticket_id: string;
  ticket_name: string;
  message: string;
  created_at: string;
}

// Types pour les rapports
export interface TicketReport {
  period: string;
  total_orders: number;
  total_revenue: number;
  orders_by_status: Record<OrderStatus, number>;
  orders_by_category: Record<string, number>;
  top_tickets: Array<{
    ticket: Ticket;
    orders_count: number;
    revenue: number;
  }>;
}

// Types pour les validations Zod
export const orderFormSchema = {
  ticket_id: { type: "string", required: true },
  quantity: { type: "number", min: 1, max: 10, required: true },
  notes: { type: "string", maxLength: 500, optional: true },
} as const;

export const ticketFormSchema = {
  name: { type: "string", minLength: 3, maxLength: 255, required: true },
  description: { type: "string", maxLength: 1000, required: true },
  price: { type: "number", min: 0, required: true },
  stock: { type: "number", min: 0, required: true },
  max_per_user: { type: "number", min: 1, max: 20, required: true },
  category: { type: "string", required: true },
  cinema_location: { type: "string", maxLength: 255, optional: true },
  valid_from: { type: "string", optional: true },
  valid_until: { type: "string", optional: true },
  is_active: { type: "boolean", required: true },
} as const;
