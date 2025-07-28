import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { CinemaService } from "@/lib/services/cinema";
import type { CinemaOrderRequest, StripePaymentResponse } from "@/types/cinema";

// Import Stripe dynamiquement pour éviter les erreurs côté client
const getStripe = async () => {
  if (typeof window === "undefined") {
    const Stripe = await import("stripe");
    return new Stripe.default(process.env.STRIPE_SECRET_KEY!);
  }
  return null;
};

/**
 * POST /api/cinema/payment - Créer un PaymentIntent Stripe pour une commande
 */
export async function POST(req: Request) {
  try {
    const { user, error: authError } = await getCurrentUser();
    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Non authentifié",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { cinema_id, quantity }: CinemaOrderRequest = body;

    // Validation des données
    if (!cinema_id || !quantity) {
      return NextResponse.json(
        {
          success: false,
          error: "cinema_id et quantity sont requis",
          code: "INVALID_INPUT",
        },
        { status: 400 }
      );
    }

    // Vérifier les variables d'environnement Stripe
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY manquant");
      return NextResponse.json(
        {
          success: false,
          error: "Configuration paiement manquante",
          code: "PAYMENT_CONFIG_ERROR",
        },
        { status: 500 }
      );
    }

    // Initialiser Stripe
    const stripe = await getStripe();
    if (!stripe) {
      return NextResponse.json(
        {
          success: false,
          error: "Service de paiement indisponible",
          code: "PAYMENT_SERVICE_ERROR",
        },
        { status: 500 }
      );
    }

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
        cinema_name: order.cinema?.name || "Inconnu",
        user_email: user.email || "",
      },
      description: `Tickets cinéma ${order.cinema?.name} (${quantity} ticket${
        quantity > 1 ? "s" : ""
      })`,
    });

    // Mettre à jour la commande avec l'ID Stripe
    await CinemaService.updateOrderPaymentIntent(order.id, paymentIntent.id);

    const response: StripePaymentResponse = {
      client_secret: paymentIntent.client_secret!,
      order_id: order.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Erreur API POST /api/cinema/payment:", error);

    // Gestion des erreurs spécifiques
    const statusCode =
      error.code === "QUOTA_EXCEEDED"
        ? 409
        : error.code === "CINEMA_NOT_FOUND"
        ? 404
        : error.code === "INVALID_QUANTITY"
        ? 400
        : 500;

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erreur lors de la création du paiement",
        code: error.code || "PAYMENT_FAILED",
      },
      { status: statusCode }
    );
  }
}
