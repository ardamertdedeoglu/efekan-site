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
    default: "Başakşehir Evlere Sağlık | Evinizdeki İlaç",
    template: "%s | Başakşehir Evlere Sağlık",
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
  metadataBase: new URL("https://basaksehir-evde-saglik.vercel.app/"),
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Başakşehir Evlere Sağlık | Evinizdeki İlaç",
    description:
      "Modern teknoloji ve uzman kadro ile poliklinik, laboratuvar, görüntüleme ve acil servis hizmetleri.",
    url: "/",
    siteName: "Başakşehir Evlere Sağlık",
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
