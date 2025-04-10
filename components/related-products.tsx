"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, ShoppingCart, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock data for related products
const relatedProducts = [
  {
    id: 5,
    name: "Vintage Leather Jacket",
    price: 3499.99,
    condition: "Good",
    rating: 4.6,
    image: "/placeholder.svg?height=300&width=300",
    category: "Outerwear",
    description: "Classic leather jacket with minimal wear. Perfect for fall weather.",
  },
  {
    id: 6,
    name: "Levi's 501 Jeans",
    price: 1250.0,
    condition: "Like New",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=300",
    category: "Bottoms",
    description: "Iconic Levi's 501 jeans in dark wash. Barely worn, excellent condition.",
  },
  {
    id: 7,
    name: "Corduroy Jacket",
    price: 1800.0,
    condition: "Excellent",
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=300",
    category: "Outerwear",
    description: "Warm corduroy jacket in camel color. Perfect for layering in colder weather.",
  },
  {
    id: 8,
    name: "Wool Beanie",
    price: 450.0,
    condition: "Like New",
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=300",
    category: "Headwear",
    description: "Soft wool beanie in charcoal gray. Worn only a few times.",
  },
]

export default function RelatedProducts() {
  const { toast } = useToast()
  const [addedToCart, setAddedToCart] = useState<Record<number, boolean>>({})

  const handleAddToCart = (productId: number, productName: string) => {
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

    // Reset the button after 2 seconds
    setTimeout(() => {
      setAddedToCart((prev) => ({
        ...prev,
        [productId]: false,
      }))
    }, 2000)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
        <Card key={product.id} className="h-full overflow-hidden hover:shadow-md transition-shadow flex flex-col">
          <Link href={`/products/${product.id}`} className="flex-grow">
            <div className="relative aspect-square">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 hover:bg-green-100">
                {product.condition}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-base mb-1 line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">{product.rating}</span>
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
  )
}

