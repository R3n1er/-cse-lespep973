/**
 * Utilitaires de formatage pour l'application CSE Les PEP 973
 */

/**
 * Formate une date en français
 */
export const formatDate = (
  dateString: string | null,
  options: Intl.DateTimeFormatOptions = {}
) => {
  if (!dateString) return "";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Date(dateString).toLocaleDateString("fr-FR", defaultOptions);
};

/**
 * Formate une date avec l'heure
 */
export const formatDateTime = (dateString: string | null) => {
  return formatDate(dateString, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Calcule le temps écoulé depuis une date (ex: "il y a 2 heures")
 */
export const formatTimeAgo = (dateString: string | null): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `il y a ${years} an${years > 1 ? "s" : ""}`;
  if (months > 0) return `il y a ${months} mois`;
  if (days > 0) return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  if (hours > 0) return `il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  return "à l'instant";
};

/**
 * Tronque un texte à une longueur donnée
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Capitalise la première lettre d'une chaîne
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formate un montant en euros
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};
