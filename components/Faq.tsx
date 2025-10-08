"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItemProps {
  question: string;
  answer: string;
}

const faqs: FaqItemProps[] = [
  {
    question: "Nemam iskustva, da li je ovo za mene?",
    answer: "Da. Program je napravljen za početnike i vodi te korak po korak kroz ceo proces.",
  },
  {
    question: "Koliko dnevno treba vremena?",
    answer: "Dovoljno je 1-2 sata dnevno u početku da vidiš prve rezultate.",
  },
  {
    question: "Gde nalazim robu?",
    answer: "Dobijaš listu od 1500+ proverenih proizvoda po nabavnim cenama koje možeš odmah ponuditi.",
  },
  {
    question: "Šta ako zapnem?",
    answer: "Imaš zajednicu i mentore 24/7 koji su tu da ti pomognu.",
  },
  {
    question: "Povraćaj novca?",
    answer: "Ako ne napraviš prvu prodaju, vraćamo ti ceo iznos bez pitanja.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-[#0B0F13] pb-16 mx-auto text-white">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="mb-10 font-display text-center text-3xl font-bold md:text-6xl">
          Česta pitanja
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer, isOpen, onClick }: FaqItemProps & { isOpen: boolean; onClick: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-[#12171E]">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between px-10 py-4 text-left text-lg font-medium focus:outline-none"
      >
        <span className="mr-2 text-sm md:text-lg">{question}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-black">
          <ChevronDown
            className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </span>
      </button>
      {isOpen && (
        <div className="px-10 pb-4 text-white/80">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
