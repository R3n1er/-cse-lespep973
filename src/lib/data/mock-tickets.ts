// Données mockées pour les tickets
// Date: 27 Janvier 2025

import { Ticket } from "@/types/tickets";

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "1",
    name: "Ticket Cinéma AGORA - Cayenne",
    description:
      "Ticket pour le cinéma AGORA à Cayenne. Films en cours et à venir. Valable 6 mois à compter de la date d'achat.",
    price: 8.0,
    stock: 50,
    max_per_user: 4,
    category: "cinema",
    cinema_location: "AGORA - Cayenne",
    valid_from: "2025-01-01",
    valid_until: "2025-12-31",
    is_active: true,
    created_at: "2025-01-27T00:00:00Z",
    updated_at: "2025-01-27T00:00:00Z",
  },
  {
    id: "2",
    name: "Ticket Cinéma Uranus - Kourou",
    description:
      "Ticket pour le cinéma Uranus à Kourou. Films en cours et à venir. Valable 6 mois à compter de la date d'achat.",
    price: 8.0,
    stock: 30,
    max_per_user: 4,
    category: "cinema",
    cinema_location: "Uranus - Kourou",
    valid_from: "2025-01-01",
    valid_until: "2025-12-31",
    is_active: true,
    created_at: "2025-01-27T00:00:00Z",
    updated_at: "2025-01-27T00:00:00Z",
  },
  {
    id: "3",
    name: "Piscine Municipale - Cayenne",
    description:
      "Accès à la piscine municipale de Cayenne. Valable 1 mois à compter de la date d'achat. Horaires d'ouverture : 6h-22h.",
    price: 3.0,
    stock: 100,
    max_per_user: 2,
    category: "loisirs",
    valid_from: "2025-01-01",
    valid_until: "2025-12-31",
    is_active: true,
    created_at: "2025-01-27T00:00:00Z",
    updated_at: "2025-01-27T00:00:00Z",
  },
  {
    id: "4",
    name: "Musée Départemental",
    description:
      "Entrée gratuite au musée départemental. Exposition permanente et temporaire. Visites guidées disponibles.",
    price: 0.0,
    stock: 200,
    max_per_user: 2,
    category: "culture",
    valid_from: "2025-01-01",
    valid_until: "2025-12-31",
    is_active: true,
    created_at: "2025-01-27T00:00:00Z",
    updated_at: "2025-01-27T00:00:00Z",
  },
  {
    id: "5",
    name: "Parc Zoologique",
    description:
      "Entrée au parc zoologique de Guyane. Découverte de la faune locale. Visites guidées et animations pour enfants.",
    price: 15.0,
    stock: 25,
    max_per_user: 2,
    category: "loisirs",
    valid_from: "2025-01-01",
    valid_until: "2025-12-31",
    is_active: true,
    created_at: "2025-01-27T00:00:00Z",
    updated_at: "2025-01-27T00:00:00Z",
  },
  {
    id: "6",
    name: "Théâtre de Cayenne",
    description:
      "Ticket pour une représentation au théâtre de Cayenne. Programmation variée : pièces, concerts, spectacles.",
    price: 12.0,
    stock: 40,
    max_per_user: 3,
    category: "culture",
    valid_from: "2025-01-01",
    valid_until: "2025-12-31",
    is_active: true,
    created_at: "2025-01-27T00:00:00Z",
    updated_at: "2025-01-27T00:00:00Z",
  },
  {
    id: "7",
    name: "Transport en Commun - 1 Mois",
    description:
      "Pass mensuel pour les transports en commun de Cayenne. Accès illimité aux bus et navettes.",
    price: 25.0,
    stock: 75,
    max_per_user: 1,
    category: "transport",
    valid_from: "2025-01-01",
    valid_until: "2025-12-31",
    is_active: true,
    created_at: "2025-01-27T00:00:00Z",
    updated_at: "2025-01-27T00:00:00Z",
  },
  {
    id: "8",
    name: "Centre Sportif Municipal",
    description:
      "Accès au centre sportif municipal. Salles de sport, terrains de tennis, piscine. Réservation conseillée.",
    price: 5.0,
    stock: 60,
    max_per_user: 3,
    category: "loisirs",
    valid_from: "2025-01-01",
    valid_until: "2025-12-31",
    is_active: true,
    created_at: "2025-01-27T00:00:00Z",
    updated_at: "2025-01-27T00:00:00Z",
  },
  {
    id: "9",
    name: "Bibliothèque Départementale",
    description:
      "Accès à la bibliothèque départementale. Prêt de livres, CD, DVD. Espace de travail et salle de lecture.",
    price: 0.0,
    stock: 150,
    max_per_user: 2,
    category: "culture",
    valid_from: "2025-01-01",
    valid_until: "2025-12-31",
    is_active: true,
    created_at: "2025-01-27T00:00:00Z",
    updated_at: "2025-01-27T00:00:00Z",
  },
  {
    id: "10",
    name: "Parc d'Attractions - Journée",
    description:
      "Entrée journée au parc d'attractions. Manèges, spectacles, restauration sur place. Idéal pour les familles.",
    price: 20.0,
    stock: 35,
    max_per_user: 2,
    category: "loisirs",
    valid_from: "2025-01-01",
    valid_until: "2025-12-31",
    is_active: true,
    created_at: "2025-01-27T00:00:00Z",
    updated_at: "2025-01-27T00:00:00Z",
  },
  {
    id: "11",
    name: "Cinéma AGORA - Séance Spéciale",
    description:
      "Ticket pour une séance spéciale au cinéma AGORA. Films d'art et essai, avant-premières, rétrospectives.",
    price: 6.0,
    stock: 20,
    max_per_user: 2,
    category: "cinema",
    cinema_location: "AGORA - Cayenne",
    valid_from: "2025-01-01",
    valid_until: "2025-12-31",
    is_active: true,
    created_at: "2025-01-27T00:00:00Z",
    updated_at: "2025-01-27T00:00:00Z",
  },
  {
    id: "12",
    name: "Exposition Temporaire - Musée",
    description:
      "Entrée pour l'exposition temporaire au musée départemental. Thème : 'Histoire de la Guyane'.",
    price: 3.0,
    stock: 80,
    max_per_user: 2,
    category: "culture",
    valid_from: "2025-01-01",
    valid_until: "2025-06-30",
    is_active: true,
    created_at: "2025-01-27T00:00:00Z",
    updated_at: "2025-01-27T00:00:00Z",
  },
];

// Fonction pour filtrer les tickets
export const filterTickets = (
  tickets: Ticket[],
  filters: {
    category?: string;
    search?: string;
    price_min?: number;
    price_max?: number;
    in_stock?: boolean;
  }
): Ticket[] => {
  return tickets.filter((ticket) => {
    // Filtre par catégorie
    if (filters.category && ticket.category !== filters.category) {
      return false;
    }

    // Filtre par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = ticket.name.toLowerCase().includes(searchLower);
      const matchesDescription = ticket.description
        ?.toLowerCase()
        .includes(searchLower);
      if (!matchesName && !matchesDescription) {
        return false;
      }
    }

    // Filtre par prix minimum
    if (filters.price_min !== undefined && ticket.price < filters.price_min) {
      return false;
    }

    // Filtre par prix maximum
    if (filters.price_max !== undefined && ticket.price > filters.price_max) {
      return false;
    }

    // Filtre par stock
    if (filters.in_stock && ticket.stock === 0) {
      return false;
    }

    return true;
  });
};

// Fonction pour obtenir les catégories uniques
export const getUniqueCategories = (tickets: Ticket[]): string[] => {
  const categories = Array.from(
    new Set(tickets.map((ticket) => ticket.category))
  );
  return categories.sort();
};

// Fonction pour obtenir les statistiques
export const getTicketStats = (tickets: Ticket[]) => {
  const totalTickets = tickets.length;
  const inStock = tickets.filter((t) => t.stock > 0).length;
  const lowStock = tickets.filter((t) => t.stock <= 5 && t.stock > 0).length;
  const outOfStock = tickets.filter((t) => t.stock === 0).length;
  const totalRevenue = tickets.reduce((sum, t) => sum + t.price * t.stock, 0);

  return {
    totalTickets,
    inStock,
    lowStock,
    outOfStock,
    totalRevenue,
  };
};
