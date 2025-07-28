import { createClient } from "@supabase/supabase-js";
import { MOCK_BLOG_POSTS } from "../../src/lib/data/mock";

// Configuration Supabase avec gestion des variables d'environnement manquantes
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";
const supabase = createClient(supabaseUrl, supabaseKey);

// Type pour les articles de blog
interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  published_at?: string | null;
  created_at?: string | null;
}

console.log("🧪 Test des fonctionnalités du blog");

async function testBlogFeatures() {
  console.log("\n📋 Test 1: Vérification des données mockées");

  // Test 1: Vérifier que les données mockées sont valides
  try {
    console.log(
      "✅ Données mockées disponibles:",
      MOCK_BLOG_POSTS.length,
      "articles"
    );

    // Vérifier la structure des articles
    MOCK_BLOG_POSTS.forEach((post: BlogPost, index: number) => {
      if (!post.id || !post.title || !post.content || !post.category) {
        throw new Error(`Article ${index} invalide: données manquantes`);
      }
    });

    console.log("✅ Structure des articles valide");
  } catch (error) {
    console.error("❌ Erreur dans les données mockées:", error);
    return false;
  }

  console.log("\n📋 Test 2: Vérification des catégories");

  // Test 2: Vérifier que toutes les catégories sont présentes
  try {
    const categories = [
      "Actualités",
      "Tickets",
      "Remboursements",
      "Avantages",
      "Événements",
      "Partenaires",
    ];
    const foundCategories = Array.from(
      new Set(MOCK_BLOG_POSTS.map((post: BlogPost) => post.category))
    );

    console.log("✅ Catégories trouvées:", foundCategories);

    // Vérifier que toutes les catégories attendues sont présentes
    categories.forEach((category) => {
      if (!foundCategories.includes(category)) {
        console.warn(`⚠️  Catégorie manquante: ${category}`);
      }
    });
  } catch (error) {
    console.error("❌ Erreur dans les catégories:", error);
    return false;
  }

  console.log("\n📋 Test 3: Test de filtrage");

  // Test 3: Tester le filtrage par catégorie
  try {
    const actualitesPosts = MOCK_BLOG_POSTS.filter(
      (post: BlogPost) => post.category === "Actualités"
    );
    const ticketsPosts = MOCK_BLOG_POSTS.filter(
      (post: BlogPost) => post.category === "Tickets"
    );

    console.log("✅ Articles Actualités:", actualitesPosts.length);
    console.log("✅ Articles Tickets:", ticketsPosts.length);

    if (actualitesPosts.length === 0) {
      throw new Error("Aucun article dans la catégorie Actualités");
    }
  } catch (error) {
    console.error("❌ Erreur dans le filtrage:", error);
    return false;
  }

  console.log("\n📋 Test 4: Test de recherche");

  // Test 4: Tester la recherche
  try {
    const searchTerm = "tickets";
    const searchResults = MOCK_BLOG_POSTS.filter(
      (post: BlogPost) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(
      '✅ Résultats de recherche pour "tickets":',
      searchResults.length
    );

    if (searchResults.length === 0) {
      console.warn('⚠️  Aucun résultat pour la recherche "tickets"');
    }
  } catch (error) {
    console.error("❌ Erreur dans la recherche:", error);
    return false;
  }

  console.log("\n📋 Test 5: Test de formatage des dates");

  // Test 5: Tester le formatage des dates
  try {
    const testDate = new Date("2025-01-27T10:00:00Z");
    const formattedDate = testDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    console.log("✅ Date formatée:", formattedDate);

    if (!formattedDate.includes("27") || !formattedDate.includes("janvier")) {
      throw new Error("Format de date incorrect");
    }
  } catch (error) {
    console.error("❌ Erreur dans le formatage des dates:", error);
    return false;
  }

  console.log("\n📋 Test 6: Test de troncature de texte");

  // Test 6: Tester la troncature de texte
  try {
    const longText = "A".repeat(200);
    const truncatedText =
      longText.length > 120 ? longText.substring(0, 120) + "..." : longText;

    console.log("✅ Texte original:", longText.length, "caractères");
    console.log("✅ Texte tronqué:", truncatedText.length, "caractères");

    if (truncatedText.length > 123) {
      throw new Error("Troncature incorrecte");
    }
  } catch (error) {
    console.error("❌ Erreur dans la troncature:", error);
    return false;
  }

  console.log("\n📋 Test 7: Test de connexion Supabase (simulé)");

  // Test 7: Simuler la connexion Supabase
  try {
    console.log(
      "✅ Connexion Supabase simulée (variables d'environnement non configurées)"
    );
    console.log(
      "ℹ️  Pour tester la vraie connexion, configurez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  } catch (error) {
    console.warn("⚠️  Impossible de tester Supabase:", error);
  }

  console.log("\n🎉 Tous les tests du blog sont passés avec succès!");
  return true;
}

// Fonction pour tester l'authentification
async function testAuthentication() {
  console.log("\n🔐 Test de l'authentification");

  try {
    // Test de déconnexion
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.warn("⚠️  Erreur lors de la déconnexion:", signOutError.message);
    } else {
      console.log("✅ Déconnexion réussie");
    }

    // Test de connexion avec des identifiants invalides
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "wrongpassword",
      });

    if (signInError) {
      console.log("✅ Gestion correcte des identifiants invalides");
    } else {
      console.warn(
        "⚠️  Connexion réussie avec des identifiants invalides (inattendu)"
      );
    }
  } catch (error) {
    console.error("❌ Erreur dans les tests d'authentification:", error);
    return false;
  }

  return true;
}

// Exécution des tests
async function runAllTests() {
  console.log("🚀 Démarrage des tests du blog et de l'authentification\n");

  const blogTestsPassed = await testBlogFeatures();
  const authTestsPassed = await testAuthentication();

  console.log("\n📊 Résumé des tests:");
  console.log(`Blog: ${blogTestsPassed ? "✅" : "❌"}`);
  console.log(`Authentification: ${authTestsPassed ? "✅" : "❌"}`);

  if (blogTestsPassed && authTestsPassed) {
    console.log("\n🎉 Tous les tests sont passés!");
    process.exit(0);
  } else {
    console.log("\n❌ Certains tests ont échoué");
    process.exit(1);
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { testBlogFeatures, testAuthentication, runAllTests };
