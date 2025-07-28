// Types pour le module Blog

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  status: "draft" | "published" | "archived";
  author_id: string;
  category: string;
  tags: string[];
  view_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  // Relations
  author?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  comments?: BlogComment[];
  reactions?: BlogReaction[];
  _count?: {
    comments: number;
    reactions: number;
  };
}

export interface BlogComment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id?: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  author?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  post?: BlogPost;
  parent?: BlogComment;
  replies?: BlogComment[];
}

export interface BlogReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: "like" | "love" | "helpful";
  created_at: string;
  // Relations
  post?: BlogPost;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface CreateBlogPostData {
  title: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category?: string;
  tags?: string[];
  status?: "draft" | "published";
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string;
}

export interface CreateCommentData {
  post_id: string;
  content: string;
  parent_id?: string;
}

export interface CreateReactionData {
  post_id: string;
  reaction_type: "like" | "love" | "helpful";
}

export interface BlogFilters {
  category?: string;
  tags?: string[];
  author_id?: string;
  status?: "draft" | "published" | "archived";
  search?: string;
}

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogListResponse {
  posts: BlogPost[];
  pagination: BlogPagination;
}

// Types pour les statistiques
export interface BlogStats {
  totalPosts: number;
  totalComments: number;
  totalReactions: number;
  publishedPosts: number;
  draftPosts: number;
  popularPosts: BlogPost[];
  recentComments: BlogComment[];
}

// Types pour les catégories
export interface BlogCategory {
  name: string;
  slug: string;
  count: number;
  description?: string;
}

// Types pour les tags
export interface BlogTag {
  name: string;
  count: number;
}
