import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/AudioContext";
import Sidebar from "@/components/Sidebar";
import ControlBar from "@/components/ControlBar";

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
            <div className="fixed inset-0 flex bg-black text-white">
              <div className="flex flex-col w-full h-full">
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 flex flex-col overflow-hidden">
                    <ControlBar />
                    <div className="flex-1 overflow-y-auto p-6">
                      {/* Main content will be rendered here */}
                      {children}
                    </div>
                  </main>
                </div>
              </div>
            </div>
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
