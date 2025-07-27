"use client";

import MainLayout from "@/components/layout/main-layout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
              <p className="text-gray-600 mt-2">
                Accédez à votre espace personnel
              </p>
            </div>
            <LoginForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
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
      </div>
    </MainLayout>
  );
}
