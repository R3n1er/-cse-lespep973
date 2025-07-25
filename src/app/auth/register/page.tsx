"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { clerkClient } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase/config";

// Liste statique des établissements ADPEP GUYANE
const etablissements = [
  "Collège Concorde Cayenne",
  "Collège Paul Kapel Cayenne",
  "Collège Eugène Nonnon Cayenne",
  "Collège Auguste Dédé Cayenne",
  "Collège Réeberg Néron Rémire",
  "Collège Constant Chlore Matoury",
  "Collège Justin Catayée Cayenne",
  "Collège Sainte-Thérèse Cayenne",
  "Collège Victor Schoelcher Kourou",
  "Collège Elie Castor Sinnamary",
  "Collège Arsène Bouyer d’Angoma Saint-Laurent",
  "Collège Albert Londres Saint-Laurent",
  "Collège Léodate Volmar Mana",
  "Collège Achmat Kartadinata Maripasoula",
  "Collège Ma Aiye Cécilia Grand Santi",
  "Collège Paul Jean-Louis Iracoubo",
  "Collège Edgard Galli Macouria",
  "Collège Jean Macé Saint-Georges",
  "Collège de Papaïchton",
  "Collège de Camopi",
  "Collège de Régina",
  "Collège de Montsinéry",
  "Collège de Roura",
  "Collège de Apatou",
  "Collège de Awala-Yalimapo",
];

// Schéma de validation pour le formulaire d'inscription
const registerSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
});

const demandeAccesSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse email invalide" }),
  etablissement: z
    .string()
    .min(2, { message: "Sélectionnez un établissement" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type DemandeAccesFormValues = z.infer<typeof demandeAccesSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemandeAcces, setShowDemandeAcces] = useState(false);
  const [checkedEmail, setCheckedEmail] = useState<string | null>(null);

  // Afficher un message d’erreur si error=domaine dans l’URL
  const errorDomaine = searchParams.get("error") === "domaine";

  // Formulaire pour vérifier l’email
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "" },
  });

  // Formulaire de demande d’accès
  const {
    register: registerDemande,
    handleSubmit: handleSubmitDemande,
    formState: { errors: demandeErrors },
  } = useForm<DemandeAccesFormValues>({
    resolver: zodResolver(demandeAccesSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      etablissement: "",
    },
  });

  // Vérification de l’email dans la table users (Excel injecté)
  const onCheckEmail = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    setCheckedEmail(null);
    setShowDemandeAcces(false);
    try {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", data.email)
        .single();
      if (userError || !user) {
        setShowDemandeAcces(true);
        setCheckedEmail(data.email);
      } else {
        // Ici, on redirige vers Clerk pour l’inscription (2FA activé côté Clerk)
        router.push(`/sign-up?email=${encodeURIComponent(data.email)}`);
      }
    } catch (e: any) {
      setError(e.message || "Erreur lors de la vérification de l’email");
    } finally {
      setIsLoading(false);
    }
  };

  // Soumission de la demande d’accès
  const onSubmitDemande = async (data: DemandeAccesFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // Enregistrer la demande en base (table "demande_acces" à créer)
      await supabase.from("demande_acces").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        etablissement: data.etablissement,
        statut: "en_attente",
      });
      router.push("/auth/verify?demande=1");
    } catch (e: any) {
      setError(e.message || "Erreur lors de la demande d’accès");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-center">
              Pour créer un compte, saisissez votre adresse email
              professionnelle ou personnelle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorDomaine && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm mb-4">
                L’inscription avec une adresse <b>@lepep973.org</b> est réservée
                à l’administration. Veuillez utiliser votre email personnel ou
                contacter un gestionnaire.
              </div>
            )}
            {!showDemandeAcces ? (
              <form
                onSubmit={handleSubmitEmail(onCheckEmail)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Adresse email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@exemple.fr"
                    {...registerEmail("email")}
                    error={!!emailErrors.email}
                  />
                  {emailErrors.email && (
                    <p className="text-sm text-red-500">
                      {emailErrors.email.message}
                    </p>
                  )}
                </div>
                {error && (
                  <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  variant="cse"
                  disabled={isLoading}
                >
                  {isLoading ? "Vérification..." : "Continuer"}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={handleSubmitDemande(onSubmitDemande)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    Prénom
                  </label>
                  <Input
                    id="firstName"
                    {...registerDemande("firstName")}
                    error={!!demandeErrors.firstName}
                  />
                  {demandeErrors.firstName && (
                    <p className="text-sm text-red-500">
                      {demandeErrors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Nom
                  </label>
                  <Input
                    id="lastName"
                    {...registerDemande("lastName")}
                    error={!!demandeErrors.lastName}
                  />
                  {demandeErrors.lastName && (
                    <p className="text-sm text-red-500">
                      {demandeErrors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Adresse email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={checkedEmail || ""}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="etablissement"
                    className="text-sm font-medium"
                  >
                    Établissement d’affectation
                  </label>
                  <select
                    id="etablissement"
                    className="w-full border rounded p-2"
                    {...registerDemande("etablissement")}
                  >
                    <option value="">Sélectionnez un établissement</option>
                    {etablissements.map((etab) => (
                      <option key={etab} value={etab}>
                        {etab}
                      </option>
                    ))}
                  </select>
                  {demandeErrors.etablissement && (
                    <p className="text-sm text-red-500">
                      {demandeErrors.etablissement.message}
                    </p>
                  )}
                </div>
                {error && (
                  <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  variant="cse"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Envoi en cours..."
                    : "Envoyer la demande d’accès"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/auth/login"
                className="text-cse-primary hover:underline"
              >
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
