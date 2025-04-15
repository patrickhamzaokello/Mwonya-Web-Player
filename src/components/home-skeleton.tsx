import { Skeleton } from "@/components/ui/skeleton"

export function HomeSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Hero Section Skeleton */}
      <div className="relative rounded-xl bg-muted p-6 md:p-8 h-[200px]">
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-6" />
        <Skeleton className="h-10 w-full max-w-md" />
      </div>

      {/* New Releases Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[280px] max-w-[280px]">
              <Skeleton className="aspect-square w-full mb-3" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Discover Slider Skeleton */}
      <div>
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="min-w-[300px] h-[150px] rounded-lg" />
          ))}
        </div>
      </div>

      {/* Featured Artists Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <Skeleton className="h-28 w-28 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Trending Tracks Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="rounded-lg border p-4">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-10 w-10" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
