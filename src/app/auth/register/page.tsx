"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "@/components/auth/RegisterForm";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="max-w-md mx-auto">
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-2xl shadow-blue-500/10">
            <CardHeader className="text-center pb-6 space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Créer un compte
                </CardTitle>
                <p className="text-gray-600">Rejoignez le CSE Les PEP 973</p>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <RegisterForm />
              <div className="pt-4 border-t border-gray-100 mt-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Déjà un compte ?{" "}
                    <Link
                      href="/"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      Se connecter
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
