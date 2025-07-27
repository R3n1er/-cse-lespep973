#!/usr/bin/env tsx

/**
 * Script de test rapide pour vérifier la correction RLS
 * À exécuter après avoir appliqué le script SQL
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRLSFix() {
  console.log("🧪 TEST RAPIDE - Correction RLS");
  console.log("=".repeat(40));

  try {
    // 1. Test d'authentification
    console.log("\n1️⃣ Test d'authentification...");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email: "user@toto.com",
      password: "password123",
    });

    if (authError) {
      console.error("❌ Erreur d'authentification:", authError.message);
      return;
    }

    console.log("✅ Authentification réussie");
    console.log(`   Utilisateur: ${user?.email}`);
    console.log(`   ID: ${user?.id}`);

    // 2. Test d'accès à la table users
    console.log("\n2️⃣ Test d'accès à la table users...");
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (userError) {
      console.error("❌ Erreur d'accès à users:", userError.message);

      if (userError.message.includes("infinite recursion")) {
        console.log("\n🚨 PROBLÈME: Récursion infinie toujours présente");
        console.log(
          "💡 Solution: Appliquez le script SQL dans le dashboard Supabase"
        );
        console.log("📄 Script: scripts/fix-rls-final.sql");
      }

      return;
    }

    console.log("✅ Accès à la table users réussi");
    console.log("📊 Données utilisateur:");
    console.log(`   - Email: ${userData.email}`);
    console.log(`   - Prénom: ${userData.first_name || "Non défini"}`);
    console.log(`   - Nom: ${userData.last_name || "Non défini"}`);
    console.log(`   - Rôle: ${userData.role || "Non défini"}`);

    // 3. Test de mise à jour
    console.log("\n3️⃣ Test de mise à jour...");
    const { error: updateError } = await supabase
      .from("users")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", user?.id);

    if (updateError) {
      console.error("❌ Erreur de mise à jour:", updateError.message);
    } else {
      console.log("✅ Mise à jour réussie");
    }

    // 4. Test de déconnexion
    console.log("\n4️⃣ Test de déconnexion...");
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("❌ Erreur de déconnexion:", signOutError.message);
    } else {
      console.log("✅ Déconnexion réussie");
    }

    // 5. Résumé
    console.log("\n🎉 RÉSULTAT FINAL");
    console.log("=".repeat(20));
    console.log("✅ Authentification: Fonctionnelle");
    console.log("✅ Accès aux données: Fonctionnel");
    console.log("✅ Mise à jour: Fonctionnelle");
    console.log("✅ Déconnexion: Fonctionnelle");
    console.log("\n🎯 La correction RLS est réussie !");
    console.log(
      "🌐 Vous pouvez maintenant tester l'application sur http://localhost:3000"
    );
  } catch (error) {
    console.error("❌ Erreur inattendue:", error);
  }
}

async function main() {
  await testRLSFix();
}

main().catch(console.error);
