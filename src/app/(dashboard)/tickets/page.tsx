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
import { Badge } from "@/components/ui/badge";
import {
  Ticket,
  MapPin,
  Euro,
  Calendar,
  Users,
  ShoppingCart,
  Star,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase/config";
import { formatDate } from "@/lib/utils/formatting";
import { toast } from "sonner";
import { CinemaTicket, CinemaLocation, CINEMAS } from "@/types";

export default function TicketsPage() {
  const { user, isLoaded } = useUser();
  const [tickets, setTickets] = useState<CinemaTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCinema, setSelectedCinema] = useState<CinemaLocation | "all">(
    "all"
  );
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (isLoaded && user) {
      fetchTickets();
    }
  }, [isLoaded, user, selectedCinema]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("cinema_tickets" as any)
        .select("*")
        .gte("available_until", new Date().toISOString().split("T")[0])
        .gt("stock_quantity", 0)
        .order("cinema")
        .order("price");

      if (selectedCinema !== "all") {
        query = query.eq("cinema", selectedCinema);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erreur lors du chargement des tickets:", error);
        toast.error("Erreur lors du chargement des tickets");
        return;
      }

      setTickets((data as unknown as CinemaTicket[]) || []);
    } catch (error) {
      console.error("Erreur inattendue:", error);
      toast.error("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (ticketId: string) => {
    setCart((prev) => ({
      ...prev,
      [ticketId]: (prev[ticketId] || 0) + 1,
    }));
    toast.success("Ticket ajouté au panier");
  };

  const removeFromCart = (ticketId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[ticketId] > 1) {
        newCart[ticketId]--;
      } else {
        delete newCart[ticketId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return tickets.reduce((total, ticket) => {
      const quantity = cart[ticket.id] || 0;
      return total + quantity * ticket.cse_price;
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Chargement des tickets...</p>
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

  const cinemasByLocation = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.cinema]) {
      acc[ticket.cinema] = [];
    }
    acc[ticket.cinema].push(ticket);
    return acc;
  }, {} as Record<CinemaLocation, CinemaTicket[]>);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Ticket className="w-8 h-8 text-blue-600" />
            Tickets de Cinéma
          </h1>
          <p className="text-gray-600">
            Réservez vos places de cinéma avec les tarifs préférentiels CSE
          </p>
        </div>

        {getCartItemCount() > 0 && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">
                  {getCartItemCount()} ticket{getCartItemCount() > 1 ? "s" : ""}{" "}
                  • {getCartTotal().toFixed(2)}€
                </p>
                <Button size="sm" className="mt-1">
                  Finaliser la commande
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Filtres par cinéma */}
      <div className="flex gap-3 flex-wrap">
        <Button
          variant={selectedCinema === "all" ? "default" : "outline"}
          onClick={() => setSelectedCinema("all")}
          size="sm"
        >
          Tous les cinémas
        </Button>
        <Button
          variant={selectedCinema === "agora_cayenne" ? "default" : "outline"}
          onClick={() => setSelectedCinema("agora_cayenne")}
          size="sm"
          className="flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          Cinéma AGORA - Cayenne
        </Button>
        <Button
          variant={selectedCinema === "uranus_kourou" ? "default" : "outline"}
          onClick={() => setSelectedCinema("uranus_kourou")}
          size="sm"
          className="flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          Cinéma Uranus - Kourou
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Ticket className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tickets disponibles</p>
              <p className="text-xl font-semibold">{tickets.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Euro className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Économies moyennes</p>
              <p className="text-xl font-semibold">
                {tickets.length > 0
                  ? Math.round(
                      (tickets.reduce(
                        (acc, t) => acc + (t.price - t.cse_price),
                        0
                      ) /
                        tickets.length) *
                        100
                    ) / 100
                  : 0}
                €
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cinémas partenaires</p>
              <p className="text-xl font-semibold">2</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Liste des cinémas et tickets */}
      <div className="space-y-8">
        {Object.entries(cinemasByLocation).map(([cinema, cinemaTickets]) => {
          const cinemaInfo = CINEMAS[cinema as CinemaLocation];

          return (
            <div key={cinema} className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {cinemaInfo.name}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {cinemaInfo.location} • {cinemaInfo.address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cinemaTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {ticket.stock_quantity} disponibles
                      </Badge>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Ticket className="w-5 h-5 text-blue-600" />
                        {ticket.ticket_type}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {ticket.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Prix public
                          </span>
                          <span className="text-sm line-through text-gray-500">
                            {ticket.price.toFixed(2)}€
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-green-600">
                            Prix CSE
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            {ticket.cse_price.toFixed(2)}€
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Économie</span>
                          <span className="font-semibold text-blue-600">
                            -{(ticket.price - ticket.cse_price).toFixed(2)}€
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Valable jusqu'au {formatDate(ticket.available_until)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-3">
                        {cart[ticket.id] ? (
                          <div className="flex items-center gap-2 w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(ticket.id)}
                              className="px-3"
                            >
                              -
                            </Button>
                            <span className="flex-1 text-center font-semibold">
                              {cart[ticket.id]} dans le panier
                            </span>
                            <Button
                              size="sm"
                              onClick={() => addToCart(ticket.id)}
                              className="px-3"
                              disabled={
                                cart[ticket.id] >= ticket.stock_quantity
                              }
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => addToCart(ticket.id)}
                            className="w-full flex items-center gap-2"
                            disabled={ticket.stock_quantity === 0}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Ajouter au panier
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {tickets.length === 0 && (
        <Card className="p-8 text-center">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun ticket disponible
          </h3>
          <p className="text-gray-600">
            Il n'y a actuellement aucun ticket de cinéma disponible. Revenez
            bientôt pour découvrir nos nouvelles offres !
          </p>
        </Card>
      )}
    </div>
  );
}
