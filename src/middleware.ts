import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasRole, publicRoutes, routePrefix } from "@/lib/clerk/config";

// Supprimer l'import Supabase

// Nettoyer les anciennes routes Supabase
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Créer le client Supabase
  const { userId, sessionClaims } = await auth();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!userId && !publicRoutes.includes(pathname)) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si l'utilisateur est connecté, vérifier les accès
  if (userId) {
    // Rediriger depuis les routes d'authentification
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Vérifier les accès admin
    if (
      pathname.startsWith(routePrefix.admin) &&
      !hasRole(sessionClaims, "admin")
    ) {
      // Rediriger vers la page d'accueil si l'utilisateur n'a pas le rôle requis
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Rediriger vers le tableau de bord si l'utilisateur est déjà connecté et essaie d'accéder à la page de connexion ou d'inscription
    if (
      pathname.startsWith("/auth/login") ||
      pathname.startsWith("/auth/register")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Intercepter la route d'inscription Clerk
  if (request.nextUrl.pathname.startsWith("/sign-up")) {
    const email = request.nextUrl.searchParams.get("email");
    if (email && email.endsWith("@lepep973.org")) {
      // Rediriger ou bloquer l'inscription
      const url = new URL("/auth/register", request.url);
      url.searchParams.set("error", "domaine");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Spécifier les routes sur lesquelles le middleware doit s'exécuter
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
