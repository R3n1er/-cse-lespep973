import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Variables d'environnement Supabase manquantes");
}

async function applyGetBlogStats() {
  try {
    console.log("Application de la fonction get_blog_stats...");

    const sqlFunction = `
      CREATE OR REPLACE FUNCTION public.get_blog_stats()
      RETURNS TABLE(
        total_posts integer,
        total_comments integer,
        total_reactions integer,
        total_views integer
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT
          (SELECT COUNT(*) FROM blog_posts),
          (SELECT COUNT(*) FROM blog_comments),
          (SELECT COUNT(*) FROM blog_reactions),
          (SELECT COALESCE(SUM(view_count), 0) FROM blog_posts);
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    // Tester si la fonction existe déjà
    console.log("🧪 Test de la fonction existante...");
    const testResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/get_blog_stats`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: SUPABASE_SERVICE_ROLE_KEY,
        } as HeadersInit,
      }
    );

    if (testResponse.ok) {
      const result = await testResponse.json();
      console.log("✅ La fonction get_blog_stats existe déjà !");
      console.log("📊 Résultat:", result);
      return;
    }

    console.log("❌ La fonction get_blog_stats n'existe pas encore.");
    console.log(
      "📝 La fonction doit être appliquée manuellement via le Supabase Dashboard."
    );
    console.log(
      "🔗 Accédez à: https://supabase.com/dashboard/project/[VOTRE_PROJECT_ID]/sql"
    );
    console.log("📋 SQL à exécuter:");
    console.log(sqlFunction);
  } catch (err) {
    console.error("Erreur inattendue:", err);
    console.log(
      "📝 La fonction doit être appliquée manuellement via le Supabase Dashboard."
    );
    console.log("📋 SQL à exécuter:");
    console.log(`
CREATE OR REPLACE FUNCTION public.get_blog_stats()
RETURNS TABLE(
  total_posts integer,
  total_comments integer,
  total_reactions integer,
  total_views integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM blog_posts),
    (SELECT COUNT(*) FROM blog_comments),
    (SELECT COUNT(*) FROM blog_reactions),
    (SELECT COALESCE(SUM(view_count), 0) FROM blog_posts);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
  }
}

applyGetBlogStats();
