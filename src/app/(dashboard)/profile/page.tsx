"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Edit,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/config";
import { formatDate } from "@/lib/utils/formatting";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  matricule: string;
  role: string;
  phone: string | null;
  address: string | null;
  etablissement?: string;
  created_at: string | null;
  updated_at: string | null;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    etablissement: "",
  });

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    }
  }, [isLoaded, user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erreur lors du chargement du profil:", error);
        return;
      }

      setProfile(data);
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        address: data.address || "",
        etablissement: (data as any).etablissement || "",
      });
    } catch (error) {
      console.error("Erreur inattendue:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    try {
      const updateData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || null,
        address: formData.address || null,
        updated_at: new Date().toISOString(),
      };

      if (formData.etablissement) {
        updateData.etablissement = formData.etablissement;
      }

      const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", user.id);

      if (error) {
        toast.error("Erreur lors de la sauvegarde du profil");
        console.error("Erreur lors de la sauvegarde:", error);
        return;
      }

      toast.success("Profil mis à jour avec succès");
      setEditing(false);
      fetchProfile(); // Recharger les données
    } catch (error) {
      toast.error("Erreur inattendue lors de la sauvegarde");
      console.error("Erreur inattendue:", error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        etablissement: (profile as any).etablissement || "",
      });
    }
    setEditing(false);
  };

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cse-primary"></div>
          <span className="ml-2">Chargement du profil...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
        <p className="text-gray-600">
          Vous devez être connecté pour accéder à cette page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Profil utilisateur
        </h1>
        <p className="text-gray-600">Gérez vos informations personnelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations personnelles
                  </CardTitle>
                  <CardDescription>Vos informations de base</CardDescription>
                </div>
                {!editing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Prénom</Label>
                  {editing ? (
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profile?.first_name || "Non renseigné"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="last_name">Nom</Label>
                  {editing ? (
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profile?.last_name || "Non renseigné"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <p className="mt-1 text-sm text-gray-900">{profile?.email}</p>
                <p className="text-xs text-gray-500">
                  L'email ne peut pas être modifié
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                {editing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1"
                    placeholder="+33 6 12 34 56 78"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {profile?.phone || "Non renseigné"}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Adresse</Label>
                {editing ? (
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="mt-1"
                    placeholder="123 Rue de la Paix, 97300 Cayenne"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {profile?.address || "Non renseigné"}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="etablissement">Établissement</Label>
                {editing ? (
                  <Input
                    id="etablissement"
                    value={formData.etablissement}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        etablissement: e.target.value,
                      })
                    }
                    className="mt-1"
                    placeholder="Nom de votre établissement"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {profile?.etablissement || "Non renseigné"}
                  </p>
                )}
              </div>

              {editing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations professionnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations professionnelles
              </CardTitle>
              <CardDescription>Vos informations de carrière</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Matricule</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {profile?.matricule || "Non renseigné"}
                  </p>
                </div>
                <div>
                  <Label>Rôle</Label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {profile?.role === "admin" && "Administrateur"}
                      {profile?.role === "gestionnaire" && "Gestionnaire"}
                      {profile?.role === "salarie" && "Salarié"}
                      {profile?.role === "tresorerie" && "Trésorerie"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Photo de profil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Photo de profil
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage
                  src={user.imageUrl}
                  alt={user.firstName || "Utilisateur"}
                />
                <AvatarFallback className="text-lg">
                  {user.firstName?.charAt(0) ||
                    user.emailAddresses[0]?.emailAddress?.charAt(0) ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-500">Photo gérée par Clerk</p>
            </CardContent>
          </Card>

          {/* Informations de compte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Informations de compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Membre depuis {formatDate(profile?.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Dernière mise à jour {formatDate(profile?.updated_at)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Changer l'email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Changer le téléphone
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                Changer l'adresse
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
