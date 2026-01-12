import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "TTiG | 띠지",
  description: "Curating Seoul's Vibe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased bg-ttig-bg text-ttig-text min-h-screen">
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
