"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { supabase } from "@/lib/supabase/config";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/supabase/auth";

interface ReactionButtonProps {
  postId: string;
  initialCount?: number;
  initialUserReaction?: boolean;
}

export default function ReactionButton({
  postId,
  initialCount = 0,
  initialUserReaction = false,
}: ReactionButtonProps) {
  const [user, setUser] = useState<any>(null);
  const [count, setCount] = useState(initialCount);
  const [userReaction, setUserReaction] = useState(initialUserReaction);
  const [isLoading, setIsLoading] = useState(false);

  // Charger l'utilisateur connecté
  useEffect(() => {
    const loadUser = async () => {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  // Charger l'état initial des réactions
  useEffect(() => {
    const loadReactions = async () => {
      if (!user) return;

      try {
        // Récupérer le nombre total de likes
        const { count: totalCount } = await supabase
          .from("blog_reactions")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postId)
          .eq("reaction_type", "like");

        // Vérifier si l'utilisateur a déjà réagi
        const { data: userData } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (userData) {
          const { data: userReactionData } = await supabase
            .from("blog_reactions")
            .select("id")
            .eq("post_id", postId)
            .eq("user_id", userData.id)
            .eq("reaction_type", "like")
            .single();

          setUserReaction(!!userReactionData);
        }

        setCount(totalCount || 0);
      } catch (error) {
        console.error("Erreur lors du chargement des réactions:", error);
      }
    };

    loadReactions();
  }, [user, postId]);

  const handleReaction = async () => {
    if (!user) {
      toast.error("Connectez-vous pour réagir aux articles");
      return;
    }

    setIsLoading(true);

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

      if (userReaction) {
        // Supprimer la réaction
        const { error: deleteError } = await supabase
          .from("blog_reactions")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userData.id)
          .eq("reaction_type", "like");

        if (deleteError) {
          console.error(
            "Erreur lors de la suppression de la réaction:",
            deleteError
          );
          toast.error("Erreur lors de la suppression de la réaction");
          return;
        }

        setCount((prev) => Math.max(0, prev - 1));
        setUserReaction(false);
        toast.success("Réaction supprimée");
      } else {
        // Ajouter la réaction
        const { error: insertError } = await supabase
          .from("blog_reactions")
          .insert({
            post_id: postId,
            user_id: userData.id,
            reaction_type: "like",
          });

        if (insertError) {
          console.error("Erreur lors de l'ajout de la réaction:", insertError);
          toast.error("Erreur lors de l'ajout de la réaction");
          return;
        }

        setCount((prev) => prev + 1);
        setUserReaction(true);
        toast.success("Article liké !");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={userReaction ? "default" : "outline"}
      size="sm"
      onClick={handleReaction}
      disabled={isLoading}
      className={`transition-all duration-200 ${
        userReaction
          ? "bg-blue-500 hover:bg-blue-600 text-white"
          : "hover:bg-blue-50"
      }`}
    >
      <ThumbsUp
        className={`w-4 h-4 mr-2 transition-transform duration-200 ${
          userReaction ? "fill-current scale-110" : ""
        }`}
      />
      {count > 0 && <span className="ml-1 text-sm font-medium">{count}</span>}
    </Button>
  );
}
