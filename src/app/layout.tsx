import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/AudioContext";
import ControlBar from "@/components/ControlBar";
import { AppSidebar } from "@/components/app-sidebar"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mwonya Player",
  description: "A beautiful music player inspired by Apple Music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-hidden`}>
        <AuthProvider>
          <AudioProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
              <ControlBar />

                <div className="flex flex-1 flex-col gap-4">
                  <div className="overflow-y-auto p-6">
                    {/* Main content will be rendered here */}
                    {children}
                  </div>

                </div>
              </SidebarInset>
            </SidebarProvider>
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
