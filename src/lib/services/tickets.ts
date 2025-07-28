// Service pour la gestion des tickets
// Date: 27 Janvier 2025

import { supabase } from "@/lib/supabase/config";
import {
  Ticket,
  Order,
  OrderWithTicket,
  TicketWithOrders,
  CartItem,
  TicketFilters,
  OrderFormData,
  TicketStats,
  WaitlistEntry,
} from "@/types/tickets";

export class TicketService {
  // Récupérer tous les tickets disponibles
  static async getTickets(filters?: TicketFilters): Promise<Ticket[]> {
    let query = supabase
      .from("tickets")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.price_min !== undefined) {
      query = query.gte("price", filters.price_min);
    }

    if (filters?.price_max !== undefined) {
      query = query.lte("price", filters.price_max);
    }

    if (filters?.in_stock) {
      query = query.gt("stock", 0);
    }

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erreur lors de la récupération des tickets:", error);
      throw new Error("Impossible de récupérer les tickets");
    }

    return data || [];
  }

  // Récupérer un ticket par ID
  static async getTicketById(id: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération du ticket:", error);
      return null;
    }

    return data;
  }

  // Récupérer les commandes d'un utilisateur
  static async getUserOrders(userId: string): Promise<OrderWithTicket[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        ticket:tickets(*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      throw new Error("Impossible de récupérer les commandes");
    }

    return data || [];
  }

  // Récupérer une commande par ID
  static async getOrderById(orderId: string): Promise<OrderWithTicket | null> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        ticket:tickets(*)
      `
      )
      .eq("id", orderId)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération de la commande:", error);
      return null;
    }

    return data;
  }

  // Créer une nouvelle commande
  static async createOrder(
    orderData: OrderFormData,
    userId: string
  ): Promise<Order> {
    // Récupérer le ticket pour calculer le prix total
    const ticket = await this.getTicketById(orderData.ticket_id);
    if (!ticket) {
      throw new Error("Ticket non trouvé");
    }

    // Vérifier le stock
    if (ticket.stock < orderData.quantity) {
      throw new Error("Stock insuffisant");
    }

    // Vérifier la limite mensuelle
    const userOrdersThisMonth = await this.getUserOrdersThisMonth(
      userId,
      orderData.ticket_id
    );
    if (userOrdersThisMonth + orderData.quantity > ticket.max_per_user) {
      throw new Error(
        `Limite mensuelle dépassée (${ticket.max_per_user} tickets max)`
      );
    }

    const totalPrice = ticket.price * orderData.quantity;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        ticket_id: orderData.ticket_id,
        quantity: orderData.quantity,
        total_price: totalPrice,
        notes: orderData.notes,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de la commande:", error);
      throw new Error("Impossible de créer la commande");
    }

    return data;
  }

  // Annuler une commande
  static async cancelOrder(orderId: string, userId: string): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'annulation de la commande:", error);
      throw new Error("Impossible d'annuler la commande");
    }

    return data;
  }

  // Confirmer une commande (admin/gestionnaire)
  static async confirmOrder(orderId: string): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la confirmation de la commande:", error);
      throw new Error("Impossible de confirmer la commande");
    }

    return data;
  }

  // Marquer une commande comme livrée
  static async deliverOrder(orderId: string): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: "delivered",
        delivered_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la livraison de la commande:", error);
      throw new Error("Impossible de marquer la commande comme livrée");
    }

    return data;
  }

  // Récupérer les commandes du mois pour un utilisateur et un ticket
  static async getUserOrdersThisMonth(
    userId: string,
    ticketId: string
  ): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("orders")
      .select("quantity")
      .eq("user_id", userId)
      .eq("ticket_id", ticketId)
      .gte("created_at", startOfMonth.toISOString())
      .neq("status", "cancelled");

    if (error) {
      console.error("Erreur lors du calcul des commandes du mois:", error);
      return 0;
    }

    return data?.reduce((total, order) => total + order.quantity, 0) || 0;
  }

  // Ajouter à la liste d'attente
  static async addToWaitlist(
    userId: string,
    ticketId: string,
    quantity: number
  ): Promise<WaitlistEntry> {
    const { data, error } = await supabase
      .from("waitlist")
      .insert({
        user_id: userId,
        ticket_id: ticketId,
        quantity: quantity,
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'ajout à la liste d'attente:", error);
      throw new Error("Impossible d'ajouter à la liste d'attente");
    }

    return data;
  }

  // Récupérer les entrées de liste d'attente d'un utilisateur
  static async getUserWaitlist(userId: string): Promise<WaitlistEntry[]> {
    const { data, error } = await supabase
      .from("waitlist")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Erreur lors de la récupération de la liste d'attente:",
        error
      );
      return [];
    }

    return data || [];
  }

  // Notifier les utilisateurs en liste d'attente quand le stock est disponible
  static async notifyWaitlistUsers(ticketId: string): Promise<void> {
    const { data, error } = await supabase
      .from("waitlist")
      .update({ notified: true })
      .eq("ticket_id", ticketId)
      .eq("notified", false);

    if (error) {
      console.error("Erreur lors de la notification des utilisateurs:", error);
    }
  }

  // Récupérer les statistiques des tickets
  static async getTicketStats(): Promise<TicketStats> {
    // Compter les tickets
    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("*")
      .eq("is_active", true);

    if (ticketsError) {
      console.error("Erreur lors du comptage des tickets:", ticketsError);
      throw new Error("Impossible de récupérer les statistiques");
    }

    // Compter les commandes
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*");

    if (ordersError) {
      console.error("Erreur lors du comptage des commandes:", ordersError);
      throw new Error("Impossible de récupérer les statistiques");
    }

    // Calculer le revenu total
    const totalRevenue =
      orders?.reduce((total, order) => total + order.total_price, 0) || 0;

    // Récupérer les tickets populaires
    const { data: popularTickets, error: popularError } = await supabase
      .from("tickets")
      .select(
        `
        *,
        orders:orders(count)
      `
      )
      .eq("is_active", true)
      .order("stock", { ascending: true })
      .limit(5);

    if (popularError) {
      console.error(
        "Erreur lors de la récupération des tickets populaires:",
        popularError
      );
    }

    // Récupérer les tickets en stock faible
    const lowStockTickets =
      tickets?.filter((ticket) => ticket.stock <= 5) || [];

    return {
      total_tickets: tickets?.length || 0,
      total_orders: orders?.length || 0,
      total_revenue: totalRevenue,
      popular_tickets: popularTickets || [],
      low_stock_tickets: lowStockTickets,
    };
  }

  // Récupérer les catégories disponibles
  static async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from("tickets")
      .select("category")
      .eq("is_active", true);

    if (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      return [];
    }

    const categories = [
      ...new Set(data?.map((ticket) => ticket.category) || []),
    ];
    return categories.sort();
  }

  // Vérifier si un ticket est en stock
  static async isTicketInStock(
    ticketId: string,
    quantity: number = 1
  ): Promise<boolean> {
    const ticket = await this.getTicketById(ticketId);
    return ticket ? ticket.stock >= quantity : false;
  }

  // Calculer le prix total d'un panier
  static calculateCartTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => total + item.total_price, 0);
  }

  // Valider un panier
  static validateCart(cartItems: CartItem[]): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (cartItems.length === 0) {
      errors.push("Le panier est vide");
    }

    for (const item of cartItems) {
      if (item.quantity <= 0) {
        errors.push(`Quantité invalide pour ${item.ticket.name}`);
      }

      if (item.quantity > item.ticket.max_per_user) {
        errors.push(`Quantité dépassant la limite pour ${item.ticket.name}`);
      }

      if (item.quantity > item.ticket.stock) {
        errors.push(`Stock insuffisant pour ${item.ticket.name}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
