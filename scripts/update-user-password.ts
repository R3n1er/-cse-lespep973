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

async function updateUserPassword() {
  console.log("🔧 Mise à jour du mot de passe pour user@toto.com...");

  try {
    // D'abord, récupérer l'utilisateur existant
    const { data: users, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      console.error(
        "❌ Erreur lors de la récupération des utilisateurs:",
        listError.message
      );
      return;
    }

    const user = users.users.find((u) => u.email === "user@toto.com");

    if (!user) {
      console.error("❌ Utilisateur user@toto.com non trouvé");
      return;
    }

    console.log("✅ Utilisateur trouvé:", user.email);
    console.log("🆔 ID:", user.id);

    // Mettre à jour le mot de passe
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: "password123",
      email_confirm: true,
    });

    if (error) {
      console.error(
        "❌ Erreur lors de la mise à jour du mot de passe:",
        error.message
      );
      return;
    }

    if (data.user) {
      console.log("✅ Mot de passe mis à jour avec succès!");
      console.log("📧 Email:", data.user.email);
      console.log("📅 Mis à jour le:", data.user.updated_at);

      // Vérifier si l'utilisateur existe dans la table users
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.log(
          "⚠️ Utilisateur non trouvé dans la table users, création..."
        );

        // Créer l'utilisateur dans la table users
        const { data: newUserData, error: insertError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            email: user.email,
            first_name: "Test",
            last_name: "User",
            matricule: "TEST001",
            role: "salarie",
            is_active: true,
          })
          .select()
          .single();

        if (insertError) {
          console.error(
            "❌ Erreur lors de l'insertion dans la table users:",
            insertError.message
          );
        } else {
          console.log("✅ Utilisateur ajouté à la table users");
          console.log("👤 Rôle:", newUserData.role);
        }
      } else {
        console.log("✅ Utilisateur déjà présent dans la table users");
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
updateUserPassword();
