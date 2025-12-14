// app/page.tsx (SERVER)
export const dynamic = "force-static";  // ili ukloni sve što forsira dynamic
export const revalidate = 300;          // ISR – obnavlja HTML na 5 min

import Navigation from "@/components/Navigation";
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
