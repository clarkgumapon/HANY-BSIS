"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingBag, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CartItemsProps {
  setIsOpen: (open: boolean) => void
}

export default function CartItems({ setIsOpen }: CartItemsProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [isRemoving, setIsRemoving] = useState<number | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const fetchCartItems = async () => {
    try {
      const items = await api.getCart()
      setCartItems(items)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cart items",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (id: number, change: number) => {
    try {
      setIsUpdating(id)
      const currentItem = cartItems.find(item => item.id === id)
      if (!currentItem) return

      const newQuantity = Math.max(1, currentItem.quantity + change)
      await api.updateCartItem(id, newQuantity)
      
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )

      // Dispatch cart update event
      const event = new CustomEvent("cart:updated")
      window.dispatchEvent(event)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const removeItem = async (id: number) => {
    try {
      setIsRemoving(id)
      // First check if the item exists in our local state
      const itemExists = cartItems.find(item => item.id === id)
      if (!itemExists) {
        toast({
          title: "Error",
          description: "Item not found in cart",
          variant: "destructive",
        })
        return
      }

      await api.removeFromCart(id)
      setCartItems(prev => prev.filter(item => item.id !== id))
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })

      // Dispatch cart update event
      const event = new CustomEvent("cart:updated")
      window.dispatchEvent(event)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(null)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const calculateShipping = () => {
    return cartItems.length > 0 ? 249.99 : 0
  }

  const calculateServiceFee = () => {
    return cartItems.length > 0 ? 50.0 : 0
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateServiceFee()
  }

  const handleLogin = () => {
    setIsOpen(false)
    router.push(
      `/auth/login?returnUrl=${encodeURIComponent("/checkout")}`
    )
  }

  const handleRegister = () => {
    setIsOpen(false)
    router.push(
      `/auth/register?returnUrl=${encodeURIComponent("/checkout")}`
    )
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true)
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      // Instead of passing cart items through URL, we'll rely on the backend session
      setIsOpen(false)
      // Navigate to checkout page
      router.push('/checkout')
    } catch (error: any) {
      console.error('Failed to process checkout:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to proceed to checkout. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading cart...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg mb-2">Please log in</h3>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your cart</p>
        <div className="flex gap-4">
          <Button onClick={handleLogin}>Login</Button>
          <Button variant="outline" onClick={handleRegister}>Register</Button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
        <Button onClick={() => setIsOpen(false)} asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto py-6">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                <Link href={`/products/${item.product.id}`} className="relative h-24 w-24 rounded-md overflow-hidden border flex-shrink-0">
                  <Image 
                    src={item.product.image_url || "/placeholder.svg"} 
                    alt={item.product.name} 
                    fill 
                    className="object-cover"
                    onError={(e: any) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                </Link>
                <div className="flex-1">
                  <Link href={`/products/${item.product.id}`}>
                    <h4 className="font-medium hover:text-primary transition-colors">{item.product.name}</h4>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-medium">₱{item.product.price.toFixed(2)}</p>
                    <div className="flex items-center text-xs text-green-600">
                      <Shield className="h-3 w-3 mr-1" />
                      <span>HanySecurePay</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={isUpdating === item.id}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={isUpdating === item.id}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    {isUpdating === item.id && (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent ml-2"></div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(item.id)}
                  disabled={isRemoving === item.id}
                >
                  {isRemoving === item.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t bg-white p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₱{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>₱{calculateShipping().toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Service Fee</span>
              <span>₱{calculateServiceFee().toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>₱{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2">Processing...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Secure checkout powered by HanySecurePay
          </p>
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to proceed with checkout.
            </DialogDescription>
          </DialogHeader>

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

