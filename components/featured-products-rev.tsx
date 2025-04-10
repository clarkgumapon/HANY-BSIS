"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, ShoppingCart, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { cacheImage, getLocalImageUrl } from "@/lib/utils"

export default function FeaturedProductsRev() {
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [addedToCart, setAddedToCart] = useState<Record<number, boolean>>({})
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await api.getProducts()
        setProducts(allProducts)
      } catch (error) {
        console.error('Failed to fetch products:', error)
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [toast])

  // Add image caching effect
  useEffect(() => {
    const cacheImages = async () => {
      const newImageUrls: Record<string, string> = {}
      
      for (const product of products) {
        if (product.image_url) {
          // First check if we have a cached version
          const cachedUrl = getLocalImageUrl(product.image_url)
          if (cachedUrl) {
            newImageUrls[product.image_url] = cachedUrl
          } else {
            // If not cached, download and cache the image
            const localUrl = await cacheImage(product.image_url)
            newImageUrls[product.image_url] = localUrl
          }
        }
      }
      
      setImageUrls(newImageUrls)
    }

    if (products.length > 0) {
      cacheImages()
    }
  }, [products])

  const handleAddToCart = async (productId: number, productName: string) => {
    if (!isAuthenticated) {
      const product = products.find((p) => p.id === productId)
      setSelectedProduct(product)
      setLoginDialogOpen(true)
      return
    }

    try {
      // Add to cart using the API
      await api.addToCart(productId, 1)

      // Update local state to show added status
      setAddedToCart((prev) => ({
        ...prev,
        [productId]: true,
      }))

      // Show toast notification
      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart.`,
        duration: 3000,
      })

      // Dispatch custom event for cart update
      const event = new CustomEvent("cart:updated")
      window.dispatchEvent(event)

      // Reset the button after 2 seconds
      setTimeout(() => {
        setAddedToCart((prev) => ({
          ...prev,
          [productId]: false,
        }))
      }, 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogin = () => {
    setLoginDialogOpen(false)
    // Store the return URL to redirect back after login
    const returnUrl = window.location.pathname
    router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  const handleRegister = () => {
    setLoginDialogOpen(false)
    // Store the return URL to redirect back after registration
    const returnUrl = window.location.pathname
    router.push(`/auth/register?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="h-full overflow-hidden">
              <div className="relative aspect-square bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-4 w-3/4 bg-muted animate-pulse mb-2" />
                <div className="h-3 w-1/4 bg-muted animate-pulse mb-2" />
                <div className="h-4 w-1/2 bg-muted animate-pulse" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="h-8 w-full bg-muted animate-pulse" />
              </CardFooter>
            </Card>
          ))
        ) : (
          products.map((product) => (
            <Card
              key={product.id}
              className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col transform hover:-translate-y-1 hover:border-green-200"
            >
              <Link href={`/products/${product.id}`} className="flex-grow">
                <div className="relative aspect-square overflow-hidden group">
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={product.id <= 4}
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e: any) => {
                      console.error("Image failed to load:", product.image_url);
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                  <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 hover:bg-green-100">
                    New Arrival
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-base mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-muted-foreground">4.5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">₱{product.price.toFixed(2)}</span>
                    <div className="flex items-center text-xs text-green-600">
                      <Shield className="h-3 w-3 mr-1" />
                      <span>HanySecurePay</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
              <CardFooter className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={addedToCart[product.id] ? "outline" : "secondary"}
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddToCart(product.id, product.name)}
                  >
                    {addedToCart[product.id] ? (
                      <>
                        <Check className="h-4 w-4 mr-2" /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      if (!isAuthenticated) {
                        setLoginDialogOpen(true)
                        return
                      }
                      router.push(`/checkout?product=${product.id}&buyNow=true`)
                    }}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to add items to your cart and make purchases.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="flex items-start gap-3 py-4">
              <div className="relative w-16 h-16 rounded border overflow-hidden flex-shrink-0">
                <Image
                  src={selectedProduct.image_url || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                  onError={(e: any) => {
                    console.error("Dialog image failed to load:", selectedProduct.image_url);
                    e.target.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div>
                <h4 className="font-medium">{selectedProduct.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                <p className="text-sm font-medium">₱{selectedProduct.price.toFixed(2)}</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button className="w-full sm:w-auto" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleRegister}>
              Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

