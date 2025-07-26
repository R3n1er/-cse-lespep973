import MainLayout from "@/components/layout/main-layout";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Users, Bell } from "lucide-react";

export default function NewsletterPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Newsletter du CSE
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Restez informé des dernières actualités, événements et informations
            importantes du Comité Social et Économique des PEP 973.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Actualités et événements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Nouvelles publications du blog</li>
                <li>• Événements et réunions du CSE</li>
                <li>• Informations importantes</li>
                <li>• Rappels et annonces</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Fréquence d&apos;envoi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Envoi uniquement quand nécessaire</li>
                <li>• Pas de spam ou de publicité</li>
                <li>• Désinscription possible à tout moment</li>
                <li>• Respect de votre vie privée</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-md mx-auto">
          <NewsletterSignup
            title="S'inscrire à la newsletter"
            description="Recevez nos dernières actualités directement dans votre boîte mail"
            showNames={true}
          />
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            En vous inscrivant, vous acceptez de recevoir nos communications par
            email. Vous pouvez vous désinscrire à tout moment en cliquant sur le
            lien dans nos emails.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
