"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/config";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/supabase/auth";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Le commentaire ne peut pas être vide")
    .max(1000, "Le commentaire est trop long"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCommentAdded?: () => void;
  onCancel?: () => void;
}

export default function CommentForm({
  postId,
  parentId,
  onCommentAdded,
  onCancel,
}: CommentFormProps) {
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger l'utilisateur connecté
  useState(() => {
    const loadUser = async () => {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    if (!user) {
      toast.error("Vous devez être connecté pour commenter");
      return;
    }

    setIsSubmitting(true);

    try {
      // Récupérer l'utilisateur depuis Supabase
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();

      if (userError || !userData) {
        toast.error("Erreur lors de la récupération de votre profil");
        return;
      }

      // Insérer le commentaire
      const { error: commentError } = await supabase
        .from("blog_comments")
        .insert({
          post_id: postId,
          user_id: userData.id,
          content: data.content,
          parent_id: parentId,
          is_approved: false, // Les commentaires nécessitent une modération
        });

      if (commentError) {
        console.error("Erreur lors de l'ajout du commentaire:", commentError);
        toast.error("Erreur lors de l'ajout du commentaire");
        return;
      }

      toast.success("Commentaire ajouté ! Il sera visible après modération.");
      reset();
      onCommentAdded?.();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Connectez-vous pour ajouter un commentaire
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {parentId ? "Répondre au commentaire" : "Ajouter un commentaire"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Textarea
              {...register("content")}
              placeholder="Écrivez votre commentaire..."
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="text-sm text-red-500 mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : "Publier"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
