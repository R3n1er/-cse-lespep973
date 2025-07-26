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

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-cse-primary mb-6">
            Bienvenue sur le portail du CSE Les PEP 973
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Votre espace dédié pour accéder aux services, actualités et
            avantages de votre Comité Social et Économique.
          </p>
          <div className="flex justify-center">
            <Link href="/auth/login">
              <Button
                variant="cse"
                size="lg"
                className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-slow"
              >
                <span className="relative z-10 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Se connecter
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nos services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez tous les avantages et services mis à votre disposition
              par le CSE
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <ServiceCard
                title="Tickets & Événements"
                description="Accédez aux tickets pour des événements culturels, cinéma et loisirs à tarifs préférentiels."
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-cse-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                }
                link="/tickets"
              />
            </div>
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <ServiceCard
                title="Remboursements"
                description="Demandez le remboursement de vos activités culturelles et sportives jusqu'à 50% dans la limite de 200€ par an."
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-cse-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                }
                link="/remboursements"
              />
            </div>
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <ServiceCard
                title="Actualités & Blog"
                description="Restez informé des dernières actualités, événements et décisions concernant votre CSE."
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-cse-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                }
                link="/blog"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">À propos du CSE</h2>
              <p className="text-gray-600 mb-4">
                Le Comité Social et Économique (CSE) des PEP 973 est
                l&apos;instance représentative du personnel qui vous accompagne
                au quotidien.
              </p>
              <p className="text-gray-600 mb-4">
                Notre mission est de proposer des activités sociales et
                culturelles, défendre vos intérêts et améliorer vos conditions
                de travail.
              </p>
              <p className="text-gray-600 mb-6">
                Composé d&apos;élus engagés, le CSE est à votre écoute pour
                répondre à vos besoins et vous accompagner dans votre vie
                professionnelle.
              </p>
              <Link href="/a-propos">
                <Button variant="outline">En savoir plus</Button>
              </Link>
            </div>
            <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Vos élus</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 font-medium">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">Jean Dupont</p>
                    <p className="text-sm text-gray-500">Président</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 font-medium">ML</span>
                  </div>
                  <div>
                    <p className="font-medium">Marie Lefebvre</p>
                    <p className="text-sm text-gray-500">Secrétaire</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 font-medium">PB</span>
                  </div>
                  <div>
                    <p className="font-medium">Pierre Boucher</p>
                    <p className="text-sm text-gray-500">Trésorier</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-cse-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Accédez à vos services</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connectez-vous pour accéder à tous les services et avantages
            proposés par votre CSE.
          </p>
          <Link href="/auth/login">
            <Button variant="cse-light" size="lg">
              Se connecter
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

function ServiceCard({ title, description, icon, link }: ServiceCardProps) {
  return (
    <Card className="group h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-cse-primary/20 cursor-pointer bg-gradient-to-br from-white to-gray-50/50 hover-lift animate-fade-in-up">
      <CardHeader className="pb-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-cse-primary/10 to-cse-primary/5 group-hover:from-cse-primary/20 group-hover:to-cse-primary/10 transition-all duration-300 group-hover:scale-110">
            <div className="text-cse-primary group-hover:text-cse-primary/80 transition-colors duration-300">
              {icon}
            </div>
          </div>
        </div>
        <CardTitle className="text-xl text-center group-hover:text-cse-primary transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="text-center leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="mt-auto pt-4 flex justify-center">
        <Link href={link} className="w-full">
          <Button
            variant="outline"
            className="w-full group-hover:bg-cse-primary group-hover:text-white group-hover:border-cse-primary transition-all duration-300 transform group-hover:scale-105"
          >
            <span className="mr-2">En savoir plus</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
