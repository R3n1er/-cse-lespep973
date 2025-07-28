"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/main-layout";
import Link from "next/link";
import ReactionButton from "@/components/blog/ReactionButton";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import BlogStats from "@/components/blog/BlogStats";
import CategoryFilter from "@/components/blog/CategoryFilter";
import BlogCard from "@/components/blog/BlogCard";
import { useBlog } from "@/lib/hooks/useBlog";

export default function BlogPage() {
  const { loading, error, filters, setFilters, filteredPosts, stats } =
    useBlog();

  const handleCategoryChange = (category: string | null) => {
    setFilters({ ...filters, category });
  };

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search });
  };

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6 text-cse-primary">
              Blog & Actualités
            </h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-cse-primary text-center">
          Blog & Actualités
        </h1>

        {/* Statistiques du blog */}
        <div className="mb-8">
          <BlogStats />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <CategoryFilter
            selectedCategory={filters.category || null}
            onCategoryChange={handleCategoryChange}
          />
          <Input
            placeholder="Rechercher un article..."
            value={filters.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">
                  Aucun article trouvé
                </h3>
                <p className="text-gray-400">
                  {filters.search || filters.category
                    ? "Essayez de modifier vos critères de recherche"
                    : "Aucun article n'est disponible pour le moment"}
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            )}
          </div>
        )}

        {/* Section Newsletter */}
        <div className="mt-12">
          <NewsletterSignup
            title="Restez informé"
            description="Recevez nos dernières actualités et événements directement dans votre boîte mail"
            showNames={true}
          />
        </div>
      </div>
    </MainLayout>
  );
}
