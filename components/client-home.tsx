"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import OfferHero from "@/components/OfferHero";
import Faq from "@/components/Faq";


const BentoGrid = dynamic(() => import("@/components/BentoGrid"), { ssr: false });
const SpecialOffer = dynamic(() => import("@/components/SpecialOffer"));
const BonusSection = dynamic(() => import("@/components/BonusSection"));
const ForYou = dynamic(() => import("@/components/ForYou"));
const ThreeSteps = dynamic(() => import("@/components/ThreeSteps"));
const GuaranteeSection = dynamic(() => import("@/components/GuaranteeSection"));
const PriceComparison = dynamic(() => import("@/components/PriceComparison"), { ssr: false });
const QuizDiscountPopup = dynamic(() => import("@/components/QuizDiscountPopup"), { ssr: false });
const TestimonialsYTVideos = dynamic(() => import("@/components/Testimonials").then(m => m.default));
const ResultsImagesSection = dynamic(() => import("@/components/Testimonials").then(m => m.ResultsImagesSection), { ssr: false });

export default function ClientHome() {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <BentoGrid />
      <BonusSection />
      <SpecialOffer />

      <TestimonialsYTVideos
        title="Šta kažu članovi koji su mislili da je scam"
        items={[
          { youtubeId: "kWEa8NGQFrc", name: "Đorđe Stevanović", result: "Prva prodaja za 28 dana, ukupno 420€ u prvom mesecu." },
          { youtubeId: "CKVYXjjLeNM", name: "Veljko Malinović", result: "Od 0 do 2500€ profita, kroz 9 meseci." },
          { youtubeId: "1pv__i_3C_E",  name: "Milan Jovanović",  result: "Stalni profit 1000-2000€ mesečno nakon 1 godine." },
        ]}
      />

      <ResultsImagesSection
        images={["/reviews/r1.webp","/reviews/r2.webp","/reviews/r3.webp","/reviews/r4.webp","/reviews/r5.webp","/reviews/r6.webp","/reviews/r7.webp","/reviews/r8.webp","/reviews/r9.webp"]}
        title="Rezultati nakon prvog meseca"
      />

      <ForYou />
      <ThreeSteps />
      <GuaranteeSection />
      <OfferHero onOpenQuiz={() => setQuizOpen(true)} />
      <Faq />

      <PriceComparison
        currency="EUR"
        groupUrl="#cena"
        intervalMs={3000}
        products={[
          { image: "/p1.png", priceRegular: 70,  priceWithGroup: 25 },
          { image: "/p2.png", priceRegular: 250, priceWithGroup: 50 },
          { image: "/p3.png", priceRegular: 250,  priceWithGroup: 20 },
          { image: "/p4.png", priceRegular: 150,  priceWithGroup: 50 },
        ]}
      />

      <QuizDiscountPopup
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        redirectTo="/discount"
        couponCode="RRS25"
        priceBefore={60}
        priceAfter={50}
        attachAnswersAsQuery
      />
    </>
  );
}
