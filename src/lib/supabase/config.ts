import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Types pour les tables Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: "salarie" | "gestionnaire" | "admin" | "tresorerie";
          created_at: string;
          updated_at: string;
          first_name: string;
          last_name: string;
          matricule: string;
          phone: string | null;
          address: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          role?: "salarie" | "gestionnaire" | "admin" | "tresorerie";
          created_at?: string;
          updated_at?: string;
          first_name: string;
          last_name: string;
          matricule: string;
          phone?: string | null;
          address?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "salarie" | "gestionnaire" | "admin" | "tresorerie";
          created_at?: string;
          updated_at?: string;
          first_name?: string;
          last_name?: string;
          matricule?: string;
          phone?: string | null;
          address?: string | null;
          is_active?: boolean;
        };
      };
      tickets: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          stock: number;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          stock: number;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          stock?: number;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          ticket_id: string;
          quantity: number;
          status: "pending" | "confirmed" | "delivered" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ticket_id: string;
          quantity: number;
          status?: "pending" | "confirmed" | "delivered" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ticket_id?: string;
          quantity?: number;
          status?: "pending" | "confirmed" | "delivered" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
      };
      reimbursements: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          description: string;
          status: "pending" | "approved" | "rejected";
          proof_url: string;
          created_at: string;
          updated_at: string;
          approved_by: string | null;
          approved_at: string | null;
          is_exception: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          description: string;
          status?: "pending" | "approved" | "rejected";
          proof_url: string;
          created_at?: string;
          updated_at?: string;
          approved_by?: string | null;
          approved_at?: string | null;
          is_exception?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          description?: string;
          status?: "pending" | "approved" | "rejected";
          proof_url?: string;
          created_at?: string;
          updated_at?: string;
          approved_by?: string | null;
          approved_at?: string | null;
          is_exception?: boolean;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: string;
          author_id: string;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          is_published: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category: string;
          author_id: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          is_published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: string;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          is_published?: boolean;
        };
      };
    };
  };
};

// Créer un client Supabase pour le côté serveur
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // Gérer les erreurs de cookies en mode lecture seule
            console.error("Erreur lors de la définition du cookie:", error);
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch (error) {
            // Gérer les erreurs de cookies en mode lecture seule
            console.error("Erreur lors de la suppression du cookie:", error);
          }
        },
      },
    }
  );
};

// Créer un client Supabase pour le côté client
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
