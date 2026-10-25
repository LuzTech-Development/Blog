/// <reference types="astro/client" />

interface Window {
  __closeLightbox?: (() => void) | null;
  __lightboxSwapBound?: boolean;
}
