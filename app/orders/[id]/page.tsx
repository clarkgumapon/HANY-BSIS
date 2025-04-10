"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Truck, Clock, MapPin, AlertTriangle, Star, Home } from "lucide-react"
import Header from "@/components/header"

// Mock order data
const orderData = {
  id: "38295",
  date: "March 19, 2025",
  status: "In Transit",
  product: {
    name: "Vintage Denim Jacket",
    price: 45.99,
    image: "/placeholder.svg?height=300&width=300",
    seller: "VintageFinds",
  },
  shipping: {
    method: "Standard Shipping (3-5 business days)",
    tracking: "HT293847561",
    address: {
      name: "John Doe",
      street: "123 Main Street",
      apt: "Apt 4B",
      city: "New York, NY 10001",
    },
  },
  timeline: [
    {
      title: "Order Placed",
      date: "March 19, 2025 at 10:23 AM",
      description: "Your deposit has been securely received.",
      completed: true,
    },
    {
      title: "Seller Notified",
      date: "March 19, 2025 at 10:24 AM",
      description: "The seller has been notified of your order.",
      completed: true,
    },
    {
      title: "Item Shipped",
      date: "March 20, 2025 at 2:15 PM",
      description: "Your item has been shipped by the seller.",
      completed: true,
    },
    {
      title: "Out for Delivery",
      date: "Expected March 22, 2025",
      description: "Your package is on its way to you.",
      completed: false,
    },
    {
      title: "Delivered",
      date: "Expected March 23, 2025",
      description: "Once delivered, please confirm receipt.",
      completed: false,
    },
  ],
  shipping_cost: 4.99,
  service_fee: 2.5,
  total: 53.48,
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const router = useRouter()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const handleConfirmReceipt = () => {
    setConfirmDialogOpen(false)
    router.push(`/orders/${orderId}/confirm`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header showBackButton backUrl="/dashboard" backLabel="Back to dashboard" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            <Home className="h-4 w-4 inline mr-1" />
            <span>Home</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm">Order #{orderId}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle>Order #{orderData.id}</CardTitle>
                  <CardDescription>Placed on {orderData.date}</CardDescription>
                </div>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{orderData.status}</Badge>
              </CardHeader>
              <CardContent className="pt-3 space-y-6">
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
                        Your payment is being held securely. Once you receive the item, you'll need to confirm receipt
                        to release the payment to the seller.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Order Timeline</h3>

                  {orderData.timeline.map((event, index) => (
                    <div
                      key={index}
                      className={`relative pl-8 pb-8 ${
                        index === orderData.timeline.length - 1
                          ? ""
                          : `border-l-2 ${event.completed ? "border-green-500" : "border-muted"}`
                      }`}
                    >
                      <div
                        className={`absolute left-[-8px] w-4 h-4 rounded-full ${event.completed ? "bg-green-500" : "bg-muted"}`}
                      ></div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        <p className="text-sm mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
                <Button className="w-full sm:w-auto" onClick={() => setConfirmDialogOpen(true)}>
                  Confirm Receipt
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  Contact Seller
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/disputes">Report an Issue</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Shipping Details</h3>
                    <p className="text-sm">{orderData.shipping.method}</p>
                    <p className="text-sm text-muted-foreground">Tracking #: {orderData.shipping.tracking}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Delivery Address</h3>
                    <p className="text-sm">
                      {orderData.shipping.address.name}
                      <br />
                      {orderData.shipping.address.street}
                      <br />
                      {orderData.shipping.address.apt}
                      <br />
                      {orderData.shipping.address.city}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₱{orderData.product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₱{orderData.shipping_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span>₱{orderData.service_fee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₱{orderData.total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800 mb-1">Delivery Status</h3>
                      <p className="text-sm text-amber-700">
                        Your package is in transit. Estimated delivery by March 23, 2025.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800 mb-1">Buyer Protection</h3>
                      <p className="text-sm text-green-700">
                        You have 48 hours after delivery to inspect the item and confirm receipt or report any issues.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Receipt</DialogTitle>
              <DialogDescription>
                By confirming receipt, you're verifying that you've received the item and are satisfied with its
                condition. This will release the payment to the seller.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded border overflow-hidden flex-shrink-0">
                  <Image
                    src={orderData.product.image || "/placeholder.svg"}
                    alt={orderData.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{orderData.product.name}</h3>
                  <p className="text-sm text-muted-foreground">Order #{orderData.id}</p>
                  <p className="text-sm font-medium">₱{orderData.product.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Rate your experience</h4>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star key={rating} className="h-6 w-6 fill-amber-400 text-amber-400 cursor-pointer" />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Leave feedback (optional)</h4>
                <Textarea placeholder="Share your experience with this item and seller..." />
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-700">
                  If there are any issues with your order, please click "Cancel" and use the "Report an Issue" button
                  instead.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmReceipt}>
                Confirm Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

