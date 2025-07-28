// Composant pour afficher une carte de ticket
// Date: 27 Janvier 2025

import { useState } from "react";
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
  ShoppingCart,
  Eye,
  Clock,
  MapPin,
  Euro,
  Users,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";
import { Ticket as TicketType } from "@/types/tickets";
import { toast } from "sonner";

interface TicketCardProps {
  ticket: TicketType;
  onOrder?: (ticketId: string, quantity: number) => void;
  showQuantitySelector?: boolean;
}

export default function TicketCard({
  ticket,
  onOrder,
  showQuantitySelector = false,
}: TicketCardProps) {
  const [quantity, setQuantity] = useState(1);

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

  const handleOrder = () => {
    if (ticket.stock === 0) {
      toast.error("Ce ticket est épuisé");
      return;
    }

    if (quantity > ticket.stock) {
      toast.error("Quantité supérieure au stock disponible");
      return;
    }

    if (quantity > ticket.max_per_user) {
      toast.error(`Limite de ${ticket.max_per_user} tickets par mois dépassée`);
      return;
    }

    if (onOrder) {
      onOrder(ticket.id, quantity);
    } else {
      toast.success(`${quantity} ticket(s) ajouté(s) au panier`);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (
      newQuantity >= 1 &&
      newQuantity <= Math.min(ticket.stock, ticket.max_per_user)
    ) {
      setQuantity(newQuantity);
    }
  };

  const stockStatus = getStockStatus(ticket.stock);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(ticket.category)}
            <Badge variant="outline">{getCategoryLabel(ticket.category)}</Badge>
          </div>
          <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
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
                {ticket.price === 0 ? "Gratuit" : `${ticket.price.toFixed(2)}€`}
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
              {ticket.max_per_user} ticket{ticket.max_per_user > 1 ? "s" : ""}
            </span>
          </div>

          {ticket.cinema_location && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{ticket.cinema_location}</span>
            </div>
          )}
        </div>

        {/* Sélecteur de quantité */}
        {showQuantitySelector && ticket.stock > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Quantité:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={
                  quantity >= Math.min(ticket.stock, ticket.max_per_user)
                }
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleOrder}
            disabled={ticket.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {showQuantitySelector ? `Commander (${quantity})` : "Commander"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
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

        {/* Prix total si quantité > 1 */}
        {showQuantitySelector && quantity > 1 && (
          <div className="text-center text-sm text-gray-600">
            Total: {(ticket.price * quantity).toFixed(2)}€
          </div>
        )}
      </CardContent>
    </Card>
  );
}
