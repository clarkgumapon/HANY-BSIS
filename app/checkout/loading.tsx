import { ShoppingBag, Heart, User, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CartButton from "@/components/cart-button"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <span className="font-bold text-xl">HanyThrift</span>
          </Link>
          <div className="hidden md:flex items-center w-full max-w-sm mx-8 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search for items..." className="pl-8 rounded-full" />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>
            <CartButton />
            <Button variant="outline" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <span>Login</span>
            </Button>
          </div>
        </div>
        <div className="container mx-auto px-4 py-2 md:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search for items..." className="pl-8 rounded-full" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading checkout information...</p>
        </div>
      </div>
    </div>
  )
}

