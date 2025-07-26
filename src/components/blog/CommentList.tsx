"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Reply, User } from "lucide-react";
import { supabase } from "@/lib/supabase/config";
import { BlogCommentWithUser } from "@/types";
import CommentForm from "./CommentForm";

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<BlogCommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("blog_comments")
        .select(
          `
          *,
          user:users(id, first_name, last_name, email)
        `
        )
        .eq("post_id", postId)
        .eq("is_approved", true)
        .is("parent_id", null) // Seulement les commentaires parents
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Erreur lors de la récupération des commentaires:",
          error
        );
        return;
      }

      // Organiser les commentaires avec leurs réponses
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from("blog_comments")
            .select(
              `
              *,
              user:users(id, first_name, last_name, email)
            `
            )
            .eq("parent_id", comment.id)
            .eq("is_approved", true)
            .order("created_at", { ascending: true });

          return {
            ...comment,
            replies: replies || [],
          };
        })
      );

      setComments(commentsWithReplies);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [postId, fetchComments]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const CommentItem = ({
    comment,
    level = 0,
  }: {
    comment: BlogCommentWithUser;
    level?: number;
  }) => (
    <div
      className={`${level > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""}`}
    >
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {comment.user?.first_name} {comment.user?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(comment.created_at)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
              className="text-xs"
            >
              <Reply className="w-3 h-3 mr-1" />
              Répondre
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-700 mb-3">{comment.content}</p>

          {replyingTo === comment.id && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onCommentAdded={() => {
                  setReplyingTo(null);
                  fetchComments();
                }}
                onCancel={() => setReplyingTo(null)}
              />
            </div>
          )}

          {/* Afficher les réponses */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} level={level + 1} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Chargement des commentaires...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">
          Commentaires ({comments.length})
        </h3>
      </div>

      {comments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Aucun commentaire pour le moment. Soyez le premier à commenter !
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      <CommentForm postId={postId} onCommentAdded={fetchComments} />
    </div>
  );
}
