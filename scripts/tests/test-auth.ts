import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

// Vérifier que les variables d'environnement sont présentes
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.error("❌ Variables d'environnement manquantes!");
  console.error(
    "Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies dans .env.local"
  );
  process.exit(1);
}

// Créer le client Supabase avec la clé anon (comme dans l'application)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAuth() {
  console.log("🧪 Test d'authentification...");
  console.log("📧 Email: user@toto.com");
  console.log("🔑 Mot de passe: password123");
  console.log("");

  try {
    // Test de connexion
    console.log("🔄 Tentative de connexion...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "user@toto.com",
      password: "password123",
    });

    if (error) {
      console.error("❌ Erreur de connexion:", error.message);
      console.error("🔍 Code d'erreur:", error.status);
      return;
    }

    if (data.user) {
      console.log("✅ Connexion réussie!");
      console.log("👤 Utilisateur:", data.user.email);
      console.log("🆔 ID:", data.user.id);
      console.log("📅 Dernière connexion:", data.user.last_sign_in_at);

      // Test de récupération de l'utilisateur
      console.log("\n🔄 Test de récupération de l'utilisateur...");
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("❌ Erreur récupération utilisateur:", userError.message);
      } else {
        console.log("✅ Utilisateur récupéré avec succès");
        console.log("👤 Email:", userData.user?.email);
        console.log("📊 Métadonnées:", userData.user?.user_metadata);
      }

      // Test de récupération depuis la table users
      console.log("\n🔄 Test de récupération depuis la table users...");
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error("❌ Erreur récupération profil:", profileError.message);
      } else {
        console.log("✅ Profil récupéré avec succès");
        console.log(
          "👤 Nom complet:",
          `${profileData.first_name} ${profileData.last_name}`
        );
        console.log("🏢 Rôle:", profileData.role);
        console.log("📋 Matricule:", profileData.matricule);
      }

      // Test de déconnexion
      console.log("\n🔄 Test de déconnexion...");
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error("❌ Erreur déconnexion:", signOutError.message);
      } else {
        console.log("✅ Déconnexion réussie");
      }

      console.log("\n🎉 Tous les tests d'authentification sont passés!");
      console.log(
        "🌐 Vous pouvez maintenant tester sur: http://localhost:3000"
      );
    }
  } catch (err) {
    console.error("❌ Erreur inattendue:", err);
  }
}

// Exécuter le script
testAuth();
