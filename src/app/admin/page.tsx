"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Mail, BarChart3, Shield, Ticket, Euro } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newsletterSubscribers: 0,
    totalTickets: 0,
    totalReimbursements: 0,
  });

  useEffect(() => {
    // Simuler le chargement des statistiques
    // En réalité, tu ferais des appels API vers Supabase
    setTimeout(() => {
      setStats({
        totalUsers: 156,
        activeUsers: 142,
        newsletterSubscribers: 142, // Tous les utilisateurs actifs reçoivent la newsletter
        totalTickets: 89,
        totalReimbursements: 45,
      });
    }, 1000);
  }, []);

  const quickActions = [
    {
      title: "Envoyer une Newsletter",
      description: "Envoyer un email à tous les membres actifs du CSE",
      href: "/admin/newsletter",
      icon: Mail,
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Gérer les Utilisateurs",
      description: "Activer/désactiver des comptes utilisateurs",
      href: "/admin/users",
      icon: Users,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Voir les Statistiques",
      description: "Analyser l'utilisation de la plateforme",
      href: "/admin/stats",
      icon: BarChart3,
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord Administration
        </h1>
        <p className="text-gray-600 mt-2">
          Gérez les utilisateurs, envoyez des newsletters et consultez les
          statistiques du CSE Les PEP 973
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs Total
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Tous les comptes créés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs Actifs
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Comptes activés et fonctionnels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.newsletterSubscribers}
            </div>
            <p className="text-xs text-muted-foreground">
              Destinataires automatiques
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tickets Vendus
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.totalTickets}
            </div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Remboursements
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {stats.totalReimbursements}
            </div>
            <p className="text-xs text-muted-foreground">
              En cours de traitement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={action.href}>Accéder</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Informations sur la logique Newsletter */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Logique Newsletter Automatique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-blue-800">
          <p>
            <strong>Système automatique :</strong> Tous les utilisateurs actifs
            du CSE reçoivent automatiquement les newsletters.
          </p>
          <p>
            <strong>Pas d'inscription manuelle :</strong> Les membres du CSE
            n'ont pas besoin de s'inscrire à une newsletter, ils la reçoivent
            automatiquement.
          </p>
          <p>
            <strong>Filtrage intelligent :</strong> Seuls les comptes activés et
            les membres bénéficiaires du CSE reçoivent les communications.
          </p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" asChild size="sm">
              <Link href="/admin/newsletter">Envoyer Newsletter</Link>
            </Button>
            <Button variant="outline" asChild size="sm">
              <Link href="/admin/users">Gérer Utilisateurs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
