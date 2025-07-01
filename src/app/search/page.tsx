import { Suspense } from "react";
import SearchPage from "@/components/music/searchPageResult";

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SearchPage />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
