"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, CheckCircle2, Truck, Shield, Home, Package } from "lucide-react"
import Header from "@/components/header"
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
  {
    id: "HT38275",
    date: "February 28, 2025",
    status: "Completed",
    product: {
      name: "Vintage Champion Hoodie",
      price: 42.75,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1374&auto=format&fit=crop",
      seller: "RetroClothes",
    },
  },
]

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?returnUrl=/orders")
    }
  }, [isAuthenticated, router])

  // Filter orders based on active tab
  const filteredOrders = mockOrders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return order.status === "In Transit"
    if (activeTab === "delivered") return order.status === "Delivered"
    if (activeTab === "completed") return order.status === "Completed"
    return true
  })

  // If not authenticated, show loading
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton backUrl="/dashboard" backLabel="Back to dashboard" />

      <main className="flex-1 container mx-auto px-4 py-8">
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
          <span className="text-sm">Orders</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
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
                              {order.status === "Delivered" ? "Confirm Receipt" : "View Details"}
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
              ))
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium mb-2">No orders found</h2>
                <p className="text-muted-foreground mb-6">
                  You don't have any {activeTab !== "all" ? activeTab : ""} orders yet.
                </p>
                <Button asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

