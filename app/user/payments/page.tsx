"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { CreditCard, Landmark, Smartphone, ArrowRight, DollarSign, Clock, Shield } from "lucide-react"

export default function PaymentsPage() {
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("payment-methods")

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "card",
      name: "Visa ending in 4242",
      details: "Expires 12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "gcash",
      name: "GCash",
      details: "+63 912 345 6789",
      isDefault: false,
    },
  ])

  // Transaction history
  const transactions = [
    {
      id: "TRX-001",
      date: "March 19, 2025",
      amount: 1299.99,
      status: "Completed",
      description: "Payment for Vintage Levi's Denim Jacket",
    },
    {
      id: "TRX-002",
      date: "March 12, 2025",
      amount: 2500.0,
      status: "Completed",
      description: "Payment for Nike Air Force 1 Sneakers",
    },
    {
      id: "TRX-003",
      date: "March 5, 2025",
      amount: 1850.5,
      status: "Completed",
      description: "Payment for Leather Crossbody Bag",
    },
  ]

  // Form state for adding new payment method
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
    gcashPhone: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleAddPaymentMethod = (type: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      const newMethod = {
        id: paymentMethods.length + 1,
        type: type,
        name: "",
        details: "",
        isDefault: false,
      }

      if (type === "card") {
        newMethod.name = `Card ending in ${formData.cardNumber.slice(-4)}`
        newMethod.details = `Expires ${formData.expiry}`
      } else if (type === "gcash") {
        newMethod.name = "GCash"
        newMethod.details = formData.gcashPhone
      } else if (type === "bank") {
        newMethod.name = formData.bankName
        newMethod.details = `Account ending in ${formData.accountNumber.slice(-4)}`
      }

      setPaymentMethods([...paymentMethods, newMethod])

      // Reset form
      setFormData({
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvc: "",
        gcashPhone: "",
        bankName: "",
        accountNumber: "",
        accountName: "",
      })

      toast({
        title: "Payment method added",
        description: "Your new payment method has been added successfully.",
        duration: 3000,
      })
    }, 1500)
  }

  const setDefaultPaymentMethod = (id: number) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )

    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
      duration: 3000,
    })
  }

  const removePaymentMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id))

    toast({
      title: "Payment method removed",
      description: "Your payment method has been removed.",
      duration: 3000,
    })
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/auth/login?returnUrl=/user/payments")
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton backUrl="/dashboard" backLabel="Back to dashboard" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Payments & Transactions</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
              <TabsTrigger value="transaction-history">Transaction History</TabsTrigger>
            </TabsList>

            <TabsContent value="payment-methods" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Payment Methods</CardTitle>
                  <CardDescription>Manage your saved payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {method.type === "card" && <CreditCard className="h-5 w-5 text-muted-foreground" />}
                            {method.type === "gcash" && <Smartphone className="h-5 w-5 text-blue-500" />}
                            {method.type === "bank" && <Landmark className="h-5 w-5 text-slate-700" />}
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {method.name}
                                {method.isDefault && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">{method.details}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!method.isDefault && (
                              <Button variant="outline" size="sm" onClick={() => setDefaultPaymentMethod(method.id)}>
                                Set as Default
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removePaymentMethod(method.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-lg mb-2">No payment methods yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add a payment method to make checkout faster and easier.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add Payment Method</CardTitle>
                  <CardDescription>Add a new payment method to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="card" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Card
                      </TabsTrigger>
                      <TabsTrigger value="gcash" className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        GCash
                      </TabsTrigger>
                      <TabsTrigger value="bank" className="flex items-center gap-2">
                        <Landmark className="h-4 w-4" />
                        Bank
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="card" className="space-y-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="XXXX XXXX XXXX XXXX"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="Enter name as shown on card"
                          value={formData.cardName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="XXX" value={formData.cvc} onChange={handleInputChange} />
                        </div>
                      </div>
                      <Button
                        className="w-full mt-2"
                        onClick={() => handleAddPaymentMethod("card")}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="mr-2">Adding...</span>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          </>
                        ) : (
                          "Add Card"
                        )}
                      </Button>
                    </TabsContent>

                    <TabsContent value="gcash" className="space-y-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="gcashPhone">GCash Phone Number</Label>
                        <Input
                          id="gcashPhone"
                          placeholder="09XX XXX XXXX"
                          value={formData.gcashPhone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <Button
                        className="w-full mt-2"
                        onClick={() => handleAddPaymentMethod("gcash")}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="mr-2">Adding...</span>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          </>
                        ) : (
                          "Add GCash"
                        )}
                      </Button>
                    </TabsContent>

                    <TabsContent value="bank" className="space-y-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          placeholder="Enter your bank"
                          value={formData.bankName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          placeholder="Enter account number"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="accountName">Account Name</Label>
                        <Input
                          id="accountName"
                          placeholder="Enter account name"
                          value={formData.accountName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <Button
                        className="w-full mt-2"
                        onClick={() => handleAddPaymentMethod("bank")}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="mr-2">Adding...</span>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          </>
                        ) : (
                          "Add Bank Account"
                        )}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transaction-history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>View your recent transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.date} • {transaction.id}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₱{transaction.amount.toFixed(2)}</div>
                            <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              {transaction.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-lg mb-2">No transactions yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Your transaction history will appear here once you make a purchase.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    HanySecurePay Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700">
                      All transactions on HanyThrift are protected by our secure escrow system. Your payment is held
                      safely until you confirm receipt and satisfaction with your purchase.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="border rounded-lg p-4 text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="font-medium text-sm mb-1">Secure Payment</h4>
                      <p className="text-xs text-muted-foreground">Your payment information is encrypted and secure</p>
                    </div>

                    <div className="border rounded-lg p-4 text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="font-medium text-sm mb-1">Buyer Protection</h4>
                      <p className="text-xs text-muted-foreground">
                        Funds are only released when you're satisfied with your purchase
                      </p>
                    </div>

                    <div className="border rounded-lg p-4 text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ArrowRight className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="font-medium text-sm mb-1">Dispute Resolution</h4>
                      <p className="text-xs text-muted-foreground">
                        Our team helps resolve any issues with your purchase
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

