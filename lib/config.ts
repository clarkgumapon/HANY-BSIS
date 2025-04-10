// API and Backend URLs
export const API_BASE_URL = 'http://localhost:8000'

// Image URLs and Storage
export const IMAGE_URLS = {
  // Product images should be stored in the public/images/products directory
  PRODUCT_IMAGES_PATH: '/images/products',
  
  // Default images
  DEFAULT_PRODUCT_IMAGE: '/placeholder.svg',
  
  // External image URLs - replace these with your actual image hosting URLs
  PRODUCT_IMAGES: {
    'vintage-denim': 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7',
    'nike-sneakers': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    'leather-bag': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
    'champion-hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    'adidas-pants': 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d',
    'yankees-cap': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b',
    'flannel-shirt': 'https://images.unsplash.com/photo-1589310243389-96a5483213a8',
    'vans-shoes': 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77',
  },
  
  // Image quality and sizing
  IMAGE_QUALITY_PARAMS: '?q=80&w=800&auto=format&fit=crop',
}

// Cache settings
export const CACHE_CONFIG = {
  IMAGE_CACHE_KEY: 'cached_images',
  MAX_CACHE_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
}

// Product display settings
export const PRODUCT_CONFIG = {
  DEFAULT_RATING: 4.5,
  ITEMS_PER_PAGE: 12,
  FEATURED_ITEMS_COUNT: 8,
} 