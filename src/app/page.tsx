import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Heart,
  Shield,
  ArrowRight,
  Building2,
  Calendar,
  Euro,
  MessageSquare,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Colonne de gauche - Bienvenue */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cse-primary/10 rounded-full">
                  <Building2 className="w-8 h-8 text-cse-primary" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  CSE Les PEP 973
                </h1>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Bienvenue sur votre
                <span className="text-cse-primary block">espace personnel</span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                Accédez à tous les services et avantages de votre Comité Social
                et Économique en quelques clics.
              </p>
            </div>

            {/* Services rapides */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tickets</p>
                  <p className="text-sm text-gray-500">Événements & Loisirs</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Euro className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Remboursements</p>
                  <p className="text-sm text-gray-500">Jusqu'à 200€/an</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Actualités</p>
                  <p className="text-sm text-gray-500">Blog & Informations</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Heart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Avantages</p>
                  <p className="text-sm text-gray-500">Services exclusifs</p>
                </div>
              </div>
            </div>

            {/* Informations CSE */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-cse-primary" />
                <h3 className="text-lg font-semibold text-gray-900">
                  À propos du CSE
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Le Comité Social et Économique des PEP 973 est votre instance
                représentative. Nous vous accompagnons au quotidien pour
                améliorer vos conditions de travail et vous proposer des
                activités sociales et culturelles.
              </p>
            </div>
          </div>

          {/* Colonne de droite - Connexion */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-cse-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-cse-primary" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Accédez à votre espace
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Connectez-vous pour accéder à tous vos services
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Accès sécurisé et privé
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Services personnalisés
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Support dédié</span>
                  </div>
                </div>

                <Link href="/auth/login" className="block">
                  <Button className="w-full h-12 text-lg font-semibold bg-cse-primary hover:bg-cse-primary/90 transition-all duration-300 group">
                    <span>Se connecter</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Nouveau ? Contactez votre responsable pour obtenir un accès
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
