#!/usr/bin/env tsx

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testRedirect() {
  console.log("🧪 TEST REDIRECTION APRÈS CONNEXION");
  console.log("====================================\n");

  try {
    // 1. Connexion
    console.log("1️⃣ Connexion...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "user@toto.com",
      password: "password123",
    });

    if (error) {
      console.error("❌ Erreur de connexion:", error.message);
      return;
    }

    console.log("✅ Connexion réussie");
    console.log("   Utilisateur:", data.user?.email);

    // 2. Vérifier la session
    console.log("\n2️⃣ Vérification de la session...");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      console.log("✅ Session active");
      console.log(
        "   Access Token:",
        session.access_token ? "Présent" : "Absent"
      );
    } else {
      console.log("❌ Aucune session");
    }

    // 3. Test d'accès aux données
    console.log("\n3️⃣ Test d'accès aux données...");
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user?.id)
      .single();

    if (userError) {
      console.error("❌ Erreur d'accès aux données:", userError.message);
    } else {
      console.log("✅ Données accessibles");
      console.log("   Nom:", userData.first_name, userData.last_name);
    }

    console.log("\n🎯 INSTRUCTIONS DE TEST MANUEL");
    console.log("==============================");
    console.log("1. Ouvrez http://localhost:3000");
    console.log("2. Connectez-vous avec user@toto.com / password123");
    console.log("3. Vérifiez si vous êtes redirigé vers /dashboard");
    console.log("4. Si non, vérifiez les logs du navigateur (F12)");

    // 4. Déconnexion
    console.log("\n4️⃣ Déconnexion...");
    await supabase.auth.signOut();
    console.log("✅ Déconnexion réussie");
  } catch (error) {
    console.error("❌ Erreur générale:", error);
  }
}

testRedirect();
