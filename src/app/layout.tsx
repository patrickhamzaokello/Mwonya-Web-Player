import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/EnhancedAudioContext";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mwonya Player - Your Ultimate Music Experience",
  description: "A modern music streaming platform inspired by Ugandan Music", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <AudioProvider>
            <AppShell>
              {children}
            </AppShell>
            <Toaster 
              position="bottom-center"
              toastOptions={{
                className: 'bg-background text-foreground border border-border',
              }}
            />
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}