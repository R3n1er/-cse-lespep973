import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { CinemaService } from "@/lib/services/cinema";

/**
 * GET /api/cinema/quota?quantity=X - Vérifier le quota mensuel de l'utilisateur
 */
export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const quantityParam = searchParams.get("quantity");
    const quantity = quantityParam ? parseInt(quantityParam, 10) : 1;

    // Validation de la quantité
    if (isNaN(quantity) || quantity < 1 || quantity > 5) {
      return NextResponse.json(
        {
          success: false,
          error: "La quantité doit être un nombre entre 1 et 5",
          code: "INVALID_QUANTITY",
        },
        { status: 400 }
      );
    }

    const quotaCheck = await CinemaService.checkUserQuota(user.id, quantity);

    return NextResponse.json({
      success: true,
      data: quotaCheck,
    });
  } catch (error: any) {
    console.error("Erreur API GET /api/cinema/quota:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erreur lors de la vérification du quota",
        code: error.code || "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
