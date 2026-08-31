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
  title: "AnuVanni | Low-Latency Edge Voice Activator",
  description:
    "Open-source keyword spotting for microcontrollers. Ultra-lightweight KWS with hybrid edge-to-ASR streaming and real-time fleet monitoring.",
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
