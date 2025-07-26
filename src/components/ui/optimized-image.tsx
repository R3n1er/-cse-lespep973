"use client";

import { Image as UnpicImage } from "@unpic/react";
import { Image } from "@unpic/react/nextjs";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  layout?: "constrained" | "fixed" | "fullWidth";
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  format?: "auto" | "webp" | "avif";
  cdn?: "vercel" | "netlify" | "supabase" | "auto";
  fallback?: string;
  loading?: "lazy" | "eager";
  objectFit?: "cover" | "contain" | "fill" | "scale-down" | "none";
  aspectRatio?: number;
  background?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  layout = "constrained",
  priority = false,
  placeholder = "empty",
  blurDataURL,
  sizes,
  quality = 80,
  format = "auto",
  cdn = "auto",
  fallback,
  loading = "lazy",
  objectFit = "cover",
  aspectRatio,
  background,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // Si erreur et fallback disponible, utiliser le fallback
  if (imageError && fallback) {
    return (
      <OptimizedImage
        {...props}
        src={fallback}
        alt={`${alt} (image de secours)`}
        width={width}
        height={height}
        className={className}
        layout={layout}
        priority={priority}
        onError={() => {}} // Éviter la récursion
      />
    );
  }

  // Placeholder d'erreur si pas de fallback
  if (imageError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-200 text-gray-400",
          className
        )}
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "auto",
          aspectRatio:
            aspectRatio || (width && height ? width / height : undefined),
        }}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    width,
    height,
    layout,
    priority,
    loading: priority ? ("eager" as const) : loading,
    className: cn(
      "transition-opacity duration-300",
      !imageLoaded && "opacity-0",
      imageLoaded && "opacity-100",
      className
    ),
    style: {
      objectFit,
      background,
    },
    onLoad: handleLoad,
    onError: handleError,
    ...(aspectRatio && { aspectRatio }),
    ...(sizes && { sizes }),
    ...(background && { background }),
    ...props,
  };

  // Utiliser le composant Unpic approprié selon le CDN
  if (cdn === "vercel" || cdn === "netlify") {
    return <Image {...imageProps} cdn={cdn} />;
  }

  // Utiliser le composant Unpic standard pour auto-détection
  return <UnpicImage {...imageProps} />;
}

// Composant spécialisé pour les avatars
export function AvatarImage({
  src,
  alt,
  size = 40,
  fallbackInitials,
  className,
  ...props
}: {
  src?: string;
  alt: string;
  size?: number;
  fallbackInitials?: string;
  className?: string;
} & Omit<OptimizedImageProps, "width" | "height" | "layout">) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-300 text-gray-600 font-semibold rounded-full",
          className
        )}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.4,
        }}
      >
        {fallbackInitials || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      layout="fixed"
      className={cn("rounded-full", className)}
      objectFit="cover"
      {...props}
    />
  );
}

// Composant spécialisé pour les héros
export function HeroImage({
  src,
  alt,
  className,
  overlay = false,
  overlayOpacity = 0.4,
  children,
  ...props
}: OptimizedImageProps & {
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        layout="fullWidth"
        priority={true}
        className="w-full h-full"
        objectFit="cover"
        {...props}
      />
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

// Composant pour les galeries d'images
export function GalleryImage({
  src,
  alt,
  className,
  onImageClick,
  ...props
}: OptimizedImageProps & {
  onImageClick?: (src: string) => void;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg cursor-pointer group",
        className
      )}
      onClick={() => onImageClick?.(src)}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        layout="constrained"
        className="transition-transform duration-300 group-hover:scale-105"
        objectFit="cover"
        {...props}
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </div>
  );
}
