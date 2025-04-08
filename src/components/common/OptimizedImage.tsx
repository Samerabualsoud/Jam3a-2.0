/**
 * Image optimization utilities for Jam3a-2.0
 * Implements lazy loading and optimization for images
 */

import React, { useState, useEffect, useRef } from 'react';

// Interface for optimized image props
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  placeholderSrc?: string;
  blurEffect?: boolean;
  lazyLoad?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage component with lazy loading and blur effect
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  placeholderSrc,
  blurEffect = true,
  lazyLoad = true,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Default placeholder if none provided
  const defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=';
  
  // Use IntersectionObserver for lazy loading
  useEffect(() => {
    if (!lazyLoad || !imgRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = src;
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px', // Start loading when image is 200px from viewport
      threshold: 0.01
    });
    
    observer.observe(imgRef.current);
    
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, lazyLoad]);
  
  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Handle image error
  const handleError = () => {
    setIsError(true);
    if (onError) onError();
  };
  
  // Determine image source based on lazy loading
  const imageSrc = lazyLoad ? (isLoaded ? src : placeholderSrc || defaultPlaceholder) : src;
  
  return (
    <div 
      className="relative overflow-hidden"
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
    >
      {/* Main image */}
      <img
        ref={imgRef}
        src={lazyLoad ? (placeholderSrc || defaultPlaceholder) : src}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${isError ? 'hidden' : ''}
        `}
        {...props}
      />
      
      {/* Placeholder with blur effect */}
      {!isLoaded && blurEffect && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ 
            backgroundImage: `url(${placeholderSrc || defaultPlaceholder})`,
            backgroundSize: 'cover',
            filter: 'blur(10px)',
            transform: 'scale(1.1)'
          }}
        />
      )}
      
      {/* Error fallback */}
      {isError && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
          <span>Image not available</span>
        </div>
      )}
    </div>
  );
};

/**
 * Generate responsive image srcset
 * @param baseSrc - Base image URL
 * @param widths - Array of widths for srcset
 * @param format - Image format (webp, jpg, etc.)
 * @returns srcset string
 */
export const generateSrcSet = (
  baseSrc: string,
  widths: number[] = [320, 640, 960, 1280, 1920],
  format: string = 'webp'
): string => {
  // If baseSrc is a data URL or SVG, return as is
  if (baseSrc.startsWith('data:') || baseSrc.endsWith('.svg')) {
    return baseSrc;
  }
  
  // Parse base URL
  const url = new URL(baseSrc, window.location.origin);
  const pathParts = url.pathname.split('.');
  const extension = pathParts.pop() || format;
  const basePath = pathParts.join('.');
  
  // Generate srcset
  return widths
    .map(width => {
      // For cloud image services like Cloudinary or ImgBB
      if (baseSrc.includes('cloudinary.com')) {
        return `${basePath.replace('/upload/', `/upload/w_${width}/`)}.${extension} ${width}w`;
      } else if (baseSrc.includes('imgbb.com')) {
        return `${basePath}_${width}.${extension} ${width}w`;
      } else {
        // Generic approach - append width to filename
        return `${basePath}_${width}.${extension} ${width}w`;
      }
    })
    .join(', ');
};

/**
 * Create a low-quality image placeholder
 * @param src - Original image URL
 * @param width - Placeholder width
 * @returns Placeholder image URL
 */
export const createPlaceholder = (src: string, width: number = 20): string => {
  // If src is a data URL or SVG, return as is
  if (src.startsWith('data:') || src.endsWith('.svg')) {
    return src;
  }
  
  // Parse URL
  const url = new URL(src, window.location.origin);
  const pathParts = url.pathname.split('.');
  const extension = pathParts.pop() || 'jpg';
  const basePath = pathParts.join('.');
  
  // Generate placeholder URL
  if (src.includes('cloudinary.com')) {
    return `${basePath.replace('/upload/', `/upload/w_${width},e_blur:100/`)}.${extension}`;
  } else if (src.includes('imgbb.com')) {
    return `${basePath}_${width}.${extension}`;
  } else {
    // Generic approach - append width to filename
    return `${basePath}_${width}.${extension}`;
  }
};

export default {
  OptimizedImage,
  generateSrcSet,
  createPlaceholder
};
