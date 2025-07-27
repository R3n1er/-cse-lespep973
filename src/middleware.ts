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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protection des routes dashboard
  if (req.nextUrl.pathname.startsWith("/dashboard") && !session) {
    console.log("🔒 Accès refusé au dashboard - Pas de session");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirection si déjà connecté et sur la page d'accueil
  if (req.nextUrl.pathname === "/" && session) {
    console.log("✅ Utilisateur connecté, redirection vers dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
