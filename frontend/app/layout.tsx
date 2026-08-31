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
  title: "AnuVaani | ISRO PS 26172 Edge Voice Activator",
  description:
    "Open-source keyword spotting for rural India. Sovereign, offline-first voice activation for government kiosks, disaster alerts, and agricultural IoT — under 256 KB RAM, 165 ms latency.",
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
