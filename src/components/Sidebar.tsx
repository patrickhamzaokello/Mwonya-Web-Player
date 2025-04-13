'use client';

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const mainMenuItems = [
    { name: "Home", path: "/home" },
    { name: "New", path: "/new" },
    { name: "Radio", path: "/radio" },
    {name: "Playlist", path: "/playlist"}
  ];

  const libraryMenuItems = [
    { name: "Recently Added", path: "/library/recent" },
    { name: "Artists", path: "/library/artists" },
    { name: "Albums", path: "/library/albums" },
    { name: "Songs", path: "/library/songs" },
    { name: "Made For You", path: "/library/made-for-you" },
  ];

  const playlistMenuItems = [
    { name: "All Playlists", path: "/playlists" },
    { name: "Favourite Songs", path: "/playlists/favorites" },
  ];

  return (
    <div className="w-64 bg-[#121212] p-6 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Mwonya Player</h1>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-[#282828] text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      <nav className="flex-1">
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">MENU</h2>
          <ul className="space-y-2">
            {mainMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block py-2 px-4 rounded hover:bg-white/10 ${
                    pathname === item.path ? "bg-white/10" : ""
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {isAuthenticated && (
          <>
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-400 mb-4">
                LIBRARY
              </h2>
              <ul className="space-y-2">
                {libraryMenuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`block py-2 px-4 rounded hover:bg-white/10 ${
                        pathname === item.path ? "bg-white/10" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-400 mb-4">
                PLAYLISTS
              </h2>
              <ul className="space-y-2">
                {playlistMenuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`block py-2 px-4 rounded hover:bg-white/10 ${
                        pathname === item.path ? "bg-white/10" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </nav>

      {!isAuthenticated && (
        <div className="mt-auto">
          <Link
            href="/login"
            className="block w-full text-center py-2 px-4 bg-white text-black rounded-full hover:bg-white/90"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 