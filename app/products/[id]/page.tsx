"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Shield, Truck, User, ShoppingCart, Check, AlertTriangle } from "lucide-react"
import RelatedProductsRev from "@/components/related-products-rev"
import SecureDepositButton from "@/components/secure-deposit-button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useRouter, useParams } from "next/navigation"
import Header from "@/components/header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import WishlistButton from "@/components/wishlist-button"
import { api } from "@/lib/api"
import { Product } from "@/lib/api"
import { Separator } from "@/components/ui/separator"

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [addedToCart, setAddedToCart] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setIsLoading(false);
        setError('Invalid product ID');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const productData = await api.getProduct(Number(productId));
        if (!productData) {
          setError('Product not found');
          return;
        }
        setProduct(productData);
      } catch (error: any) {
        console.error('Failed to fetch product:', error);
        setError(error instanceof Error 
          ? error.message 
          : 'Failed to load product details. Please try again later.');
          
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, toast]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true)
      return
    }

    if (!product) return

    try {
      setIsLoading(true)
      // Call the API to add the item to cart
      await api.addToCart(product.id, 1)

      // Update local state to show added status
      setAddedToCart(true)

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
        setAddedToCart(false)
      }, 2000)
    } catch (error: any) {
      console.error('Failed to add to cart:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      })
      
      // If we get an authentication error, show login dialog
      if (error.message.includes('Authentication failed')) {
        setLoginDialogOpen(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true)
      return
    }

    if (!product) return

    // Show loading state
    setIsLoading(true)

    // Redirect to checkout with this product
    setTimeout(() => {
      router.push(`/checkout?product=${product.id}&buyNow=true`)
    }, 500)
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Error Loading Product</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Button variant="outline" onClick={() => router.push('/products/all')}>
              View All Products
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/products/all')}>View All Products</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden border bg-white">
              <Image
                src={product?.image_url || "/placeholder.svg"}
                alt={product?.name || "Product image"}
                fill
                className="object-contain p-4"
                priority
              />
              <WishlistButton productId={Number(productId)} className="absolute top-4 right-4 z-10" />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-semibold mb-2">{product?.name}</h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-medium">4.5</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                      {product?.category}
                    </Badge>
                  </div>
                </div>
                <WishlistButton productId={Number(productId)} className="h-10 w-10" />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold">₱{product?.price.toFixed(2)}</span>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <Shield className="h-3.5 w-3.5 mr-1" />
                  HanySecurePay Protected
                </Badge>
              </div>

              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-muted-foreground">{product?.description}</p>
              </div>

              <div className="space-y-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <span className="text-sm text-muted-foreground block mb-1">Condition</span>
                    <p className="font-medium">{product?.condition || "Good"}</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <span className="text-sm text-muted-foreground block mb-1">Stock</span>
                    <p className="font-medium">{product?.stock} available</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                    <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Free Shipping</p>
                      <p className="text-sm text-muted-foreground">2-3 business days delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Buyer Protection</p>
                      <p className="text-sm text-muted-foreground">Get full refund if item is not as described</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                  onClick={handleAddToCart}
                  disabled={addedToCart || !product}
                >
                  {addedToCart ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <SecureDepositButton 
                  productId={product.id}
                  onClick={handleBuyNow}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold">Customer Reviews</h2>
            <div className="grid gap-6">
              {[1, 2, 3].map((review) => (
                <div key={review} className="flex gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Verified Buyer</p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted stroke-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Great product! Exactly as described and arrived quickly. The quality is excellent and the shipping was fast.
                    </p>
                    <p className="text-xs text-muted-foreground">Posted 2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-24">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full" 
                        style={{ width: rating === 4 ? '80%' : rating === 5 ? '60%' : '20%' }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {rating === 4 ? '80%' : rating === 5 ? '60%' : '20%'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">4.5</p>
                    <p className="text-sm text-muted-foreground">Overall Rating</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">89</p>
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Similar Items</h2>
            <Link href={`/category/${product.category?.toLowerCase()}`} className="text-primary hover:underline">
              View All
            </Link>
          </div>
          <RelatedProductsRev category={product.category} currentProductId={product.id} />
        </div>
      </main>

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to add items to your cart.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium mb-1">{product?.name}</h4>
              <p className="text-sm text-muted-foreground">₱{product?.price.toFixed(2)}</p>
            </div>
          </div>
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



