import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SanTayo – Saan Tayo Kakain?",
    template: "%s | SanTayo",
  },
  description:
    "Hindi makapag-decide? Kami na bahala. Find what to eat in BGC in under 30 seconds.",

  // 🔥 Brand clarity + SEO
  applicationName: 'SanTayo',
  keywords: [
    'SanTayo',
    'Saan Tayo Kakain',
    'BGC restaurants',
    'where to eat BGC',
    'food decision app Philippines'
  ],
      
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/saan-tayo-logo.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
