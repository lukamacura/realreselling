// app/page.tsx (SERVER)
export const dynamic = "force-static";  // ili ukloni sve što forsira dynamic
export const revalidate = 300;          // ISR – obnavlja HTML na 5 min

import type { Metadata } from "next";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Real Reselling — Nauči da zarađuješ od resellinga",
  description:
    "Prva online zarada od resellinga u 30 dana ili vraćamo novac. Kompletna edukacija, zajednica i alati za početak.",
  openGraph: {
    title: "Real Reselling — Nauči da zarađuješ od resellinga",
    description:
      "Prva online zarada od resellinga u 30 dana ili vraćamo novac.",
    url: "https://realreselling.com",
  },
};
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SocialProofBuy from "@/components/SocialProofBuy";
import ClientHome from "@/components/client-home"; // vidi dole
import Youtube from "@/components/Youtube"; // vidi dole
import SnowCanvas from "@/components/SnowCanvas";


export default function Page() {
  return (
    <>
      <Navigation />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <SnowCanvas className="pointer-events-none absolute inset-0 z-0 opacity-80" />

        <SocialProofBuy />
        <Hero />
        <Youtube videoId="YHgKyEFUQeE" title="VSL" />

        <ClientHome />
        <Footer />
      </main>
    </>
  );
}
