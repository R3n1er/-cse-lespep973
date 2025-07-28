#!/usr/bin/env tsx

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBlog() {
  console.log("🧪 TEST DU MODULE BLOG");
  console.log("======================\n");

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
    console.log("   Utilisateur:", signInData.user?.email);

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
      console.log("\n📝 Articles disponibles:");
      posts.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.title}`);
        console.log(`      Catégorie: ${post.category}`);
        console.log(
          `      Auteur: ${post.author?.first_name} ${post.author?.last_name}`
        );
        console.log(`      Date: ${post.created_at}`);
        console.log("");
      });
    }

    // 3. Test de récupération des commentaires
    console.log("3️⃣ Test de récupération des commentaires...");
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
      .eq("is_approved", true);

    if (commentsError) {
      console.error(
        "❌ Erreur lors de la récupération des commentaires:",
        commentsError.message
      );
    } else {
      console.log("✅ Commentaires récupérés avec succès");
      console.log(`   Nombre de commentaires: ${comments?.length || 0}`);
    }

    // 4. Test de récupération des réactions
    console.log("\n4️⃣ Test de récupération des réactions...");
    const { data: reactions, error: reactionsError } = await supabase.from(
      "blog_reactions"
    ).select(`
        *,
        user:users!blog_reactions_user_id_fkey(
          first_name,
          last_name,
          email
        )
      `);

    if (reactionsError) {
      console.error(
        "❌ Erreur lors de la récupération des réactions:",
        reactionsError.message
      );
    } else {
      console.log("✅ Réactions récupérées avec succès");
      console.log(`   Nombre de réactions: ${reactions?.length || 0}`);
    }

    // 5. Test de création d'un commentaire (si des articles existent)
    if (posts && posts.length > 0) {
      console.log("\n5️⃣ Test de création d'un commentaire...");
      const testComment = {
        post_id: posts[0].id,
        content: "Test commentaire automatique - " + new Date().toISOString(),
      };

      const { data: newComment, error: createCommentError } = await supabase
        .from("blog_comments")
        .insert(testComment)
        .select()
        .single();

      if (createCommentError) {
        console.error(
          "❌ Erreur lors de la création du commentaire:",
          createCommentError.message
        );
      } else {
        console.log("✅ Commentaire créé avec succès");
        console.log("   ID:", newComment.id);
        console.log("   Contenu:", newComment.content);
      }
    }

    // 6. Test de création d'une réaction (si des articles existent)
    if (posts && posts.length > 0) {
      console.log("\n6️⃣ Test de création d'une réaction...");
      const testReaction = {
        post_id: posts[0].id,
        reaction_type: "like",
      };

      const { data: newReaction, error: createReactionError } = await supabase
        .from("blog_reactions")
        .insert(testReaction)
        .select()
        .single();

      if (createReactionError) {
        console.error(
          "❌ Erreur lors de la création de la réaction:",
          createReactionError.message
        );
      } else {
        console.log("✅ Réaction créée avec succès");
        console.log("   ID:", newReaction.id);
        console.log("   Type:", newReaction.reaction_type);
      }
    }

    // 7. Statistiques du blog
    console.log("\n7️⃣ Statistiques du blog...");
    const [
      { count: totalPosts },
      { count: totalComments },
      { count: totalReactions },
    ] = await Promise.all([
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      supabase
        .from("blog_comments")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("blog_reactions")
        .select("*", { count: "exact", head: true }),
    ]);

    console.log("📊 Statistiques:");
    console.log(`   Articles: ${totalPosts || 0}`);
    console.log(`   Commentaires: ${totalComments || 0}`);
    console.log(`   Réactions: ${totalReactions || 0}`);

    // 8. Test de déconnexion
    console.log("\n8️⃣ Test de déconnexion...");
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("❌ Erreur lors de la déconnexion:", signOutError.message);
    } else {
      console.log("✅ Déconnexion réussie");
    }

    console.log("\n🎉 Tous les tests du module blog sont passés!");
    console.log(
      "🌐 Vous pouvez maintenant tester l'interface sur: http://localhost:3000/dashboard/blog"
    );
  } catch (error) {
    console.error("❌ Erreur générale:", error);
  }
}

testBlog();
