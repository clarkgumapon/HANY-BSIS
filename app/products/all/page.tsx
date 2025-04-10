"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, ShoppingCart, Check, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Header from "@/components/header"
import { api } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { Product } from "@/lib/api"

export default function AllProductsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [addedToCart, setAddedToCart] = useState<Record<number, boolean>>({})
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setError(null);
      try {
        const productsData = await api.getProducts()
        setProducts(productsData)
      } catch (error) {
        console.error('Failed to fetch products:', error)
        setError(error instanceof Error 
          ? error.message 
          : 'Failed to load products. Please try again later.');
          
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load products",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [toast])

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      setSelectedProduct(product)
      setLoginDialogOpen(true)
      return
    }

    try {
      // Call the API to add the item to cart
      await api.addToCart(product.id, 1)

      // Update local state to show added status
      setAddedToCart((prev) => ({
        ...prev,
        [product.id]: true,
      }))

      // Show toast notification
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      })

      // Dispatch custom event for cart update
      const event = new CustomEvent("cart:updated")
      window.dispatchEvent(event)

      // Reset the button after 2 seconds
      setTimeout(() => {
        setAddedToCart((prev) => ({
          ...prev,
          [product.id]: false,
        }))
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
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
      <Header showBackButton backUrl="/" backLabel="Back to home" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">Browse our complete collection of secondhand items</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-64 rounded-md bg-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Error Loading Products</h3>
            <p className="text-center text-muted-foreground mb-6 max-w-md">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 hover:bg-green-100">
                      {product.category}
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
                  <Button
                    variant={addedToCart[product.id] ? "outline" : "default"}
                    size="sm"
                    className="w-full transition-all duration-200 hover:shadow-md"
                    onClick={() => handleAddToCart(product)}
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
                </CardFooter>
              </Card>
            ))}
          </div>
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

