export function ArtistHeroSkeleton() {
    return (
      <div className="relative w-full bg-background">
        {/* Background Skeleton */}
        <div className="absolute inset-0 h-80 bg-muted animate-pulse" />
  
        {/* Content Container */}
        <div className="relative z-10">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto">
              {/* Top Section Skeleton */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                {/* Profile Image Skeleton */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted animate-pulse" />
                </div>
  
                {/* Artist Info Skeleton */}
                <div className="flex-1 text-center md:text-left">
                  <div className="w-16 h-6 bg-muted animate-pulse rounded mb-4 mx-auto md:mx-0" />
                  <div className="w-48 h-12 bg-muted animate-pulse rounded mb-3 mx-auto md:mx-0" />
                  <div className="w-32 h-6 bg-muted animate-pulse rounded mb-6 mx-auto md:mx-0" />
  
                  {/* Buttons Skeleton */}
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                    <div className="w-24 h-12 bg-muted animate-pulse rounded-full" />
                    <div className="w-28 h-12 bg-muted animate-pulse rounded-full" />
                  </div>
                </div>
              </div>
  
              {/* Divider */}
              <div className="w-full h-px bg-border mb-12" />
  
              {/* Bottom Section Skeleton */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="w-16 h-6 bg-muted animate-pulse rounded mb-4" />
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-muted animate-pulse rounded" />
                    <div className="w-full h-4 bg-muted animate-pulse rounded" />
                    <div className="w-3/4 h-4 bg-muted animate-pulse rounded" />
                  </div>
                </div>
  
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="w-16 h-4 bg-muted animate-pulse rounded mb-2" />
                      <div className="w-24 h-4 bg-muted animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  