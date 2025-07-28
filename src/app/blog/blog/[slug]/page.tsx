"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, User, Eye, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase/config";
import { formatDate } from "@/lib/utils/formatting";
import { toast } from "sonner";
import CommentSection from "@/components/blog/CommentSection";
import ReactionButtons from "@/components/blog/ReactionButtons";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string | null;
  author_id: string;
  view_count?: number;
  author?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchPost();
    getCurrentUser();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);

      // Récupérer l'article par son titre (slug simplifié)
      const { data, error } = await supabase
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
        .eq("title", decodeURIComponent(slug))
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          toast.error("Article non trouvé");
          router.push("/dashboard/blog");
          return;
        }
        throw error;
      }

      setPost(data);

      // Incrémenter le compteur de vues
      incrementViewCount(data.id);
    } catch (error) {
      console.error("Erreur lors du chargement de l'article:", error);
      toast.error("Erreur lors du chargement de l'article");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
    }
  };

  const incrementViewCount = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ view_count: (post?.view_count || 0) + 1 })
        .eq("id", postId);

      if (error) {
        console.error("Erreur lors de l'incrémentation des vues:", error);
      }
    } catch (error) {
      console.error("Erreur lors de l'incrémentation des vues:", error);
    }
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

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Article non trouvé
            </h3>
            <p className="text-gray-500">
              L'article que vous recherchez n'existe pas.
            </p>
            <Button
              onClick={() => router.push("/dashboard/blog")}
              className="mt-4"
            >
              Retour au blog
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      {/* Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/blog")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au blog
        </Button>
      </div>

      {/* Article */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
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
              <CardTitle className="text-3xl font-bold mb-4">
                {post.title}
              </CardTitle>
            </div>
          </div>

          {/* Auteur et métadonnées */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="" />
                <AvatarFallback>
                  {getInitials(post.author?.first_name, post.author?.last_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {post.author?.first_name} {post.author?.last_name}
                </div>
                <div className="text-sm text-gray-500">
                  {post.author?.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.view_count || 0} vues</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>0 commentaires</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Contenu de l'article */}
          <div className="prose prose-lg max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Réactions */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Réactions</h3>
            <ReactionButtons postId={post.id} currentUserId={currentUser?.id} />
          </div>
        </CardContent>
      </Card>

      {/* Section commentaires */}
      <CommentSection postId={post.id} currentUserId={currentUser?.id} />
    </div>
  );
}
