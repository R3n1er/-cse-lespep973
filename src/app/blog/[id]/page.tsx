"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/main-layout";
import Link from "next/link";
import { BlogPost } from "@/types";
import CommentList from "@/components/blog/CommentList";
import ReactionButton from "@/components/blog/ReactionButton";
import SimilarArticles from "@/components/blog/SimilarArticles";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { MOCK_BLOG_POSTS } from "@/lib/data/mock";
import { formatDate } from "@/lib/utils/formatting";

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // TODO: Remplacer par un fetch Supabase
    const found = MOCK_BLOG_POSTS.find((p: BlogPost) => p.id === params.id);
    setPost(found || null);
  }, [params.id]);

  if (!post) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 text-center text-gray-500">
          Article introuvable.
          <div className="mt-6">
            <Button variant="outline" onClick={() => router.back()}>
              Retour au blog
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10 max-w-2xl">
        <Button variant="outline" className="mb-6" asChild>
          <Link href="/blog">← Retour au blog</Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-2">
              {post.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{post.category}</Badge>
              <span className="text-xs text-gray-400">
                {formatDate(post.published_at || post.created_at)}
              </span>
            </CardDescription>
            <div className="text-sm text-gray-500 mb-2">
              Par <b>Admin CSE</b>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-800 mb-6">
              {post.content}
            </div>

            {/* Bouton de réaction */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <ReactionButton postId={post.id} />
            </div>
          </CardContent>
        </Card>

        {/* Section des commentaires */}
        <div className="mt-8">
          <CommentList postId={post.id} />
        </div>

        {/* Section des articles similaires */}
        <div className="mt-8">
          <SimilarArticles
            currentPostId={post.id}
            category={post.category}
            maxArticles={3}
          />
        </div>

        {/* Section Newsletter */}
        <div className="mt-8">
          <NewsletterSignup
            title="Newsletter"
            description="Recevez nos prochains articles directement dans votre boîte mail"
            showNames={false}
          />
        </div>
      </div>
    </MainLayout>
  );
}
