// Hooks SWR personnalisés pour l'application CSE Les PEP 973
// Gestion optimisée des données avec cache et révalidation automatique

import useSWR from "swr";
import { supabase } from "@/lib/supabase/config";
import {
  CinemaTicket,
  BlogPost,
  BlogComment,
  NewsletterSubscription,
  UserProfile,
  CinemaOrder,
} from "@/types";

// Fonction fetcher générique pour Supabase
const supabaseFetcher = async (query: string) => {
  const { data, error } = await supabase.rpc(query);
  if (error) throw error;
  return data;
};

// Fonction fetcher pour les requêtes SELECT simples
const tableFetcher = async ([table, filters]: [string, any]) => {
  let query = supabase.from(table).select("*");

  // Appliquer les filtres
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Hook pour les tickets de cinéma disponibles
export function useCinemaTickets(filters?: {
  cinema?: string;
  available?: boolean;
}) {
  const key = ["cinema_tickets", filters];

  const fetcher = async () => {
    let query = supabase
      .from("cinema_tickets" as any)
      .select("*")
      .gt("stock_quantity", 0)
      .gte("available_until", new Date().toISOString().split("T")[0])
      .order("cinema")
      .order("price");

    if (filters?.cinema && filters.cinema !== "all") {
      query = query.eq("cinema", filters.cinema);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as CinemaTicket[];
  };

  return useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
  });
}

// Hook pour les articles de blog
export function useBlogPosts(limit?: number, category?: string) {
  const key = ["blog_posts", { limit, category }];

  const fetcher = async () => {
    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as BlogPost[];
  };

  return useSWR(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });
}

// Hook pour les commentaires d'un article
export function useBlogComments(postId: string) {
  const key = ["blog_comments", postId];

  const fetcher = async () => {
    const { data, error } = await supabase
      .from("blog_comments")
      .select(
        `
        *,
        user:users(first_name, last_name)
      `
      )
      .eq("post_id", postId)
      .eq("is_approved", true)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  };

  return useSWR(key, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 30000, // 30 seconds
  });
}

// Hook pour le profil utilisateur
export function useUserProfile(userId?: string) {
  const key = userId ? ["user_profile", userId] : null;

  const fetcher = async () => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as UserProfile;
  };

  return useSWR(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000, // 10 minutes
  });
}

// Hook pour les commandes de l'utilisateur
export function useUserOrders(userId?: string) {
  const key = userId ? ["user_orders", userId] : null;

  const fetcher = async () => {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("cinema_orders" as any)
      .select(
        `
        *,
        items:cinema_order_items(*,
          ticket:cinema_tickets(*)
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as CinemaOrder[];
  };

  return useSWR(key, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 60000, // 1 minute
  });
}

// Hook pour les statistiques utilisateur
export function useUserStats(userId?: string) {
  const key = userId ? ["user_stats", userId] : null;

  const fetcher = async () => {
    if (!userId) return null;

    // Récupérer les statistiques en parallèle
    const [commentsResult, reactionsResult, ordersResult, newsletterResult] =
      await Promise.all([
        supabase.from("blog_comments").select("id").eq("user_id", userId),
        supabase.from("blog_reactions").select("id").eq("user_id", userId),
        supabase
          .from("cinema_orders" as any)
          .select("total_amount")
          .eq("user_id", userId)
          .eq("status", "delivered"),
        supabase
          .from("newsletter_subscriptions")
          .select("active")
          .eq("user_id", userId)
          .single(),
      ]);

    const totalSpent =
      ordersResult.data?.reduce((sum, order) => sum + order.total_amount, 0) ||
      0;

    return {
      total_comments: commentsResult.data?.length || 0,
      total_reactions: reactionsResult.data?.length || 0,
      total_orders: ordersResult.data?.length || 0,
      total_spent: totalSpent,
      newsletter_subscribed: newsletterResult.data?.active || false,
      last_activity: new Date().toISOString(),
    };
  };

  return useSWR(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });
}

// Hook pour rechercher des contenus
export function useSearch(query: string, type: "posts" | "tickets" = "posts") {
  const key = query.length >= 2 ? ["search", query, type] : null;

  const fetcher = async () => {
    if (type === "posts") {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as BlogPost[];
    }

    if (type === "tickets") {
      const { data, error } = await supabase
        .from("cinema_tickets" as any)
        .select("*")
        .or(
          `cinema_name.ilike.%${query}%,ticket_type.ilike.%${query}%,description.ilike.%${query}%`
        )
        .gt("stock_quantity", 0)
        .order("cinema")
        .limit(10);

      if (error) throw error;
      return data as CinemaTicket[];
    }

    return [];
  };

  return useSWR(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000, // 30 seconds
  });
}

// Hook pour les abonnements newsletter
export function useNewsletterSubscription(email?: string) {
  const key = email ? ["newsletter_subscription", email] : null;

  const fetcher = async () => {
    if (!email) return null;

    const { data, error } = await supabase
      .from("newsletter_subscriptions")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") throw error; // Ignore "not found" errors
    return data as NewsletterSubscription | null;
  };

  return useSWR(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });
}

// Fonction utilitaire pour invalider le cache
export const mutateCache = {
  tickets: () => useSWR.mutate(["cinema_tickets"]),
  posts: () => useSWR.mutate(["blog_posts"]),
  comments: (postId: string) => useSWR.mutate(["blog_comments", postId]),
  userProfile: (userId: string) => useSWR.mutate(["user_profile", userId]),
  userOrders: (userId: string) => useSWR.mutate(["user_orders", userId]),
  userStats: (userId: string) => useSWR.mutate(["user_stats", userId]),
};

// Provider SWR avec configuration globale
export const swrConfig = {
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  loadingTimeout: 10000,
  onErrorRetry: (
    error: any,
    key: string,
    config: any,
    revalidate: any,
    { retryCount }: any
  ) => {
    // Ne pas retry sur les erreurs 404
    if (error.status === 404) return;

    // Ne pas retry après 3 tentatives
    if (retryCount >= 3) return;

    // Retry après 5 secondes
    setTimeout(() => revalidate({ retryCount }), 5000);
  },
};
