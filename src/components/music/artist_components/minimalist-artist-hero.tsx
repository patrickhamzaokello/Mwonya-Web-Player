"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Play, UserPlus, UserCheck, MoreHorizontal } from "lucide-react"
import { ArtistIntro } from "@/lib/artist_page_types"

interface MinimalistArtistHeroProps {
  artistData: ArtistIntro
}

export default function MinimalistArtistHero({ artistData }: MinimalistArtistHeroProps) {
  return (
    <div className="">
      <div className="container">
        {/* Main Content Row */}
        <div className="flex items-center gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-64 h-64 rounded-lg overflow-hidden bg-zinc-800">
              <Image
                src={artistData.profilephoto || "/placeholder.svg"}
                alt={artistData.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Artist Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1">
                Artist
              </Badge>
              {artistData.verified && (
                  <svg
                  width="20"
                  height="20"
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.875 13.5019L23.13 10.3744L23.5125 6.23438L19.4513 5.31187L17.325 1.73438L13.5 3.37688L9.675 1.73438L7.54875 5.31187L3.4875 6.22313L3.87 10.3631L1.125 13.5019L3.87 16.6294L3.4875 20.7806L7.54875 21.7031L9.675 25.2806L13.5 23.6269L17.325 25.2694L19.4513 21.6919L23.5125 20.7694L23.13 16.6294L25.875 13.5019ZM11.25 19.1269L6.75 14.6269L8.33625 13.0406L11.25 15.9431L18.6638 8.52937L20.25 10.1269L11.25 19.1269Z"
                    fill="#a900ff"
                  />
                </svg>
              )}
            </div>
            
            <h1 className="text-2xl font-semibold text-white mb-1 truncate">
              {artistData.name}
            </h1>
            
            <p className="text-sm text-zinc-400 mb-3">{artistData.monthly}</p>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="bg-white text-black hover:bg-zinc-100 px-4 py-2 h-8 rounded-md"
              >
                <Play className="w-3 h-3 mr-2 fill-current" />
                Play
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={`px-4 py-2 h-8 rounded-md border text-xs ${
                  artistData.following
                    ? "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                    : "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                {artistData.following ? (
                  <>
                    <UserCheck className="w-3 h-3 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3 mr-2" />
                    Follow
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 w-8 h-8 p-0 rounded-md"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats - Desktop Only */}
          <div className="hidden lg:flex items-center gap-8 text-sm">
           {/* Exclusive Access */}
          {!artistData.user_access_exclusive && (
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-xs font-medium text-zinc-400 mb-2">Exclusive Access</h3>
              <p className="text-xs text-zinc-400 mb-3">Join artist circle for exclusive content</p>
              <Button
                variant="outline"
                size="sm"
                className="border-amber-600 text-amber-400 hover:bg-amber-950 text-xs px-3 py-1 h-7 rounded-md w-full"
              >
                Join for ${(artistData.circle_cost / 100).toFixed(0)}
              </Button>
            </div>
          )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 my-6"></div>

        {/* Bottom Info Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* About */}
          <div className="md:col-span-2">
            <h2 className="text-sm font-medium text-zinc-400 mb-2">About</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">{artistData.intro}</p>
          </div>

          {/* Details */}
          <div className="space-y-4 flex gap-4">
            <div>
              <h3 className="text-xs font-medium text-zinc-500 mb-1">Genre</h3>
              <p className="text-sm text-zinc-300">Afro Pop</p>
            </div>
            
            <div>
              <h3 className="text-xs font-medium text-zinc-500 mb-1">Label</h3>
              <p className="text-sm text-zinc-300">Independent</p>
            </div>

            <div>
              <h3 className="text-xs font-medium text-zinc-500 mb-1">Location</h3>
              <p className="text-sm text-zinc-300">Northern Uganda</p>
            </div>
          </div>

          
        </div>

        {/* Mobile Stats */}
        <div className="lg:hidden mt-6 flex justify-center gap-8 text-sm">
          <div className="text-center">
            <div className="text-white font-medium">2.1M</div>
            <div className="text-zinc-500 text-xs">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-white font-medium">156</div>
            <div className="text-zinc-500 text-xs">Songs</div>
          </div>
          <div className="text-center">
            <div className="text-white font-medium">42</div>
            <div className="text-zinc-500 text-xs">Albums</div>
          </div>
        </div>
      </div>
    </div>
  )
}