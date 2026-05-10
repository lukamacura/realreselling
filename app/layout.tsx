/* eslint-disable @next/next/no-img-element */
import "./globals.css";
import { Inter, Bebas_Neue } from "next/font/google";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
// import MaintancePage from "@/components/MaintancePage";


export const metadata: Metadata = {
  metadataBase: new URL("https://realreselling.com"),
  title: {
    default: "Real Reselling — Nauči da zarađuješ od resellinga",
    template: "%s | Real Reselling",
  },
  description:
    "Prva online zarada od resellinga u 30 dana ili vraćamo novac. Kompletna edukacija, zajednica i alati.",
  openGraph: {
    type: "website",
    locale: "sr_RS",
    siteName: "Real Reselling",
    title: "Real Reselling — Nauči da zarađuješ od resellinga",
    description:
      "Prva online zarada od resellinga u 30 dana ili vraćamo novac. Kompletna edukacija, zajednica i alati.",
    url: "https://realreselling.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Reselling — Nauči da zarađuješ od resellinga",
    description:
      "Prva online zarada od resellinga u 30 dana ili vraćamo novac.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  return (

    <html lang="sr" className="dark">
      <head>
        {pixelId && (
          <>
            <Script id="fb-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s){
                  if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)
                }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body className={`${inter.variable} ${bebas.variable} font-sans bg-brand-dark text-white overflow-x-hidden`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
