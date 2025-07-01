import Link from "next/link";

export default function AlbumsPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Albums</h1>
        <p className="text-muted-foreground">
          This feature is coming soon! Stay tuned for updates.
        </p>
        {/* Sample album */}
        <div className="mt-6">
          <Link href="/library/albums/mw_alb378f121f-300b-4e86-a3c4-6da8d85378cd">
            <p className="text-blue-500 hover:underline">
              Sample Album (ID: 1)
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}