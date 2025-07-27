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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Calendar,
  Ticket,
  Euro,
  MessageSquare,
  Bell,
  Settings,
  Activity,
  TrendingUp,
  Award,
  Clock,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/config";
import { formatDate, formatTimeAgo } from "@/lib/utils/formatting";

interface UserStats {
  totalTickets: number;
  totalReimbursements: number;
  totalComments: number;
  totalReactions: number;
  lastActivity: string;
  memberSince: string;
}

interface RecentActivity {
  id: string;
  type: "ticket" | "reimbursement" | "comment" | "reaction";
  title: string;
  description: string;
  date: string;
  status?: "pending" | "approved" | "rejected";
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalTickets: 0,
    totalReimbursements: 0,
    totalComments: 0,
    totalReactions: 0,
    lastActivity: new Date().toISOString(),
    memberSince: new Date().toISOString(),
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser);
      }
    };
    loadUser();
  }, []);

  const fetchUserData = async (currentUser: any) => {
    if (!currentUser) return;

    try {
      setLoading(true);

      // Récupérer les statistiques utilisateur
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      // Récupérer les commentaires de l'utilisateur
      const { data: comments } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("user_id", currentUser.id);

      // Récupérer les réactions de l'utilisateur
      const { data: reactions } = await supabase
        .from("blog_reactions")
        .select("*")
        .eq("user_id", currentUser.id);

      // Mettre à jour les statistiques
      setUserStats({
        totalTickets: 0, // TODO: Implémenter quand le module tickets sera créé
        totalReimbursements: 0, // TODO: Implémenter quand le module remboursements sera créé
        totalComments: comments?.length || 0,
        totalReactions: reactions?.length || 0,
        lastActivity: userData?.updated_at || new Date().toISOString(),
        memberSince: userData?.created_at || new Date().toISOString(),
      });

      // Créer les activités récentes
      const activities: RecentActivity[] = [];

      // Ajouter les commentaires récents
      if (comments) {
        comments.slice(0, 3).forEach((comment) => {
          activities.push({
            id: comment.id,
            type: "comment",
            title: "Commentaire ajouté",
            description: `Vous avez commenté un article`,
            date: comment.created_at,
            status: comment.is_approved ? "approved" : "pending",
          });
        });
      }

      // Ajouter les réactions récentes
      if (reactions) {
        reactions.slice(0, 2).forEach((reaction) => {
          activities.push({
            id: reaction.id,
            type: "reaction",
            title: "Réaction ajoutée",
            description: `Vous avez aimé un article`,
            date: reaction.created_at,
          });
        });
      }

      // Trier par date et prendre les 5 plus récentes
      activities.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "ticket":
        return <Ticket className="w-4 h-4" />;
      case "reimbursement":
        return <Euro className="w-4 h-4" />;
      case "comment":
        return <MessageSquare className="w-4 h-4" />;
      case "reaction":
        return <Award className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Approuvé
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      case "rejected":
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cse-primary"></div>
          <span className="ml-2">Chargement du dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
        <p className="text-gray-600 mb-4">
          Vous devez être connecté pour accéder au dashboard.
        </p>
        <Link href="/auth/login">
          <Button>Se connecter</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      {/* En-tête du Dashboard */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue, {user.user_metadata?.first_name || user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Colonne principale */}
        <div className="xl:col-span-2 space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tickets</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats.totalTickets}
                </div>
                <p className="text-xs text-muted-foreground">+0 ce mois</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Remboursements
                </CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats.totalReimbursements}
                </div>
                <p className="text-xs text-muted-foreground">0€ ce mois</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Commentaires
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats.totalComments}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{userStats.totalComments} ce mois
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Réactions</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats.totalReactions}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{userStats.totalReactions} ce mois
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Activités récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activités récentes
              </CardTitle>
              <CardDescription>
                Vos dernières interactions sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune activité récente</p>
                  <p className="text-sm">
                    Commencez à utiliser les services du CSE !
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-cse-primary/10 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(activity.date)}
                        </p>
                      </div>
                      {getStatusBadge(activity.status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="xl:col-span-1 space-y-6">
          {/* Profil utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={user.user_metadata?.avatar_url}
                    alt={user.user_metadata?.first_name || "Utilisateur"}
                  />
                  <AvatarFallback>
                    {user.user_metadata?.first_name?.charAt(0) ||
                      user.email?.charAt(0) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {user.user_metadata?.first_name}{" "}
                    {user.user_metadata?.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <Badge variant="outline" className="mt-1">
                    Salarié
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis {formatDate(userStats.memberSince)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    Dernière activité {formatTimeAgo(userStats.lastActivity)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Modifier le profil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/tickets">
                <Button variant="outline" className="w-full justify-start">
                  <Ticket className="w-4 h-4 mr-2" />
                  Acheter des tickets
                </Button>
              </Link>
              <Link href="/dashboard/remboursements">
                <Button variant="outline" className="w-full justify-start">
                  <Euro className="w-4 h-4 mr-2" />
                  Demander un remboursement
                </Button>
              </Link>
              <Link href="/dashboard/blog">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Voir le blog
                </Button>
              </Link>
              <Link href="/dashboard/newsletter">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Gérer la newsletter
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Informations CSE */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Informations CSE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Budget disponible</p>
                <p className="text-2xl font-bold text-cse-primary">200€</p>
                <p className="text-gray-500">Limite annuelle</p>
              </div>
              <div className="pt-3 border-t">
                <p className="font-medium">Prochain événement</p>
                <p className="text-gray-600">Aucun événement prévu</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
