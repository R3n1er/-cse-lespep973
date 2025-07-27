import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

// Vérifier que les variables d'environnement sont présentes
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error("❌ Variables d'environnement manquantes!");
  console.error(
    "Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies dans .env.local"
  );
  process.exit(1);
}

// Créer le client Supabase avec la clé service_role (admin)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createUser() {
  console.log("🚀 Création de l'utilisateur user@toto.com...");

  try {
    // Créer l'utilisateur avec mot de passe
    const { data, error } = await supabase.auth.admin.createUser({
      email: "user@toto.com",
      password: "password123",
      email_confirm: true, // Confirme automatiquement l'email
      user_metadata: {
        first_name: "Test",
        last_name: "User",
        matricule: "TEST001",
      },
    });

    if (error) {
      console.error("❌ Erreur lors de la création:", error.message);
      return;
    }

    if (data.user) {
      console.log("✅ Utilisateur créé avec succès!");
      console.log("📧 Email:", data.user.email);
      console.log("🆔 ID:", data.user.id);
      console.log("📅 Créé le:", data.user.created_at);

      // Insérer l'utilisateur dans la table users
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          id: data.user.id,
          email: data.user.email,
          first_name: "Test",
          last_name: "User",
          matricule: "TEST001",
          role: "salarie",
          is_active: true,
        })
        .select()
        .single();

      if (userError) {
        console.error(
          "⚠️ Erreur lors de l'insertion dans la table users:",
          userError.message
        );
      } else {
        console.log("✅ Utilisateur ajouté à la table users");
        console.log("👤 Rôle:", userData.role);
      }

      console.log("\n🎉 Utilisateur prêt pour les tests!");
      console.log("📝 Identifiants de connexion:");
      console.log("   Email: user@toto.com");
      console.log("   Mot de passe: password123");
      console.log("\n🌐 Testez la connexion sur: http://localhost:3000");
    }
  } catch (err) {
    console.error("❌ Erreur inattendue:", err);
  }
}

// Exécuter le script
createUser();
