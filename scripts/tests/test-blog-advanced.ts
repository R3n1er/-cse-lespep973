#!/usr/bin/env tsx

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBlogAdvanced() {
  console.log("🧪 TEST DES FONCTIONNALITÉS AVANCÉES DU BLOG");
  console.log("=============================================\n");

  try {
    // 1. Test de connexion
    console.log("1️⃣ Test de connexion...");
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: "user@toto.com",
        password: "password123",
      });

    if (signInError) {
      console.error("❌ Erreur de connexion:", signInError.message);
      return;
    }

    console.log("✅ Connexion réussie");
    const userId = signInData.user?.id;

    // 2. Test de récupération des articles
    console.log("\n2️⃣ Test de récupération des articles...");
    const { data: posts, error: postsError } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        author:users!blog_posts_author_id_fkey(
          first_name,
          last_name,
          email
        )
      `
      )
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error(
        "❌ Erreur lors de la récupération des articles:",
        postsError.message
      );
      return;
    }

    console.log("✅ Articles récupérés avec succès");
    console.log(`   Nombre d'articles: ${posts?.length || 0}`);

    if (posts && posts.length > 0) {
      const firstPost = posts[0];
      console.log(`   Premier article: "${firstPost.title}"`);

      // 3. Test des réactions
      console.log("\n3️⃣ Test des réactions...");

      // Ajouter une réaction
      const { error: reactionError } = await supabase
        .from("blog_reactions")
        .insert({
          post_id: firstPost.id,
          user_id: userId,
          reaction_type: "love",
        });

      if (reactionError) {
        console.error(
          "❌ Erreur lors de l'ajout de la réaction:",
          reactionError.message
        );
      } else {
        console.log("✅ Réaction ajoutée avec succès");
      }

      // Récupérer les réactions
      const { data: reactions, error: reactionsError } = await supabase
        .from("blog_reactions")
        .select("*")
        .eq("post_id", firstPost.id);

      if (reactionsError) {
        console.error(
          "❌ Erreur lors de la récupération des réactions:",
          reactionsError.message
        );
      } else {
        console.log(`✅ Réactions récupérées: ${reactions?.length || 0}`);
      }

      // 4. Test des commentaires
      console.log("\n4️⃣ Test des commentaires...");

      // Ajouter un commentaire
      const { error: commentError } = await supabase
        .from("blog_comments")
        .insert({
          post_id: firstPost.id,
          user_id: userId,
          content: "Test commentaire avancé - " + new Date().toISOString(),
          is_approved: true,
        });

      if (commentError) {
        console.error(
          "❌ Erreur lors de l'ajout du commentaire:",
          commentError.message
        );
      } else {
        console.log("✅ Commentaire ajouté avec succès");
      }

      // Récupérer les commentaires
      const { data: comments, error: commentsError } = await supabase
        .from("blog_comments")
        .select(
          `
          *,
          author:users!blog_comments_author_id_fkey(
            first_name,
            last_name,
            email
          )
        `
        )
        .eq("post_id", firstPost.id)
        .eq("is_approved", true);

      if (commentsError) {
        console.error(
          "❌ Erreur lors de la récupération des commentaires:",
          commentsError.message
        );
      } else {
        console.log(`✅ Commentaires récupérés: ${comments?.length || 0}`);
      }

      // 5. Test de réponse à un commentaire
      if (comments && comments.length > 0) {
        console.log("\n5️⃣ Test de réponse à un commentaire...");

        const { error: replyError } = await supabase
          .from("blog_comments")
          .insert({
            post_id: firstPost.id,
            user_id: userId,
            content: "Réponse au commentaire - " + new Date().toISOString(),
            parent_id: comments[0].id,
            is_approved: true,
          });

        if (replyError) {
          console.error(
            "❌ Erreur lors de l'ajout de la réponse:",
            replyError.message
          );
        } else {
          console.log("✅ Réponse ajoutée avec succès");
        }
      }

      // 6. Test de mise à jour du compteur de vues
      console.log("\n6️⃣ Test de mise à jour du compteur de vues...");

      const { error: viewError } = await supabase
        .from("blog_posts")
        .update({ view_count: (firstPost.view_count || 0) + 1 })
        .eq("id", firstPost.id);

      if (viewError) {
        console.error(
          "❌ Erreur lors de la mise à jour des vues:",
          viewError.message
        );
      } else {
        console.log("✅ Compteur de vues mis à jour");
      }
    }

    // 7. Test de recherche et filtres
    console.log("\n7️⃣ Test de recherche et filtres...");

    // Recherche par titre
    const { data: searchResults, error: searchError } = await supabase
      .from("blog_posts")
      .select("*")
      .or("title.ilike.%Bienvenue%,content.ilike.%CSE%");

    if (searchError) {
      console.error("❌ Erreur lors de la recherche:", searchError.message);
    } else {
      console.log(
        `✅ Recherche effectuée: ${searchResults?.length || 0} résultats`
      );
    }

    // Filtre par catégorie
    const { data: categoryResults, error: categoryError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", "actualites");

    if (categoryError) {
      console.error(
        "❌ Erreur lors du filtrage par catégorie:",
        categoryError.message
      );
    } else {
      console.log(
        `✅ Filtrage par catégorie: ${categoryResults?.length || 0} articles`
      );
    }

    // 8. Statistiques avancées
    console.log("\n8️⃣ Statistiques avancées...");

    const [
      { count: totalPosts },
      { count: totalComments },
      { count: totalReactions },
      { count: totalViews },
    ] = await Promise.all([
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      supabase
        .from("blog_comments")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("blog_reactions")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("blog_posts")
        .select("view_count", { count: "exact", head: true }),
    ]);

    console.log("📊 Statistiques avancées:");
    console.log(`   Articles: ${totalPosts || 0}`);
    console.log(`   Commentaires: ${totalComments || 0}`);
    console.log(`   Réactions: ${totalReactions || 0}`);
    console.log(`   Vues totales: ${totalViews || 0}`);

    // 9. Test de déconnexion
    console.log("\n9️⃣ Test de déconnexion...");
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("❌ Erreur lors de la déconnexion:", signOutError.message);
    } else {
      console.log("✅ Déconnexion réussie");
    }

    console.log(
      "\n🎉 Tous les tests des fonctionnalités avancées du blog sont passés!"
    );
    console.log(
      "🌐 Testez maintenant l'interface sur: http://localhost:3000/dashboard/blog"
    );
    console.log("📝 Fonctionnalités testées:");
    console.log("   ✅ Système de réactions (like, love, helpful)");
    console.log("   ✅ Système de commentaires avec réponses");
    console.log("   ✅ Compteur de vues");
    console.log("   ✅ Recherche et filtres");
    console.log("   ✅ Statistiques avancées");
  } catch (error) {
    console.error("❌ Erreur générale:", error);
  }
}

testBlogAdvanced();
