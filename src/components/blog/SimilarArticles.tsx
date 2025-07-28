"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { MOCK_BLOG_POSTS } from "@/lib/data/mock";
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
  const [similarArticles, setSimilarArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarArticles = () => {
      try {
        // Filtrer les articles de la même catégorie
        let articles = MOCK_BLOG_POSTS.filter(
          (article) =>
            article.category === category && article.id !== currentPostId
        );

        // Si on n'a pas assez d'articles de la même catégorie, compléter avec d'autres articles
        if (articles.length < maxArticles) {
          const remainingCount = maxArticles - articles.length;
          const otherArticles = MOCK_BLOG_POSTS.filter(
            (article) =>
              article.category !== category && article.id !== currentPostId
          ).slice(0, remainingCount);

          articles = [...articles, ...otherArticles];
        }

        // Limiter au nombre maximum demandé
        articles = articles.slice(0, maxArticles);

        setSimilarArticles(articles);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    // Simuler un délai de chargement
    setTimeout(() => {
      fetchSimilarArticles();
    }, 300);
  }, [currentPostId, category, maxArticles]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (similarArticles.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📚</div>
        <p className="text-gray-500">
          Aucun article similaire trouvé pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {similarArticles.map((article) => (
        <Link
          key={article.id}
          href={`/blog/${article.id}`}
          className="block group"
        >
          <div className="p-4 rounded-lg border border-gray-200 hover:border-cse-primary/50 hover:bg-gray-50/50 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-cse-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.category !== category && (
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {truncateText(article.content, 120)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatDate(
                      article.published_at ||
                        article.created_at ||
                        new Date().toISOString()
                    )}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cse-primary transition-colors ml-2 flex-shrink-0" />
            </div>
          </div>
        </Link>
      ))}

      <div className="pt-4 border-t border-gray-200">
        <Button variant="outline" asChild className="w-full">
          <Link href="/blog">
            Voir tous les articles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
