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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  role?: string;
  created_at?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
    is_active: true,
    role: "user",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Simulation de récupération des utilisateurs
      // En réalité, tu ferais un appel API vers Supabase
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: "1",
            email: "user@toto.com",
            first_name: "Admin",
            last_name: "CSE",
            is_active: true,
            role: "admin",
            created_at: "2025-01-01",
          },
          {
            id: "2",
            email: "alice.martin@pep973.fr",
            first_name: "Alice",
            last_name: "Martin",
            is_active: true,
            role: "user",
            created_at: "2025-01-15",
          },
          {
            id: "3",
            email: "bob.dupont@pep973.fr",
            first_name: "Bob",
            last_name: "Dupont",
            is_active: true,
            role: "user",
            created_at: "2025-01-15",
          },
          {
            id: "4",
            email: "claire.bernard@pep973.fr",
            first_name: "Claire",
            last_name: "Bernard",
            is_active: false,
            role: "user",
            created_at: "2025-01-10",
          },
        ];
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Ici tu ferais l'appel API pour changer le statut
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_active: !currentStatus } : user
        )
      );
      console.log(`Statut de l'utilisateur ${userId} changé`);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    }
  };

  const addUser = async () => {
    if (!newUser.email || !newUser.first_name || !newUser.last_name) {
      alert("Tous les champs sont requis");
      return;
    }

    try {
      // Ici tu ferais l'appel API pour créer l'utilisateur
      const user: User = {
        id: Date.now().toString(),
        ...newUser,
        created_at: new Date().toISOString(),
      };

      setUsers((prev) => [user, ...prev]);
      setNewUser({
        email: "",
        first_name: "",
        last_name: "",
        is_active: true,
        role: "user",
      });
      setShowAddForm(false);
      console.log("Utilisateur ajouté:", user);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsersCount = users.filter((u) => u.is_active).length;

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion des Utilisateurs
        </h1>
        <p className="text-gray-600 mt-2">
          Gérez les membres du CSE, activez/désactivez les comptes et contrôlez
          qui reçoit les newsletters
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Utilisateurs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs Actifs
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeUsersCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs Inactifs
            </CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.length - activeUsersCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Newsletter Recipients
            </CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {activeUsersCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Reçoivent automatiquement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Outils de gestion */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">
              Nouvel utilisateur CSE
            </CardTitle>
            <CardDescription>
              Ajouter un nouveau membre du CSE qui recevra automatiquement les
              newsletters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="utilisateur@pep973.fr"
                />
              </div>

              <div>
                <Label htmlFor="first_name">Prénom *</Label>
                <Input
                  id="first_name"
                  value={newUser.first_name}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                  placeholder="Prénom"
                />
              </div>

              <div>
                <Label htmlFor="last_name">Nom *</Label>
                <Input
                  id="last_name"
                  value={newUser.last_name}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                  placeholder="Nom"
                />
              </div>

              <div>
                <Label>Statut initial</Label>
                <div className="flex items-center space-x-3 mt-1">
                  <Badge variant={newUser.is_active ? "default" : "secondary"}>
                    {newUser.is_active ? "Actif" : "Inactif"}
                  </Badge>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setNewUser((prev) => ({
                        ...prev,
                        is_active: !prev.is_active,
                      }))
                    }
                  >
                    Changer
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={addUser}
                className="bg-green-600 hover:bg-green-700"
              >
                Ajouter l'utilisateur
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        user.is_active ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {user.first_name} {user.last_name}
                        </span>
                        {user.role === "admin" && (
                          <Badge variant="destructive">Admin</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? "Actif" : "Inactif"}
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      className={
                        user.is_active
                          ? "text-red-600 hover:text-red-700"
                          : "text-green-600 hover:text-green-700"
                      }
                    >
                      {user.is_active ? (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Activer
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun utilisateur trouvé
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations importantes */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Système de Newsletter Automatique
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2">
          <p>
            <strong>✅ Utilisateurs actifs :</strong> Reçoivent automatiquement
            toutes les newsletters et communications du CSE.
          </p>
          <p>
            <strong>❌ Utilisateurs inactifs :</strong> N'apparaissent pas dans
            les envois de newsletter et ne peuvent pas se connecter.
          </p>
          <p>
            <strong>🔄 Changement de statut :</strong> Prend effet immédiatement
            pour les prochains envois de newsletter.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
