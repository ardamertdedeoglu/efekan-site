import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Örnek Sağlık | Güvenilir Tanı ve Tedavi",
    template: "%s | Örnek Sağlık",
  },
  description:
    "Modern teknoloji ve uzman kadro ile poliklinik, laboratuvar, görüntüleme ve acil servis hizmetleri.",
  keywords: [
    "sağlık",
    "klinik",
    "hastane",
    "laboratuvar",
    "görüntüleme",
    "acil servis",
    "check-up",
  ],
  metadataBase: new URL("https://www.ornekklinik.com"),
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Örnek Sağlık | Güvenilir Tanı ve Tedavi",
    description:
      "Modern teknoloji ve uzman kadro ile poliklinik, laboratuvar, görüntüleme ve acil servis hizmetleri.",
    url: "/",
    siteName: "Örnek Sağlık",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
