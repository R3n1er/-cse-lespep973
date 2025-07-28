import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Variables d'environnement Supabase manquantes");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAuthRedirect() {
  try {
    console.log("🧪 Test d'authentification et redirection...");

    // Test de connexion
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "user@toto.com",
      password: "password123",
    });

    if (error) {
      console.error("❌ Erreur de connexion:", error);
      return;
    }

    if (data.user) {
      console.log("✅ Connexion réussie:", data.user.email);
      console.log("✅ Session:", !!data.session);

      // Vérifier la session
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("✅ Session active:", !!sessionData.session);

      if (sessionData.session) {
        console.log("✅ Utilisateur connecté:", sessionData.session.user.email);
        console.log("✅ Access token:", !!sessionData.session.access_token);
      }
    } else {
      console.log("⚠️ Pas d'utilisateur retourné");
    }

    // Test de déconnexion
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.error("❌ Erreur de déconnexion:", signOutError);
    } else {
      console.log("✅ Déconnexion réussie");
    }
  } catch (err) {
    console.error("❌ Erreur inattendue:", err);
  }
}

testAuthRedirect();
