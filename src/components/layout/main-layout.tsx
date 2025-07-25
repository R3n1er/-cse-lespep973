import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-cse-primary">
                CSE Les PEP 973
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-cse-primary"
            >
              Accueil
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium hover:text-cse-primary"
            >
              Blog
            </Link>
            <Link
              href="/tickets"
              className="text-sm font-medium hover:text-cse-primary"
            >
              Tickets
            </Link>
            <Link
              href="/remboursements"
              className="text-sm font-medium hover:text-cse-primary"
            >
              Remboursements
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-cse-primary"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="cse" className="hidden md:flex">
                Connexion
              </Button>
            </Link>
            <Button variant="outline" className="md:hidden" aria-label="Menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-background">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">CSE Les PEP 973</h3>
              <p className="text-sm text-muted-foreground">
                Comité Social et Économique des PEP 973, au service des
                salariés.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm hover:text-cse-primary">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm hover:text-cse-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tickets"
                    className="text-sm hover:text-cse-primary"
                  >
                    Tickets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/remboursements"
                    className="text-sm hover:text-cse-primary"
                  >
                    Remboursements
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Légal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/mentions-legales"
                    className="text-sm hover:text-cse-primary"
                  >
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/politique-confidentialite"
                    className="text-sm hover:text-cse-primary"
                  >
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/cgu" className="text-sm hover:text-cse-primary">
                    CGU
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact</h3>
              <ul className="space-y-2">
                <li className="text-sm">Email: cse@lespep973.org</li>
                <li className="text-sm">Téléphone: +33 5 94 XX XX XX</li>
                <li className="text-sm">Adresse: Cayenne, Guyane Française</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} CSE Les PEP 973. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
