import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gaia Ecotrack - Renewable Energy Tokenization on Solana",
  description: "A decentralized platform for tokenizing renewable energy. 1 kWh = 1 Gaia Token. Track, verify, and trade renewable energy certificates on Solana blockchain.",
  keywords: ["Gaia", "Solana", "Renewable Energy", "Tokenization", "DePIN", "Climate Tech", "Web3"],
  authors: [{ name: "Gaia Ecotrack Team" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌱</text></svg>",
  },
  openGraph: {
    title: "Gaia Ecotrack",
    description: "Renewable Energy Tokenization on Solana",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaia Ecotrack",
    description: "Renewable Energy Tokenization on Solana",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F6F3EC] text-[#1a1a1a] min-h-screen`}
      >
        <QueryProvider>
          <WalletProvider>
            {children}
            <Toaster />
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
