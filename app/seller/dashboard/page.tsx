"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ShoppingBag,
  Package,
  User,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  Shield,
  Key,
  Copy,
  DollarSign,
} from "lucide-react"

export default function SellerDashboardPage() {
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  const [withdrawalToken, setWithdrawalToken] = useState("")
  const [tokenCopied, setTokenCopied] = useState(false)

  const copyToken = () => {
    navigator.clipboard.writeText(withdrawalToken)
    setTokenCopied(true)
    setTimeout(() => setTokenCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-5 w-5 text-green-600" />
            <span>HanyThrift</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              href="/seller/dashboard"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
            >
              <Package className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <CreditCard className="h-4 w-4" />
              Payments
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Separator className="my-2" />
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <div className="md:hidden">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Seller Dashboard</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </header>

        <main className="grid gap-6 p-4 sm:p-6 md:gap-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Items you're currently selling</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">To Ship</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Orders waiting to be shipped</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">Successfully completed sales</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₱245.80</div>
                <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-lg font-semibold mt-6">Recent Orders</h2>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Order #HT38295</h3>
                      <p className="text-sm text-muted-foreground">Sold on March 19, 2025</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Payment Ready</Badge>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded border overflow-hidden flex-shrink-0">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Vintage Denim Jacket"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Vintage Denim Jacket</h4>
                      <p className="text-sm text-muted-foreground">Buyer: JohnDoe123</p>
                      <p className="text-sm font-medium">₱45.99</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center text-xs text-green-600">
                        <Key className="h-3 w-3 mr-1" />
                        <span>Withdrawal Available</span>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setWithdrawalToken("HT-WD-38295-VF-45.99")
                          setWithdrawDialogOpen(true)
                        }}
                      >
                        Withdraw Funds
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Buyer confirmed receipt on March 23, 2025</span>
                    </div>
                    <Link href="#" className="text-sm font-medium text-primary flex items-center">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Order #HT38288</h3>
                      <p className="text-sm text-muted-foreground">Sold on March 14, 2025</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Shipped</Badge>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded border overflow-hidden flex-shrink-0">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Leather Crossbody Bag"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Leather Crossbody Bag</h4>
                      <p className="text-sm text-muted-foreground">Buyer: FashionFinder22</p>
                      <p className="text-sm font-medium">₱38.50</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center text-xs text-blue-600">
                        <Shield className="h-3 w-3 mr-1" />
                        <span>Payment Secured</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Update Tracking
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span>Shipped on March 16, 2025 • Awaiting delivery</span>
                    </div>
                    <Link href="#" className="text-sm font-medium text-primary flex items-center">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Your payment for Order #HT38295 is now available for withdrawal. Use the secure token below to access your
              funds.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800 mb-1">Withdrawal Token</h3>
                  <p className="text-sm text-green-700">
                    This token is unique to this transaction and can only be used once.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="token">Your Secure Withdrawal Token</Label>
              <div className="flex items-center gap-2">
                <Input id="token" value={withdrawalToken} readOnly className="font-mono" />
                <Button variant="outline" size="icon" onClick={copyToken}>
                  {tokenCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Copy this token and use it in the withdrawal section of your payment settings.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Amount Available</Label>
              <div className="flex items-center gap-2 text-lg font-bold text-green-600">
                <DollarSign className="h-5 w-5" />
                <span>45.99</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-1">Important</h3>
                  <p className="text-sm text-blue-700">
                    For security reasons, this token will expire in 24 hours. Make sure to complete your withdrawal
                    before then.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>
              Close
            </Button>
            <Button asChild>
              <Link href="/seller/withdraw">Proceed to Withdrawal</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

