import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Heart, Eye } from "lucide-react";
import Link from "next/link";
import ReactionButton from "@/components/blog/ReactionButton";
import { formatDate, truncateText } from "@/lib/utils/formatting";

interface BlogCardProps {
  post: any;
  className?: string;
}

export default function BlogCard({ post, className = "" }: BlogCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      Actualités: "bg-blue-100 text-blue-700",
      Tickets: "bg-green-100 text-green-700",
      Remboursements: "bg-purple-100 text-purple-700",
      Avantages: "bg-orange-100 text-orange-700",
      Événements: "bg-red-100 text-red-700",
      Partenaires: "bg-indigo-100 text-indigo-700",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      Actualités: "📰",
      Tickets: "🎫",
      Remboursements: "💰",
      Avantages: "🎁",
      Événements: "📅",
      Partenaires: "🤝",
    };
    return icons[category as keyof typeof icons] || "📄";
  };

  return (
    <Link
      href={`/blog/${post.id}`}
      className={`block group ${className}`}
      data-testid="blog-card"
    >
      <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden">
        {/* Image de couverture */}
        <div className="relative h-48 bg-gradient-to-br from-cse-primary/10 to-cse-secondary/10 flex items-center justify-center">
          <div className="text-6xl opacity-20">
            <span aria-label={`Icône catégorie ${post.category}`}>
              {getCategoryIcon(post.category)}
            </span>
          </div>
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className={`${getCategoryColor(post.category)} border-0`}
              data-testid="category-badge"
            >
              {post.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <div className="w-2 h-2 bg-cse-primary rounded-full animate-pulse"></div>
          </div>
        </div>

        <CardHeader className="flex-1">
          <CardTitle
            className="text-lg font-semibold line-clamp-2 group-hover:text-cse-primary transition-colors"
            data-testid="article-title"
          >
            {post.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <Calendar className="w-3 h-3" />
            <span data-testid="article-date">
              {formatDate(
                post.published_at || post.created_at || new Date().toISOString()
              )}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <p
            className="text-gray-700 line-clamp-3 mb-4 text-sm leading-relaxed"
            data-testid="article-excerpt"
          >
            {truncateText(post.content, 120)}
          </p>

          {/* Statistiques */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span data-testid="comment-count">0</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span data-testid="reaction-count">0</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span data-testid="view-count">0</span>
            </div>
          </div>

          {/* Bouton de réaction */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <ReactionButton postId={post.id} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
