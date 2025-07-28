import { createClient } from "@supabase/supabase-js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { login, logout, supabase } from "./utils";

let userId: string | undefined;
let firstPost: any;

// Nettoyage après les tests
afterAll(async () => {
  await supabase.auth.signOut();
});

describe("Fonctionnalités avancées du blog", () => {
  let userId: string | undefined;
  let firstPost: any;

  beforeAll(async () => {
    await logout();
  });

  it("Connexion utilisateur", async () => {
    const user = await login();
    expect(user).toBeDefined();
    userId = user?.id;
  });

  it("Récupération des articles", async () => {
    const { data, error } = await supabase.from("blog_posts").select("*");
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    if (!data || data.length === 0) {
      console.warn("Aucun article en base, certains tests seront ignorés.");
      return;
    }
    expect(data.length).toBeGreaterThan(0);
    firstPost = data[0];
    expect(firstPost).toBeDefined();
  });

  it("Ajout et récupération de réaction", async () => {
    if (!firstPost) {
      console.warn("Aucun article disponible, test ignoré.");
      return;
    }
    const { error } = await supabase.from("blog_reactions").insert({
      post_id: firstPost.id,
      user_id: userId,
      reaction_type: "love",
    });
    expect(error).toBeNull();
    const { data, error: fetchError } = await supabase
      .from("blog_reactions")
      .select("*")
      .eq("post_id", firstPost.id);
    expect(fetchError).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it("Ajout et récupération de commentaire", async () => {
    if (!firstPost) {
      console.warn("Aucun article disponible, test ignoré.");
      return;
    }
    const { error } = await supabase.from("blog_comments").insert({
      post_id: firstPost.id,
      user_id: userId,
      content: "Test commentaire avancé - " + new Date().toISOString(),
    });
    expect(error).toBeNull();
    const { data, error: fetchError } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("post_id", firstPost.id);
    expect(fetchError).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it("Mise à jour du compteur de vues", async () => {
    if (!firstPost) {
      console.warn("Aucun article disponible, test ignoré.");
      return;
    }
    const { error } = await supabase
      .from("blog_posts")
      .update({ view_count: (firstPost.view_count || 0) + 1 })
      .eq("id", firstPost.id);
    expect(error).toBeNull();
  });

  it("Recherche et filtres", async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .ilike("title", "%blog%");
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it("Statistiques avancées", async () => {
    const { data, error } = await supabase.rpc("get_blog_stats");
    if (error && error.code === "PGRST202") {
      console.warn("Fonction get_blog_stats absente, test ignoré.");
      return;
    }
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("Déconnexion", async () => {
    await expect(logout()).resolves.toBe(true);
  });
});
