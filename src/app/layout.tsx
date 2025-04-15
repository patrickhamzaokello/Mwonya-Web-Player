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
  description: "Ugandan Number one Music and Video Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-hidden h-screen`}>
        <AuthProvider>
          <AudioProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="flex flex-col h-screen">
                <ControlBar />
                <main className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto px-6">
                    {children}
                  </div>
                </main>
              </SidebarInset>
            </SidebarProvider>
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}