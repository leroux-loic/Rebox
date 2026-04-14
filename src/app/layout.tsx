import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { BottomNav } from "@/components/bottom-nav";
import { Providers } from "./providers";

import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReBox - Marketplace de cartons",
  description: "Donnez une seconde vie aux cartons. Écologique, économique, local.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen flex flex-col">
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </main>
            <BottomNav />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
