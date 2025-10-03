"use client";
import Navigation from "@/components/Navigation";
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

// gde koristiš toast


export default function Home() {
const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Simulacija fetch-a / inicijalizacije
    const t = setTimeout(() => setLoading(false), 2700);
    return () => clearTimeout(t);
  }, []);

    const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Preloader active={loading} onDone={() => console.log("preloader done")} cycleMs={900} />
      <Navigation />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <SocialProofBuy />
      <Hero />
      <BentoGrid />
      <SpecialOffer />
      <BonusSection />
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

      
      </main>
      
    </div>
  );
}
