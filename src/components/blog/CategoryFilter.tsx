"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Ticket,
  CreditCard,
  Gift,
  Calendar,
  Handshake,
  Star,
} from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  className?: string;
}

const CATEGORIES = [
  { id: null, name: "Toutes", icon: Star, color: "bg-gray-100 text-gray-700" },
  {
    id: "Actualités",
    name: "Actualités",
    icon: Newspaper,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "Tickets",
    name: "Tickets",
    icon: Ticket,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "Remboursements",
    name: "Remboursements",
    icon: CreditCard,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "Avantages",
    name: "Avantages",
    icon: Gift,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "Événements",
    name: "Événements",
    icon: Calendar,
    color: "bg-red-100 text-red-700",
  },
  {
    id: "Partenaires",
    name: "Partenaires",
    icon: Handshake,
    color: "bg-indigo-100 text-indigo-700",
  },
];

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  className = "",
}: CategoryFilterProps) {
  return (
    <div
      className={`flex gap-2 flex-wrap ${className}`}
      data-testid="category-filter"
    >
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;

        return (
          <Button
            key={category.id || "all"}
            variant={isSelected ? "cse" : "outline"}
            onClick={() => onCategoryChange(category.id)}
            size="sm"
            className="flex items-center gap-2"
            data-testid={`category-button-${category.id || "all"}`}
            data-selected={isSelected}
          >
            <Icon className="w-4 h-4" />
            {category.name}
            {isSelected && (
              <Badge
                variant="secondary"
                className="ml-1 text-xs"
                data-testid="selected-badge"
              >
                {category.name === "Toutes" ? "Tous" : "Actif"}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}
