import Link from "next/link"
import { Home, Search, Library, User } from "lucide-react"

export function MobileNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around">
        <Link href="/" className="flex flex-1 flex-col items-center justify-center py-3">
          <Home className="h-6 w-6" />
          <span className="mt-1 text-xs">Home</span>
        </Link>
        <Link href="/search" className="flex flex-1 flex-col items-center justify-center py-3">
          <Search className="h-6 w-6" />
          <span className="mt-1 text-xs">Search</span>
        </Link>
        <Link href="/library" className="flex flex-1 flex-col items-center justify-center py-3">
          <Library className="h-6 w-6" />
          <span className="mt-1 text-xs">Library</span>
        </Link>
        <Link href="/profile" className="flex flex-1 flex-col items-center justify-center py-3">
          <User className="h-6 w-6" />
          <span className="mt-1 text-xs">Profile</span>
        </Link>
      </div>
    </div>
  )
}
