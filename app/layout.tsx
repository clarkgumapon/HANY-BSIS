import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import ApiChecker from "@/components/api-check"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HanyThrift - Secondhand Shopping",
  description: "A modern, secure platform for secondhand shopping with HanySecurePay protection.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ApiChecker />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'