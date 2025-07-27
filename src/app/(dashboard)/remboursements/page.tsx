"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Euro, Plus } from "lucide-react";

export default function RemboursementsPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Remboursements
        </h1>
        <p className="text-gray-600">
          Demandez le remboursement de vos dépenses éligibles
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <Button className="bg-cse-primary hover:bg-cse-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {/* Contenu temporaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="w-5 h-5" />
            Remboursements en construction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Le module remboursements est en cours de développement. Bientôt
            disponible !
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
