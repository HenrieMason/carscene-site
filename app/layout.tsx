import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import FacebookPixel from "./components/FacebookPixel";
import ClarityProvider from "./components/Clarity";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarScene | Custom Dream 9 Car Shirts",
  description:
    "Create a custom Dream 9 shirt with your 9 favorite cars. Search 1,596 cars, build your lineup, and order your shirt.",

  icons: {
    icon: "/icon.png?v=3",
  },

  openGraph: {
    title: "CarScene | Custom Dream 9 Car Shirts",
    description:
      "Create a custom Dream 9 shirt with your 9 favorite cars. Search 1,596 cars, build your lineup, and order your shirt.",
    url: "https://carsceneapp.com",
    siteName: "CarScene",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CarScene Dream 9 Shirt",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "CarScene | Custom Dream 9 Car Shirts",
    description:
      "Create a custom Dream 9 shirt with your 9 favorite cars. Search 1,596 cars, build your lineup, and order your shirt.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${geistSans.className} min-h-full flex flex-col`}>
        <FacebookPixel />
        <ClarityProvider />
        {children}
        <Analytics />
      </body>
    </html>
  );
}