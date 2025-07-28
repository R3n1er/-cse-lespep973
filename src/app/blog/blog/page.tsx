"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Heart,
  Eye,
  Calendar,
  User,
  Search,
} from "lucide-react";
import { supabase } from "@/lib/supabase/config";
import { formatDate } from "@/lib/utils/formatting";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string | null;
  author_id: string;
  author?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      let query = supabase
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

      // Appliquer les filtres
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }
      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setPosts(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error);
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPosts();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchPosts();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "actualites":
        return "bg-blue-100 text-blue-800";
      case "guides":
        return "bg-green-100 text-green-800";
      case "evenements":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "actualites":
        return "Actualités";
      case "guides":
        return "Guides";
      case "evenements":
        return "Événements";
      default:
        return category;
    }
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Blog & Actualités
        </h1>
        <p className="text-gray-600">
          Découvrez les dernières actualités et guides du CSE Les PEP 973
        </p>
      </div>

      {/* Filtres et recherche */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
          </div>
          <Button onClick={handleSearch} className="sm:w-auto">
            Rechercher
          </Button>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange("all")}
          >
            Tous
          </Button>
          <Button
            variant={selectedCategory === "actualites" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange("actualites")}
          >
            Actualités
          </Button>
          <Button
            variant={selectedCategory === "guides" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange("guides")}
          >
            Guides
          </Button>
          <Button
            variant={selectedCategory === "evenements" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange("evenements")}
          >
            Événements
          </Button>
        </div>
      </div>

      {/* Liste des articles */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== "all"
                ? "Aucun article ne correspond à vos critères de recherche."
                : "Aucun article n'a encore été publié."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getCategoryColor(post.category)}>
                    {getCategoryLabel(post.category)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {post.created_at
                      ? formatDate(post.created_at)
                      : "Date inconnue"}
                  </div>
                </div>
                <CardTitle className="text-xl line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {truncateContent(post.content)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>
                      {post.author?.first_name} {post.author?.last_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>0</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/dashboard/blog/${encodeURIComponent(post.title)}`
                    )
                  }
                >
                  Lire la suite
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistiques */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques du Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {posts.length}
                </div>
                <div className="text-sm text-gray-500">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-500">Commentaires</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">0</div>
                <div className="text-sm text-gray-500">Réactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {posts.filter((p) => p.category === "actualites").length}
                </div>
                <div className="text-sm text-gray-500">Actualités</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
