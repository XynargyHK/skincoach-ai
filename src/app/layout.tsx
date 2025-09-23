import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import OneSignalProvider from "@/components/OneSignalProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://skincoach.ai'),
  title: "SkinCoach.ai - AI-Powered Personalized Skincare | Prescription-Grade Formulas",
  description: "Revolutionary AI skincare that adapts to your skin, climate, and lifestyle. Get prescription-grade, personalized formulas with nanotech boosters. FDA registered, dermatologist-tested. Transform your skin with AI intelligence.",
  keywords: "AI skincare, personalized skincare, prescription skincare, dermatologist tested, anti-aging, acne treatment, custom skincare routine, nanotech skincare, FDA registered skincare",
  authors: [{ name: "SkinCoach.ai" }],
  creator: "SkinCoach.ai",
  publisher: "SkinCoach.ai",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skincoach.ai',
    siteName: 'SkinCoach.ai',
    title: 'SkinCoach.ai - AI-Powered Personalized Skincare',
    description: 'Revolutionary AI skincare that adapts to your skin, climate, and lifestyle. Get prescription-grade, personalized formulas with nanotech boosters.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SkinCoach.ai - AI-Powered Personalized Skincare',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkinCoach.ai - AI-Powered Personalized Skincare',
    description: 'Revolutionary AI skincare that adapts to your skin, climate, and lifestyle. Get prescription-grade, personalized formulas.',
    images: ['/twitter-image.jpg'],
    creator: '@skincoach_ai',
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://skincoach.ai',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OneSignalProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </OneSignalProvider>
      </body>
    </html>
  );
}
