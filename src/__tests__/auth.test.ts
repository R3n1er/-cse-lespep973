import { createClient } from "@supabase/supabase-js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { login, logout, supabase, TEST_EMAIL } from "./utils";

describe("Authentification Supabase", () => {
  let userId: string | undefined;

  it("Connexion avec identifiants valides", async () => {
    const user = await login();
    expect(user).toBeDefined();
    expect(user?.email).toBe(TEST_EMAIL);
    userId = user?.id;
  });

  it("Récupération de l'utilisateur connecté", async () => {
    const { data } = await supabase.auth.getUser();
    expect(data.user).toBeDefined();
    expect(data.user?.id).toBe(userId);
  });

  it("Récupération du profil utilisateur en base", async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBe(userId);
  });

  it("Déconnexion", async () => {
    await expect(logout()).resolves.toBe(true);
  });
});
