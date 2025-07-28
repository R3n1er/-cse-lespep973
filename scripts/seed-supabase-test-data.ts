import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { MOCK_BLOG_POSTS } from "../src/lib/data/mock";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Variables d'environnement Supabase manquantes");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seed() {
  // Articles
  for (const post of MOCK_BLOG_POSTS) {
    await supabase.from("blog_posts").upsert({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      author_id: post.author_id,
      created_at: post.created_at,
      updated_at: post.updated_at,
      published_at: post.published_at,
      is_published: post.is_published,
    });
    // Commentaires
    for (let i = 1; i <= 2; i++) {
      await supabase.from("blog_comments").insert({
        post_id: post.id,
        user_id: "user-1",
        content: `Commentaire ${i} sur ${post.title}`,
        created_at: new Date().toISOString(),
      });
    }
    // Réactions
    for (const type of ["like", "love"]) {
      await supabase.from("blog_reactions").insert({
        post_id: post.id,
        user_id: "user-1",
        reaction_type: type,
        created_at: new Date().toISOString(),
      });
    }
  }
  console.log("Seed terminé !");
}

seed();
