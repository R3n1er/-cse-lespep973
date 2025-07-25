"use client";

import { SignIn } from "@clerk/nextjs";
import MainLayout from "@/components/layout/main-layout";

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10 flex justify-center">
        <div className="w-full max-w-md">
          <SignIn
            appearance={{
              elements: {
                card: "shadow-lg border border-gray-200",
                headerTitle: "text-2xl font-bold text-center",
                headerSubtitle: "text-center",
              },
            }}
            afterSignInUrl="/"
            signUpUrl="/auth/register"
            // TODO: Ajouter une logique avancée pour bloquer lepep973.org sauf admin
            // via Clerk hooks ou events côté backend
          />
        </div>
      </div>
    </MainLayout>
  );
}
