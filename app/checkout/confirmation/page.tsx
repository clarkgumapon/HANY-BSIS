"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, Shield, Truck, Clock, Calendar } from "lucide-react"

// Mock order data
const orderData = {
  id: "HT38295",
  date: "March 19, 2025",
  status: "Processing",
  product: {
    name: "Vintage Denim Jacket",
    price: 45.99,
    image: "/placeholder.svg?height=300&width=300",
    seller: "VintageFinds",
  },
  shipping: 4.99,
  serviceFee: 2.5,
  total: 53.48,
  estimatedDelivery: "March 23 - March 25, 2025",
}

export default function CheckoutConfirmationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading confirmation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium mb-6">
          <ArrowLeft className="h-4 w-4" />
          Go to dashboard
        </Link>

        <Card className="border-green-100">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <div className="flex items-center justify-center text-center">
              <div>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-800">Deposit Successful!</CardTitle>
                <CardDescription className="text-green-700 mt-1">
                  Your payment is now securely held by HanySecurePay
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Order #{orderData.id}</h2>
                <p className="text-sm text-muted-foreground">{orderData.date}</p>
              </div>
              <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                {orderData.status}
              </div>
            </div>

            <Separator />

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
                <p className="text-sm text-muted-foreground">Seller: {orderData.product.seller}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-medium">₱{orderData.product.price.toFixed(2)}</p>
                  <span className="text-sm text-muted-foreground">Quantity: 1</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-1">HanySecurePay Protection</h3>
                  <p className="text-sm text-blue-700">
                    Your payment of ₱{orderData.total.toFixed(2)} is being held securely. The seller will only receive
                    the funds after you confirm receipt and satisfaction with the item.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">What happens next?</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">Seller Ships Item</h4>
                  <p className="text-xs text-muted-foreground">
                    The seller has been notified and will ship your item soon
                  </p>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">Track Delivery</h4>
                  <p className="text-xs text-muted-foreground">
                    You'll receive tracking information once the item is shipped
                  </p>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">Confirm Receipt</h4>
                  <p className="text-xs text-muted-foreground">
                    After receiving the item, confirm to release payment to seller
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">Estimated Delivery</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{orderData.estimatedDelivery}</span>
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/orders/${orderData.id}`)}>
                    Track Order
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₱{orderData.product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>₱{orderData.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span>₱{orderData.serviceFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₱{orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/orders/38295">View Order Status</Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Contact Seller
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

