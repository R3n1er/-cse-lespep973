import { config } from "@/config";

export async function sendNewsletterEmail(
  to: string,
  subject: string,
  html: string
) {
  const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
  const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN)
    throw new Error("MAILGUN_API_KEY ou MAILGUN_DOMAIN manquant");

  const res = await fetch(
    `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString(
          "base64"
        )}`,
      },
      body: new URLSearchParams({
        from: config.email.from,
        to,
        subject,
        html,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Erreur lors de l'envoi de l'email");
  }
  return res.json();
}
