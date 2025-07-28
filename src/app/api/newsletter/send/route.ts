import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/config";

export async function POST(req: Request) {
  try {
    const { subject, content } = await req.json();

    if (!subject || !content) {
      return NextResponse.json(
        { error: "Sujet et contenu requis" },
        { status: 400 }
      );
    }

    // Récupérer tous les utilisateurs actifs du CSE
    // Essayer d'abord la fonction SQL, sinon utiliser une requête directe
    let activeUsers;
    let usersError;

    try {
      const { data, error } = await supabase.rpc("get_active_users");
      activeUsers = data;
      usersError = error;
    } catch (rpcError) {
      console.warn(
        "Fonction get_active_users non disponible, utilisation de la requête directe"
      );
      // Fallback : requête directe sur la table users
      const { data, error } = await supabase
        .from("users")
        .select("id, email, first_name, last_name")
        .eq("is_active", true)
        .not("email", "is", null);

      activeUsers = data;
      usersError = error;
    }

    if (usersError) {
      console.error(
        "Erreur lors de la récupération des utilisateurs:",
        usersError
      );
      return NextResponse.json(
        { error: "Erreur lors de la récupération des utilisateurs" },
        { status: 500 }
      );
    }

    if (!activeUsers || activeUsers.length === 0) {
      return NextResponse.json(
        { error: "Aucun utilisateur actif trouvé" },
        { status: 404 }
      );
    }

    // Configuration Mailgun
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      return NextResponse.json(
        { error: "Configuration Mailgun manquante" },
        { status: 500 }
      );
    }

    // Préparer l'email HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CSE Les PEP 973</h1>
              <p>Communication officielle</p>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement à tous les membres du CSE Les PEP 973</p>
              <p>Vous recevez cet email en tant que membre bénéficiaire du CSE</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email via Mailgun à tous les utilisateurs
    const emailPromises = activeUsers.map(
      async (user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
      }) => {
        try {
          const response = await fetch(
            `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${Buffer.from(
                  `api:${MAILGUN_API_KEY}`
                ).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                from: `CSE Les PEP 973 <noreply@${MAILGUN_DOMAIN}>`,
                to: user.email,
                subject: subject,
                html: htmlContent,
                "o:tag": "newsletter",
                "o:tracking": "yes",
                "o:tracking-clicks": "yes",
                "o:tracking-opens": "yes",
              }),
            }
          );

          if (!response.ok) {
            console.error(
              `Erreur envoi email à ${user.email}:`,
              await response.text()
            );
            return { email: user.email, success: false };
          }

          return { email: user.email, success: true };
        } catch (error) {
          console.error(`Erreur envoi email à ${user.email}:`, error);
          return { email: user.email, success: false };
        }
      }
    );

    // Attendre tous les envois
    const results = await Promise.all(emailPromises);
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    // Log de l'envoi pour traçabilité
    const { error: logError } = await supabase.from("newsletter_logs").insert([
      {
        subject,
        content,
        recipients_count: activeUsers.length,
        sent_count: successCount,
        failed_count: failureCount,
        sent_at: new Date().toISOString(),
        sent_by: "admin", // À adapter selon ton système d'auth admin
      },
    ]);

    if (logError) {
      console.error("Erreur lors du log:", logError);
    }

    return NextResponse.json({
      success: true,
      message: `Newsletter envoyée avec succès`,
      stats: {
        total: activeUsers.length,
        sent: successCount,
        failed: failureCount,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la newsletter:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
