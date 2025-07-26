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
import { BlogPost } from "@/types";
import ReactionButton from "@/components/blog/ReactionButton";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { MOCK_BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/data/mock";
import { formatDate, truncateText } from "@/lib/utils/formatting";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // TODO: Remplacer par un fetch Supabase
  useEffect(() => {
    // setPosts(...)
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      (!category || post.category === category) &&
      (post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-cse-primary text-center">
          Blog & Actualités
        </h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={!category ? "cse" : "outline"}
              onClick={() => setCategory(null)}
              size="sm"
            >
              Toutes
            </Button>
            {BLOG_CATEGORIES.map((cat: string) => (
              <Button
                key={cat}
                variant={category === cat ? "cse" : "outline"}
                onClick={() => setCategory(cat)}
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>
          <Input
            placeholder="Rechercher un article..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              Aucun article trouvé.
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="hover:scale-[1.02] transition-transform"
              >
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-xs text-gray-400">
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-gray-700 line-clamp-3 mb-4">
                      {truncateText(post.content, 150)}
                    </p>

                    {/* Bouton de réaction */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <ReactionButton postId={post.id} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

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
