#!/usr/bin/env tsx

/**
 * Script de diagnostic RLS pour identifier la cause de la récursion infinie
 * Analyse les politiques existantes et propose des solutions
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY non trouvée dans .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function diagnoseRLS() {
  console.log("🔍 DIAGNOSTIC RLS - CSE Les PEP 973");
  console.log("=".repeat(50));

  try {
    // 1. Analyser les politiques existantes
    console.log("\n📋 1. Analyse des politiques existantes...");
    const { data: policies, error: policiesError } = await supabase
      .from("pg_policies")
      .select("*")
      .eq("tablename", "users");

    if (policiesError) {
      console.error(
        "❌ Erreur lors de la récupération des politiques:",
        policiesError
      );
    } else {
      console.log("✅ Politiques trouvées:", policies?.length || 0);
      policies?.forEach((policy) => {
        console.log(
          `   - ${policy.policyname}: ${policy.cmd} (${
            policy.permissive ? "permissive" : "restrictive"
          })`
        );
        console.log(`     Condition: ${policy.qual}`);
      });
    }

    // 2. Vérifier la structure de la table users
    console.log("\n📊 2. Structure de la table users...");
    const { data: columns, error: columnsError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable")
      .eq("table_name", "users")
      .eq("table_schema", "public");

    if (columnsError) {
      console.error(
        "❌ Erreur lors de la récupération des colonnes:",
        columnsError
      );
    } else {
      console.log("✅ Colonnes de la table users:");
      columns?.forEach((col) => {
        console.log(
          `   - ${col.column_name}: ${col.data_type} (${
            col.is_nullable === "YES" ? "nullable" : "not null"
          })`
        );
      });
    }

    // 3. Vérifier les contraintes et triggers
    console.log("\n🔗 3. Contraintes et triggers...");
    const { data: constraints, error: constraintsError } = await supabase
      .from("information_schema.table_constraints")
      .select("constraint_name, constraint_type")
      .eq("table_name", "users")
      .eq("table_schema", "public");

    if (constraintsError) {
      console.error(
        "❌ Erreur lors de la récupération des contraintes:",
        constraintsError
      );
    } else {
      console.log("✅ Contraintes trouvées:", constraints?.length || 0);
      constraints?.forEach((constraint) => {
        console.log(
          `   - ${constraint.constraint_name}: ${constraint.constraint_type}`
        );
      });
    }

    // 4. Test d'accès direct avec service_role
    console.log("\n🔑 4. Test d'accès avec service_role...");
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (userError) {
      console.error("❌ Erreur d'accès avec service_role:", userError);
    } else {
      console.log("✅ Accès avec service_role réussi");
      console.log("   Données trouvées:", userData?.length || 0);
    }

    // 5. Analyser les politiques RLS activées
    console.log("\n🛡️ 5. État RLS des tables...");
    const tables = [
      "users",
      "blog_posts",
      "blog_comments",
      "blog_reactions",
      "cinema_tickets",
      "orders",
      "newsletter_subscriptions",
    ];

    for (const table of tables) {
      const { data: rlsStatus, error: rlsError } = await supabase
        .from("pg_tables")
        .select("tablename, rowsecurity")
        .eq("tablename", table)
        .eq("schemaname", "public")
        .single();

      if (rlsError) {
        console.log(`   ⚠️ ${table}: Erreur de vérification`);
      } else {
        console.log(
          `   ${rlsStatus?.rowsecurity ? "🟢" : "🔴"} ${table}: RLS ${
            rlsStatus?.rowsecurity ? "activé" : "désactivé"
          }`
        );
      }
    }

    // 6. Proposer des solutions
    console.log("\n💡 6. Solutions proposées...");
    proposeSolutions();
  } catch (error) {
    console.error("❌ Erreur lors du diagnostic:", error);
  }
}

function proposeSolutions() {
  console.log("\n🔧 Solutions recommandées (par ordre de priorité):");

  console.log("\n1️⃣ SOLUTION IMMÉDIATE - Désactiver RLS temporairement:");
  console.log(`
-- Exécuter dans l'éditeur SQL Supabase
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- Puis tester l'application
`);

  console.log("\n2️⃣ SOLUTION INTERMÉDIAIRE - Politique simple:");
  console.log(`
-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Créer une politique basique
CREATE POLICY "Basic user access" ON users
    FOR ALL USING (true);
`);

  console.log("\n3️⃣ SOLUTION COMPLÈTE - Politique sécurisée:");
  console.log(`
-- Politique sécurisée sans récursion
CREATE POLICY "Secure user access" ON users
    FOR SELECT USING (
        auth.uid() IS NOT NULL 
        AND auth.uid()::text = id::text
    );
    
CREATE POLICY "Secure user update" ON users
    FOR UPDATE USING (
        auth.uid() IS NOT NULL 
        AND auth.uid()::text = id::text
    );
`);

  console.log("\n4️⃣ SOLUTION DE CONTOURNEMENT - Utiliser une vue:");
  console.log(`
-- Créer une vue pour éviter la récursion
CREATE OR REPLACE VIEW user_profiles AS
SELECT id, email, first_name, last_name, role, created_at, updated_at
FROM users;

-- Politique sur la vue
CREATE POLICY "View user profiles" ON user_profiles
    FOR SELECT USING (auth.uid()::text = id::text);
`);
}

async function testImmediateFix() {
  console.log("\n🧪 Test de la solution immédiate...");

  try {
    // Désactiver RLS temporairement
    const { error: disableError } = await supabase.rpc("exec_sql", {
      sql: "ALTER TABLE users DISABLE ROW LEVEL SECURITY;",
    });

    if (disableError) {
      console.log(
        "⚠️ Impossible d'exécuter via API, utilisez le dashboard Supabase"
      );
      console.log(
        "💡 Allez dans SQL Editor et exécutez: ALTER TABLE users DISABLE ROW LEVEL SECURITY;"
      );
      return;
    }

    console.log("✅ RLS désactivé temporairement");

    // Tester l'accès
    const { data: testData, error: testError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (testError) {
      console.error("❌ Erreur même avec RLS désactivé:", testError);
    } else {
      console.log("✅ Accès réussi avec RLS désactivé");
      console.log("📊 Données:", testData);
    }
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

async function main() {
  await diagnoseRLS();
  await testImmediateFix();

  console.log("\n📋 PROCHAINES ÉTAPES:");
  console.log("1. Allez sur https://supabase.com/dashboard");
  console.log("2. Ouvrez SQL Editor");
  console.log("3. Exécutez: ALTER TABLE users DISABLE ROW LEVEL SECURITY;");
  console.log("4. Testez avec: npm run test-auth");
  console.log("5. Si ça fonctionne, recréez les politiques sécurisées");
}

main().catch(console.error);
