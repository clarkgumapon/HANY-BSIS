import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Shirt, Watch, Footprints, HardHatIcon as Hat, PocketIcon as Jacket } from "lucide-react"
import { PantsIcon } from "@/components/icons/pants-icon"

const categories = [
  {
    name: "Clothing",
    icon: Shirt,
    count: 3,
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    slug: "clothing",
  },
  {
    name: "Footwear",
    icon: Footprints,
    count: 3,
    color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    slug: "footwear",
  },
  {
    name: "Accessories",
    icon: Watch,
    count: 3,
    color: "bg-amber-50 text-amber-600 hover:bg-amber-100",
    slug: "accessories",
  },
  {
    name: "Outerwear",
    icon: Jacket,
    count: 3,
    color: "bg-green-50 text-green-600 hover:bg-green-100",
    slug: "outerwear",
  },
  {
    name: "Bottoms",
    icon: PantsIcon,
    count: 3,
    color: "bg-red-50 text-red-600 hover:bg-red-100",
    slug: "bottoms",
  },
  {
    name: "Headwear",
    icon: Hat,
    count: 3,
    color: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100",
    slug: "headwear",
  },
]

export default function CategorySection() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link href={`/category/${category.slug}`} key={category.name}>
          <Card className="h-full hover:shadow-lg transition-all transform hover:-translate-y-2 duration-300 border-none hover:bg-opacity-90">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div
                className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-3 transition-colors`}
              >
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-center">{category.name}</h3>
              <p className="text-xs text-muted-foreground">{category.count} items</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

