import { supabase } from "@/lib/supabase/config";
import type {
  BlogPost,
  BlogComment,
  BlogReaction,
  CreateBlogPostData,
  UpdateBlogPostData,
  CreateCommentData,
  CreateReactionData,
  BlogFilters,
  BlogListResponse,
  BlogStats,
} from "@/types/blog";

// Service pour les articles de blog
export class BlogService {
  // Récupérer tous les articles publiés avec pagination
  static async getPublishedPosts(
    page: number = 1,
    limit: number = 10,
    filters?: BlogFilters
  ): Promise<BlogListResponse> {
    let query = supabase
      .from("blog_posts")
      .select(
        `
        *,
        author:users!blog_posts_author_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    // Appliquer les filtres
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }
    if (filters?.author_id) {
      query = query.eq("author_id", filters.author_id);
    }
    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
      );
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: posts, error, count } = await query;

    if (error) {
      throw new Error(
        `Erreur lors de la récupération des articles: ${error.message}`
      );
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      posts: posts || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  // Récupérer un article par son ID
  static async getPostById(id: string): Promise<BlogPost | null> {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        author:users!blog_posts_author_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `
      )
      .eq("id", id)
      .eq("is_published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Article non trouvé
      }
      throw new Error(
        `Erreur lors de la récupération de l'article: ${error.message}`
      );
    }

    return post;
  }

  // Créer un nouvel article
  static async createPost(postData: CreateBlogPostData): Promise<BlogPost> {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .insert({
        ...postData,
        is_published: postData.status === "published",
        published_at:
          postData.status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(
        `Erreur lors de la création de l'article: ${error.message}`
      );
    }

    return post;
  }

  // Mettre à jour un article
  static async updatePost(postData: UpdateBlogPostData): Promise<BlogPost> {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .update({
        ...postData,
        is_published: postData.status === "published",
        published_at:
          postData.status === "published" ? new Date().toISOString() : null,
      })
      .eq("id", postData.id)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Erreur lors de la mise à jour de l'article: ${error.message}`
      );
    }

    return post;
  }

  // Supprimer un article
  static async deletePost(id: string): Promise<void> {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      throw new Error(
        `Erreur lors de la suppression de l'article: ${error.message}`
      );
    }
  }
}

// Service pour les commentaires
export class CommentService {
  // Récupérer les commentaires d'un article
  static async getCommentsByPostId(postId: string): Promise<BlogComment[]> {
    const { data: comments, error } = await supabase
      .from("blog_comments")
      .select(
        `
        *,
        author:users!blog_comments_user_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `
      )
      .eq("post_id", postId)
      .eq("is_approved", true)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(
        `Erreur lors de la récupération des commentaires: ${error.message}`
      );
    }

    return comments || [];
  }

  // Créer un commentaire
  static async createComment(
    commentData: CreateCommentData
  ): Promise<BlogComment> {
    const { data: comment, error } = await supabase
      .from("blog_comments")
      .insert(commentData)
      .select(
        `
        *,
        author:users!blog_comments_user_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `
      )
      .single();

    if (error) {
      throw new Error(
        `Erreur lors de la création du commentaire: ${error.message}`
      );
    }

    return comment;
  }

  // Mettre à jour un commentaire
  static async updateComment(
    id: string,
    content: string
  ): Promise<BlogComment> {
    const { data: comment, error } = await supabase
      .from("blog_comments")
      .update({ content })
      .eq("id", id)
      .select(
        `
        *,
        author:users!blog_comments_user_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `
      )
      .single();

    if (error) {
      throw new Error(
        `Erreur lors de la mise à jour du commentaire: ${error.message}`
      );
    }

    return comment;
  }

  // Supprimer un commentaire
  static async deleteComment(id: string): Promise<void> {
    const { error } = await supabase
      .from("blog_comments")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(
        `Erreur lors de la suppression du commentaire: ${error.message}`
      );
    }
  }
}

// Service pour les réactions
export class ReactionService {
  // Récupérer les réactions d'un article
  static async getReactionsByPostId(postId: string): Promise<BlogReaction[]> {
    const { data: reactions, error } = await supabase
      .from("blog_reactions")
      .select(
        `
        *,
        user:users!blog_reactions_user_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `
      )
      .eq("post_id", postId);

    if (error) {
      throw new Error(
        `Erreur lors de la récupération des réactions: ${error.message}`
      );
    }

    return reactions || [];
  }

  // Ajouter ou mettre à jour une réaction
  static async toggleReaction(
    reactionData: CreateReactionData
  ): Promise<BlogReaction | null> {
    // Vérifier si la réaction existe déjà
    const { data: existingReaction } = await supabase
      .from("blog_reactions")
      .select("*")
      .eq("post_id", reactionData.post_id)
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
      .eq("reaction_type", reactionData.reaction_type)
      .single();

    if (existingReaction) {
      // Supprimer la réaction existante (toggle)
      const { error } = await supabase
        .from("blog_reactions")
        .delete()
        .eq("id", existingReaction.id);

      if (error) {
        throw new Error(
          `Erreur lors de la suppression de la réaction: ${error.message}`
        );
      }

      return null;
    } else {
      // Créer une nouvelle réaction
      const { data: reaction, error } = await supabase
        .from("blog_reactions")
        .insert(reactionData)
        .select(
          `
          *,
          user:users!blog_reactions_user_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        `
        )
        .single();

      if (error) {
        throw new Error(
          `Erreur lors de la création de la réaction: ${error.message}`
        );
      }

      return reaction;
    }
  }
}

// Service pour les statistiques
export class BlogStatsService {
  // Récupérer les statistiques du blog
  static async getStats(): Promise<BlogStats> {
    const [
      { count: totalPosts },
      { count: publishedPosts },
      { count: draftPosts },
      { count: totalComments },
      { count: totalReactions },
    ] = await Promise.all([
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      supabase
        .from("blog_posts")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true),
      supabase
        .from("blog_posts")
        .select("*", { count: "exact", head: true })
        .eq("is_published", false),
      supabase
        .from("blog_comments")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("blog_reactions")
        .select("*", { count: "exact", head: true }),
    ]);

    // Récupérer les articles populaires
    const { data: popularPosts } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        author:users!blog_posts_author_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(5);

    // Récupérer les commentaires récents
    const { data: recentComments } = await supabase
      .from("blog_comments")
      .select(
        `
        *,
        author:users!blog_comments_user_id_fkey(
          id,
          first_name,
          last_name,
          email
        ),
        post:blog_posts!blog_comments_post_id_fkey(
          id,
          title
        )
      `
      )
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(10);

    return {
      totalPosts: totalPosts || 0,
      publishedPosts: publishedPosts || 0,
      draftPosts: draftPosts || 0,
      totalComments: totalComments || 0,
      totalReactions: totalReactions || 0,
      popularPosts: popularPosts || [],
      recentComments: recentComments || [],
    };
  }
}
