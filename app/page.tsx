"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import SpecialOffer from "@/components/SpecialOffer";
import BonusSection from "@/components/BonusSection";
import ForYou from "@/components/ForYou";
import ThreeSteps from "@/components/ThreeSteps";
import GuaranteeSection from "@/components/GuaranteeSection";
import OfferHero from "@/components/OfferHero";
import Faq from "@/components/Faq";
import SocialProofBuy from "@/components/SocialProofBuy";
import QuizDiscountPopup from "@/components/QuizDiscountPopup";
import VSLPlayer from "@/components/VSLPlayer";
import TestimonialsYTVideos, { ResultsImagesSection } from "@/components/Testimonials";
import { redirect } from "next/navigation";

// gde koristiš toast


export default function Home() {
const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Simulacija fetch-a / inicijalizacije
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

    const [quizOpen, setQuizOpen] = useState(false);

      redirect("/odrzavanje");


  return (
    <>
    
     <Preloader active={loading} onDone={() => console.log("preloader done")} cycleMs={1100} />
      <Navigation />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <SocialProofBuy />
      <Hero />
      <VSLPlayer
        poster="/vsl1-poster.jpg"
        sources={[
          { src: "/vsl1.webm", type: "video/webm" }, // opcionalno
          { src: "/vsl1.mp4",  type: "video/mp4"  },
        ]}
      />
   
      <BentoGrid />
      <BonusSection />
      <SpecialOffer />
   

     <TestimonialsYTVideos
        title="Šta kažu članovi koji su mislili da je scam"
      items={[
        {
          youtubeId: "kWEa8NGQFrc",
          name: "Đorđe Stevanović",
          result: "Prva prodaja za 28 dana, ukupno 420€ u prvom mesecu.",
        },
        {
          youtubeId: "CKVYXjjLeNM",
          name: "Veljko Malinović",
          result: "Od 0 do 2500€ profita, kroz 9 meseci.",
        },
        {
          youtubeId: "1pv__i_3C_E",
          name: "Milan Jovanović",
          result: "Stalni profit 1000-2000€ mesečno nakon 1 godine.",
        },]}/>
    

      <ResultsImagesSection
        images={["/reviews/r1.webp", "/reviews/r2.webp", "/reviews/r3.webp", "/reviews/r4.webp", "/reviews/r5.webp", "/reviews/r6.webp",  "/reviews/r7.webp",  "/reviews/r8.webp",  "/reviews/r9.webp"]}
        title="Rezultati nakon prvog meseca"
      />
      <ForYou />
      <ThreeSteps />
      <GuaranteeSection />
      <OfferHero onOpenQuiz={() => setQuizOpen(true)}/>
      <Faq />

  
      <QuizDiscountPopup
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        redirectTo="/discount"
        couponCode="RRS25"
        priceBefore={60}
        priceAfter={50}
        attachAnswersAsQuery
      />

      <Footer />
      </main>
    </>
     

      
      
      
  );
}
