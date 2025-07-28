import { testBlogFeatures, testAuthentication } from "./test-blog-features";
import { testBlogComponents, testAuthComponents } from "./test-blog-ui";

console.log("🚀 Test complet du blog et de l'authentification");

async function runCompleteTests() {
  console.log("\n📋 Phase 1: Tests des fonctionnalités");
  const blogFeaturesPassed = await testBlogFeatures();

  console.log("\n📋 Phase 2: Tests d'authentification");
  const authTestsPassed = await testAuthentication();

  console.log("\n📋 Phase 3: Tests des composants");
  const blogComponentsPassed = testBlogComponents();

  console.log("\n📋 Phase 4: Tests des composants d'authentification");
  const authComponentsPassed = testAuthComponents();

  console.log("\n📊 Résumé complet des tests:");
  console.log(`Blog Features: ${blogFeaturesPassed ? "✅" : "❌"}`);
  console.log(`Auth Tests: ${authTestsPassed ? "✅" : "❌"}`);
  console.log(`Blog Components: ${blogComponentsPassed ? "✅" : "❌"}`);
  console.log(`Auth Components: ${authComponentsPassed ? "✅" : "❌"}`);

  const allTestsPassed =
    blogFeaturesPassed &&
    authTestsPassed &&
    blogComponentsPassed &&
    authComponentsPassed;

  if (allTestsPassed) {
    console.log("\n🎉 Tous les tests sont passés avec succès!");
    console.log("\n📈 Statistiques:");
    console.log("- ✅ 4 phases de tests");
    console.log("- ✅ Fonctionnalités du blog validées");
    console.log("- ✅ Authentification testée");
    console.log("- ✅ Composants UI vérifiés");
    console.log("- ✅ Gestion d'erreurs testée");
    console.log("\n🚀 Le blog est prêt pour la production!");
    process.exit(0);
  } else {
    console.log("\n❌ Certains tests ont échoué");
    console.log("\n🔧 Actions recommandées:");
    if (!blogFeaturesPassed) {
      console.log("- Vérifier les données mockées");
      console.log("- Contrôler la logique de filtrage");
    }
    if (!authTestsPassed) {
      console.log("- Vérifier la configuration Supabase");
      console.log("- Contrôler les variables d'environnement");
    }
    if (!blogComponentsPassed) {
      console.log("- Vérifier la structure des composants");
      console.log("- Contrôler les props et types");
    }
    if (!authComponentsPassed) {
      console.log("- Vérifier les composants d'authentification");
      console.log("- Contrôler les formulaires");
    }
    process.exit(1);
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runCompleteTests().catch(console.error);
}

export { runCompleteTests };
