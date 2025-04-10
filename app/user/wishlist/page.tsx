"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, ShoppingCart, Heart, Trash2, Home } from "lucide-react"
import Header from "@/components/header"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { products } from "@/data/products"

export default function WishlistPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load wishlist on mount
  useEffect(() => {
    if (isAuthenticated) {
      // In a real app, this would fetch from an API
      // For now, we'll use localStorage to simulate persistence
      const wishlistIds = JSON.parse(localStorage.getItem("hanythrift_wishlist") || "[]")

      // Map IDs to actual product data
      const items = wishlistIds
        .map((id: number) => {
          return products.find((p) => p.id === id)
        })
        .filter(Boolean)

      setWishlistItems(items)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/auth/login?returnUrl=/user/wishlist")
    }
  }, [isAuthenticated, isLoading, router])

  const removeFromWishlist = (productId: number, productName: string) => {
    // Update state
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId))

    // Update localStorage
    const wishlist = JSON.parse(localStorage.getItem("hanythrift_wishlist") || "[]")
    const updatedWishlist = wishlist.filter((id: number) => id !== productId)
    localStorage.setItem("hanythrift_wishlist", JSON.stringify(updatedWishlist))

    // Show toast
    toast({
      title: "Removed from wishlist",
      description: `${productName} has been removed from your wishlist.`,
      duration: 3000,
    })
  }

  const addToCart = (productId: number, productName: string) => {
    // In a real app, this would call an API to add to cart
    // For now, just show a toast
    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart.`,
      duration: 3000,
    })

    // Dispatch custom event for cart update
    const event = new CustomEvent("cart:updated")
    window.dispatchEvent(event)
  }

  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect handled by useEffect

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton backUrl="/dashboard" backLabel="Back to dashboard" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            <Home className="h-4 w-4 inline mr-1" />
            <span>Home</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm">Wishlist</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <span className="text-sm text-muted-foreground">{wishlistItems.length} items</span>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{item.condition}</Badge>
                            <div className="flex items-center text-amber-500">
                              <Star className="h-4 w-4 fill-amber-500" />
                              <span className="ml-1 text-sm">{item.rating}</span>
                            </div>
                          </div>
                          <Link href={`/products/${item.id}`} className="hover:underline">
                            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                          </Link>
                          <p className="text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex items-center gap-2 mb-4">
                            <p className="text-lg font-bold">₱{item.price.toFixed(2)}</p>
                            <div className="flex items-center text-xs text-green-600">
                              <Shield className="h-3 w-3 mr-1" />
                              <span>HanySecurePay</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:min-w-[150px]">
                          <Button
                            className="w-full transition-all duration-200 hover:shadow-md"
                            onClick={() => addToCart(item.id, item.name)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                            onClick={() => removeFromWishlist(item.id, item.name)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you're interested in by clicking the "Add to Wishlist" button on product pages.
            </p>
            <Button asChild>
              <Link href="/">Browse Products</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

