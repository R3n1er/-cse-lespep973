"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, MapPin, Euro, Calendar, Users } from "lucide-react";
import type { Cinema, QuotaCheck } from "@/types/cinema";
import { PaymentForm } from "./PaymentForm";

// Initialiser Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CinemaOrderFormProps {
  cinemas: Cinema[];
  userId: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export default function CinemaOrderForm({
  cinemas,
  userId,
}: CinemaOrderFormProps) {
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quotaCheck, setQuotaCheck] = useState<QuotaCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier le quota à chaque changement de quantité
  useEffect(() => {
    if (quantity > 0) {
      checkQuota();
    }
  }, [quantity]);

  const checkQuota = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/cinema/quota?quantity=${quantity}`);
      const result: ApiResponse<QuotaCheck> = await response.json();

      if (!result.success) {
        setError(result.error || "Erreur lors de la vérification du quota");
        return;
      }

      setQuotaCheck(result.data || null);
    } catch (err) {
      console.error("Erreur vérification quota:", err);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleCinemaSelect = (cinema: Cinema) => {
    setSelectedCinema(cinema);
    setError(null);
  };

  const calculateTotal = () => {
    return selectedCinema ? selectedCinema.reduced_price * quantity : 0;
  };

  const calculateSavings = () => {
    return selectedCinema
      ? (selectedCinema.regular_price - selectedCinema.reduced_price) * quantity
      : 0;
  };

  const handlePaymentSuccess = () => {
    // Redirection vers page de confirmation
    window.location.href = "/tickets/success";
  };

  const currentMonth = new Date().toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Commande de Tickets Cinéma
        </h1>
        <p className="text-gray-600">
          Profitez de tarifs réduits CSE dans les cinémas partenaires de Guyane
        </p>
      </div>

      {/* Erreur globale */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Sélection du cinéma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Choisissez votre cinéma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cinemas.map((cinema) => (
              <div
                key={cinema.id}
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedCinema?.id === cinema.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleCinemaSelect(cinema)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {cinema.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{cinema.location}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      selectedCinema?.id === cinema.id ? "default" : "secondary"
                    }
                  >
                    {cinema.location}
                  </Badge>
                </div>

                {cinema.address && (
                  <p className="text-sm text-gray-600 mb-4">{cinema.address}</p>
                )}

                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        {cinema.reduced_price.toFixed(2)}€
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        Prix CSE
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 line-through">
                        {cinema.regular_price.toFixed(2)}€
                      </span>
                      <span className="text-green-600 font-medium">
                        -
                        {(
                          ((cinema.regular_price - cinema.reduced_price) /
                            cinema.regular_price) *
                          100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                  </div>
                  {selectedCinema?.id === cinema.id && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
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
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Quantité de tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nombre de tickets (maximum 5 par mois)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuantity(num)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        quantity === num
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Affichage du quota */}
              {quotaCheck && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Quota mensuel - {currentMonth}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tickets utilisés :</span>
                      <span className="ml-2 font-bold text-blue-600">
                        {quotaCheck.used_tickets}/{quotaCheck.max_quota}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tickets restants :</span>
                      <span className="ml-2 font-bold text-green-600">
                        {quotaCheck.remaining_quota}
                      </span>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Utilisation du quota</span>
                      <span>
                        {Math.round(
                          (quotaCheck.used_tickets / quotaCheck.max_quota) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (quotaCheck.used_tickets / quotaCheck.max_quota) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {!quotaCheck.can_order && (
                    <Alert className="mt-4 border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        ⚠️ Quota mensuel dépassé. Vous ne pouvez pas commander{" "}
                        {quantity} ticket{quantity > 1 ? "s" : ""}{" "}
                        supplémentaire{quantity > 1 ? "s" : ""}.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Résumé de la commande */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Résumé de votre commande
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {quantity} ticket{quantity > 1 ? "s" : ""} -{" "}
                      {selectedCinema.name}
                    </span>
                    <span className="font-medium">
                      {calculateTotal().toFixed(2)}€
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Économie CSE</span>
                    <span className="font-medium">
                      -{calculateSavings().toFixed(2)}€
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Total :
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {calculateTotal().toFixed(2)}€
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Au lieu de{" "}
                      {(selectedCinema.regular_price * quantity).toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paiement Stripe */}
      {selectedCinema && quotaCheck?.can_order && !loading && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            cinema={selectedCinema}
            quantity={quantity}
            total={calculateTotal()}
            onSuccess={handlePaymentSuccess}
          />
        </Elements>
      )}

      {/* Note importante */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2 text-blue-800">
              <h4 className="font-medium">Informations importantes :</h4>
              <ul className="text-sm space-y-1">
                <li>• Les tickets sont valables 90 jours après l'achat</li>
                <li>• Maximum 5 tickets par salarié par mois calendaire</li>
                <li>• Les tickets sont envoyés par email après paiement</li>
                <li>• Présentez le code QR directement au cinéma</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
