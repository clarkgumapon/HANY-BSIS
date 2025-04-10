import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function downloadImage(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Failed to download image:', error)
    return '/placeholder.svg'
  }
}

export function getLocalImageUrl(url: string): string | null {
  try {
    const storedImages = localStorage.getItem('cached_images')
    if (!storedImages) return null
    
    const imageMap = JSON.parse(storedImages)
    return imageMap[url] || null
  } catch (error) {
    console.error('Failed to get local image:', error)
    return null
  }
}

export async function cacheImage(url: string): Promise<string> {
  try {
    // Check if image is already cached
    const existingUrl = getLocalImageUrl(url)
    if (existingUrl) return existingUrl

    // Download and cache the image
    const localUrl = await downloadImage(url)
    const storedImages = localStorage.getItem('cached_images')
    const imageMap = storedImages ? JSON.parse(storedImages) : {}
    
    imageMap[url] = localUrl
    localStorage.setItem('cached_images', JSON.stringify(imageMap))
    
    return localUrl
  } catch (error) {
    console.error('Failed to cache image:', error)
    return url
  }
}
