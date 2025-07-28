import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Variables d'environnement Supabase manquantes");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testLoginFlow() {
  try {
    console.log("🧪 Test du flux de connexion complet...");

    // 1. Vérifier l'état initial
    const { data: initialSession } = await supabase.auth.getSession();
    console.log("📋 État initial - Session:", !!initialSession.session);

    // 2. Se connecter
    console.log("🔐 Tentative de connexion...");
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
      console.log("✅ Session créée:", !!data.session);

      // 3. Vérifier la session après connexion
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("📋 Session après connexion:", !!sessionData.session);

      if (sessionData.session) {
        console.log("✅ Utilisateur connecté:", sessionData.session.user.email);
        console.log("✅ Access token:", !!sessionData.session.access_token);
        console.log("✅ Refresh token:", !!sessionData.session.refresh_token);

        // 4. Simuler une redirection vers le dashboard
        console.log("🔄 Simulation redirection vers /dashboard...");

        // 5. Vérifier que la session persiste
        setTimeout(async () => {
          const { data: persistentSession } = await supabase.auth.getSession();
          console.log("📋 Session persistante:", !!persistentSession.session);

          if (persistentSession.session) {
            console.log("✅ Session maintenue après délai");
          } else {
            console.log("❌ Session perdue après délai");
          }

          // 6. Se déconnecter
          const { error: signOutError } = await supabase.auth.signOut();
          if (signOutError) {
            console.error("❌ Erreur de déconnexion:", signOutError);
          } else {
            console.log("✅ Déconnexion réussie");
          }
        }, 1000);
      } else {
        console.log("❌ Pas de session après connexion");
      }
    } else {
      console.log("⚠️ Pas d'utilisateur retourné");
    }
  } catch (err) {
    console.error("❌ Erreur inattendue:", err);
  }
}

testLoginFlow();
