import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Vérifier les cookies de session Supabase (noms corrects)
  const supabaseCookies = req.cookies
    .getAll()
    .filter(
      (cookie) =>
        cookie.name.startsWith("sb-") ||
        cookie.name.includes("supabase") ||
        cookie.name.includes("auth")
    );

  console.log(
    "🔍 Middleware - Cookies Supabase:",
    supabaseCookies.map((c) => c.name)
  );

  // Vérifier les cookies spécifiques Supabase
  const accessToken = req.cookies.get(
    "sb-uonrqbxplvlfuqblpwnf-auth-token"
  )?.value;
  const refreshToken = req.cookies.get(
    "sb-uonrqbxplvlfuqblpwnf-auth-refresh-token"
  )?.value;

  console.log("🔍 Middleware - Access Token:", !!accessToken);
  console.log("🔍 Middleware - Refresh Token:", !!refreshToken);

  // Essayer de récupérer la session
  let session = null;
  try {
    const {
      data: { session: sessionData },
    } = await supabase.auth.getSession();
    session = sessionData;
  } catch (error) {
    console.log("🔍 Middleware - Erreur session:", error);
  }

  console.log("🔍 Middleware - URL:", req.nextUrl.pathname);
  console.log("🔍 Middleware - Session:", !!session);
  console.log(
    "🔍 Middleware - Cookies:",
    req.cookies.getAll().map((c) => c.name)
  );
  if (session) {
    console.log("🔍 Middleware - User:", session.user.email);
  }

  // Protection des routes dashboard basée sur les cookies
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const hasValidSession = session || accessToken;

    if (!hasValidSession) {
      console.log("🔒 Accès refusé au dashboard - Pas de session valide");
      console.log("   URL demandée:", req.nextUrl.pathname);
      console.log("   Session:", !!session);
      console.log("   Access Token:", !!accessToken);
      console.log("   ⚠️ Cookies Clerk détectés - Nettoyage nécessaire");

      return NextResponse.redirect(new URL("/", req.url));
    } else {
      console.log("✅ Accès autorisé au dashboard");
    }
  }

  // Redirection si déjà connecté et sur la page d'accueil
  if (req.nextUrl.pathname === "/" && session) {
    console.log("✅ Utilisateur connecté, redirection vers dashboard");
    console.log("   Session user:", session.user.email);
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
