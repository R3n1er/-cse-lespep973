"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Reply, Trash2, Edit } from "lucide-react";
import { supabase } from "@/lib/supabase/config";
import { formatDate } from "@/lib/utils/formatting";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  post_id: string;
  parent_id?: string;
  is_approved: boolean;
  author?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  currentUserId?: string;
}

export default function CommentSection({
  postId,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_comments")
        .select(
          `
          *,
          author:users!blog_comments_author_id_fkey(
            first_name,
            last_name,
            email
          )
        `
        )
        .eq("post_id", postId)
        .eq("is_approved", true)
        .is("parent_id", null)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      // Organiser les commentaires avec leurs réponses
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from("blog_comments")
            .select(
              `
              *,
              author:users!blog_comments_author_id_fkey(
                first_name,
                last_name,
                email
              )
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
      console.error("Erreur lors du chargement des commentaires:", error);
      toast.error("Erreur lors du chargement des commentaires");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUserId) {
      toast.error("Veuillez saisir un commentaire");
      return;
    }

    try {
      const { error } = await supabase.from("blog_comments").insert({
        post_id: postId,
        author_id: currentUserId,
        content: newComment.trim(),
        parent_id: replyingTo,
        is_approved: true, // Auto-approuvé pour les utilisateurs connectés
      });

      if (error) {
        throw error;
      }

      toast.success("Commentaire ajouté avec succès");
      setNewComment("");
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }

    try {
      const { error } = await supabase
        .from("blog_comments")
        .update({ content: editContent.trim() })
        .eq("id", commentId)
        .eq("author_id", currentUserId);

      if (error) {
        throw error;
      }

      toast.success("Commentaire modifié avec succès");
      setEditingComment(null);
      setEditContent("");
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de la modification du commentaire:", error);
      toast.error("Erreur lors de la modification du commentaire");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("blog_comments")
        .delete()
        .eq("id", commentId)
        .eq("author_id", currentUserId);

      if (error) {
        throw error;
      }

      toast.success("Commentaire supprimé avec succès");
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
      toast.error("Erreur lors de la suppression du commentaire");
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isAuthor = comment.author_id === currentUserId;
    const isEditing = editingComment === comment.id;

    return (
      <div key={comment.id} className={`${isReply ? "ml-8 mt-3" : "mb-4"}`}>
        <Card className={isReply ? "border-l-2 border-blue-200" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs">
                    {getInitials(
                      comment.author?.first_name,
                      comment.author?.last_name
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">
                    {comment.author?.first_name} {comment.author?.last_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(comment.created_at)}
                  </div>
                </div>
              </div>
              {isAuthor && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditContent(comment.content);
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Modifier votre commentaire..."
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditComment(comment.id)}
                  >
                    Sauvegarder
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent("");
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
                {!isReply && currentUserId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    <Reply className="w-3 h-3 mr-1" />
                    Répondre
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Réponses */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Commentaires</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h3 className="text-lg font-semibold">
            Commentaires ({comments.length})
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulaire de commentaire */}
        {currentUserId && (
          <div className="space-y-2">
            {replyingTo && (
              <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                Répondre à un commentaire...
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                  className="ml-2"
                >
                  Annuler
                </Button>
              </div>
            )}
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                Publier
              </Button>
              {replyingTo && (
                <Button variant="outline" onClick={() => setReplyingTo(null)}>
                  Annuler
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Liste des commentaires */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucun commentaire pour le moment.</p>
            {!currentUserId && (
              <p className="text-sm mt-1">
                Connectez-vous pour laisser un commentaire.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => renderComment(comment))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
