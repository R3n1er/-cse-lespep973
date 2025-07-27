"use client";

// Démonstration des bibliothèques d'icônes disponibles
import {
  // Lucide Icons (déjà utilisés)
  Home,
  Mail,
  User,
  Settings,
  Heart,
  Star,
  Calendar,
  Phone,
  // DaisyUI icons via classes CSS
} from "lucide-react";

// React Icons
import {
  FaHome,
  FaUser,
  FaEnvelope,
  FaCog,
  FaHeart,
  FaStar,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
} from "react-icons/fa";

import {
  MdEmail,
  MdHome,
  MdPerson,
  MdSettings,
  MdFavorite,
  MdBusinessCenter,
  MdLocalMovies,
  MdRestaurant,
} from "react-icons/md";

import {
  IoHome,
  IoMail,
  IoPerson,
  IoSettings,
  IoHeart,
  IoTicket,
  IoCard,
  IoGift,
} from "react-icons/io5";

// Lineicons React - temporairement désactivé
// import LineIcon from "react-lineicons";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IconShowcaseProps {
  showAll?: boolean;
}

export function IconShowcase({ showAll = false }: IconShowcaseProps) {
  const iconSets = [
    {
      name: "Lucide React",
      description: "Icônes simples et élégantes (actuellement utilisé)",
      package: "lucide-react",
      icons: [
        { component: <Home className="w-6 h-6" />, name: "Home" },
        { component: <Mail className="w-6 h-6" />, name: "Mail" },
        { component: <User className="w-6 h-6" />, name: "User" },
        { component: <Settings className="w-6 h-6" />, name: "Settings" },
        { component: <Heart className="w-6 h-6" />, name: "Heart" },
        { component: <Star className="w-6 h-6" />, name: "Star" },
        { component: <Calendar className="w-6 h-6" />, name: "Calendar" },
        { component: <Phone className="w-6 h-6" />, name: "Phone" },
      ],
      status: "active",
    },
    {
      name: "React Icons (Font Awesome)",
      description: "Collection d'icônes Font Awesome populaires",
      package: "react-icons/fa",
      icons: [
        { component: <FaHome className="w-6 h-6" />, name: "FaHome" },
        { component: <FaUser className="w-6 h-6" />, name: "FaUser" },
        { component: <FaEnvelope className="w-6 h-6" />, name: "FaEnvelope" },
        { component: <FaCog className="w-6 h-6" />, name: "FaCog" },
        { component: <FaHeart className="w-6 h-6" />, name: "FaHeart" },
        { component: <FaStar className="w-6 h-6" />, name: "FaStar" },
        {
          component: <FaFacebook className="w-6 h-6 text-blue-600" />,
          name: "FaFacebook",
        },
        {
          component: <FaTwitter className="w-6 h-6 text-blue-400" />,
          name: "FaTwitter",
        },
      ],
      status: "new",
    },
    {
      name: "React Icons (Material Design)",
      description: "Icônes Material Design de Google",
      package: "react-icons/md",
      icons: [
        { component: <MdHome className="w-6 h-6" />, name: "MdHome" },
        { component: <MdEmail className="w-6 h-6" />, name: "MdEmail" },
        { component: <MdPerson className="w-6 h-6" />, name: "MdPerson" },
        { component: <MdSettings className="w-6 h-6" />, name: "MdSettings" },
        {
          component: <MdFavorite className="w-6 h-6 text-red-500" />,
          name: "MdFavorite",
        },
        {
          component: <MdBusinessCenter className="w-6 h-6" />,
          name: "MdBusinessCenter",
        },
        {
          component: <MdLocalMovies className="w-6 h-6" />,
          name: "MdLocalMovies",
        },
        {
          component: <MdRestaurant className="w-6 h-6" />,
          name: "MdRestaurant",
        },
      ],
      status: "new",
    },
    {
      name: "React Icons (Ionicons)",
      description: "Icônes modernes pour applications web et mobiles",
      package: "react-icons/io5",
      icons: [
        { component: <IoHome className="w-6 h-6" />, name: "IoHome" },
        { component: <IoMail className="w-6 h-6" />, name: "IoMail" },
        { component: <IoPerson className="w-6 h-6" />, name: "IoPerson" },
        { component: <IoSettings className="w-6 h-6" />, name: "IoSettings" },
        {
          component: <IoHeart className="w-6 h-6 text-red-500" />,
          name: "IoHeart",
        },
        {
          component: <IoTicket className="w-6 h-6 text-blue-500" />,
          name: "IoTicket",
        },
        { component: <IoCard className="w-6 h-6" />, name: "IoCard" },
        {
          component: <IoGift className="w-6 h-6 text-green-500" />,
          name: "IoGift",
        },
      ],
      status: "new",
    },
    // Temporairement désactivé - problème de types avec react-lineicons
    // {
    //   name: "Lineicons",
    //   description: "Collection d'icônes ligne essentielles",
    //   package: "react-lineicons",
    //   icons: [
    //     {
    //       component: <LineIcon name="home" style={{ fontSize: "24px" }} />,
    //       name: "home",
    //     },
    //     {
    //       component: <LineIcon name="envelope" style={{ fontSize: "24px" }} />,
    //       name: "envelope",
    //     },
    //     {
    //       component: <LineIcon name="user" style={{ fontSize: "24px" }} />,
    //       name: "user",
    //     },
    //     {
    //       component: <LineIcon name="cog" style={{ fontSize: "24px" }} />,
    //       name: "cog",
    //     },
    //     {
    //       component: (
    //         <LineIcon
    //           name="heart"
    //           style={{ fontSize: "24px", color: "#ef4444" }}
    //         />
    //       ),
    //       name: "heart",
    //     },
    //     {
    //       component: (
    //         <LineIcon
    //           name="star"
    //           style={{ fontSize: "24px", color: "#fbbf24" }}
    //         />
    //       ),
    //       name: "star",
    //     },
    //     {
    //       component: (
    //         <LineIcon
    //           name="ticket"
    //           style={{ fontSize: "24px", color: "#3b82f6" }}
    //         />
    //       ),
    //       name: "ticket",
    //     },
    //     {
    //       component: <LineIcon name="calendar" style={{ fontSize: "24px" }} />,
    //       name: "calendar",
    //     },
    //   ],
    //   status: "new",
    // },
  ];

  const cssExamples = [
    {
      name: "DaisyUI Icons",
      description: "Classes CSS pour icônes intégrées",
      examples: [
        {
          class: "btn btn-circle btn-primary",
          content: "🏠",
          name: "Home Button",
        },
        {
          class: "btn btn-circle btn-secondary",
          content: "✉️",
          name: "Mail Button",
        },
        {
          class: "btn btn-circle btn-accent",
          content: "👤",
          name: "User Button",
        },
        {
          class: "btn btn-circle btn-info",
          content: "⚙️",
          name: "Settings Button",
        },
      ],
    },
  ];

  const displaySets = showAll ? iconSets : iconSets.slice(0, 2);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Bibliothèques d&apos;Icônes Disponibles
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          L&apos;application CSE dispose maintenant de plusieurs bibliothèques
          d&apos;icônes pour enrichir l&apos;interface utilisateur selon les
          spécifications du PRD v2.1
        </p>
      </div>

      {/* Bibliothèques d&apos;icônes React */}
      <div className="grid gap-6">
        {displaySets.map((iconSet) => (
          <Card key={iconSet.name} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {iconSet.name}
                    <Badge
                      variant={
                        iconSet.status === "active" ? "default" : "secondary"
                      }
                    >
                      {iconSet.status === "active" ? "Actuel" : "Nouveau"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{iconSet.description}</CardDescription>
                </div>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {iconSet.package}
                </code>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {iconSet.icons.map((icon, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-gray-700">{icon.component}</div>
                    <span className="text-xs text-gray-500 text-center font-mono">
                      {icon.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DaisyUI CSS Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            DaisyUI CSS Components
            <Badge variant="secondary">Nouveau</Badge>
          </CardTitle>
          <CardDescription>
            Composants CSS avec icônes intégrées utilisant DaisyUI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cssExamples[0].examples.map((example, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className={example.class}>{example.content}</div>
                <span className="text-xs text-gray-500 text-center">
                  {example.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600">
                Bibliothèques d&apos;icônes
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">200+</div>
              <div className="text-sm text-gray-600">Icônes disponibles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">Styles différents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">Compatible TypeScript</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!showAll && (
        <div className="text-center">
          <p className="text-gray-500">
            {iconSets.length - displaySets.length} autres bibliothèques
            disponibles...
          </p>
        </div>
      )}
    </div>
  );
}

// Composant utilitaire pour choisir une icône
export function IconPicker({
  onSelect,
  selectedIcon,
  compact = false,
}: {
  onSelect?: (iconName: string, library: string) => void;
  selectedIcon?: string;
  compact?: boolean;
}) {
  const quickIcons = [
    {
      component: <Home className="w-5 h-5" />,
      name: "home",
      library: "lucide",
    },
    {
      component: <Mail className="w-5 h-5" />,
      name: "mail",
      library: "lucide",
    },
    {
      component: <User className="w-5 h-5" />,
      name: "user",
      library: "lucide",
    },
    {
      component: <Settings className="w-5 h-5" />,
      name: "settings",
      library: "lucide",
    },
    {
      component: <FaHeart className="w-5 h-5" />,
      name: "heart",
      library: "fa",
    },
    { component: <FaStar className="w-5 h-5" />, name: "star", library: "fa" },
    {
      component: <IoTicket className="w-5 h-5" />,
      name: "ticket",
      library: "io",
    },
    {
      component: <MdBusinessCenter className="w-5 h-5" />,
      name: "business",
      library: "md",
    },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {quickIcons.map((icon, index) => (
          <button
            key={index}
            onClick={() => onSelect?.(icon.name, icon.library)}
            className={`p-2 rounded-lg border transition-colors ${
              selectedIcon === `${icon.library}:${icon.name}`
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            title={`${icon.library}:${icon.name}`}
          >
            {icon.component}
          </button>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélectionner une icône</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {quickIcons.map((icon, index) => (
            <button
              key={index}
              onClick={() => onSelect?.(icon.name, icon.library)}
              className={`p-3 rounded-lg border transition-colors flex flex-col items-center space-y-1 ${
                selectedIcon === `${icon.library}:${icon.name}`
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {icon.component}
              <span className="text-xs">{icon.name}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
