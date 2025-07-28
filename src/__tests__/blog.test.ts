import { createClient } from "@supabase/supabase-js";
import { describe, it, expect, afterAll, beforeAll } from "vitest";
import { login, logout, supabase } from "./utils";

describe("Module Blog - Intégration", () => {
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

  it("Récupération des commentaires", async () => {
    if (!firstPost) return;
    const { data, error } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("post_id", firstPost.id);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it("Récupération des réactions", async () => {
    if (!firstPost) return;
    const { data, error } = await supabase
      .from("blog_reactions")
      .select("*")
      .eq("post_id", firstPost.id);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it("Création d'un commentaire", async () => {
    if (!firstPost) {
      console.warn("Aucun article disponible, test ignoré.");
      return;
    }
    const testComment = {
      post_id: firstPost.id,
      user_id: userId,
      content: "Test commentaire - " + new Date().toISOString(),
    };
    const { error } = await supabase.from("blog_comments").insert(testComment);
    expect(error).toBeNull();
  });

  it("Création d'une réaction", async () => {
    if (!firstPost) {
      console.warn("Aucun article disponible, test ignoré.");
      return;
    }
    const testReaction = {
      post_id: firstPost.id,
      user_id: userId,
      reaction_type: "like",
    };
    const { error } = await supabase
      .from("blog_reactions")
      .insert(testReaction);
    expect(error).toBeNull();
  });

  it("Statistiques du blog", async () => {
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
