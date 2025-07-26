"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/config";
import { BlogPost } from "@/types";
import { formatDate, truncateText } from "@/lib/utils/formatting";

interface SimilarArticlesProps {
  currentPostId: string;
  category: string;
  maxArticles?: number;
}

export default function SimilarArticles({
  currentPostId,
  category,
  maxArticles = 3,
}: SimilarArticlesProps) {
  const [similarArticles, setSimilarArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarArticles = async () => {
      try {
        // D'abord, essayer de récupérer les articles de la même catégorie
        const { data: sameCategoryArticles, error: sameCategoryError } =
          await supabase
            .from("blog_posts")
            .select("*")
            .eq("category", category)
            .eq("is_published", true)
            .neq("id", currentPostId)
            .order("published_at", { ascending: false })
            .limit(maxArticles);

        if (sameCategoryError) {
          console.error(
            "Erreur lors de la récupération des articles de la même catégorie:",
            sameCategoryError
          );
        }

        let articles = sameCategoryArticles || [];

        // Si on n'a pas assez d'articles de la même catégorie, compléter avec d'autres articles
        if (articles.length < maxArticles) {
          const remainingCount = maxArticles - articles.length;

          const { data: otherArticles, error: otherArticlesError } =
            await supabase
              .from("blog_posts")
              .select("*")
              .eq("is_published", true)
              .neq("id", currentPostId)
              .neq("category", category)
              .order("published_at", { ascending: false })
              .limit(remainingCount);

          if (otherArticlesError) {
            console.error(
              "Erreur lors de la récupération des autres articles:",
              otherArticlesError
            );
          }

          if (otherArticles) {
            articles = [...articles, ...otherArticles];
          }
        }

        setSimilarArticles(articles);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarArticles();
  }, [currentPostId, category, maxArticles]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Articles similaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Chargement...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (similarArticles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Articles similaires</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Aucun article similaire trouvé pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Articles similaires
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {similarArticles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.id}`}
              className="block group"
            >
              <div className="p-4 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50/50 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {article.category !== category && (
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {truncateText(article.content, 150)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatDate(article.published_at || article.created_at)}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors ml-2 flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" asChild className="w-full">
            <Link href="/blog">
              Voir tous les articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
