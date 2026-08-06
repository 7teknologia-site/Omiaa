/**
 * Image Compression and Optimization Helper for OMIAÁ Alquimia Ancestral
 * Ensures WebP formatting, quality control, responsive sizing and lazy loading.
 */

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  quality?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Optimizes an image URL by appending WebP formatting, dimensions, and compression params
 */
export function getOptimizedImageUrl(
  url: string,
  width: number = 800,
  quality: number = 80
): string {
  if (!url) {
    return 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop';
  }

  // Handle Unsplash images
  if (url.includes('images.unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?q=${quality}&w=${width}&auto=format&fit=crop&fm=webp`;
  }

  return url;
}

/**
 * Generates a srcSet string for responsive WebP image loading
 */
export function getImageSrcSet(url: string, quality: number = 80): string {
  if (!url || !url.includes('images.unsplash.com')) {
    return '';
  }

  const baseUrl = url.split('?')[0];
  return `
    ${baseUrl}?q=${quality}&w=400&auto=format&fit=crop&fm=webp 400w,
    ${baseUrl}?q=${quality}&w=800&auto=format&fit=crop&fm=webp 800w,
    ${baseUrl}?q=${quality}&w=1200&auto=format&fit=crop&fm=webp 1200w
  `.trim();
}
