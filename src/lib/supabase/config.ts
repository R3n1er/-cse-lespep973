import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export type { Database };

// Client Supabase pour le côté client
export const createSupabaseClient = () => createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const supabase = createSupabaseClient();
