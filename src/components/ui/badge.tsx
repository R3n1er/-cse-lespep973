import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Variantes spécifiques au CSE
        "cse-primary": "bg-blue-100 text-cse-primary border-blue-200",
        "cse-secondary": "bg-gray-100 text-cse-secondary border-gray-200",
        "cse-success": "bg-green-100 text-cse-success border-green-200",
        "cse-danger": "bg-red-100 text-cse-danger border-red-200",
        "cse-warning": "bg-yellow-100 text-cse-warning border-yellow-200",
        "cse-info": "bg-cyan-100 text-cse-info border-cyan-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// Composant de badge spécifique au CSE avec des variantes prédéfinies
export interface CSEBadgeProps extends BadgeProps {
  status?: "pending" | "approved" | "rejected" | "delivered" | "cancelled";
}

function CSEBadge({ className, variant, status, ...props }: CSEBadgeProps) {
  // Déterminer la variante en fonction du statut
  let statusVariant = variant;
  if (status) {
    switch (status) {
      case "pending":
        statusVariant = "cse-warning";
        break;
      case "approved":
        statusVariant = "cse-success";
        break;
      case "rejected":
        statusVariant = "cse-danger";
        break;
      case "delivered":
        statusVariant = "cse-success";
        break;
      case "cancelled":
        statusVariant = "cse-secondary";
        break;
      default:
        statusVariant = "cse-primary";
    }
  }

  return (
    <div
      className={cn(badgeVariants({ variant: statusVariant }), className)}
      {...props}
    />
  );
}

export { Badge, CSEBadge, badgeVariants };
