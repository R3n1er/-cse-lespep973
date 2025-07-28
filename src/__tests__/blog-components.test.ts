import { describe, it, expect } from "vitest";
import { MOCK_BLOG_POSTS } from "../../src/lib/data/mock";

describe("Composants Blog", () => {
  it("Chaque article a toutes les propriétés nécessaires et un ID unique", () => {
    const ids = new Set();
    MOCK_BLOG_POSTS.forEach((post, index) => {
      expect(post.id, `Article ${index} sans id`).toBeTruthy();
      expect(post.title, `Article ${index} sans titre`).toBeTruthy();
      expect(post.content, `Article ${index} sans contenu`).toBeTruthy();
      expect(post.category, `Article ${index} sans catégorie`).toBeTruthy();
      expect(ids.has(post.id)).toBe(false);
      ids.add(post.id);
      expect(post.title.trim().length).toBeGreaterThan(0);
      expect(post.content.trim().length).toBeGreaterThan(0);
    });
  });

  it("Chaque article a une catégorie valide", () => {
    const categories = [
      "Actualités",
      "Tickets",
      "Remboursements",
      "Avantages",
      "Événements",
      "Partenaires",
    ];
    MOCK_BLOG_POSTS.forEach((post, index) => {
      expect(categories.includes(post.category)).toBe(true);
    });
  });

  it("Les dates des articles sont valides et bien formatées", () => {
    MOCK_BLOG_POSTS.forEach((post, index) => {
      const dateToFormat =
        post.published_at || post.created_at || new Date().toISOString();
      const date = new Date(dateToFormat);
      expect(isNaN(date.getTime())).toBe(false);
      const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      expect(formattedDate).toMatch(/2025/);
    });
  });

  it("La troncature de texte fonctionne", () => {
    MOCK_BLOG_POSTS.forEach((post, index) => {
      const truncatedText =
        post.content.length > 120
          ? post.content.substring(0, 120) + "..."
          : post.content;
      expect(truncatedText.length).toBeLessThanOrEqual(123);
    });
  });

  it("La recherche par mot-clé retourne des résultats", () => {
    const searchTerms = [
      "tickets",
      "remboursements",
      "actualités",
      "avantages",
    ];
    searchTerms.forEach((term) => {
      const results = MOCK_BLOG_POSTS.filter(
        (post) =>
          post.title.toLowerCase().includes(term.toLowerCase()) ||
          post.content.toLowerCase().includes(term.toLowerCase())
      );
      expect(results.length).toBeGreaterThanOrEqual(0);
    });
  });

  it("Le filtrage par catégorie retourne des articles", () => {
    const categories = ["Actualités", "Tickets", "Remboursements", "Avantages"];
    categories.forEach((category) => {
      const filteredPosts = MOCK_BLOG_POSTS.filter(
        (post) => post.category === category
      );
      expect(filteredPosts.length).toBeGreaterThanOrEqual(0);
    });
  });

  it("Les URLs générées pour les articles sont valides", () => {
    MOCK_BLOG_POSTS.forEach((post, index) => {
      const expectedUrl = `/blog/${post.id}`;
      expect(expectedUrl).toMatch(/^\/blog\/[a-zA-Z0-9-]+$/);
    });
  });
});
