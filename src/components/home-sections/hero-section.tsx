import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  heading: string
  subheading: string
}

export function HeroSection({ heading, subheading }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-16 px-4 rounded-lg mb-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{heading}</h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-8">{subheading}</p>
        <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
          Start Listening
        </Button>
      </div>
    </div>
  )
}
