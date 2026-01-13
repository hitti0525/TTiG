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
      <head>
        {/* 1. 구글 태그 관리자 Head - Next.js 문법에 맞춰 수정했습니다. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P2L2CXQC');`,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-ttig-bg text-ttig-text min-h-screen">
        {/* 2. 구글 태그 관리자 Body (noscript) - style 속성 에러를 해결했습니다. */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P2L2CXQC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}