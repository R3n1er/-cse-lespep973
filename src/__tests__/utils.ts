import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Variables d'environnement Supabase manquantes");
}

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

export const TEST_EMAIL = "user@toto.com";
export const TEST_PASSWORD = "password123";

export async function login(email = TEST_EMAIL, password = TEST_PASSWORD) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
}

export async function logout() {
  // Gérer le cas où la session est déjà absente
  const { error } = await supabase.auth.signOut();
  if (error && error.name !== "AuthSessionMissingError") {
    throw error;
  }
  return true;
}
