"use client"

import * as React from "react"
import {
  AudioWaveform,
  Blend,
  Blocks,
  BoomBox,
  Calendar,
  Command,
  Drum,
  GalleryVerticalEnd,
  Home,
  Inbox,
  LibraryBig,
  LocateFixed,
  MessageCircleQuestion,
  Podcast,
  Search,
  Settings2,
  Share,
  Sparkles,
  Trash2,
  UserRoundCheck,
  Waypoints,
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavWorkspaces } from "@/components/nav-workspaces"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Home",
      url: "/",
      icon: LibraryBig,
    },
    {
      title: "Music",
      url: "music",
      icon: Sparkles,
      isActive: true,
    },
    {
      title: "Radio",
      url: "radio",
      icon: BoomBox,
      badge: "10",
    },
    {
      title: "Podcast",
      url: "podcast",
      icon: Podcast,
      badge: "10",
    },
    {
      title: "Mixtape",
      url: "mixtape",
      icon: Drum,
      badge: "10",
    },
  ],
  navSecondary: [
    
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
 
    {
      title: "Share Link",
      url: "#",
      icon: Waypoints,
    },
    
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  mlibrary: [
    { name: "Artists", url: "/library/artists",icon: UserRoundCheck },
    { name: "Daylist", url: "/library/made-for-you", icon: Blend },
    { name: "All Playlists", url: "/playlist", icon: GalleryVerticalEnd },
    { name: "Made For You", url: "/library/made-for-you", icon: LocateFixed},
  ],
  playlist_listing: [
  

    
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites mlibrary={data.mlibrary} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
