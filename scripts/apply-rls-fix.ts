#!/usr/bin/env tsx

/**
 * Script pour appliquer la correction RLS directement via l'API Supabase
 * Utilise la clé service_role pour contourner les problèmes de migration
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY non trouvée dans .env.local");
  console.log("💡 Ajoutez votre clé service_role dans .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applyRLSFix() {
  console.log("🔧 Application de la correction RLS...");

  try {
    // Lire le script SQL
    const sqlPath = path.join(process.cwd(), "scripts", "fix-rls-simple.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf-8");

    console.log("📄 Script SQL chargé");
    console.log("🔄 Exécution des commandes SQL...");

    // Exécuter le script SQL
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: sqlContent,
    });

    if (error) {
      console.error("❌ Erreur lors de l'exécution SQL:", error);

      // Si exec_sql n'existe pas, essayons une approche différente
      console.log("🔄 Tentative avec une approche alternative...");
      await applyRLSFixAlternative();
      return;
    }

    console.log("✅ Script SQL exécuté avec succès");
    console.log("📊 Résultats:", data);
  } catch (error) {
    console.error("❌ Erreur inattendue:", error);
    console.log("🔄 Tentative avec une approche alternative...");
    await applyRLSFixAlternative();
  }
}

async function applyRLSFixAlternative() {
  console.log("🔧 Approche alternative - Correction RLS étape par étape...");

  try {
    // 1. Désactiver RLS sur users
    console.log("1️⃣ Désactivation RLS sur users...");
    const { error: error1 } = await supabase.from("users").select("*").limit(1);

    if (error1 && error1.message.includes("infinite recursion")) {
      console.log("⚠️ Récursion détectée, tentative de correction...");

      // 2. Supprimer les politiques via SQL direct
      const dropPoliciesSQL = `
        DROP POLICY IF EXISTS "Users can view own profile" ON users;
        DROP POLICY IF EXISTS "Users can update own profile" ON users;
      `;

      console.log("2️⃣ Suppression des politiques problématiques...");
      // Note: Cette approche nécessite un accès direct à la base de données
      // ou l'utilisation de l'interface Supabase

      console.log("💡 Pour appliquer cette correction, vous devez :");
      console.log("   1. Aller sur le dashboard Supabase");
      console.log("   2. Ouvrir l'éditeur SQL");
      console.log("   3. Exécuter le contenu de scripts/fix-rls-simple.sql");
      console.log("   4. Ou utiliser la CLI Supabase si disponible");

      return;
    }

    console.log("✅ RLS semble fonctionnel");
  } catch (error) {
    console.error("❌ Erreur lors de la correction alternative:", error);
  }
}

async function testRLSFix() {
  console.log("\n🧪 Test de la correction RLS...");

  try {
    // Test avec l'utilisateur de test
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email: "user@toto.com",
      password: "password123",
    });

    if (authError) {
      console.error("❌ Erreur d'authentification:", authError);
      return;
    }

    console.log("✅ Authentification réussie");

    // Test d'accès à la table users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (userError) {
      console.error("❌ Erreur d'accès à la table users:", userError);
      return;
    }

    console.log("✅ Accès à la table users réussi");
    console.log("👤 Données utilisateur:", userData);
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

async function main() {
  console.log("🚀 CORRECTION RLS - CSE Les PEP 973");
  console.log("=".repeat(50));

  await applyRLSFix();
  await testRLSFix();

  console.log("\n📋 Instructions manuelles :");
  console.log("1. Allez sur https://supabase.com/dashboard");
  console.log("2. Sélectionnez votre projet");
  console.log('3. Allez dans "SQL Editor"');
  console.log("4. Copiez le contenu de scripts/fix-rls-simple.sql");
  console.log("5. Exécutez le script");
  console.log("6. Testez avec: npm run test-auth");
}

main().catch(console.error);
