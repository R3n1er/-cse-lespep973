// =====================================================
// CINEMA SERVICE - CSE LES PEP 973
// Date: 29 Janvier 2025
// Version: 1.0
// =====================================================

import { supabase } from "@/lib/supabase/config";
import type {
  Cinema,
  CinemaOrder,
  CinemaTicket,
  QuotaCheck,
  CinemaOrderRequest,
  CinemaOrderHistory,
  CinemaStats,
  CinemaError,
  CinemaErrorCode,
  QRCodeData,
  PaginatedResponse,
  CinemaSearchParams,
} from "@/types/cinema";
import { CINEMA_CONSTANTS, CINEMA_ERROR_MESSAGES } from "@/types/cinema";

/**
 * Service principal pour la gestion des tickets cinéma
 */
export class CinemaService {
  /**
   * Récupérer tous les cinémas actifs
   */
  static async getCinemas(): Promise<Cinema[]> {
    try {
      const { data, error } = await supabase
        .from("cinemas")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) {
        throw this.createError("CINEMA_NOT_FOUND", error.message);
      }

      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des cinémas:", error);
      throw error;
    }
  }

  /**
   * Récupérer un cinéma par ID
   */
  static async getCinemaById(cinemaId: string): Promise<Cinema> {
    try {
      const { data, error } = await supabase
        .from("cinemas")
        .select("*")
        .eq("id", cinemaId)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        throw this.createError(
          "CINEMA_NOT_FOUND",
          "Cinéma non trouvé ou inactif"
        );
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération du cinéma:", error);
      throw error;
    }
  }

  /**
   * Vérifier le quota mensuel d'un utilisateur
   */
  static async checkUserQuota(
    userId: string,
    quantity: number
  ): Promise<QuotaCheck> {
    try {
      // Validation de base
      if (
        quantity < CINEMA_CONSTANTS.MIN_TICKETS_PER_ORDER ||
        quantity > CINEMA_CONSTANTS.MAX_TICKETS_PER_ORDER
      ) {
        throw this.createError(
          "INVALID_QUANTITY",
          `Quantité invalide: ${quantity}. Min: ${CINEMA_CONSTANTS.MIN_TICKETS_PER_ORDER}, Max: ${CINEMA_CONSTANTS.MAX_TICKETS_PER_ORDER}`
        );
      }

      const { data, error } = await supabase.rpc("check_monthly_quota", {
        p_user_id: userId,
        p_requested_quantity: quantity,
      });

      if (error) {
        console.error("Erreur RPC check_monthly_quota:", error);
        // Fallback: calcul manuel si la fonction RPC échoue
        return await this.checkQuotaFallback(userId, quantity);
      }

      return data as QuotaCheck;
    } catch (error) {
      console.error("Erreur lors de la vérification du quota:", error);
      throw error;
    }
  }

  /**
   * Fallback pour vérification quota si RPC échoue
   */
  private static async checkQuotaFallback(
    userId: string,
    quantity: number
  ): Promise<QuotaCheck> {
    const currentMonth = new Date().toISOString().slice(0, 7) + "-01";

    const { data: orders, error } = await supabase
      .from("cinema_orders")
      .select("quantity")
      .eq("user_id", userId)
      .eq("order_month", currentMonth)
      .in("status", ["paid", "pending"]);

    if (error) {
      throw this.createError("INSUFFICIENT_QUOTA", error.message);
    }

    const usedTickets =
      orders?.reduce((sum, order) => sum + order.quantity, 0) || 0;
    const remainingQuota = CINEMA_CONSTANTS.MAX_TICKETS_PER_MONTH - usedTickets;

    return {
      used_tickets: usedTickets,
      remaining_quota: remainingQuota,
      requested_quantity: quantity,
      can_order: remainingQuota >= quantity,
      target_month: currentMonth,
      max_quota: CINEMA_CONSTANTS.MAX_TICKETS_PER_MONTH,
    };
  }

  /**
   * Récupérer l'historique des commandes d'un utilisateur
   */
  static async getUserHistory(userId: string): Promise<CinemaOrderHistory[]> {
    try {
      const { data, error } = await supabase.rpc("get_user_cinema_history", {
        p_user_id: userId,
      });

      if (error) {
        console.error("Erreur RPC get_user_cinema_history:", error);
        // Fallback: requête manuelle
        return await this.getUserHistoryFallback(userId);
      }

      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      throw error;
    }
  }

  /**
   * Fallback pour historique utilisateur si RPC échoue
   */
  private static async getUserHistoryFallback(
    userId: string
  ): Promise<CinemaOrderHistory[]> {
    const { data, error } = await supabase
      .from("cinema_orders")
      .select(
        `
        id,
        quantity,
        total_amount,
        status,
        created_at,
        stripe_payment_intent_id,
        cinema:cinemas(name, location),
        tickets:cinema_tickets(count)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw this.createError("ORDER_NOT_FOUND", error.message);
    }

    return (
      data?.map((order) => ({
        order_id: order.id,
        cinema_name: (order.cinema as any)?.name || "Inconnu",
        cinema_location: (order.cinema as any)?.location || "Inconnu",
        quantity: order.quantity,
        total_amount: order.total_amount,
        order_date: order.created_at.split("T")[0],
        status: order.status,
        tickets_count: Array.isArray(order.tickets) ? order.tickets.length : 0,
        stripe_payment_intent_id: order.stripe_payment_intent_id,
      })) || []
    );
  }

  /**
   * Créer une nouvelle commande de tickets
   */
  static async createOrder(
    userId: string,
    orderData: CinemaOrderRequest
  ): Promise<CinemaOrder> {
    try {
      // 1. Vérifier le quota utilisateur
      const quotaCheck = await this.checkUserQuota(userId, orderData.quantity);
      if (!quotaCheck.can_order) {
        throw this.createError(
          "QUOTA_EXCEEDED",
          `Quota dépassé. Tickets restants ce mois: ${quotaCheck.remaining_quota}`
        );
      }

      // 2. Récupérer et valider le cinéma
      const cinema = await this.getCinemaById(orderData.cinema_id);
      if (!cinema.is_active) {
        throw this.createError(
          "CINEMA_INACTIVE",
          "Ce cinéma n'est plus disponible"
        );
      }

      // 3. Calculer les montants
      const orderMonth = new Date().toISOString().slice(0, 7) + "-01"; // YYYY-MM-01
      const totalAmount = Number(
        (cinema.reduced_price * orderData.quantity).toFixed(2)
      );

      // 4. Créer la commande
      const { data: order, error: orderError } = await supabase
        .from("cinema_orders")
        .insert({
          user_id: userId,
          cinema_id: orderData.cinema_id,
          quantity: orderData.quantity,
          unit_price: cinema.reduced_price,
          total_amount: totalAmount,
          order_month: orderMonth,
          status: "pending",
        })
        .select("*")
        .single();

      if (orderError) {
        throw this.createError("ORDER_NOT_FOUND", orderError.message);
      }

      // 5. Ajouter les données du cinéma à la réponse
      return {
        ...order,
        cinema,
      };
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      throw error;
    }
  }

  /**
   * Mettre à jour le PaymentIntent Stripe d'une commande
   */
  static async updateOrderPaymentIntent(
    orderId: string,
    paymentIntentId: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("cinema_orders")
        .update({ stripe_payment_intent_id: paymentIntentId })
        .eq("id", orderId);

      if (error) {
        throw this.createError("ORDER_NOT_FOUND", error.message);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du PaymentIntent:", error);
      throw error;
    }
  }

  /**
   * Marquer une commande comme payée et générer les tickets
   */
  static async markOrderAsPaid(orderId: string): Promise<CinemaTicket[]> {
    try {
      // 1. Mettre à jour le statut de la commande
      const { data: order, error: updateError } = await supabase
        .from("cinema_orders")
        .update({ status: "paid" })
        .eq("id", orderId)
        .select("*, cinema:cinemas(*)")
        .single();

      if (updateError || !order) {
        throw this.createError(
          "ORDER_NOT_FOUND",
          updateError?.message || "Commande non trouvée"
        );
      }

      // 2. Générer les tickets individuels
      const tickets = await this.generateTicketsForOrder(order);

      return tickets;
    } catch (error) {
      console.error("Erreur lors de la validation de la commande:", error);
      throw error;
    }
  }

  /**
   * Générer les tickets pour une commande payée
   */
  private static async generateTicketsForOrder(
    order: CinemaOrder & { cinema: Cinema }
  ): Promise<CinemaTicket[]> {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(
        expiresAt.getDate() + CINEMA_CONSTANTS.TICKET_VALIDITY_DAYS
      );

      const ticketsToCreate = Array.from(
        { length: order.quantity },
        (_, index) => {
          const qrCodeData: QRCodeData = {
            ticket_id: "", // Sera rempli après insertion
            ticket_code: "", // Auto-généré par trigger
            cinema_name: order.cinema.name,
            cinema_location: order.cinema.location,
            order_id: order.id,
            user_email: "", // À remplir côté API
            expires_at: expiresAt.toISOString(),
            generated_at: new Date().toISOString(),
          };

          return {
            order_id: order.id,
            qr_code_data: JSON.stringify(qrCodeData),
            expires_at: expiresAt.toISOString(),
          };
        }
      );

      const { data: tickets, error } = await supabase
        .from("cinema_tickets")
        .insert(ticketsToCreate)
        .select("*");

      if (error) {
        throw this.createError("TICKET_EXPIRED", error.message);
      }

      return tickets || [];
    } catch (error) {
      console.error("Erreur lors de la génération des tickets:", error);
      throw error;
    }
  }

  /**
   * Récupérer les tickets d'une commande
   */
  static async getOrderTickets(orderId: string): Promise<CinemaTicket[]> {
    try {
      const { data: tickets, error } = await supabase
        .from("cinema_tickets")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at");

      if (error) {
        throw this.createError("TICKET_EXPIRED", error.message);
      }

      return tickets || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des tickets:", error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques cinéma (admin uniquement)
   */
  static async getCinemaStats(): Promise<CinemaStats> {
    try {
      const { data, error } = await supabase.rpc("get_cinema_stats");

      if (error) {
        console.error("Erreur RPC get_cinema_stats:", error);
        // Fallback: calcul manuel des stats
        return await this.getCinemaStatsFallback();
      }

      return data as CinemaStats;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw error;
    }
  }

  /**
   * Fallback pour statistiques si RPC échoue
   */
  private static async getCinemaStatsFallback(): Promise<CinemaStats> {
    // Implémentation simplifiée des stats
    const { data: allOrders, error } = await supabase
      .from("cinema_orders")
      .select(
        "total_amount, quantity, created_at, cinema:cinemas(name, location)"
      )
      .eq("status", "paid");

    if (error) {
      throw this.createError("ORDER_NOT_FOUND", error.message);
    }

    const orders = allOrders || [];
    const currentMonth = new Date().toISOString().slice(0, 7);
    const ordersThisMonth = orders.filter((order) =>
      order.created_at.startsWith(currentMonth)
    );

    return {
      total_orders: orders.length,
      total_revenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
      total_tickets_sold: orders.reduce(
        (sum, order) => sum + order.quantity,
        0
      ),
      orders_this_month: ordersThisMonth.length,
      revenue_this_month: ordersThisMonth.reduce(
        (sum, order) => sum + order.total_amount,
        0
      ),
      cinema_breakdown: [], // Implémentation simplifiée
    };
  }

  /**
   * Rechercher des commandes avec filtres (admin)
   */
  static async searchOrders(
    params: CinemaSearchParams
  ): Promise<PaginatedResponse<CinemaOrder>> {
    try {
      let query = supabase
        .from("cinema_orders")
        .select("*, cinema:cinemas(*), tickets:cinema_tickets(count)", {
          count: "exact",
        });

      // Appliquer les filtres
      if (params.status) {
        query = query.eq("status", params.status);
      }
      if (params.cinema_id) {
        query = query.eq("cinema_id", params.cinema_id);
      }
      if (params.start_date) {
        query = query.gte("created_at", params.start_date);
      }
      if (params.end_date) {
        query = query.lte("created_at", params.end_date);
      }

      // Pagination
      const limit = params.limit || 20;
      const offset = params.offset || 0;
      query = query.range(offset, offset + limit - 1);
      query = query.order("created_at", { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        throw this.createError("ORDER_NOT_FOUND", error.message);
      }

      return {
        data: data || [],
        total: count || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        has_more: (count || 0) > offset + limit,
      };
    } catch (error) {
      console.error("Erreur lors de la recherche des commandes:", error);
      throw error;
    }
  }

  /**
   * Créer une erreur typée pour le module cinéma
   */
  private static createError(
    code: CinemaErrorCode,
    message?: string
  ): CinemaError {
    return {
      code,
      message: message || CINEMA_ERROR_MESSAGES[code],
    };
  }

  /**
   * Valider un ticket par son code (pour les cinémas)
   */
  static async validateTicket(
    ticketCode: string
  ): Promise<{ valid: boolean; ticket?: CinemaTicket; error?: string }> {
    try {
      const { data: ticket, error } = await supabase
        .from("cinema_tickets")
        .select("*, order:cinema_orders(*, cinema:cinemas(*))")
        .eq("ticket_code", ticketCode)
        .single();

      if (error || !ticket) {
        return { valid: false, error: "Ticket non trouvé" };
      }

      // Vérifier si le ticket a expiré
      if (new Date(ticket.expires_at) < new Date()) {
        return { valid: false, error: "Ticket expiré" };
      }

      // Vérifier si le ticket a déjà été utilisé
      if (ticket.is_used) {
        return { valid: false, error: "Ticket déjà utilisé", ticket };
      }

      return { valid: true, ticket };
    } catch (error) {
      console.error("Erreur lors de la validation du ticket:", error);
      return { valid: false, error: "Erreur de validation" };
    }
  }

  /**
   * Marquer un ticket comme utilisé
   */
  static async markTicketAsUsed(ticketId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("cinema_tickets")
        .update({
          is_used: true,
          used_at: new Date().toISOString(),
        })
        .eq("id", ticketId);

      if (error) {
        throw this.createError("TICKET_ALREADY_USED", error.message);
      }
    } catch (error) {
      console.error("Erreur lors du marquage du ticket:", error);
      throw error;
    }
  }
}
