import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createServerSupabaseClient();

    // Échange le code contre une session
    await supabase.auth.exchangeCodeForSession(code);

    // Vérifier si l'utilisateur existe déjà dans la table users
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Vérifier si l'utilisateur existe dans la table users
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      // Si l'utilisateur n'existe pas dans la table users, l'ajouter
      if (!existingUser && user.email) {
        const userData = {
          id: user.id,
          email: user.email,
          first_name:
            user.user_metadata.first_name ||
            user.user_metadata.given_name ||
            "",
          last_name:
            user.user_metadata.last_name ||
            user.user_metadata.family_name ||
            "",
          matricule: user.user_metadata.matricule || "",
          role: "salarie" as const, // Rôle par défaut
          is_active: true,
        };

        await supabase.from("users").insert(userData);
      }
    }
  }

  // Rediriger vers la page d'accueil
  return NextResponse.redirect(new URL("/", request.url));
}
