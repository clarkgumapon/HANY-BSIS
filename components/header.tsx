"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart, User, LogOut } from "lucide-react"
import CartButton from "@/components/cart-button"
import SearchBar from "@/components/search-bar"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  showBackButton?: boolean
  backUrl?: string
  backLabel?: string
}

export default function Header({ showBackButton = false, backUrl = "/", backLabel = "Back" }: HeaderProps) {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 transition-all duration-200 hover:shadow-md"
              onClick={() => router.push(backUrl)}
            >
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                {backLabel}
              </span>
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2 transition-colors hover:text-primary">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <span className="font-bold text-xl">HanyThrift</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center w-full max-w-sm mx-8 relative">
          <SearchBar />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex transition-all duration-200 hover:shadow-md">
            <Heart className="h-5 w-5" />
          </Button>
          <CartButton />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 transition-all duration-200 hover:shadow-md">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/user/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/orders")}>Orders</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" className="gap-2 transition-all duration-200 hover:shadow-md" asChild>
              <Link href="/auth/login" className="transition-colors hover:text-primary">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4 py-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  )
}

