import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SustainabilityBanner() {
  return (
    <div className="rounded-lg bg-gradient-to-r from-green-50 to-green-100 p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <h2 className="font-semibold text-green-800">Sustainable Shopping</h2>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Give Items a Second Life</h1>
          <p className="text-muted-foreground mb-4 max-w-md">
            Shop pre-loved items and reduce your carbon footprint. Every purchase helps extend the lifecycle of quality
            products.
          </p>
          <Button className="bg-green-600 hover:bg-green-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
            Explore Eco-Friendly Finds
          </Button>
        </div>
        <div className="flex-shrink-0 w-full md:w-1/3 aspect-video md:aspect-square relative rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-400 opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-800">30%</div>
              <div className="text-sm font-medium text-green-700">Less Carbon Footprint</div>
              <div className="text-xs text-green-600 mt-1">than buying new</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

