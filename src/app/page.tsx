"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
import {
  Shield,
  Building2,
  Calendar,
  Euro,
  MessageSquare,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Colonne de gauche - Présentation */}
            <div className="space-y-10">
              {/* En-tête avec logo */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      CSE Les PEP 973
                    </h1>
                    <p className="text-gray-600">Comité Social et Économique</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Votre espace
                    <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      personnel
                    </span>
                  </h2>

                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    Accédez à tous vos services, avantages et informations en
                    toute simplicité.
                  </p>
                </div>
              </div>

              {/* Services en grille moderne */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Billetterie</p>
                      <p className="text-sm text-gray-600">
                        Événements & Loisirs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <Euro className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Remboursements
                      </p>
                      <p className="text-sm text-gray-600">
                        Jusqu&apos;à 200€/an
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Actualités</p>
                      <p className="text-sm text-gray-600">
                        Blog & Informations
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Avantages</p>
                      <p className="text-sm text-gray-600">
                        Services exclusifs
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points forts */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-700">
                    Interface sécurisée et moderne
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-700">
                    Accès rapide à tous vos services
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-700">
                    Support dédié disponible
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne de droite - Connexion Supabase */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <Card className="bg-white/80 backdrop-blur-md border-0 shadow-2xl shadow-blue-500/10">
                  <CardHeader className="text-center pb-6 space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        Connexion sécurisée
                      </CardTitle>
                      <p className="text-gray-600">
                        Accédez à votre espace personnel
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 pb-8">
                    <div className="space-y-6">
                      <LoginForm />

                      {/* Informations supplémentaires */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="text-center space-y-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">
                              Connexion sécurisée SSL
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Nouveau collaborateur ?{" "}
                            <a
                              href="/contact"
                              className="text-blue-600 hover:text-blue-700 underline"
                            >
                              Contactez-nous
                            </a>{" "}
                            pour obtenir vos accès
                          </p>
                          <p className="text-xs text-gray-500">
                            Pas encore de compte ?{" "}
                            <a
                              href="/auth/register"
                              className="text-blue-600 hover:text-blue-700 underline"
                            >
                              S&apos;inscrire
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="max-w-xl mx-auto py-12">
        <h2 className="text-xl font-bold mb-4">Recevez nos actualités</h2>
        <NewsletterSignup />
      </section>
    </div>
  );
}
