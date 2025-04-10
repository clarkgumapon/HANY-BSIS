"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, ShoppingCart, Check, ArrowLeft, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { api } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

// Import all product data from different components
import { products as featuredProducts } from "@/data/products"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const [addedToCart, setAddedToCart] = useState<Record<number, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  useEffect(() => {
    const searchProducts = async () => {
      setIsLoading(true)
      try {
        const allProducts = await api.getProducts()
        if (query) {
          const lowerCaseQuery = query.toLowerCase()
          const results = allProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(lowerCaseQuery) ||
              product.description?.toLowerCase().includes(lowerCaseQuery) ||
              product.category?.toLowerCase().includes(lowerCaseQuery)
          )
          setSearchResults(results)
        } else {
          setSearchResults([])
        }
      } catch (error) {
        console.error('Failed to search products:', error)
        toast({
          title: "Error",
          description: "Failed to load search results. Please try again.",
          variant: "destructive",
        })
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }

    searchProducts()
  }, [query, toast])

  const handleAddToCart = async (productId: number, productName: string) => {
    if (!isAuthenticated) {
      const product = searchResults.find((p) => p.id === productId)
      setSelectedProduct(product)
      setLoginDialogOpen(true)
      return
    }

    try {
      await api.addToCart(productId, 1)
      
      setAddedToCart((prev) => ({
        ...prev,
        [productId]: true,
      }))

      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart.`,
        duration: 3000,
      })

      const event = new CustomEvent("cart:updated")
      window.dispatchEvent(event)

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
    const returnUrl = window.location.pathname + window.location.search
    router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  const handleRegister = () => {
    setLoginDialogOpen(false)
    const returnUrl = window.location.pathname + window.location.search
    router.push(`/auth/register?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        {query && <p className="text-muted-foreground">Showing results for "{query}"</p>}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <Card key={product.id} className="h-full overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <Link href={`/products/${product.id}`} className="flex-grow">
                <div className="relative aspect-square">
                  <Image 
                    src={product.image_url || "/placeholder.svg"} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                    onError={(e: any) => {
                      e.target.src = "/placeholder.svg"
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
                <Button
                  variant={addedToCart[product.id] ? "outline" : "default"}
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
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any products matching "{query}". Try using different keywords or browse our categories.
          </p>
          <Button asChild>
            <Link href="/">Browse All Products</Link>
          </Button>
        </div>
      )}

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
                <p className="text-sm text-muted-foreground">New Arrival</p>
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
    </div>
  )
}

