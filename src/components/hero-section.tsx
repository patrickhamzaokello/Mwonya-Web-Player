import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HeroSectionProps {
  data: {
    heading: string
    subheading: string
  }
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-lg">
        <h1 className="mb-3 text-3xl font-medium tracking-tight text-gray-900 md:text-4xl">
          {data.heading}
        </h1>
        <p className="mb-6 max-w-xl text-lg text-gray-500">
          {data.subheading}
        </p>
     
    </div>
  )
}