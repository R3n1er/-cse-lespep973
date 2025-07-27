#!/usr/bin/env tsx

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function clearClerkCookies() {
  console.log("🧹 NETTOYAGE DES COOKIES CLERK");
  console.log("================================\n");

  try {
    // 1. Déconnexion de Supabase pour nettoyer les sessions
    console.log("1️⃣ Déconnexion de Supabase...");
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("⚠️ Erreur lors de la déconnexion:", error.message);
    } else {
      console.log("✅ Déconnexion réussie");
    }

    console.log("\n🎯 INSTRUCTIONS POUR NETTOYER LES COOKIES CLERK");
    console.log("================================================");
    console.log("1. Ouvrez les outils de développement (F12)");
    console.log('2. Allez dans l\'onglet "Application" ou "Storage"');
    console.log('3. Dans la section "Cookies", sélectionnez votre domaine');
    console.log("4. Supprimez tous les cookies commençant par:");
    console.log("   - __clerk_");
    console.log("   - __client_uat");
    console.log("5. Rafraîchissez la page");
    console.log("6. Testez la connexion avec user@toto.com / password123");

    console.log("\n🔧 ALTERNATIVE - Script de nettoyage automatique");
    console.log("================================================");
    console.log(
      "Vous pouvez aussi exécuter ce script dans la console du navigateur:"
    );
    console.log(`
// Script de nettoyage des cookies Clerk
document.cookie.split(";").forEach(function(c) { 
  c = c.replace(/^ +/, "").replace(/=.*/, "");
  if (c.startsWith('__clerk_') || c.startsWith('__client_uat')) {
    document.cookie = c + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    console.log('Cookie supprimé:', c);
  }
});
location.reload();
    `);
  } catch (error) {
    console.error("❌ Erreur générale:", error);
  }
}

clearClerkCookies();
