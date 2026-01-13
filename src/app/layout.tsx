import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { BottomNav } from "@/components/bottom-nav";
import { Providers } from "./providers";

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
            <div className="flex-1 pb-16 md:pb-0">
              {children}
            </div>
            <BottomNav />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
