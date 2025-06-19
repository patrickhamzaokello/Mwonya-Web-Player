'use client';

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function NewPage() {
  const { isAuthenticated } = useAuth();

  // Mock data for featured content
  const featuredContent = [
    {
      id: 1,
      title: "Featured Playlist",
      description: "Discover new music curated just for you",
      image: "/placeholder-1.jpg",
    },
    {
      id: 2,
      title: "New Releases",
      description: "Check out the latest tracks from your favorite artists",
      image: "/placeholder-2.jpg",
    },
    {
      id: 3,
      title: "Popular Now",
      description: "See what's trending in the music world",
      image: "/placeholder-3.jpg",
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Discover New Music</h1>

        {!isAuthenticated && (
          <div className="bg-[#282828] p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Sign up to enjoy unlimited music</h2>
            <p className="text-gray-400 mb-4">
              Create an account to access millions of songs, create playlists, and more.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-white/90"
            >
              Sign up for free
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredContent.map((item) => (
            <div
              key={item.id}
              className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors"
            >
              <div className="aspect-square bg-[#282828] rounded mb-4">
                {/* Replace with actual image */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Image
                </div>
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 