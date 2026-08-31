import type { Metadata } from "next";
import { JetBrains_Mono, Urbanist } from "next/font/google";

import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoiceCore | Low-Latency Edge Voice Activator",
  description:
    "Open-source keyword spotting for ISRO PS 26172. Ultra-lightweight KWS on microcontrollers with hybrid edge-to-ASR streaming. SIH 2026 Smart Automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.variable} ${jetbrains.variable}`}>
        {children}
      </body>
    </html>
  );
}
