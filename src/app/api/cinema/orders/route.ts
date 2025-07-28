import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { CinemaService } from "@/lib/services/cinema";
import type { CinemaOrderRequest } from "@/types/cinema";

/**
 * GET /api/cinema/orders - Récupérer l'historique des commandes de l'utilisateur
 */
export async function GET() {
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

    const history = await CinemaService.getUserHistory(user.id);

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error("Erreur API GET /api/cinema/orders:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message || "Erreur lors de la récupération de l'historique",
        code: error.code || "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cinema/orders - Créer une nouvelle commande de tickets
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

    if (quantity < 1 || quantity > 5) {
      return NextResponse.json(
        {
          success: false,
          error: "La quantité doit être entre 1 et 5",
          code: "INVALID_QUANTITY",
        },
        { status: 400 }
      );
    }

    // Créer la commande
    const order = await CinemaService.createOrder(user.id, {
      cinema_id,
      quantity,
    });

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur API POST /api/cinema/orders:", error);

    // Gestion des erreurs spécifiques au cinéma
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
        error: error.message || "Erreur lors de la création de la commande",
        code: error.code || "INTERNAL_ERROR",
      },
      { status: statusCode }
    );
  }
}
