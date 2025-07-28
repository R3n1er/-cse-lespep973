"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Heart, Eye, TrendingUp } from "lucide-react";

interface BlogStatsProps {
  className?: string;
}

export default function BlogStats({ className = "" }: BlogStatsProps) {
  const [stats, setStats] = useState({
    totalPosts: 5,
    totalComments: 12,
    totalReactions: 28,
    totalViews: 156,
    popularCategory: "Actualités",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un délai de chargement
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}
        data-testid="blog-stats-loading"
      >
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}
      data-testid="blog-stats"
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Articles</p>
              <p
                className="text-2xl font-bold text-cse-primary"
                data-testid="total-posts"
              >
                {stats.totalPosts}
              </p>
            </div>
            <div className="p-2 bg-cse-primary/10 rounded-full">
              <TrendingUp className="w-5 h-5 text-cse-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Commentaires</p>
              <p
                className="text-2xl font-bold text-blue-600"
                data-testid="total-comments"
              >
                {stats.totalComments}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Réactions</p>
              <p
                className="text-2xl font-bold text-red-600"
                data-testid="total-reactions"
              >
                {stats.totalReactions}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vues</p>
              <p
                className="text-2xl font-bold text-green-600"
                data-testid="total-views"
              >
                {stats.totalViews}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
