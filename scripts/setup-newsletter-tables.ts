import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Variables d'environnement Supabase manquantes");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupNewsletterTables() {
  try {
    console.log("🚀 Configuration des tables newsletter...");

    // 1. Vérifier/créer la table users avec les champs nécessaires
    console.log("📋 Vérification de la table users...");

    // Insérer des utilisateurs de test
    const testUsers = [
      {
        email: "user@toto.com",
        first_name: "Admin",
        last_name: "CSE",
        is_active: true,
        role: "admin",
      },
      {
        email: "alice.martin@pep973.fr",
        first_name: "Alice",
        last_name: "Martin",
        is_active: true,
        role: "user",
      },
      {
        email: "bob.dupont@pep973.fr",
        first_name: "Bob",
        last_name: "Dupont",
        is_active: true,
        role: "user",
      },
      {
        email: "claire.bernard@pep973.fr",
        first_name: "Claire",
        last_name: "Bernard",
        is_active: true,
        role: "user",
      },
      {
        email: "david.moreau@pep973.fr",
        first_name: "David",
        last_name: "Moreau",
        is_active: false,
        role: "user",
      },
    ];

    console.log("👥 Insertion des utilisateurs de test...");

    for (const user of testUsers) {
      const { error } = await supabase
        .from("users")
        .upsert(user, { onConflict: "email" });

      if (error) {
        console.warn(
          `⚠️ Erreur lors de l'insertion de ${user.email}:`,
          error.message
        );
      } else {
        console.log(`✅ Utilisateur ${user.email} ajouté/mis à jour`);
      }
    }

    // 2. Tester la récupération des utilisateurs actifs
    console.log("\n🧪 Test de récupération des utilisateurs actifs...");

    const { data: activeUsers, error: usersError } = await supabase
      .from("users")
      .select("email, first_name, last_name, is_active")
      .eq("is_active", true);

    if (usersError) {
      console.error(
        "❌ Erreur lors de la récupération des utilisateurs:",
        usersError
      );
    } else {
      console.log(
        `✅ ${activeUsers?.length || 0} utilisateurs actifs trouvés:`
      );
      activeUsers?.forEach((user) => {
        console.log(`  - ${user.first_name} ${user.last_name} (${user.email})`);
      });
    }

    // 3. Créer un log de newsletter de test (si la table existe)
    console.log("\n📧 Test d'insertion de log newsletter...");

    const { error: logError } = await supabase.from("newsletter_logs").insert({
      subject: "Newsletter de test - Configuration système",
      content:
        "<h1>Test de configuration</h1><p>Ceci est un test du système de newsletter.</p>",
      recipients_count: activeUsers?.length || 0,
      sent_count: activeUsers?.length || 0,
      failed_count: 0,
      sent_by: "system",
    });

    if (logError) {
      console.warn(
        "⚠️ Table newsletter_logs non disponible:",
        logError.message
      );
      console.log(
        "📝 La table newsletter_logs doit être créée manuellement via le dashboard Supabase"
      );
    } else {
      console.log("✅ Log de newsletter de test créé");
    }

    // 4. Tester les fonctions RPC si disponibles
    console.log("\n🔧 Test des fonctions RPC...");

    const { data: rpcUsers, error: rpcError } = await supabase.rpc(
      "get_active_users"
    );

    if (rpcError) {
      console.warn(
        "⚠️ Fonction get_active_users non disponible:",
        rpcError.message
      );
    } else {
      console.log(
        `✅ Fonction get_active_users opérationnelle (${
          rpcUsers?.length || 0
        } utilisateurs)`
      );
    }

    const { data: stats, error: statsError } = await supabase.rpc(
      "get_newsletter_stats"
    );

    if (statsError) {
      console.warn(
        "⚠️ Fonction get_newsletter_stats non disponible:",
        statsError.message
      );
    } else {
      console.log("✅ Statistiques newsletter:", stats);
    }

    console.log("\n🎉 Configuration des tables newsletter terminée !");
    console.log("\n📌 Étapes suivantes si des erreurs persistent :");
    console.log("1. Ouvrez le dashboard Supabase");
    console.log("2. Allez dans SQL Editor");
    console.log(
      "3. Exécutez le contenu de supabase/migrations/20250128_newsletter_system.sql"
    );
    console.log("4. Redémarrez ce script pour vérifier");
  } catch (error) {
    console.error("❌ Erreur lors de la configuration:", error);
    process.exit(1);
  }
}

setupNewsletterTables();
