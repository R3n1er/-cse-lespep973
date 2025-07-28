import { NextResponse } from "next/server";
import { CinemaService } from "@/lib/services/cinema";

/**
 * GET /api/cinema - Récupérer tous les cinémas actifs
 */
export async function GET() {
  try {
    const cinemas = await CinemaService.getCinemas();

    return NextResponse.json({
      success: true,
      data: cinemas,
    });
  } catch (error: any) {
    console.error("Erreur API GET /api/cinema:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erreur lors de la récupération des cinémas",
        code: error.code || "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
