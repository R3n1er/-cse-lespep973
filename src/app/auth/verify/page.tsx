import Link from "next/link";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Vérifiez votre email
            </CardTitle>
            <CardDescription className="text-center">
              Un lien de vérification a été envoyé à votre adresse email
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 pt-4">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-center space-y-3">
              <p>
                Nous avons envoyé un lien de vérification à votre adresse email.
                Veuillez cliquer sur ce lien pour activer votre compte.
              </p>
              <p className="text-sm text-gray-500">
                Si vous ne recevez pas l&apos;email dans les prochaines minutes,
                vérifiez votre dossier de spam ou de promotions.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Link href="/auth/login" className="w-full">
              <Button variant="cse" className="w-full">
                Retour à la connexion
              </Button>
            </Link>
            <div className="text-center text-sm">
              Besoin d&apos;aide ?{" "}
              <Link
                href="/contact"
                className="text-cse-primary hover:underline"
              >
                Contactez-nous
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
