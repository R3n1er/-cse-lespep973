"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Mail } from "lucide-react";

export default function NewsletterPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Newsletter
        </h1>
        <p className="text-gray-600">
          Gérez vos abonnements aux newsletters du CSE
        </p>
      </div>

      {/* Contenu temporaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Newsletter en construction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Le module newsletter est en cours de développement. Bientôt
            disponible !
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
