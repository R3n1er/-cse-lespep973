import { createClient } from "@supabase/supabase-js";

// Client Supabase unique pour éviter les instances multiples
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "supabase-auth-token",
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    flowType: "pkce",
  },
});

// Fonction pour créer un client si nécessaire (pour les scripts)
export const createSupabaseClient = () => supabase;
