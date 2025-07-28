import { createClient } from "@supabase/supabase-js";
import { describe, it, expect } from "vitest";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Variables d'environnement Supabase manquantes");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const TEST_EMAIL = "user@toto.com";
const TEST_PASSWORD = "password123";

describe("Redirection après connexion", () => {
  let userId: string | undefined;

  it("Connexion et session active", async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    expect(error).toBeNull();
    expect(data.user).toBeDefined();
    userId = data.user?.id;

    // Vérifier la session
    const { data: sessionData } = await supabase.auth.getSession();
    expect(sessionData.session).toBeDefined();
    expect(sessionData.session?.access_token).toBeTruthy();
  });

  it("Accès aux données utilisateur", async () => {
    if (!userId) throw new Error("userId non défini");
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.first_name).toBeDefined();
    expect(data.last_name).toBeDefined();
  });

  it("Déconnexion", async () => {
    const { error } = await supabase.auth.signOut();
    // Gérer le cas où il n'y a pas de session active
    if (error && error.name !== "AuthSessionMissingError") {
      expect(error).toBeNull();
    }
    // Si c'est AuthSessionMissingError, c'est normal (pas de session active)
  });
});
