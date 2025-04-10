"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, CreditCard, Landmark, Smartphone, Info, Lock, CheckCircle, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import { useAuth } from "@/components/auth-provider"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface CartItem {
  id: number
  product_id: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    image_url: string
    description: string
    category: string
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("gcash")
  const [paymentStep, setPaymentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Get buy now parameters
  const productId = searchParams.get('product')
  const isBuyNow = searchParams.get('buyNow') === 'true'

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
    gcashPhone: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  })

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (isBuyNow && productId) {
          // Handle "Buy Now" - fetch single product
          const product = await api.getProduct(parseInt(productId))
          if (!product) {
            throw new Error('Product not found')
          }
          setCartItems([{
            id: -1, // Temporary ID for direct purchase
            product_id: product.id,
            quantity: 1,
            product: product
          }])
        } else {
          // Regular cart checkout
          const items = await api.getCart()
          if (!items || items.length === 0) {
            toast({
              title: "Cart is empty",
              description: "Please add items to your cart before checking out.",
              variant: "destructive",
            })
            router.push("/")
            return
          }
          setCartItems(items)
        }
      } catch (error: any) {
        console.error('Failed to fetch items:', error)
        toast({
          title: "Error",
          description: error.message || "Failed to load items. Please try again.",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchItems()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, productId, isBuyNow, toast, router])

  // Calculate totals
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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Clear error for this field if it exists
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  // Validate form before submission
  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Required shipping fields
    if (!formData.firstName) errors.firstName = "First name is required"
    if (!formData.lastName) errors.lastName = "Last name is required"
    if (!formData.address) errors.address = "Address is required"
    if (!formData.city) errors.city = "City is required"
    if (!formData.state) errors.state = "State/Province is required"
    if (!formData.zip) errors.zip = "Postal code is required"
    if (!formData.phone) errors.phone = "Phone number is required"

    // Payment method specific validation
    if (paymentMethod === "gcash") {
      if (!formData.gcashPhone) errors.gcashPhone = "GCash phone number is required"
    } else if (paymentMethod === "bank") {
      if (!formData.bankName) errors.bankName = "Bank name is required"
      if (!formData.accountNumber) errors.accountNumber = "Account number is required"
      if (!formData.accountName) errors.accountName = "Account name is required"
    } else if (paymentMethod === "card") {
      if (!formData.cardNumber) errors.cardNumber = "Card number is required"
      if (!formData.expiry) errors.expiry = "Expiry date is required"
      if (!formData.cvc) errors.cvc = "CVC is required"
      if (!formData.cardName) errors.cardName = "Name on card is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleDeposit = async () => {
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorId = Object.keys(formErrors)[0]
      const element = document.getElementById(firstErrorId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
        element.focus()
      }
      return
    }

    setIsProcessing(true)

    try {
      // Here you would normally make an API call to process the payment
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000))
      setPaymentStep(2)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCompleteCheckout = async () => {
    try {
      setIsProcessing(true)
      if (isBuyNow && productId) {
        // Handle direct purchase
        await api.createOrder({
          total_amount: calculateTotal(),
          items: [{
            product_id: parseInt(productId),
            quantity: 1
          }]
        })
      } else {
        // Handle cart checkout
        await api.createOrder({
          total_amount: calculateTotal(),
          items: cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
          }))
        })
      }
      router.push("/checkout/confirmation")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Check authentication and cart items on page load
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const returnUrl = window.location.pathname + window.location.search
      router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`)
      return
    }

    if (!isLoading && cartItems.length === 0) {
      router.push("/")
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
    }
  }, [isAuthenticated, isLoading, cartItems.length, router, toast])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading checkout information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // The useEffect will handle the redirect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Shopping
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your items before checkout</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                        <div className="relative h-24 w-24 rounded-lg overflow-hidden border bg-muted">
                          <Image
                            src={item.product.image_url || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            onError={(e: any) => {
                              e.target.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.product.category}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <p className="text-sm">Quantity: {item.quantity}</p>
                            <p className="text-sm font-medium">₱{item.product.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₱{(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                  <CardDescription>Enter your shipping details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={formErrors.firstName ? "border-red-500" : ""}
                      />
                      {formErrors.firstName && (
                        <p className="text-sm text-red-500">{formErrors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={formErrors.lastName ? "border-red-500" : ""}
                      />
                      {formErrors.lastName && (
                        <p className="text-sm text-red-500">{formErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={formErrors.address ? "border-red-500" : ""}
                    />
                    {formErrors.address && (
                      <p className="text-sm text-red-500">{formErrors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={formErrors.city ? "border-red-500" : ""}
                      />
                      {formErrors.city && (
                        <p className="text-sm text-red-500">{formErrors.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={formErrors.state ? "border-red-500" : ""}
                      />
                      {formErrors.state && (
                        <p className="text-sm text-red-500">{formErrors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zip">Postal Code</Label>
                      <Input
                        id="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className={formErrors.zip ? "border-red-500" : ""}
                      />
                      {formErrors.zip && (
                        <p className="text-sm text-red-500">{formErrors.zip}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={formErrors.phone ? "border-red-500" : ""}
                      />
                      {formErrors.phone && (
                        <p className="text-sm text-red-500">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="gcash" className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        GCash
                      </TabsTrigger>
                      <TabsTrigger value="bank" className="flex items-center gap-2">
                        <Landmark className="h-4 w-4" />
                        Bank
                      </TabsTrigger>
                      <TabsTrigger value="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Card
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="gcash" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="gcashPhone">GCash Phone Number</Label>
                        <Input
                          id="gcashPhone"
                          value={formData.gcashPhone}
                          onChange={handleInputChange}
                          className={formErrors.gcashPhone ? "border-red-500" : ""}
                        />
                        {formErrors.gcashPhone && (
                          <p className="text-sm text-red-500">{formErrors.gcashPhone}</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="bank" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          className={formErrors.bankName ? "border-red-500" : ""}
                        />
                        {formErrors.bankName && (
                          <p className="text-sm text-red-500">{formErrors.bankName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          className={formErrors.accountNumber ? "border-red-500" : ""}
                        />
                        {formErrors.accountNumber && (
                          <p className="text-sm text-red-500">{formErrors.accountNumber}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Name</Label>
                        <Input
                          id="accountName"
                          value={formData.accountName}
                          onChange={handleInputChange}
                          className={formErrors.accountName ? "border-red-500" : ""}
                        />
                        {formErrors.accountName && (
                          <p className="text-sm text-red-500">{formErrors.accountName}</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="card" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={formErrors.cardNumber ? "border-red-500" : ""}
                        />
                        {formErrors.cardNumber && (
                          <p className="text-sm text-red-500">{formErrors.cardNumber}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            className={formErrors.expiry ? "border-red-500" : ""}
                          />
                          {formErrors.expiry && (
                            <p className="text-sm text-red-500">{formErrors.expiry}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            value={formData.cvc}
                            onChange={handleInputChange}
                            className={formErrors.cvc ? "border-red-500" : ""}
                          />
                          {formErrors.cvc && (
                            <p className="text-sm text-red-500">{formErrors.cvc}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={formErrors.cardName ? "border-red-500" : ""}
                        />
                        {formErrors.cardName && (
                          <p className="text-sm text-red-500">{formErrors.cardName}</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Order Total */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Total</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₱{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>₱{calculateShipping().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service Fee</span>
                        <span>₱{calculateServiceFee().toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>₱{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    {paymentStep === 1 ? (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleDeposit}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <span className="mr-2">Processing...</span>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          </>
                        ) : (
                          "Pay Now"
                        )}
                      </Button>
                    ) : (
                      <Button className="w-full" size="lg" onClick={handleCompleteCheckout}>
                        Complete Order
                      </Button>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>Secure checkout powered by HanySecurePay</span>
                    </div>

                    {paymentStep === 2 && (
                      <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 mt-0.5" />
                        <div>
                          <p className="font-medium">Payment Successful</p>
                          <p className="text-sm mt-1">
                            Your payment has been processed successfully. Click "Complete Order" to finish your purchase.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

