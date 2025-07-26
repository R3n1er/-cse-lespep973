"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/config";
import { toast } from "sonner";

// Schéma de validation
const newsletterSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  first_name: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .optional(),
  last_name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .optional(),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  showNames?: boolean;
  className?: string;
}

export default function NewsletterSignup({
  title = "Newsletter",
  description = "Restez informé des dernières actualités du CSE",
  showNames = false,
  className = "",
}: NewsletterSignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);

    try {
      // Vérifier si l'email est déjà inscrit
      const { data: existingSubscription, error: checkError } = await supabase
        .from("newsletter_subscriptions")
        .select("id, is_active")
        .eq("email", data.email)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 = "no rows returned", ce qui est normal si pas d'abonnement existant
        console.error("Erreur lors de la vérification:", checkError);
        toast.error("Une erreur est survenue. Veuillez réessayer.");
        return;
      }

      if (existingSubscription) {
        if (existingSubscription.is_active) {
          toast.error("Cette adresse email est déjà inscrite à la newsletter.");
          return;
        } else {
          // Réactiver l'abonnement
          const { error: updateError } = await supabase
            .from("newsletter_subscriptions")
            .update({
              is_active: true,
              unsubscribed_at: null,
              first_name: data.first_name,
              last_name: data.last_name,
            })
            .eq("id", existingSubscription.id);

          if (updateError) {
            console.error("Erreur lors de la réactivation:", updateError);
            toast.error("Une erreur est survenue. Veuillez réessayer.");
            return;
          }

          toast.success("Votre abonnement à la newsletter a été réactivé !");
          setIsSubscribed(true);
          reset();
          return;
        }
      }

      // Créer un nouvel abonnement
      const { error: insertError } = await supabase
        .from("newsletter_subscriptions")
        .insert({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          is_active: true,
        });

      if (insertError) {
        console.error("Erreur lors de l'inscription:", insertError);
        toast.error("Une erreur est survenue. Veuillez réessayer.");
        return;
      }

      toast.success("Inscription à la newsletter réussie !");
      setIsSubscribed(true);
      reset();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Inscription réussie !
            </h3>
            <p className="text-gray-600 mb-4">
              Vous recevrez désormais nos dernières actualités par email.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSubscribed(false)}
              className="w-full"
            >
              S&apos;inscrire à nouveau
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {showNames && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  {...register("first_name")}
                  placeholder="Prénom"
                  className={errors.first_name ? "border-red-500" : ""}
                />
                {errors.first_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  {...register("last_name")}
                  placeholder="Nom"
                  className={errors.last_name ? "border-red-500" : ""}
                />
                {errors.last_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="votre@email.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                S&apos;inscrire à la newsletter
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center">
            <p>En vous inscrivant, vous acceptez de recevoir nos actualités.</p>
            <p className="mt-1">Vous pouvez vous désinscrire à tout moment.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
