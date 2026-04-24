import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreHeader, StoreFooter } from "@/components/common/StoreShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Djenebou Shop — Streetwear Premium",
    template: "%s | Djenebou Shop",
  },
  description:
    "La boutique streetwear premium pour les esprits libres. Joggings, ensembles et hoodies haut de gamme. Livraison 24h à Dakar.",
  keywords: ["streetwear", "jogger", "ensemble", "hoodie", "Dakar", "Sénégal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
     
     
      <body className="min-h-full flex flex-col bg-[#080808] text-[#f8f8f8]">
        <StoreHeader />
        <main className="flex-1">{children}</main>
        <StoreFooter />
      </body>
    </html>
  );
}
