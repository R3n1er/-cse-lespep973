"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("🔄 Tentative de connexion avec:", email);

    const { data, error } = await signIn(email, password);

    if (error) {
      console.error("❌ Erreur de connexion:", error);
      setError(error.message);
    } else if (data.user) {
      console.log("✅ Connexion réussie:", data.user.email);
      console.log("🔄 Redirection vers /dashboard...");
      router.push("/dashboard");
    } else {
      console.log("⚠️ Pas d'erreur mais pas d'utilisateur");
      setError("Erreur inattendue lors de la connexion");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
        />
      </div>

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
