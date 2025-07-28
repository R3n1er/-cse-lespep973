import { NextResponse } from "next/server";
import { sendNewsletterEmail } from "@/lib/services/emailService";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email)
    return NextResponse.json({ error: "Email requis" }, { status: 400 });

  // Ici tu peux ajouter l’email à ta base Supabase si tu veux
  // await supabase.from("newsletter_subscriptions").insert({ email });

  // Envoi d’un email de bienvenue
  await sendNewsletterEmail(
    email,
    "Bienvenue à la newsletter du CSE Les PEP 973",
    "<h1>Merci pour votre inscription !</h1><p>Vous recevrez bientôt nos actualités.</p>"
  );

  return NextResponse.json({ success: true });
}
