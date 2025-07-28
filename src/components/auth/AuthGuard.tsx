"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/config";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log(
            "✅ AuthGuard - Utilisateur authentifié:",
            session.user.email
          );
          setAuthenticated(true);
        } else {
          console.log(
            "❌ AuthGuard - Pas d'authentification, redirection vers /"
          );
          router.push("/");
        }
      } catch (error) {
        console.error("❌ AuthGuard - Erreur:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // La redirection est en cours
  }

  return <>{children}</>;
}
