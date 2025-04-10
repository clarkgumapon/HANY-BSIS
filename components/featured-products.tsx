"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, ShoppingCart, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock data for featured products
const products = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    price: 1299.99,
    condition: "Like New",
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=300",
    category: "Outerwear",
    description: "Classic vintage denim jacket in excellent condition. Medium wash with minimal wear.",
  },
  {
    id: 2,
    name: "Adidas Ultraboost",
    price: 2500.0,
    condition: "Good",
    rating: 4.5,
    image: "/placeholder.svg?height=300&width=300",
    category: "Footwear",
    description: "Lightly used Adidas Ultraboost running shoes, size 10. Comfortable and still in great shape.",
  },
  {
    id: 3,
    name: "Leather Crossbody Bag",
    price: 1850.5,
    condition: "Excellent",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessories",
    description: "Genuine leather crossbody bag with adjustable strap. Minimal signs of use.",
  },
  {
    id: 4,
    name: "Nike Cap",
    price: 750.0,
    condition: "Good",
    rating: 4.6,
    image: "/placeholder.svg?height=300&width=300",
    category: "Headwear",
    description: "Classic Nike cap in black. Adjustable strap for perfect fit.",
  },
]

export default function FeaturedProducts() {
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
      {products.map((product) => (
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

