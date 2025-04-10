"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle, Shield, Star, AlertTriangle } from "lucide-react"

// Mock order data
const orderData = {
  id: "38295",
  product: {
    name: "Vintage Denim Jacket",
    price: 45.99,
    image: "/placeholder.svg?height=300&width=300",
    seller: "VintageFinds",
  },
  total: 53.48,
}

export default function ConfirmReceiptPage() {
  const params = useParams();
  const orderId = params.id as string;
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleConfirm = () => {
    setIsSubmitting(true)
    // Simulate confirmation process
    setTimeout(() => {
      setIsSubmitting(false)
      setIsConfirmed(true)
    }, 2000)
  }

  const handleComplete = () => {
    router.push("/orders/confirmation")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <Link href={`/orders/${orderId}`} className="inline-flex items-center gap-2 text-sm font-medium mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to order
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Confirm Receipt</CardTitle>
            <CardDescription>
              Please confirm that you've received your order and are satisfied with the item.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isConfirmed ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded border overflow-hidden flex-shrink-0">
                    <Image
                      src={orderData.product.image || "/placeholder.svg"}
                      alt={orderData.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{orderData.product.name}</h3>
                    <p className="text-sm text-muted-foreground">Order #{orderData.id}</p>
                    <p className="text-sm text-muted-foreground">Seller: {orderData.product.seller}</p>
                    <p className="text-sm font-medium">₱{orderData.product.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">Important Information</h3>
                      <p className="text-sm text-blue-700">
                        By confirming receipt, you're verifying that you've received the item and are satisfied with its
                        condition. This will release the payment to the seller.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Rate your experience</h3>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 cursor-pointer ${star <= rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Leave feedback (optional)</h3>
                  <Textarea
                    placeholder="Share your experience with this item and seller..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    If there are any issues with your order, please use the "Report an Issue" button instead of
                    confirming receipt.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">Receipt Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for confirming receipt of your order. The payment has been released to the seller.
                </p>

                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-left mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800 mb-1">Transaction Complete</h3>
                      <p className="text-sm text-green-700">
                        Your transaction is now complete. The payment of ₱{orderData.total.toFixed(2)} has been released
                        to the seller.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button onClick={handleComplete}>View Confirmation</Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Return to Dashboard</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          {!isConfirmed && (
            <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
              <Button
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Processing...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  </>
                ) : (
                  "Confirm Receipt"
                )}
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/disputes">Report an Issue</Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

