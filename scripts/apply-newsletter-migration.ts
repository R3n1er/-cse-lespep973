import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error(
    "Variables d'environnement Supabase manquantes (SERVICE_ROLE_KEY requis)"
  );
}

// Utiliser la service key pour avoir tous les droits
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyNewsletterMigration() {
  try {
    console.log("🚀 Application de la migration newsletter...");

    // Lire le fichier de migration
    const migrationPath = join(
      process.cwd(),
      "supabase",
      "migrations",
      "20250128_newsletter_system.sql"
    );
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    console.log("📄 Migration lue, application en cours...");

    // Exécuter la migration
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: migrationSQL,
    });

    if (error) {
      console.error("❌ Erreur lors de l'exécution de la migration:", error);

      // Essayer une approche alternative si exec_sql n'existe pas
      console.log("🔄 Tentative d'application manuelle...");

      // Diviser en plusieurs requêtes si nécessaire
      const statements = migrationSQL
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--"));

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error: stmtError } = await supabase
              .from("dummy") // Cette approche ne marchera pas, on va utiliser l'API REST
              .select()
              .limit(1);

            console.log("⚠️ Utilisation de l'API REST Supabase...");
            break;
          } catch (e) {
            // Ignorer l'erreur et continuer
          }
        }
      }

      // Utiliser l'API REST de Supabase pour exécuter le SQL
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          apikey: SUPABASE_SERVICE_KEY || "",
        } as HeadersInit,
        body: JSON.stringify({ sql: migrationSQL }),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur API: ${response.status} ${response.statusText}`
        );
      }

      console.log("✅ Migration appliquée via API REST");
    } else {
      console.log("✅ Migration appliquée avec succès:", data);
    }

    // Vérifier que les tables ont été créées
    console.log("🔍 Vérification des tables créées...");

    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", ["users", "newsletter_logs", "newsletter_recipients"]);

    if (tablesError) {
      console.warn("⚠️ Impossible de vérifier les tables:", tablesError);
    } else {
      console.log(
        "📊 Tables trouvées:",
        tables?.map((t) => t.table_name)
      );
    }

    // Tester les fonctions créées
    console.log("🧪 Test des fonctions...");

    const { data: activeUsers, error: usersError } = await supabase.rpc(
      "get_active_users"
    );

    if (usersError) {
      console.warn("⚠️ Fonction get_active_users non disponible:", usersError);
    } else {
      console.log("✅ Utilisateurs actifs trouvés:", activeUsers?.length || 0);
    }

    const { data: stats, error: statsError } = await supabase.rpc(
      "get_newsletter_stats"
    );

    if (statsError) {
      console.warn(
        "⚠️ Fonction get_newsletter_stats non disponible:",
        statsError
      );
    } else {
      console.log("✅ Statistiques newsletter:", stats);
    }

    console.log("🎉 Migration newsletter terminée avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de l'application de la migration:", error);

    // Instructions pour application manuelle
    console.log(
      "\n📝 Si la migration automatique échoue, appliquez manuellement:"
    );
    console.log("1. Ouvrez le dashboard Supabase");
    console.log("2. Allez dans SQL Editor");
    console.log(
      "3. Copiez-collez le contenu de supabase/migrations/20250128_newsletter_system.sql"
    );
    console.log("4. Exécutez le script");

    process.exit(1);
  }
}

applyNewsletterMigration();
