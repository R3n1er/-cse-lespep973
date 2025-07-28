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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ticket,
  Search,
  Filter,
  ShoppingCart,
  Eye,
  Clock,
  MapPin,
  Euro,
  Users,
  AlertCircle,
} from "lucide-react";
import { Ticket as TicketType, TicketFilters } from "@/types/tickets";
import {
  MOCK_TICKETS,
  filterTickets,
  getUniqueCategories,
  getTicketStats,
} from "@/lib/data/mock-tickets";
import { toast } from "sonner";

export default function TicketsPage() {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TicketFilters>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        loadTickets();
      }
    };
    loadUser();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);

      // Utiliser les données mockées pour l'instant
      let filteredTickets = MOCK_TICKETS;

      // Appliquer les filtres
      if (selectedCategory) {
        filteredTickets = filterTickets(filteredTickets, {
          category: selectedCategory,
        });
      }

      if (searchTerm) {
        filteredTickets = filterTickets(filteredTickets, {
          search: searchTerm,
        });
      }

      setTickets(filteredTickets);
    } catch (error) {
      console.error("Erreur inattendue:", error);
      toast.error("Erreur lors du chargement des tickets");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cinema":
        return <Ticket className="w-4 h-4" />;
      case "loisirs":
        return <Users className="w-4 h-4" />;
      case "culture":
        return <Eye className="w-4 h-4" />;
      case "transport":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Ticket className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "cinema":
        return "Cinéma";
      case "loisirs":
        return "Loisirs";
      case "culture":
        return "Culture";
      case "transport":
        return "Transport";
      default:
        return category;
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: "Épuisé", variant: "destructive" as const };
    } else if (stock <= 5) {
      return { label: "Stock faible", variant: "secondary" as const };
    } else {
      return { label: "En stock", variant: "default" as const };
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilters({ ...filters, category: category || undefined });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters({ ...filters, search: term || undefined });
  };

  const handleOrder = async (ticketId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour commander");
      return;
    }

    try {
      // Pour l'instant, on simule une commande
      toast.success("Commande ajoutée au panier");
      // TODO: Implémenter la logique de commande
    } catch (error) {
      console.error("Erreur lors de la commande:", error);
      toast.error("Erreur lors de la commande");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Accès requis
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder au catalogue des tickets.
          </p>
          <Button asChild>
            <a href="/auth/login">Se connecter</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Catalogue des Tickets
        </h1>
        <p className="text-gray-600">
          Découvrez tous les tickets et avantages disponibles du CSE
        </p>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un ticket..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Catégorie */}
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                <SelectItem value="cinema">Cinéma</SelectItem>
                <SelectItem value="loisirs">Loisirs</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
              </SelectContent>
            </Select>

            {/* Bouton de réinitialisation */}
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("");
                setSearchTerm("");
                setFilters({});
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des tickets */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun ticket trouvé
            </h3>
            <p className="text-gray-600">
              Aucun ticket ne correspond à vos critères de recherche.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => {
            const stockStatus = getStockStatus(ticket.stock);

            return (
              <Card
                key={ticket.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(ticket.category)}
                      <Badge variant="outline">
                        {getCategoryLabel(ticket.category)}
                      </Badge>
                    </div>
                    <Badge variant={stockStatus.variant}>
                      {stockStatus.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{ticket.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {ticket.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Informations du ticket */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Prix</span>
                      <div className="flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        <span className="font-semibold">
                          {ticket.price === 0
                            ? "Gratuit"
                            : `${ticket.price.toFixed(2)}€`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stock</span>
                      <span className="text-sm font-medium">
                        {ticket.stock} disponible{ticket.stock > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Limite/mois</span>
                      <span className="text-sm font-medium">
                        {ticket.max_per_user} ticket
                        {ticket.max_per_user > 1 ? "s" : ""}
                      </span>
                    </div>

                    {ticket.cinema_location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{ticket.cinema_location}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOrder(ticket.id)}
                      disabled={ticket.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Commander
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Ouvrir modal de détails
                        toast.info("Fonctionnalité en cours de développement");
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Alertes */}
                  {ticket.stock <= 5 && ticket.stock > 0 && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                      <AlertCircle className="w-4 h-4" />
                      <span>Stock limité !</span>
                    </div>
                  )}

                  {ticket.stock === 0 && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                      <Clock className="w-4 h-4" />
                      <span>Épuisé - Liste d'attente disponible</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Statistiques */}
      {tickets.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {getTicketStats(tickets).totalTickets}
                </div>
                <div className="text-sm text-gray-600">Tickets disponibles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {getTicketStats(tickets).inStock}
                </div>
                <div className="text-sm text-gray-600">En stock</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {getTicketStats(tickets).lowStock}
                </div>
                <div className="text-sm text-gray-600">Stock faible</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {getTicketStats(tickets).outOfStock}
                </div>
                <div className="text-sm text-gray-600">Épuisés</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
