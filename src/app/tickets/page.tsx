import { Suspense } from "react";
import { getCurrentUser } from "@/lib/supabase/auth";
import { CinemaService } from "@/lib/services/cinema";
import CinemaOrderForm from "@/components/cinema/CinemaOrderForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Ticket } from "lucide-react";
import { redirect } from "next/navigation";

async function TicketsPageContent() {
  try {
    // Vérifier l'authentification
    const { user, error: authError } = await getCurrentUser();
    if (authError || !user) {
      redirect("/auth/login");
    }

    // Récupérer les cinémas disponibles
    const cinemas = await CinemaService.getCinemas();

    if (cinemas.length === 0) {
      return (
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Tickets Cinéma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Aucun cinéma partenaire disponible pour le moment.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="container mx-auto">
        <CinemaOrderForm cinemas={cinemas} userId={user.id} />
      </div>
    );
  } catch (error) {
    console.error("Erreur lors du chargement de la page tickets:", error);

    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              Une erreur est survenue lors du chargement de la page. Veuillez
              réessayer plus tard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

function TicketsPageLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="text-center space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Cinema cards skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="p-6 border-2 rounded-xl">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading indicator */}
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Chargement des cinémas partenaires...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<TicketsPageLoading />}>
      <TicketsPageContent />
    </Suspense>
  );
}
