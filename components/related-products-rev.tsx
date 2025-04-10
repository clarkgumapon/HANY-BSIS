"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, ShoppingCart, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"
import { Product } from "@/lib/api"
import { useRouter } from "next/navigation"

interface RelatedProductsRevProps {
  category?: string
  currentProductId?: number
}

export default function RelatedProductsRev({ category, currentProductId }: RelatedProductsRevProps) {
  const { toast } = useToast()
  const [addedToCart, setAddedToCart] = useState<Record<number, boolean>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let allProducts = await api.getProducts();
        
        // Filter products by category and exclude current product
        if (category) {
          allProducts = allProducts.filter(
            (product: Product) => 
              product.category === category && 
              product.id !== currentProductId
          );
        }
        
        // Limit to 4 products
        setProducts(allProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, currentProductId]);

  const handleAddToCart = async (productId: number, productName: string) => {
    try {
      // Call the API to add the item to cart
      await api.addToCart(productId, 1);
      
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
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-md bg-gray-100 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No related products found</div>;
  }

  return (
    <div>
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
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-base mb-1 line-clamp-1">{product.name}</h3>
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
        ))}
      </div>
    </div>
  )
}

