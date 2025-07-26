// Configuration Sentry pour l'application CSE Les PEP 973
// Monitoring et tracking des erreurs

import * as Sentry from "@sentry/nextjs";

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Configuration de l'environnement
    environment: process.env.NODE_ENV,

    // Taux d'échantillonnage des performances
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Taux d'échantillonnage des replays
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Configuration pour Next.js
    integrations: [
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Filtrage des erreurs
    beforeSend(event, hint) {
      // Filtrer les erreurs de développement
      if (process.env.NODE_ENV === "development") {
        return null;
      }

      // Filtrer les erreurs réseau spécifiques
      if (event.exception?.values?.[0]?.value?.includes("Network Error")) {
        return null;
      }

      // Filtrer les erreurs CORS
      if (event.exception?.values?.[0]?.value?.includes("CORS")) {
        return null;
      }

      return event;
    },

    // Configuration des tags par défaut
    initialScope: {
      tags: {
        component: "cse-app",
        version: process.env.npm_package_version || "unknown",
      },
    },
  });
};

// Fonction utilitaire pour capturer des erreurs avec contexte
export const captureError = (
  error: Error,
  context?: {
    user?: { id: string; email?: string };
    extra?: Record<string, any>;
    tags?: Record<string, string>;
    level?: Sentry.SeverityLevel;
  }
) => {
  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser(context.user);
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.level) {
      scope.setLevel(context.level);
    }

    Sentry.captureException(error);
  });
};

// Fonction pour capturer des messages personnalisés
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: {
    user?: { id: string; email?: string };
    extra?: Record<string, any>;
    tags?: Record<string, string>;
  }
) => {
  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser(context.user);
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    scope.setLevel(level);
    Sentry.captureMessage(message);
  });
};

// Fonction pour tracker les performances
export const startTransaction = (name: string, operation: string) => {
  return Sentry.startTransaction({
    name,
    op: operation,
  });
};

// Hook pour React Error Boundary
export const withSentryErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return Sentry.withErrorBoundary(Component, {
    fallback: ({ error, resetError }) => (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4 p-8">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900">
            Une erreur s'est produite
          </h1>
          <p className="text-gray-600 max-w-md">
            Nous sommes désolés, mais quelque chose s'est mal passé. Notre
            équipe a été notifiée et travaille à résoudre le problème.
          </p>
          <button
            onClick={resetError}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    ),
    showDialog: false,
  });
};

// Fonction pour définir l'utilisateur
export const setUser = (user: {
  id: string;
  email?: string;
  username?: string;
  role?: string;
}) => {
  Sentry.setUser(user);
};

// Fonction pour nettoyer l'utilisateur (déconnexion)
export const clearUser = () => {
  Sentry.setUser(null);
};

// Middleware pour tracker les erreurs API
export const withSentryApi = (handler: any) => {
  return Sentry.wrapApiHandlerWithSentry(handler, "/api");
};

// Types d'erreurs personnalisés pour l'application CSE
export class CSEError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode: number = 500) {
    super(message);
    this.name = "CSEError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class AuthenticationError extends CSEError {
  constructor(message: string = "Erreur d'authentification") {
    super(message, "AUTH_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends CSEError {
  constructor(message: string = "Accès non autorisé") {
    super(message, "AUTHORIZATION_ERROR", 403);
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends CSEError {
  constructor(message: string = "Données invalides") {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends CSEError {
  constructor(message: string = "Erreur de base de données") {
    super(message, "DATABASE_ERROR", 500);
    this.name = "DatabaseError";
  }
}

// Configuration des échantillonnages selon l'environnement
export const getSentryConfig = () => {
  const config = {
    development: {
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 1.0,
      debug: true,
    },
    staging: {
      tracesSampleRate: 0.5,
      replaysSessionSampleRate: 0.3,
      debug: false,
    },
    production: {
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      debug: false,
    },
  };

  const env = process.env.NODE_ENV as keyof typeof config;
  return config[env] || config.production;
};
