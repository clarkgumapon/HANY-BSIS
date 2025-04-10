import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, Shield, Star } from "lucide-react"

// Mock order data
const orderData = {
  id: "38295",
  date: "March 23, 2025",
  product: {
    name: "Vintage Denim Jacket",
    price: 45.99,
    image: "/placeholder.svg?height=300&width=300",
    seller: "VintageFinds",
  },
  shipping: 4.99,
  serviceFee: 2.5,
  total: 53.48,
}

export default function OrderConfirmationPage() {
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
                <CardTitle className="text-xl text-green-800">Order Complete!</CardTitle>
                <CardDescription className="text-green-700 mt-1">
                  Payment has been released to the seller
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Order #{orderData.id}</h2>
                <p className="text-sm text-muted-foreground">Completed on {orderData.date}</p>
              </div>
              <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Completed</div>
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
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800 mb-1">Transaction Complete</h3>
                  <p className="text-sm text-green-700">
                    Thank you for confirming receipt of your item. The payment has been released to the seller, and your
                    transaction is now complete.
                  </p>
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
            <Button className="w-full sm:w-auto" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/dashboard">View All Orders</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

