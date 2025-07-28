import { createClient } from "@supabase/supabase-js";
import { describe, it, expect } from "vitest";
import { login, logout, supabase } from "./utils";

describe("Flux complet interface utilisateur (UI Flow)", () => {
  let userId: string | undefined;
  let sessionToken: string | undefined;

  it("Connexion et récupération de session", async () => {
    const user = await login();
    expect(user).toBeDefined();
    userId = user?.id;
    const { data: sessionData } = await supabase.auth.getSession();
    expect(sessionData.session).toBeDefined();
    sessionToken = sessionData.session?.access_token;
    expect(sessionToken).toBeTruthy();
  });

  it("Récupération de la session active", async () => {
    const { data } = await supabase.auth.getSession();
    expect(data.session).toBeDefined();
  });

  it("Accès aux données utilisateur", async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBe(userId);
  });

  it("Simulation de redirection et accès dashboard", async () => {
    expect(sessionToken).toBeTruthy();
    // Simuler une redirection si besoin
  });

  it("Déconnexion", async () => {
    await expect(logout()).resolves.toBe(true);
  });
});
