import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Définir les routes publiques qui ne nécessitent pas d'authentification
export const publicRoutes = [
  "/",
  "/blog",
  "/contact",
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/mentions-legales",
  "/politique-confidentialite",
  "/cgu",
];

// Définir les routes d'authentification
export const authRoutes = ["/auth/login", "/auth/register", "/auth/verify"];

// Définir les préfixes de routes pour différents types d'utilisateurs
export const routePrefix = {
  admin: "/admin",
  dashboard: "/dashboard",
};

// Fonction pour vérifier si un utilisateur a un rôle spécifique
export const hasRole = (userData: any, role: string) => {
  try {
    return userData?.publicMetadata?.role === role;
  } catch (error) {
    console.error("Erreur lors de la vérification du rôle:", error);
    return false;
  }
};

// Fonction pour rediriger vers la page de connexion
export const redirectToLogin = (request: NextRequest) => {
  const signInUrl = new URL("/auth/login", request.url);
  signInUrl.searchParams.set("redirect_url", request.url);
  return NextResponse.redirect(signInUrl);
};

// Fonction pour protéger les routes
export const protectRoute = (request: NextRequest) => {
  const authObject = auth();

  // Si l'utilisateur n'est pas connecté et que la route n'est pas publique
  if (!authObject.userId && !publicRoutes.includes(request.nextUrl.pathname)) {
    return redirectToLogin(request);
  }

  // Si l'utilisateur est connecté et essaie d'accéder à une route d'authentification
  if (authObject.userId && authRoutes.includes(request.nextUrl.pathname)) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  // Vérification des accès aux routes administratives
  if (
    authObject.userId &&
    request.nextUrl.pathname.startsWith(routePrefix.admin) &&
    !hasRole(authObject.user, "admin")
  ) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};
