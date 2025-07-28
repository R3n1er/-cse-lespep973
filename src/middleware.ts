import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("🔍 Middleware - URL:", req.nextUrl.pathname);
  console.log("🔍 Middleware - Session:", !!session);
  console.log(
    "🔍 Middleware - Cookies:",
    req.cookies.getAll().map((c) => c.name)
  );

  if (session) {
    console.log("🔍 Middleware - User:", session.user.email);
    console.log("🔍 Middleware - Access Token:", !!session.access_token);
  }

  // TEMPORAIRE: Désactiver la protection middleware pour permettre l'accès
  // La protection sera gérée côté client par AuthGuard
  console.log(
    "⚠️ Middleware temporairement désactivé - Protection côté client active"
  );

  return res;
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
