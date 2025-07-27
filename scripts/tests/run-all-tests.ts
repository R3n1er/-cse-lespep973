#!/usr/bin/env tsx

import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const tests = [
  {
    name: "Authentification",
    script: "test-auth.ts",
    description: "Test de connexion/déconnexion",
  },
  {
    name: "RLS Fix",
    script: "test-rls-fix.ts",
    description: "Test des politiques RLS",
  },
  {
    name: "Redirection",
    script: "test-redirect.ts",
    description: "Test de redirection après connexion",
  },
  {
    name: "UI Flow",
    script: "test-ui-flow.ts",
    description: "Test du flux interface utilisateur",
  },
  {
    name: "Application",
    script: "test-application.ts",
    description: "Test complet de l'application",
  },
];

async function runAllTests() {
  console.log("🧪 EXÉCUTION DE TOUS LES TESTS");
  console.log("===============================\n");

  const results: { name: string; success: boolean; error?: string }[] = [];

  for (const test of tests) {
    const scriptPath = join(__dirname, test.script);

    if (!existsSync(scriptPath)) {
      console.log(`⚠️  Script non trouvé: ${test.script}`);
      results.push({
        name: test.name,
        success: false,
        error: "Script non trouvé",
      });
      continue;
    }

    console.log(`🔄 Test: ${test.name}`);
    console.log(`   Description: ${test.description}`);

    try {
      execSync(`tsx ${scriptPath}`, {
        stdio: "pipe",
        encoding: "utf8",
        cwd: process.cwd(),
      });
      console.log(`✅ ${test.name}: SUCCÈS\n`);
      results.push({ name: test.name, success: true });
    } catch (error: any) {
      console.log(`❌ ${test.name}: ÉCHEC`);
      console.log(`   Erreur: ${error.message}\n`);
      results.push({ name: test.name, success: false, error: error.message });
    }
  }

  // Résumé final
  console.log("📊 RÉSUMÉ DES TESTS");
  console.log("===================");

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Succès: ${successful}/${results.length}`);
  console.log(`❌ Échecs: ${failed}/${results.length}`);
  console.log(
    `📈 Taux de réussite: ${Math.round((successful / results.length) * 100)}%\n`
  );

  if (failed > 0) {
    console.log("❌ TESTS EN ÉCHEC:");
    results
      .filter((r) => !r.success)
      .forEach((result) => {
        console.log(`   - ${result.name}: ${result.error}`);
      });
    console.log("");
  }

  if (successful === results.length) {
    console.log("🎉 TOUS LES TESTS SONT PASSÉS !");
    console.log("🚀 L'application est prête pour la production.");
  } else {
    console.log(
      "⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus."
    );
  }
}

runAllTests().catch(console.error);
