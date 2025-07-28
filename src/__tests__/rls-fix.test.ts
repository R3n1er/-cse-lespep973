import { createClient } from "@supabase/supabase-js";
import { describe, it, expect } from "vitest";
import { login, logout, supabase, TEST_EMAIL } from "./utils";

describe("Correction RLS Supabase", () => {
  let userId: string | undefined;

  it("Authentification", async () => {
    const user = await login();
    expect(user).toBeDefined();
    userId = user?.id;
  });

  it("Accès à la table users", async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBe(userId);
  });

  it("Mise à jour du profil utilisateur", async () => {
    const { error } = await supabase
      .from("users")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", userId);
    expect(error).toBeNull();
  });

  it("Déconnexion", async () => {
    await expect(logout()).resolves.toBe(true);
  });
});
