"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/supabase/auth";
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
  Calendar,
  Save,
  Edit,
  X,
  Baby,
  Plus,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/config";
import { formatDate } from "@/lib/utils/formatting";
import { toast } from "sonner";

interface ChildInfo {
  name: string;
  birthDate: string;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  matricule: string;
  role: string;
  phone: string | null;
  personal_email: string | null;
  children_count: number | null;
  children_birth_dates: ChildInfo[] | null;
  address: string | null;
  etablissement?: string;
  created_at: string | null;
  updated_at: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    personal_email: "",
    children_count: 0,
    children_birth_dates: [] as ChildInfo[],
  });

  useEffect(() => {
    const loadUser = async () => {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser);
      }
    };
    loadUser();
  }, []);

  const fetchProfile = async (currentUser: any) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        console.error("Erreur lors du chargement du profil:", error);
        return;
      }

      // Adapter les données au format UserProfile
      const profileData: UserProfile = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        matricule: data.matricule,
        role: data.role,
        phone: data.phone,
        personal_email: (data as any).personal_email || null,
        children_count: (data as any).children_count || null,
        children_birth_dates: (data as any).children_birth_dates || null,
        address: data.address,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setProfile(profileData);
      setFormData({
        phone: data.phone || "",
        personal_email: (data as any).personal_email || "",
        children_count: (data as any).children_count || 0,
        children_birth_dates: (data as any).children_birth_dates || [],
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
      const updateData = {
        phone: formData.phone || null,
        personal_email: formData.personal_email || null,
        children_count: formData.children_count,
        children_birth_dates: formData.children_birth_dates,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", user.id);

      if (error) {
        toast.error("Erreur lors de la sauvegarde");
        console.error("Erreur:", error);
        return;
      }

      toast.success("Profil mis à jour avec succès");
      setEditing(false);
      if (user) {
        fetchProfile(user);
      }
    } catch (error) {
      toast.error("Erreur inattendue");
      console.error("Erreur:", error);
    }
  };

  const addChild = () => {
    if (formData.children_birth_dates.length < formData.children_count) {
      setFormData({
        ...formData,
        children_birth_dates: [
          ...formData.children_birth_dates,
          { name: "", birthDate: "" },
        ],
      });
    }
  };

  const removeChild = (index: number) => {
    const newChildren = formData.children_birth_dates.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      children_birth_dates: newChildren,
      children_count: Math.min(formData.children_count, newChildren.length),
    });
  };

  const updateChild = (
    index: number,
    field: keyof ChildInfo,
    value: string
  ) => {
    const newChildren = [...formData.children_birth_dates];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setFormData({
      ...formData,
      children_birth_dates: newChildren,
    });
  };

  const handleChildrenCountChange = (count: number) => {
    setFormData({
      ...formData,
      children_count: count,
      children_birth_dates: formData.children_birth_dates.slice(0, count),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-600">Accès non autorisé</p>
          <p className="text-gray-600">
            Veuillez vous connecter pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-600">Profil non trouvé</p>
          <p className="text-gray-600">
            Impossible de charger les informations du profil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles</p>
        </div>
        <Button
          onClick={() => setEditing(!editing)}
          variant={editing ? "outline" : "default"}
          className="flex items-center gap-2"
        >
          {editing ? (
            <>
              <X className="w-4 h-4" />
              Annuler
            </>
          ) : (
            <>
              <Edit className="w-4 h-4" />
              Modifier
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations personnelles (lecture seule) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations Professionnelles
            </CardTitle>
            <CardDescription>
              Ces informations sont gérées par les ressources humaines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                <AvatarFallback>
                  {profile.first_name?.[0]}
                  {profile.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {profile.first_name} {profile.last_name}
                </h3>
                <Badge variant="secondary">{profile.role}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Email professionnel:
                </span>
                <span className="text-sm">{profile.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Matricule:</span>
                <span className="text-sm font-mono">{profile.matricule}</span>
              </div>

              {profile.etablissement && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Établissement:</span>
                  <span className="text-sm">{profile.etablissement}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Membre depuis:</span>
                <span className="text-sm">
                  {profile.created_at ? formatDate(profile.created_at) : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations modifiables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Informations Personnelles
            </CardTitle>
            <CardDescription>
              Informations que vous pouvez modifier selon les directives CSE
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={
                    editing ? formData.phone : profile.phone || "Non renseigné"
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!editing}
                  placeholder="Ex: +594 6 94 XX XX XX"
                />
              </div>

              <div>
                <Label htmlFor="personal_email">Email personnel</Label>
                <Input
                  id="personal_email"
                  type="email"
                  value={
                    editing
                      ? formData.personal_email
                      : profile.personal_email || "Non renseigné"
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, personal_email: e.target.value })
                  }
                  disabled={!editing}
                  placeholder="votre.email@exemple.com"
                />
              </div>

              <div>
                <Label htmlFor="children_count">Nombre d&apos;enfants</Label>
                <Input
                  id="children_count"
                  type="number"
                  min="0"
                  max="10"
                  value={
                    editing
                      ? formData.children_count
                      : profile.children_count || 0
                  }
                  onChange={(e) =>
                    handleChildrenCountChange(parseInt(e.target.value) || 0)
                  }
                  disabled={!editing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations des enfants */}
        {(formData.children_count > 0 ||
          (profile.children_birth_dates &&
            profile.children_birth_dates.length > 0)) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="w-5 h-5" />
                Informations des Enfants
              </CardTitle>
              <CardDescription>
                Dates de naissance de vos enfants pour les avantages CSE
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <div className="space-y-4">
                  {Array.from({ length: formData.children_count }).map(
                    (_, index) => {
                      const child = formData.children_birth_dates[index] || {
                        name: "",
                        birthDate: "",
                      };
                      return (
                        <div key={index} className="flex gap-3 items-end">
                          <div className="flex-1">
                            <Label htmlFor={`child_name_${index}`}>
                              Prénom enfant {index + 1}
                            </Label>
                            <Input
                              id={`child_name_${index}`}
                              value={child.name}
                              onChange={(e) =>
                                updateChild(index, "name", e.target.value)
                              }
                              placeholder="Prénom"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={`child_birth_${index}`}>
                              Date de naissance
                            </Label>
                            <Input
                              id={`child_birth_${index}`}
                              type="date"
                              value={child.birthDate}
                              onChange={(e) =>
                                updateChild(index, "birthDate", e.target.value)
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeChild(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    }
                  )}

                  {formData.children_birth_dates.length <
                    formData.children_count && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addChild}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter les informations
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.children_birth_dates &&
                  profile.children_birth_dates.length > 0 ? (
                    profile.children_birth_dates.map((child, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium">
                          {child.name || `Enfant ${index + 1}`}
                        </span>
                        <span className="text-sm text-gray-600">
                          {child.birthDate
                            ? formatDate(child.birthDate)
                            : "Date non renseignée"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      Aucune information renseignée
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {editing && (
        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Enregistrer les modifications
          </Button>
        </div>
      )}
    </div>
  );
}
