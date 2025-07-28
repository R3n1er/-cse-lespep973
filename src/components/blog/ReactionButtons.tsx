"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, HelpCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/config";
import { toast } from "sonner";

interface Reaction {
  id: string;
  reaction_type: string;
  user_id: string;
}

interface ReactionButtonsProps {
  postId: string;
  currentUserId?: string;
}

export default function ReactionButtons({
  postId,
  currentUserId,
}: ReactionButtonsProps) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchReactions();
  }, [postId]);

  const fetchReactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_reactions")
        .select("*")
        .eq("post_id", postId);

      if (error) {
        throw error;
      }

      setReactions(data || []);

      // Déterminer les réactions de l'utilisateur actuel
      if (currentUserId) {
        const userReactionTypes = new Set(
          (data || [])
            .filter((reaction) => reaction.user_id === currentUserId)
            .map((reaction) => reaction.reaction_type)
        );
        setUserReactions(userReactionTypes);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des réactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (reactionType: "like" | "love" | "helpful") => {
    if (!currentUserId) {
      toast.error("Connectez-vous pour réagir aux articles");
      return;
    }

    try {
      const isReacted = userReactions.has(reactionType);

      if (isReacted) {
        // Supprimer la réaction
        const { error } = await supabase
          .from("blog_reactions")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", currentUserId)
          .eq("reaction_type", reactionType);

        if (error) {
          throw error;
        }

        setUserReactions((prev) => {
          const newSet = new Set(prev);
          newSet.delete(reactionType);
          return newSet;
        });

        toast.success("Réaction supprimée");
      } else {
        // Ajouter la réaction
        const { error } = await supabase.from("blog_reactions").insert({
          post_id: postId,
          user_id: currentUserId,
          reaction_type: reactionType,
        });

        if (error) {
          throw error;
        }

        setUserReactions(
          (prev) => new Set([...Array.from(prev), reactionType])
        );
        toast.success("Réaction ajoutée");
      }

      // Recharger les réactions
      fetchReactions();
    } catch (error) {
      console.error("Erreur lors de la gestion de la réaction:", error);
      toast.error("Erreur lors de la gestion de la réaction");
    }
  };

  const getReactionCount = (type: "like" | "love" | "helpful") => {
    return reactions.filter((reaction) => reaction.reaction_type === type)
      .length;
  };

  const getReactionIcon = (type: "like" | "love" | "helpful") => {
    switch (type) {
      case "like":
        return <ThumbsUp className="w-4 h-4" />;
      case "love":
        return <Heart className="w-4 h-4" />;
      case "helpful":
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getReactionLabel = (type: "like" | "love" | "helpful") => {
    switch (type) {
      case "like":
        return "J'aime";
      case "love":
        return "J'adore";
      case "helpful":
        return "Utile";
    }
  };

  if (loading) {
    return (
      <div className="flex gap-2">
        {["like", "love", "helpful"].map((type) => (
          <Button key={type} variant="outline" size="sm" disabled>
            {getReactionIcon(type as any)}
            <span className="ml-1">...</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {(["like", "love", "helpful"] as const).map((type) => {
        const count = getReactionCount(type);
        const isReacted = userReactions.has(type);

        return (
          <Button
            key={type}
            variant={isReacted ? "default" : "outline"}
            size="sm"
            onClick={() => handleReaction(type)}
            className={isReacted ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            {getReactionIcon(type)}
            <span className="ml-1">
              {getReactionLabel(type)} {count > 0 && `(${count})`}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
