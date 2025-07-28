"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/config";

export default function TestMiddlewarePage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { session: sessionData },
        } = await supabase.auth.getSession();
        setSession(sessionData);
        console.log("🔍 Test Middleware - Session:", sessionData);
      } catch (error) {
        console.error("❌ Erreur session:", error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Middleware</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Session</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {session ? JSON.stringify(session, null, 2) : "Aucune session"}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">User</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {session?.user
              ? JSON.stringify(session.user, null, 2)
              : "Aucun utilisateur"}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Aller à l'accueil
            </button>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Aller au dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
