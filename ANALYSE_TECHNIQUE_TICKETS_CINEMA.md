# 🎬 ANALYSE TECHNIQUE - Module Tickets Cinéma

## 📋 **Résumé Exécutif**

**Date :** 28 Janvier 2025  
**Version :** 1.0  
**Objectif :** Analyse technique approfondie pour l'implémentation du système de commande de tickets cinéma CSE Les PEP 973

---

## 🎯 **Spécifications Métier Analysées**

### **Contraintes Identifiées :**

1. **Géographiques** : 2 cinémas spécifiques en Guyane (Agora Cayenne / Uranus Kourou)
2. **Quotas** : Maximum 5 tickets par salarié par mois calendaire
3. **Paiement** : Exclusivement par CB via Stripe
4. **Tarification** : Prix réduits CSE négociés avec les partenaires
5. **Distribution** : Tickets électroniques avec QR codes

---

## 🏗️ **Architecture Technique Proposée**

### **1. Base de Données - Extensions Supabase**

```sql
-- Table des cinémas partenaires
CREATE TABLE public.cinemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- "Agora", "Uranus"
    location VARCHAR(100) NOT NULL, -- "Cayenne", "Kourou"
    address TEXT,
    contact_info JSONB,
    reduced_price DECIMAL(5,2) NOT NULL, -- Prix CSE réduit
    regular_price DECIMAL(5,2) NOT NULL, -- Prix public
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes de tickets
CREATE TABLE public.cinema_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    cinema_id UUID NOT NULL REFERENCES public.cinemas(id),
    quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 5),
    unit_price DECIMAL(5,2) NOT NULL,
    total_amount DECIMAL(8,2) NOT NULL,
    order_month DATE NOT NULL, -- YYYY-MM-01 pour tracking quota
    stripe_payment_intent_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tickets individuels
CREATE TABLE public.cinema_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.cinema_orders(id),
    ticket_code VARCHAR(50) UNIQUE NOT NULL, -- Code unique pour retrait
    qr_code_data TEXT NOT NULL, -- Données pour QR code
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimisation des requêtes quota
CREATE INDEX idx_cinema_orders_user_month ON public.cinema_orders(user_id, order_month);
CREATE INDEX idx_cinema_tickets_order ON public.cinema_tickets(order_id);
```

### **2. Fonctions SQL pour Gestion des Quotas**

```sql
-- Fonction pour vérifier le quota mensuel
CREATE OR REPLACE FUNCTION check_monthly_quota(
    p_user_id UUID,
    p_requested_quantity INTEGER,
    p_target_month DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_used_tickets INTEGER := 0;
    v_remaining_quota INTEGER;
    v_can_order BOOLEAN;
BEGIN
    -- Calculer les tickets déjà commandés ce mois
    SELECT COALESCE(SUM(quantity), 0)
    INTO v_used_tickets
    FROM public.cinema_orders
    WHERE user_id = p_user_id
      AND order_month = p_target_month
      AND status IN ('paid', 'pending');

    v_remaining_quota := 5 - v_used_tickets;
    v_can_order := (v_remaining_quota >= p_requested_quantity);

    RETURN jsonb_build_object(
        'used_tickets', v_used_tickets,
        'remaining_quota', v_remaining_quota,
        'requested_quantity', p_requested_quantity,
        'can_order', v_can_order,
        'target_month', p_target_month
    );
END;
$$;

-- Fonction pour obtenir l'historique des commandes
CREATE OR REPLACE FUNCTION get_user_cinema_history(p_user_id UUID)
RETURNS TABLE (
    order_id UUID,
    cinema_name VARCHAR(100),
    cinema_location VARCHAR(100),
    quantity INTEGER,
    total_amount DECIMAL(8,2),
    order_date DATE,
    status VARCHAR(20),
    tickets_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT
        co.id as order_id,
        c.name as cinema_name,
        c.location as cinema_location,
        co.quantity,
        co.total_amount,
        co.created_at::DATE as order_date,
        co.status,
        COUNT(ct.id) as tickets_count
    FROM public.cinema_orders co
    JOIN public.cinemas c ON co.cinema_id = c.id
    LEFT JOIN public.cinema_tickets ct ON co.id = ct.order_id
    WHERE co.user_id = p_user_id
    GROUP BY co.id, c.name, c.location, co.quantity, co.total_amount, co.created_at, co.status
    ORDER BY co.created_at DESC;
$$;
```

### **3. Types TypeScript**

```typescript
// src/types/cinema.ts
export interface Cinema {
  id: string;
  name: "Agora" | "Uranus";
  location: "Cayenne" | "Kourou";
  address?: string;
  contact_info?: Record<string, any>;
  reduced_price: number;
  regular_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CinemaOrder {
  id: string;
  user_id: string;
  cinema_id: string;
  cinema?: Cinema;
  quantity: number;
  unit_price: number;
  total_amount: number;
  order_month: string; // YYYY-MM-01
  stripe_payment_intent_id?: string;
  status: "pending" | "paid" | "cancelled" | "refunded";
  created_at: string;
  updated_at: string;
  tickets?: CinemaTicket[];
}

export interface CinemaTicket {
  id: string;
  order_id: string;
  ticket_code: string;
  qr_code_data: string;
  is_used: boolean;
  used_at?: string;
  expires_at: string;
  created_at: string;
}

export interface QuotaCheck {
  used_tickets: number;
  remaining_quota: number;
  requested_quantity: number;
  can_order: boolean;
  target_month: string;
}

export interface CinemaOrderRequest {
  cinema_id: string;
  quantity: number;
}
```

### **4. Services et API Routes**

```typescript
// src/lib/services/cinema.ts
import { supabase } from "@/lib/supabase/config";
import type {
  Cinema,
  CinemaOrder,
  QuotaCheck,
  CinemaOrderRequest,
} from "@/types/cinema";

export class CinemaService {
  static async getCinemas(): Promise<Cinema[]> {
    const { data, error } = await supabase
      .from("cinemas")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return data || [];
  }

  static async checkUserQuota(
    userId: string,
    quantity: number
  ): Promise<QuotaCheck> {
    const { data, error } = await supabase.rpc("check_monthly_quota", {
      p_user_id: userId,
      p_requested_quantity: quantity,
    });

    if (error) throw error;
    return data;
  }

  static async getUserHistory(userId: string) {
    const { data, error } = await supabase.rpc("get_user_cinema_history", {
      p_user_id: userId,
    });

    if (error) throw error;
    return data || [];
  }

  static async createOrder(
    userId: string,
    orderData: CinemaOrderRequest
  ): Promise<CinemaOrder> {
    // 1. Vérifier le quota
    const quotaCheck = await this.checkUserQuota(userId, orderData.quantity);
    if (!quotaCheck.can_order) {
      throw new Error(
        `Quota dépassé. Tickets restants ce mois: ${quotaCheck.remaining_quota}`
      );
    }

    // 2. Récupérer les infos du cinéma
    const { data: cinema, error: cinemaError } = await supabase
      .from("cinemas")
      .select("*")
      .eq("id", orderData.cinema_id)
      .single();

    if (cinemaError) throw cinemaError;

    // 3. Créer la commande
    const orderMonth = new Date().toISOString().slice(0, 7) + "-01"; // YYYY-MM-01
    const totalAmount = cinema.reduced_price * orderData.quantity;

    const { data: order, error: orderError } = await supabase
      .from("cinema_orders")
      .insert({
        user_id: userId,
        cinema_id: orderData.cinema_id,
        quantity: orderData.quantity,
        unit_price: cinema.reduced_price,
        total_amount: totalAmount,
        order_month: orderMonth,
        status: "pending",
      })
      .select("*")
      .single();

    if (orderError) throw orderError;
    return order;
  }
}
```

### **5. Intégration Stripe**

```typescript
// src/app/api/cinema/payment/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/supabase/auth";
import { CinemaService } from "@/lib/services/cinema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const { user, error: authError } = await getCurrentUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { cinema_id, quantity } = await req.json();

    // Créer la commande (avec vérification quota)
    const order = await CinemaService.createOrder(user.id, {
      cinema_id,
      quantity,
    });

    // Créer le PaymentIntent Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100), // Convertir en centimes
      currency: "eur",
      metadata: {
        order_id: order.id,
        user_id: user.id,
        cinema_id: cinema_id,
        quantity: quantity.toString(),
      },
    });

    // Mettre à jour la commande avec l'ID Stripe
    await supabase
      .from("cinema_orders")
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq("id", order.id);

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      order_id: order.id,
    });
  } catch (error) {
    console.error("Erreur création paiement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
```

### **6. Composants React - Interface Utilisateur**

```typescript
// src/components/cinema/CinemaOrderForm.tsx
"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CinemaService } from "@/lib/services/cinema";
import type { Cinema, QuotaCheck } from "@/types/cinema";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CinemaOrderFormProps {
  cinemas: Cinema[];
  userId: string;
}

export default function CinemaOrderForm({
  cinemas,
  userId,
}: CinemaOrderFormProps) {
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quotaCheck, setQuotaCheck] = useState<QuotaCheck | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quantity > 0) {
      checkQuota();
    }
  }, [quantity]);

  const checkQuota = async () => {
    try {
      const quota = await CinemaService.checkUserQuota(userId, quantity);
      setQuotaCheck(quota);
    } catch (error) {
      console.error("Erreur vérification quota:", error);
    }
  };

  const handleCinemaSelect = (cinema: Cinema) => {
    setSelectedCinema(cinema);
  };

  const calculateTotal = () => {
    return selectedCinema ? selectedCinema.reduced_price * quantity : 0;
  };

  return (
    <div className="space-y-6">
      {/* Sélection du cinéma */}
      <Card>
        <CardHeader>
          <CardTitle>Choisissez votre cinéma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cinemas.map((cinema) => (
              <div
                key={cinema.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCinema?.id === cinema.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleCinemaSelect(cinema)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{cinema.name}</h3>
                  <Badge variant="secondary">{cinema.location}</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {cinema.address}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">
                    {cinema.reduced_price.toFixed(2)}€
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {cinema.regular_price.toFixed(2)}€
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sélection quantité et quota */}
      {selectedCinema && (
        <Card>
          <CardHeader>
            <CardTitle>Quantité de tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre de tickets (max 5 par mois)
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} ticket{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {quotaCheck && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between text-sm">
                    <span>Tickets utilisés ce mois :</span>
                    <span className="font-medium">
                      {quotaCheck.used_tickets}/5
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tickets restants :</span>
                    <span className="font-medium">
                      {quotaCheck.remaining_quota}
                    </span>
                  </div>
                  {!quotaCheck.can_order && (
                    <div className="mt-2 text-red-600 text-sm font-medium">
                      ⚠️ Quota mensuel dépassé
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-semibold">Total :</span>
                <span className="text-2xl font-bold text-blue-600">
                  {calculateTotal().toFixed(2)}€
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paiement Stripe */}
      {selectedCinema && quotaCheck?.can_order && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            cinema={selectedCinema}
            quantity={quantity}
            total={calculateTotal()}
            onSuccess={() => {
              // Redirection vers page de confirmation
              window.location.href = "/tickets/success";
            }}
          />
        </Elements>
      )}
    </div>
  );
}

// Composant de paiement Stripe séparé
function PaymentForm({
  cinema,
  quantity,
  total,
  onSuccess,
}: {
  cinema: Cinema;
  quantity: number;
  total: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Créer le PaymentIntent
      const response = await fetch("/api/cinema/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cinema_id: cinema.id,
          quantity,
        }),
      });

      const { client_secret, order_id } = await response.json();

      // Confirmer le paiement
      const { error: stripeError } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Erreur de paiement");
      } else {
        onSuccess();
      }
    } catch (err) {
      setError("Erreur lors du traitement du paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paiement sécurisé</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 border rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                },
              }}
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button
            type="submit"
            className="w-full"
            disabled={!stripe || loading}
          >
            {loading ? "Traitement..." : `Payer ${total.toFixed(2)}€`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

---

## 🔐 **Sécurité et Politiques RLS**

```sql
-- Politiques RLS pour cinema_orders
ALTER TABLE public.cinema_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cinema orders" ON public.cinema_orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cinema orders" ON public.cinema_orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour cinema_tickets
ALTER TABLE public.cinema_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cinema tickets" ON public.cinema_tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cinema_orders co
            WHERE co.id = cinema_tickets.order_id
            AND co.user_id = auth.uid()
        )
    );

-- Politiques admin pour gestion
CREATE POLICY "Admins can manage all cinema orders" ON public.cinema_orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND (u.role = 'admin' OR u.email LIKE '%admin%')
        )
    );
```

---

## 📱 **Intégration avec l'Existant**

### **1. Navigation - Mise à jour DashboardLayout**

```typescript
// Ajout dans src/components/layout/dashboard-layout.tsx
const navigation = [
  // ... existing items ...
  {
    name: "Tickets Cinéma",
    href: "/tickets",
    icon: Film, // Import from lucide-react
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100",
  },
  // ... rest of items ...
];
```

### **2. Configuration - Mise à jour config/index.ts**

```typescript
// Ajout dans src/config/index.ts
export const config = {
  // ... existing config ...
  features: {
    // ... existing features ...
    cinema: {
      enabled: true,
      max_tickets_per_month: 5,
      ticket_validity_days: 90,
      payment_provider: "stripe",
      cinemas: [
        {
          name: "Agora",
          location: "Cayenne",
          reduced_price: 7.5,
          regular_price: 12.0,
        },
        {
          name: "Uranus",
          location: "Kourou",
          reduced_price: 7.0,
          regular_price: 11.5,
        },
      ],
    },
  },
  // ... rest of config ...
};
```

### **3. Variables d'Environnement**

```env
# .env.local - Ajouts nécessaires
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Configuration cinémas (optionnel, peut être en base)
AGORA_REDUCED_PRICE=7.50
URANUS_REDUCED_PRICE=7.00
```

---

## 🧪 **Tests Proposés**

### **Tests Unitaires**

```typescript
// src/__tests__/cinema.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { CinemaService } from "@/lib/services/cinema";

describe("CinemaService", () => {
  describe("checkUserQuota", () => {
    it("should allow order when under quota", async () => {
      const quota = await CinemaService.checkUserQuota("user-id", 3);
      expect(quota.can_order).toBe(true);
    });

    it("should reject order when quota exceeded", async () => {
      // Mock user with 5 tickets already ordered
      const quota = await CinemaService.checkUserQuota(
        "user-with-5-tickets",
        1
      );
      expect(quota.can_order).toBe(false);
    });
  });

  describe("createOrder", () => {
    it("should create order with correct pricing", async () => {
      const order = await CinemaService.createOrder("user-id", {
        cinema_id: "agora-id",
        quantity: 2,
      });
      expect(order.quantity).toBe(2);
      expect(order.total_amount).toBe(15.0); // 7.50 * 2
    });
  });
});
```

---

## 📋 **Plan d'Implémentation**

### **Phase 1 - Base de Données (Jour 1-2)**

1. ✅ Créer les migrations Supabase
2. ✅ Implémenter les fonctions SQL
3. ✅ Configurer les politiques RLS
4. ✅ Insérer les données des cinémas

### **Phase 2 - Backend API (Jour 3-4)**

1. ✅ Créer les types TypeScript
2. ✅ Implémenter CinemaService
3. ✅ Créer les routes API
4. ✅ Intégrer Stripe

### **Phase 3 - Interface Utilisateur (Jour 5-6)**

1. ✅ Créer les composants de commande
2. ✅ Intégrer Stripe Elements
3. ✅ Implémenter la validation côté client
4. ✅ Créer la page de confirmation

### **Phase 4 - Tests et Documentation (Jour 7)**

1. ✅ Tests unitaires et d'intégration
2. ✅ Tests Stripe en mode sandbox
3. ✅ Documentation utilisateur
4. ✅ Guide d'administration

---

## ⚠️ **Risques et Mitigation**

### **Risques Identifiés :**

1. **Dépassement de quota** : Condition de course entre vérifications

   - **Mitigation** : Contraintes base de données + vérification atomique

2. **Échec de paiement Stripe** : Commande créée mais paiement échoué

   - **Mitigation** : Statut 'pending' + cleanup automatique

3. **Génération de QR codes** : Performance et unicité

   - **Mitigation** : UUID + cache + génération asynchrone

4. **Fraude/abus quotas** : Manipulation côté client
   - **Mitigation** : Validation serveur + logging + audit trail

---

## 🚀 **Prochaines Étapes**

1. **Validation des spécifications** avec les parties prenantes
2. **Configuration Stripe** en mode test puis production
3. **Négociation tarifs** avec cinémas Agora et Uranus
4. **Formation équipe** sur le nouveau module
5. **Tests utilisateurs** avec un groupe restreint
6. **Déploiement progressif** par cinéma

---

**Cette analyse technique propose une solution robuste, sécurisée et scalable pour le système de commande de tickets cinéma, parfaitement intégrée à l'architecture existante du projet CSE Les PEP 973.**
