"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
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
import CommentList from "@/components/blog/CommentList";
import ReactionButton from "@/components/blog/ReactionButton";
import SimilarArticles from "@/components/blog/SimilarArticles";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { MOCK_BLOG_POSTS } from "@/lib/data/mock";
import { formatDate } from "@/lib/utils/formatting";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Simuler un délai de chargement
    setTimeout(() => {
      const found = MOCK_BLOG_POSTS.find((p: any) => p.id === slug);
      if (found) {
        setPost(found);
      } else {
        setError("Article introuvable");
      }
      setLoading(false);
    }, 500);
  }, [slug]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <Card>
              <CardHeader>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 max-w-4xl">
          <Button variant="outline" className="mb-6" asChild>
            <Link href="/blog">← Retour au blog</Link>
          </Button>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold mb-4 text-gray-700">
              Article introuvable
            </h1>
            <p className="text-gray-500 mb-6">
              L'article que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                Retour
              </Button>
              <Button asChild>
                <Link href="/blog">Voir tous les articles</Link>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10 max-w-4xl">
        <Button variant="outline" className="mb-6" asChild>
          <Link href="/blog">← Retour au blog</Link>
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{post.category}</Badge>
              <span className="text-xs text-gray-400">
                {formatDate(
                  post.published_at ||
                    post.created_at ||
                    new Date().toISOString()
                )}
              </span>
            </div>
            <CardTitle className="text-3xl font-bold mb-4 leading-tight">
              {post.title}
            </CardTitle>
            <CardDescription className="text-base">
              Par <span className="font-semibold">Admin CSE</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-800 mb-8 leading-relaxed">
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>

            {/* Bouton de réaction */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <ReactionButton postId={post.id} />
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>0 commentaires</span>
                <span>0 réactions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section des commentaires */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Commentaires</h2>
          <CommentList postId={post.id} />
        </div>

        {/* Section des articles similaires */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
          <SimilarArticles
            currentPostId={post.id}
            category={post.category}
            maxArticles={3}
          />
        </div>

        {/* Section Newsletter */}
        <div className="bg-gradient-to-r from-cse-primary/5 to-cse-secondary/5 rounded-lg p-8">
          <NewsletterSignup
            title="Restez informé"
            description="Recevez nos prochains articles et actualités directement dans votre boîte mail"
            showNames={false}
          />
        </div>
      </div>
    </MainLayout>
  );
}
