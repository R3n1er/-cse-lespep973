import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine les classes CSS avec clsx et tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un prix en euros
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

/**
 * Formate une date en français
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateObj);
}

/**
 * Vérifie si un utilisateur a un rôle spécifique
 */
export function hasRole(
  userRole: string | undefined,
  requiredRoles: string[]
): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

/**
 * Génère un slug à partir d'un texte
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

/**
 * Tronque un texte à une longueur donnée
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Valide un numéro de téléphone français
 */
export function isValidPhoneNumber(phone: string): boolean {
  const regex = /^(\+33|0)[1-9](\d{2}){4}$/;
  return regex.test(phone);
}

/**
 * Formate un numéro de téléphone français
 */
export function formatPhoneNumber(phone: string): string {
  // Supprime tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, "");

  // Si le numéro commence par 0, le convertir au format international
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return (
      "+33 " +
      cleaned.substring(1, 2) +
      " " +
      cleaned.substring(2, 4) +
      " " +
      cleaned.substring(4, 6) +
      " " +
      cleaned.substring(6, 8) +
      " " +
      cleaned.substring(8, 10)
    );
  }

  // Si le numéro commence par 33, le formater
  if (cleaned.startsWith("33") && cleaned.length === 11) {
    return (
      "+33 " +
      cleaned.substring(2, 3) +
      " " +
      cleaned.substring(3, 5) +
      " " +
      cleaned.substring(5, 7) +
      " " +
      cleaned.substring(7, 9) +
      " " +
      cleaned.substring(9, 11)
    );
  }

  // Sinon, retourner le numéro tel quel
  return phone;
}
