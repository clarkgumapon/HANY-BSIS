import Link from "next/link"
import FeaturedProductsRev from "@/components/featured-products-rev"
import SustainabilityBanner from "@/components/sustainability-banner"
import CategorySection from "@/components/category-section"
import Header from "@/components/header"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="py-6 md:py-10">
          <div className="container mx-auto px-4">
            <SustainabilityBanner />
          </div>
        </section>
        <section className="py-6 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Shop by Category</h2>
            <CategorySection />
          </div>
        </section>
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Featured Items</h2>
              <Link
                href="/products/all"
                className="text-sm font-medium text-green-600 hover:underline hover:text-green-700 transition-colors"
              >
                View all
              </Link>
            </div>
            <FeaturedProductsRev />
          </div>
        </section>
      </main>
      <footer className="border-t py-6 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Made with ❤️ by Hany BSIS First Year</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

