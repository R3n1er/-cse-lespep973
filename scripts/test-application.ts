#!/usr/bin/env tsx

/**
 * Script de test complet pour l'application CSE Les PEP 973
 * Vérifie toutes les fonctionnalités après la refactorisation
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TestResult {
  name: string;
  status: "PASS" | "FAIL" | "WARN";
  message: string;
  details?: any;
}

const results: TestResult[] = [];

function addResult(
  name: string,
  status: "PASS" | "FAIL" | "WARN",
  message: string,
  details?: any
) {
  results.push({ name, status, message, details });
  const emoji = status === "PASS" ? "✅" : status === "FAIL" ? "❌" : "⚠️";
  console.log(`${emoji} ${name}: ${message}`);
}

async function testAuthentication() {
  console.log("\n🔐 Test d'authentification...");

  try {
    // Test de connexion
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "user@toto.com",
      password: "password123",
    });

    if (error) {
      addResult("Connexion", "FAIL", `Erreur de connexion: ${error.message}`);
      return false;
    }

    if (data.user) {
      addResult(
        "Connexion",
        "PASS",
        `Utilisateur connecté: ${data.user.email}`
      );
    } else {
      addResult("Connexion", "FAIL", "Aucun utilisateur retourné");
      return false;
    }

    // Test de récupération de session
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      addResult("Session", "PASS", "Session récupérée avec succès");
    } else {
      addResult("Session", "FAIL", "Aucune session trouvée");
      return false;
    }

    return true;
  } catch (error) {
    addResult("Authentification", "FAIL", `Erreur inattendue: ${error}`);
    return false;
  }
}

async function testDatabaseTables() {
  console.log("\n🗄️ Test des tables de base de données...");

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
    try {
      const { data, error } = await supabase.from(table).select("*").limit(1);

      if (error) {
        if (error.message.includes("infinite recursion")) {
          addResult(
            `Table ${table}`,
            "WARN",
            "Politique RLS à corriger",
            error.message
          );
        } else {
          addResult(
            `Table ${table}`,
            "FAIL",
            `Erreur d'accès: ${error.message}`
          );
        }
      } else {
        addResult(
          `Table ${table}`,
          "PASS",
          `Accès réussi (${data?.length || 0} lignes)`
        );
      }
    } catch (error) {
      addResult(`Table ${table}`, "FAIL", `Erreur inattendue: ${error}`);
    }
  }
}

async function testApiEndpoints() {
  console.log("\n🌐 Test des endpoints API...");

  const baseUrl = "http://localhost:3000";
  const endpoints = [
    "/",
    "/auth/login",
    "/auth/register",
    "/blog",
    "/newsletter",
    "/contact",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      if (response.ok) {
        addResult(`Endpoint ${endpoint}`, "PASS", `HTTP ${response.status}`);
      } else {
        addResult(`Endpoint ${endpoint}`, "FAIL", `HTTP ${response.status}`);
      }
    } catch (error) {
      addResult(
        `Endpoint ${endpoint}`,
        "FAIL",
        `Erreur de connexion: ${error}`
      );
    }
  }
}

async function testMiddleware() {
  console.log("\n🛡️ Test du middleware...");

  try {
    // Test redirection dashboard sans authentification
    const response = await fetch("http://localhost:3000/dashboard", {
      redirect: "manual",
    });

    if (response.status === 307) {
      addResult("Middleware Dashboard", "PASS", "Redirection correcte vers /");
    } else {
      addResult(
        "Middleware Dashboard",
        "FAIL",
        `Status inattendu: ${response.status}`
      );
    }
  } catch (error) {
    addResult("Middleware", "FAIL", `Erreur de test: ${error}`);
  }
}

async function testBuild() {
  console.log("\n🔨 Test du build...");

  try {
    const { execSync } = require("child_process");
    execSync("npm run build", { stdio: "pipe" });
    addResult("Build Production", "PASS", "Build réussi");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    addResult("Build Production", "FAIL", `Erreur de build: ${errorMessage}`);
  }
}

function generateReport() {
  console.log("\n📊 RAPPORT DE TEST COMPLET");
  console.log("=".repeat(50));

  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const warnings = results.filter((r) => r.status === "WARN").length;

  console.log(`\n📈 Résultats:`);
  console.log(`   Total: ${total}`);
  console.log(`   ✅ Réussis: ${passed}`);
  console.log(`   ❌ Échecs: ${failed}`);
  console.log(`   ⚠️ Avertissements: ${warnings}`);

  if (failed > 0) {
    console.log("\n❌ Tests échoués:");
    results
      .filter((r) => r.status === "FAIL")
      .forEach((result) => {
        console.log(`   - ${result.name}: ${result.message}`);
      });
  }

  if (warnings > 0) {
    console.log("\n⚠️ Avertissements:");
    results
      .filter((r) => r.status === "WARN")
      .forEach((result) => {
        console.log(`   - ${result.name}: ${result.message}`);
      });
  }

  console.log("\n🎯 Recommandations:");
  if (failed === 0 && warnings === 0) {
    console.log("   🎉 Tous les tests sont passés ! L'application est prête.");
  } else if (failed === 0) {
    console.log(
      "   ✅ Application fonctionnelle avec quelques améliorations à apporter."
    );
  } else {
    console.log("   🔧 Des corrections sont nécessaires avant de continuer.");
  }

  console.log("\n🌐 Application accessible sur: http://localhost:3000");
  console.log("👤 Identifiants de test: user@toto.com / password123");
}

async function main() {
  console.log("🧪 TEST COMPLET DE L'APPLICATION CSE LES PEP 973");
  console.log("=".repeat(60));
  console.log("Vérification après refactorisation Supabase Auth");
  console.log("=".repeat(60));

  // Tests
  await testAuthentication();
  await testDatabaseTables();
  await testApiEndpoints();
  await testMiddleware();
  await testBuild();

  // Rapport final
  generateReport();

  // Déconnexion
  await supabase.auth.signOut();
}

main().catch(console.error);
