"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Download,
  Mail,
  Calendar,
  MapPin,
  Ticket,
} from "lucide-react";
import Link from "next/link";

export default function TicketSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un petit délai pour l'effet
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mx-auto animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Message de succès principal */}
        <Card className="border-green-200 bg-white shadow-lg">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Paiement réussi !
                </h1>
                <p className="text-lg text-gray-600">
                  Vos tickets cinéma ont été commandés avec succès
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  Un email de confirmation avec vos tickets a été envoyé à votre
                  adresse email.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations sur les tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-blue-600" />
              Vos tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Email de confirmation</p>
                  <p className="text-gray-600">Envoyé dans quelques minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Download className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Format PDF</p>
                  <p className="text-gray-600">Tickets téléchargeables</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Validité</p>
                  <p className="text-gray-600">
                    90 jours à partir d'aujourd'hui
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Utilisation</p>
                  <p className="text-gray-600">
                    Présentez le QR code au cinéma
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions importantes */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">
              Instructions importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">1</span>
              </div>
              <p>
                Vérifiez votre boîte email (y compris les spams) pour recevoir
                vos tickets.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">2</span>
              </div>
              <p>
                Téléchargez les tickets PDF ou sauvegardez-les sur votre
                téléphone.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">3</span>
              </div>
              <p>
                Présentez le code QR directement à l'accueil du cinéma pour
                retirer vos places.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">4</span>
              </div>
              <p>
                Les tickets sont valables 90 jours à partir de la date d'achat.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1" size="lg">
            <Link href="/tickets">Commander d'autres tickets</Link>
          </Button>

          <Button variant="outline" asChild className="flex-1" size="lg">
            <Link href="/dashboard">Retour au dashboard</Link>
          </Button>
        </div>

        {/* Note de support */}
        <Card className="bg-gray-50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-600">
              En cas de problème avec vos tickets, contactez-nous à{" "}
              <a
                href="mailto:support@cse-lespep973.fr"
                className="text-blue-600 hover:underline"
              >
                support@cse-lespep973.fr
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
