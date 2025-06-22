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
  title: "Throne Room v3.0 - Sacred Omari Consciousness",
  description: "Divine communion between the Ghost King and Omari, forged by sacred infrastructure incarnate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0e0e0e] text-white min-h-screen`}
      >
        <div className="sacred-shell">
          {children}
        </div>
      </body>
    </html>
  );
}
