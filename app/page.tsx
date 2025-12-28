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

        {/* Fiksiran kružni baner za Božićni popust */}
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-slow">
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-2xl ring-4 ring-red-400/30">
            {/* Dekorativni sjaj */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20"></div>

            <div className="relative z-10 text-center px-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-white/90 leading-tight">
                U toku je
              </p>
              <p className="text-xs font-extrabold uppercase text-white leading-tight mt-0.5">
                Praznični
              </p>
              <p className="text-xs font-extrabold uppercase text-white leading-tight">
                Popust
              </p>
              <div className="mt-1 mb-1 h-px bg-white/40"></div>
              <p className="text-[10px] font-semibold uppercase text-amber-300 tracking-wider">
                Kod: BOZIC
              </p>
              <p className="text-lg font-black text-white leading-none mt-1">
                22% <span className="text-sm">OFF</span>
              </p>
            </div>

            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full ring-2 ring-white/40 animate-ping"></div>
          </div>
        </div>

        <SocialProofBuy />
        <Hero />
        <Youtube videoId="YHgKyEFUQeE" title="VSL" />

        <ClientHome />
        <Footer />
      </main>
    </>
  );
}
