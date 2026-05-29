import type { Metadata } from "next";
import { Cinzel, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/AuthProvider";

const cinzel = Cinzel({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Empire English Community — Forged in Language. Crowned in Mastery.",
  description: "An elite imperial English transformation academy. Enter the Empire, complete the Four Trials, prove your worth, and earn your Imperial Rank.",
  keywords: ["English", "Assessment", "Placement Test", "Imperial", "Language Learning"],
  icons: {
    icon: "/favicon.ico",
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
        className={`${cinzel.variable} ${playfair.variable} antialiased bg-[#0a0a0a] text-[#e8e0d0]`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
