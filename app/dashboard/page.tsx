"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import {
  ShoppingBag,
  Package,
  User,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Shield,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

// Mock orders data
const mockOrders = [
  {
    id: "HT38295",
    date: "March 19, 2025",
    status: "In Transit",
    product: {
      name: "Vintage Denim Jacket",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1516608152931-144d39e9188e?q=80&w=1374&auto=format&fit=crop",
      seller: "VintageFinds",
    },
  },
  {
    id: "HT38290",
    date: "March 12, 2025",
    status: "Delivered",
    product: {
      name: "Mechanical Keyboard",
      price: 65.0,
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1470&auto=format&fit=crop",
      seller: "TechTreasures",
    },
  },
  {
    id: "HT38288",
    date: "March 5, 2025",
    status: "Completed",
    product: {
      name: "Leather Crossbody Bag",
      price: 38.5,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1376&auto=format&fit=crop",
      seller: "FashionFinds",
    },
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("buying")
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?returnUrl=/dashboard")
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // If not authenticated, show loading or nothing
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
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
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
            >
              <Package className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/user/payments"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <CreditCard className="h-4 w-4" />
              Payments
            </Link>
            <Link
              href="/user/profile"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/user/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Separator className="my-2" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-left"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="grid gap-6 p-4 sm:p-6 md:gap-8 overflow-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Welcome, {user?.name || "User"}</h1>
          </div>

          <Tabs defaultValue="buying" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buying">Buying</TabsTrigger>
              <TabsTrigger value="selling">Selling</TabsTrigger>
            </TabsList>

            <TabsContent value="buying" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Items you've purchased that are in progress</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">To Confirm</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-xs text-muted-foreground">Items delivered waiting for your confirmation</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">Successfully completed purchases</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Disputes</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Issues reported with purchases</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold mt-6">My Orders</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/orders">View All Orders</Link>
                </Button>
              </div>

              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Order #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                          </div>
                          <Badge
                            className={`
                              ${
                                order.status === "In Transit"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : order.status === "Delivered"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : "bg-green-100 text-green-800 hover:bg-green-100"
                              }
                            `}
                          >
                            {order.status}
                          </Badge>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="relative w-16 h-16 rounded border overflow-hidden flex-shrink-0">
                            <Image
                              src={order.product.image || "/placeholder.svg"}
                              alt={order.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{order.product.name}</h4>
                            <p className="text-sm text-muted-foreground">Seller: {order.product.seller}</p>
                            <p className="text-sm font-medium">₱{order.product.price.toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center text-xs text-green-600">
                              <Shield className="h-3 w-3 mr-1" />
                              <span>HanySecurePay Protected</span>
                            </div>
                            <Button
                              variant={order.status === "Delivered" ? "default" : "outline"}
                              size="sm"
                              className={order.status === "Delivered" ? "bg-green-600 hover:bg-green-700" : ""}
                              asChild
                            >
                              <Link href={`/orders/${order.id.replace("HT", "")}`}>
                                {order.status === "Delivered" ? "Confirm Receipt" : "Track Order"}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="p-4 bg-muted/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            {order.status === "In Transit" ? (
                              <>
                                <Truck className="h-4 w-4 text-amber-600" />
                                <span>Estimated delivery: March 23, 2025</span>
                              </>
                            ) : order.status === "Delivered" ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                <span>Delivered on March 18, 2025</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span>Completed on March 8, 2025</span>
                              </>
                            )}
                          </div>
                          <Link
                            href={`/orders/${order.id.replace("HT", "")}`}
                            className="text-sm font-medium text-primary flex items-center"
                          >
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="selling" className="space-y-4">
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
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

