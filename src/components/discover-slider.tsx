import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { customLoader } from "@/lib/utils"

interface DiscoverSliderProps {
  data: {
    heading: string
    featured_sliderBanners: Array<{
      id: number
      playlistID: string
      imagepath: string
    }>
  }
}

export function DiscoverSlider({ data }: DiscoverSliderProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{data.heading}</h2>
      </div>
      <Carousel className="w-full">
        <CarouselContent>
          {data.featured_sliderBanners.map((banner) => (
            <CarouselItem key={banner.id} className="md:basis-1/2 lg:basis-1/3">
              <Link href={`/playlist/${banner.playlistID}`}>
                <Card className="border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
                      <Image
                       loader={customLoader}
                        src={banner.imagepath || "/placeholder.svg"}
                        alt={`Discover banner ${banner.id}`}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  )
}
