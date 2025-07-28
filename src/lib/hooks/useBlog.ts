import { useState, useEffect, useCallback } from "react";
import { MOCK_BLOG_POSTS } from "@/lib/data/mock";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  published_at?: string | null;
  created_at?: string | null;
}

interface BlogFilters {
  category?: string | null;
  search?: string;
}

interface UseBlogReturn {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  filters: BlogFilters;
  setFilters: (filters: BlogFilters) => void;
  filteredPosts: BlogPost[];
  categories: string[];
  stats: {
    totalPosts: number;
    totalComments: number;
    totalReactions: number;
    totalViews: number;
  };
}

export function useBlog(): UseBlogReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BlogFilters>({});

  // Charger les articles
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simuler un délai de chargement
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPosts(MOCK_BLOG_POSTS);
    } catch (err) {
      console.error("Erreur lors du chargement des articles:", err);
      setError("Impossible de charger les articles. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les articles au montage
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Filtrer les articles
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      !filters.category || post.category === filters.category;
    const matchesSearch =
      !filters.search ||
      post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      post.content.toLowerCase().includes(filters.search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Extraire les catégories uniques
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  // Calculer les statistiques
  const stats = {
    totalPosts: posts.length,
    totalComments: posts.reduce((sum, post) => sum + 0, 0), // TODO: Remplacer par de vraies données
    totalReactions: posts.reduce((sum, post) => sum + 0, 0), // TODO: Remplacer par de vraies données
    totalViews: posts.reduce((sum, post) => sum + 0, 0), // TODO: Remplacer par de vraies données
  };

  return {
    posts,
    loading,
    error,
    filters,
    setFilters,
    filteredPosts,
    categories,
    stats,
  };
}
