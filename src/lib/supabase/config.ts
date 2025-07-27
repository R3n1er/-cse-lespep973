import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export type { Database };

// Client Supabase unique pour éviter les instances multiples
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "supabase-auth-token",
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

// Fonction pour créer un client si nécessaire (pour les scripts)
export const createSupabaseClient = () => supabase;
