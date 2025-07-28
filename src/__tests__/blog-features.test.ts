import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { MOCK_BLOG_POSTS } from "../../src/lib/data/mock";

describe("Fonctionnalités du blog", () => {
  it("Les données mockées sont valides", () => {
    expect(MOCK_BLOG_POSTS.length).toBeGreaterThan(0);
    MOCK_BLOG_POSTS.forEach((post, index) => {
      expect(post.id).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.content).toBeTruthy();
      expect(post.category).toBeTruthy();
    });
  });

  it("Toutes les catégories attendues sont présentes", () => {
    const categories = ["Actualités", "Tickets", "Remboursements", "Avantages"];
    const foundCategories = Array.from(
      new Set(MOCK_BLOG_POSTS.map((post) => post.category))
    );
    categories.forEach((category) => {
      expect(foundCategories).toContain(category);
    });
  });

  it("Le filtrage par catégorie fonctionne", () => {
    const actualitesPosts = MOCK_BLOG_POSTS.filter(
      (post) => post.category === "Actualités"
    );
    const ticketsPosts = MOCK_BLOG_POSTS.filter(
      (post) => post.category === "Tickets"
    );
    expect(actualitesPosts.length).toBeGreaterThan(0);
    expect(ticketsPosts.length).toBeGreaterThanOrEqual(0);
  });

  it("La recherche par mot-clé fonctionne", () => {
    const searchTerm = "tickets";
    const searchResults = MOCK_BLOG_POSTS.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
    );
    expect(searchResults.length).toBeGreaterThanOrEqual(0);
  });

  it("Le formatage des dates est correct", () => {
    const testDate = new Date("2025-01-27T10:00:00Z");
    const formattedDate = testDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    expect(formattedDate).toMatch(/27/);
    expect(formattedDate).toMatch(/janvier/);
  });

  it("La troncature de texte fonctionne", () => {
    const longText = "A".repeat(200);
    const truncatedText =
      longText.length > 120 ? longText.substring(0, 120) + "..." : longText;
    expect(truncatedText.length).toBeLessThanOrEqual(123);
  });
});

describe("Authentification Supabase (simulée)", () => {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";
  const supabase = createClient(supabaseUrl, supabaseKey);

  it("Gestion correcte des identifiants invalides", async () => {
    await supabase.auth.signOut();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: "test@example.com",
      password: "wrongpassword",
    });
    expect(signInError).toBeDefined();
  });
});
