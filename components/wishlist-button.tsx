"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface WishlistButtonProps {
  productId: number
  productName?: string
  className?: string
}

export default function WishlistButton({ productId, productName = "", className = "" }: WishlistButtonProps) {
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)

  // Check if product is in wishlist on mount
  useEffect(() => {
    if (isAuthenticated) {
      // In a real app, this would fetch from an API or local storage
      const wishlist = JSON.parse(localStorage.getItem("hanythrift_wishlist") || "[]")
      setIsInWishlist(wishlist.includes(productId))
    }
  }, [productId, isAuthenticated])

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true)
      return
    }

    // Toggle wishlist state
    setIsInWishlist((prev) => !prev)

    // In a real app, this would call an API
    // For now, we'll use localStorage to simulate persistence
    const wishlist = JSON.parse(localStorage.getItem("hanythrift_wishlist") || "[]")

    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter((id: number) => id !== productId)
      localStorage.setItem("hanythrift_wishlist", JSON.stringify(updatedWishlist))

      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist.`,
        duration: 3000,
      })
    } else {
      // Add to wishlist
      wishlist.push(productId)
      localStorage.setItem("hanythrift_wishlist", JSON.stringify(wishlist))

      toast({
        title: "Added to wishlist",
        description: `${productName} has been added to your wishlist.`,
        duration: 3000,
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
      <Button
        variant="outline"
        className={`${
          isInWishlist ? "bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100" : ""
        } ${className}`}
        onClick={handleToggleWishlist}
      >
        <Heart className={`h-5 w-5 ${isInWishlist ? "fill-pink-600" : ""}`} />
        <span className="sr-only">{isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
      </Button>

      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>You need to be logged in to add items to your wishlist.</DialogDescription>
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

