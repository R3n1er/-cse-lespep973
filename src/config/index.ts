export const config = {
  app: {
    name: "CSE Les PEP 973",
    description: "Portail du Comité Social et Économique des PEP 973",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    version: "1.0.0",
  },
  auth: {
    providers: ["supabase"],
    redirects: {
      signIn: "/dashboard",
      signOut: "/",
      error: "/auth/login",
    },
    session: {
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    },
  },
  features: {
    blog: {
      enabled: true,
      categories: [
        "Actualités",
        "Tickets",
        "Remboursements",
        "Avantages",
        "Événements",
        "Partenaires",
      ],
      maxPostsPerPage: 12,
    },
    tickets: {
      enabled: true,
      categories: ["cinema", "loisirs", "culture", "transport"],
      maxPerUser: 5,
    },
    newsletter: {
      enabled: true,
      provider: "mailgun",
    },
    payments: {
      enabled: false,
      provider: "stripe",
    },
  },
  database: {
    provider: "supabase",
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  email: {
    provider: "mailgun",
    from: "noreply@cse-lespep973.fr",
    templates: {
      welcome: "welcome",
      newsletter: "newsletter",
      ticketConfirmation: "ticket-confirmation",
    },
  },
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
    },
    headers: {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "origin-when-cross-origin",
    },
  },
  testing: {
    framework: "vitest",
    coverage: {
      threshold: 80,
      exclude: ["src/types", "src/lib/data/mock*"],
    },
  },
  deployment: {
    platform: "vercel",
    environment: process.env.NODE_ENV || "development",
  },
};

export type AppConfig = typeof config;
export type FeatureConfig = typeof config.features;
export type AuthConfig = typeof config.auth;
