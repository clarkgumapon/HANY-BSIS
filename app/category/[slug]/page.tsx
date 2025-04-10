import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import CategoryProducts from "@/components/category-products"

// Mock category data
const categories = {
  clothing: {
    name: "Clothing",
    description: "Browse our collection of secondhand clothing items in excellent condition.",
    count: 3,
  },
  footwear: {
    name: "Footwear",
    description: "Quality pre-loved shoes, sneakers, and boots at affordable prices.",
    count: 3,
  },
  accessories: {
    name: "Accessories",
    description: "Complete your look with our selection of secondhand accessories.",
    count: 3,
  },
  outerwear: {
    name: "Outerwear",
    description: "Stay warm with our collection of pre-loved jackets, coats, and sweaters.",
    count: 3,
  },
  bottoms: {
    name: "Bottoms",
    description: "Find the perfect pair of pre-loved jeans, pants, shorts, and skirts.",
    count: 3,
  },
  headwear: {
    name: "Headwear",
    description: "Top off your outfit with our selection of pre-loved hats, caps, and beanies.",
    count: 3,
  },
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = await params.slug
  const category = categories[slug as keyof typeof categories] || {
    name: "Category Not Found",
    description: "This category does not exist.",
    count: 0,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <Badge variant="outline" className="ml-2">
            {category.count} items
          </Badge>
        </div>
        <p className="text-muted-foreground">{category.description}</p>
      </div>

      <CategoryProducts slug={slug} />
    </div>
  )
}

