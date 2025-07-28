"use client";
import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    setStatus(res.ok ? "success" : "error");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        required
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-4 py-2 flex-1"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Envoi..." : "S'inscrire"}
      </button>
      {status === "success" && (
        <span className="text-green-600 ml-2">Merci !</span>
      )}
      {status === "error" && (
        <span className="text-red-600 ml-2">Erreur !</span>
      )}
    </form>
  );
}
