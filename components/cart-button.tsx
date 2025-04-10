"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import CartItems from "@/components/cart-items"
import { api } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function CartButton() {
  const [cartCount, setCartCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const fetchCartCount = async () => {
    try {
      const cartItems = await api.getCart()
      const totalItems = cartItems.reduce((total: number, item: any) => total + item.quantity, 0)
      setCartCount(totalItems)
    } catch (error) {
      // Check if it's an auth error or other error
      if (error instanceof Error && error.message.includes('Authentication failed')) {
        // This will be handled by the auth provider's event listener
        console.log('Authentication issue when fetching cart count')
      } else {
        console.error('Failed to fetch cart count:', error)
      }
      setCartCount(0)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount()
    } else {
      setCartCount(0)
    }

    // Listen for custom events when items are added to cart
    const handleCartUpdate = () => {
      if (isAuthenticated) {
        fetchCartCount()
      }
    }

    window.addEventListener("cart:updated", handleCartUpdate)

    return () => {
      window.removeEventListener("cart:updated", handleCartUpdate)
    }
  }, [isAuthenticated])

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      window.location.href = `/auth/login?returnUrl=${encodeURIComponent("/checkout")}`
      setIsOpen(false)
      return
    }
    
    try {
      // Ensure we have items in cart before proceeding
      const cartItems = await api.getCart()
      if (cartItems.length === 0) {
        toast({
          title: "Cart is empty",
          description: "Please add items to your cart before checking out.",
          variant: "destructive",
        })
        return
      }
      
      setIsOpen(false)
      // Use window.location for more reliable navigation
      window.location.href = "/checkout"
    } catch (error) {
      console.error('Failed to process checkout:', error)
      toast({
        title: "Error",
        description: "Failed to proceed to checkout. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-medium text-white">
              {cartCount}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <CartItems setIsOpen={setIsOpen} />
      </SheetContent>
    </Sheet>
  )
}

