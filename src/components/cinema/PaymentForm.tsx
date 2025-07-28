"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import type { Cinema, StripePaymentResponse } from "@/types/cinema";

interface PaymentFormProps {
  cinema: Cinema;
  quantity: number;
  total: number;
  onSuccess: () => void;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export function PaymentForm({
  cinema,
  quantity,
  total,
  onSuccess,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Service de paiement non disponible");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Créer le PaymentIntent côté serveur
      const response = await fetch("/api/cinema/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cinema_id: cinema.id,
          quantity,
        }),
      });

      const result: ApiResponse<StripePaymentResponse> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(
          result.error || "Erreur lors de la création du paiement"
        );
      }

      const { client_secret } = result.data;

      // 2. Confirmer le paiement avec Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: "Salarié CSE Les PEP 973",
            },
          },
        });

      if (stripeError) {
        throw new Error(stripeError.message || "Erreur de paiement Stripe");
      }

      if (paymentIntent?.status === "succeeded") {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        throw new Error("Paiement non confirmé");
      }
    } catch (err: any) {
      console.error("Erreur de paiement:", err);
      setError(err.message || "Erreur lors du traitement du paiement");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Paiement réussi !
              </h3>
              <p className="text-green-700 mt-2">
                Vos tickets vous seront envoyés par email dans quelques
                instants.
              </p>
            </div>
            <div className="animate-pulse text-sm text-green-600">
              Redirection en cours...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-green-600" />
          Paiement sécurisé
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Récapitulatif */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Récapitulatif :</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>
                  {quantity} ticket{quantity > 1 ? "s" : ""} - {cinema.name} (
                  {cinema.location})
                </span>
                <span className="font-medium">{total.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          {/* Carte bancaire */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Informations de carte bancaire
            </label>
            <div className="p-4 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                      fontFamily: '"Inter", sans-serif',
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Lock className="h-3 w-3" />
              <span>
                Paiement sécurisé par Stripe • Vos données sont protégées
              </span>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Bouton de paiement */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            disabled={!stripe || loading}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Payer {total.toFixed(2)}€
              </>
            )}
          </Button>

          {/* Informations de sécurité */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Paiement sécurisé SSL 256 bits</p>
            <p>• Aucune donnée bancaire n'est stockée sur nos serveurs</p>
            <p>• Vous recevrez un email de confirmation après paiement</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
