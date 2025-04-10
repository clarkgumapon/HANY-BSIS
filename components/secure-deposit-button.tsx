"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Shield } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface SecureDepositButtonProps {
  productId?: number
  onClick?: () => void
}

export default function SecureDepositButton({ productId, onClick }: SecureDepositButtonProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [showDialog, setShowDialog] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const handleSecureDeposit = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (!isAuthenticated) {
      setShowLoginDialog(true)
      return
    }

    setShowDialog(true)
  }

  const proceedToCheckout = () => {
    if (productId) {
      router.push(`/checkout?product=${productId}`)
    }
  }

  const handleLogin = () => {
    setShowLoginDialog(false)
    // Store the return URL to redirect back after login
    const returnUrl = window.location.pathname
    router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  const handleRegister = () => {
    setShowLoginDialog(false)
    // Store the return URL to redirect back after registration
    const returnUrl = window.location.pathname
    router.push(`/auth/register?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  return (
    <>
      <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base" onClick={handleSecureDeposit}>
        Secure with Deposit
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>HanySecurePay Protection</DialogTitle>
            <DialogDescription>
              You're about to make a secure deposit for this item. Your payment will be held safely until you confirm
              receipt and satisfaction.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800 mb-1">How HanySecurePay Works</h3>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-green-700">
                    <li>You deposit the full amount now</li>
                    <li>We hold your payment securely</li>
                    <li>Seller ships the item to you</li>
                    <li>You confirm receipt and satisfaction</li>
                    <li>We release the payment to the seller</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              If the item doesn't match the description or you encounter any issues, you can open a dispute within 48
              hours of delivery, and we'll help resolve the matter.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={proceedToCheckout}>
              Proceed to Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>You need to be logged in to make a secure deposit and purchase items.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800 mb-1">HanySecurePay Protection</h3>
                  <p className="text-sm text-green-700">
                    Create an account or log in to use our secure payment system that protects both buyers and sellers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogin}>Login</Button>
            <Button variant="secondary" onClick={handleRegister}>
              Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

