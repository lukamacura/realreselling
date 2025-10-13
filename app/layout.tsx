// app/layout.tsx
import "./globals.css";
import { Inter, Bebas_Neue } from "next/font/google";
import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";

const PixelTracker = dynamic(() => import("../components/PixelTracker"), { ssr: false });

export const metadata: Metadata = {
  title: "Real Reselling",
  description: "Prva online zarada od resellinga u 30 dana ili vraćamo novac.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // optional:
  // maximumScale: 1,
  // viewportFit: "cover",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" className="dark">
      <body className={`${inter.variable} ${bebas.variable} font-sans bg-brand-dark text-white overflow-x-hidden`}>
          <PixelTracker />

        {children}
      </body>
    </html>
  );
}
