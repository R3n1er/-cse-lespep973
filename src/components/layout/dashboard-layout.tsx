"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  User,
  Film,
  Euro,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentUser, signOut } from "@/lib/supabase/auth";
import AuthGuard from "@/components/auth/AuthGuard";

const navigation = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
  {
    name: "Blog & Actualités",
    href: "/blog",
    icon: MessageSquare,
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
  },
  {
    name: "Tickets Cinéma",
    href: "/tickets",
    icon: Film,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 hover:bg-emerald-100",
  },
  {
    name: "Remboursements",
    href: "/remboursements",
    icon: Euro,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 hover:bg-indigo-100",
  },
  {
    name: "Mon Profil",
    href: "/profile",
    icon: User,
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user: currentUser, error } = await getCurrentUser();
        if (error || !currentUser) {
          console.log("❌ Pas d'utilisateur connecté, redirection vers /");
          router.push("/");
          return;
        }
        console.log("✅ Utilisateur connecté:", currentUser.email);
        setUser(currentUser);
      } catch (error) {
        console.error(
          "❌ Erreur lors de la vérification de l'utilisateur:",
          error
        );
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (!error) {
        console.log("✅ Déconnexion réussie");
        router.push("/");
      } else {
        console.error("❌ Erreur lors de la déconnexion:", error);
      }
    } catch (error) {
      console.error("❌ Erreur inattendue lors de la déconnexion:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar pour mobile */}
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden",
            sidebarOpen ? "block" : "hidden"
          )}
        >
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between px-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-white">
                  CSE Les PEP 973
                </h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 space-y-2 px-3 py-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-sm",
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : `text-gray-700 ${item.bgColor}`
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg mr-3 transition-colors",
                        isActive ? "bg-white/20" : `${item.color} bg-white`
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-4">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url}
                    alt={user?.user_metadata?.first_name || "Utilisateur"}
                  />
                  <AvatarFallback>
                    {user?.user_metadata?.first_name?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.user_metadata?.first_name}{" "}
                    {user?.user_metadata?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar pour desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-lg">
            <div className="flex h-16 items-center px-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-lg font-bold text-white">
                  CSE Les PEP 973
                </h1>
              </div>
            </div>
            <nav className="flex-1 space-y-2 px-4 py-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-sm",
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : `text-gray-700 ${item.bgColor}`
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg mr-3 transition-colors",
                        isActive ? "bg-white/20" : `${item.color} bg-white`
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-4">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url}
                    alt={user?.user_metadata?.first_name || "Utilisateur"}
                  />
                  <AvatarFallback>
                    {user?.user_metadata?.first_name?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.user_metadata?.first_name}{" "}
                    {user?.user_metadata?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="lg:pl-72">
          {/* Header mobile */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 shadow-lg lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:bg-white/20"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">CSE Les PEP 973</h1>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.user_metadata?.avatar_url}
                alt={user?.user_metadata?.first_name || "Utilisateur"}
              />
              <AvatarFallback>
                {user?.user_metadata?.first_name?.charAt(0) ||
                  user?.email?.charAt(0) ||
                  "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Contenu de la page */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
