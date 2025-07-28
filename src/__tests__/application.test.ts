import { createClient } from "@supabase/supabase-js";
import { describe, it, expect, beforeAll } from "vitest";
import { login, logout, supabase } from "./utils";

async function isServerRunning(url = "http://localhost:3000") {
  try {
    const res = await fetch(url);
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

describe("Test d'intégration complet de l'application", () => {
  let userId: string | undefined;
  let serverAvailable: boolean;

  beforeAll(async () => {
    await logout();
    serverAvailable = await isServerRunning();
  });

  it("Authentification utilisateur", async () => {
    const user = await login();
    expect(user).toBeDefined();
    userId = user?.id;
    const { data: sessionData } = await supabase.auth.getSession();
    expect(sessionData.session).toBeDefined();
  });

  it("Accès aux tables principales", async () => {
    const TABLES = [
      "users",
      "blog_posts",
      "blog_comments",
      "blog_reactions",
      "cinema_tickets",
      "orders",
      "newsletter_subscriptions",
    ];
    for (const table of TABLES) {
      const { error } = await supabase.from(table).select("*").limit(1);
      expect(error).toBeNull();
    }
  });

  it("Déconnexion", async () => {
    await expect(logout()).resolves.toBe(true);
  });

  describe("Tests nécessitant le serveur Next.js", () => {
    beforeAll(async () => {
      serverAvailable = await isServerRunning();
      if (!serverAvailable) {
        // eslint-disable-next-line no-console
        console.warn("Serveur Next.js non démarré, ces tests seront ignorés.");
      }
    });

    (serverAvailable ? it : it.skip)(
      "Accès aux endpoints HTTP principaux",
      async () => {
        const ENDPOINTS = [
          "/",
          "/auth/login",
          "/auth/register",
          "/blog",
          "/newsletter",
          "/contact",
        ];
        const baseUrl = "http://localhost:3000";
        for (const endpoint of ENDPOINTS) {
          const response = await fetch(`${baseUrl}${endpoint}`);
          expect(response.status).toBeLessThan(500);
        }
      }
    );

    (serverAvailable ? it : it.skip)(
      "Middleware : redirection dashboard sans authentification",
      async () => {
        await logout();
        const response = await fetch("http://localhost:3000/dashboard", {
          redirect: "manual",
        });
        expect([301, 302, 307, 308]).toContain(response.status);
      }
    );
  });
});
