import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AiChatWidget from "@/components/chat/AiChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AXIOM Logic — AI Automation & Intelligent Workflows",
  description:
    "Enterprise AI automation infrastructure. Transform repetitive operations into connected, high-reliability intelligent workflows.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/axiom-symbol.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-white text-[#0F172A] antialiased">
        {children}
        <AiChatWidget />
      </body>
    </html>
  );
}
