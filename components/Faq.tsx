"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItemProps {
  question: string;
  answer: string;
}

const faqs: FaqItemProps[] = [
  {
    question: "Nemam iskustva, da li je ovo za mene?",
    answer:
      "Da. Program je napravljen za početnike i vodi te korak po korak kroz ceo proces.",
  },
  {
    question: "Koliko dnevno treba vremena?",
    answer: "Dovoljno je 1-2 sata dnevno u početku da vidiš prve rezultate.",
  },
  {
    question: "Gde nalazim robu?",
    answer:
      "Dobijaš listu od 1500+ proverenih proizvoda po nabavnim cenama koje možeš odmah ponuditi.",
  },
  {
    question: "Šta ako zapnem?",
    answer: "Imaš zajednicu i mentore 24/7 koji su tu da ti pomognu.",
  },
  {
    question: "Povraćaj novca?",
    answer:
      "Ako ne napraviš prvu prodaju, vraćamo ti ceo iznos bez pitanja.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-[#0B0F13] pb-16 mx-auto text-white">
      <motion.div
        className="container mx-auto max-w-3xl px-4"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h2
          className="mb-10 font-display text-center text-3xl font-bold md:text-6xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Česta pitanja
        </motion.h2>

        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function FaqItem({
  question,
  answer,
  isOpen,
  onClick,
}: FaqItemProps & { isOpen: boolean; onClick: () => void; index: number }) {
  return (
    <motion.div
      className="overflow-hidden rounded-2xl border border-white/20 bg-[#12171E]"
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
      }}
      layout
    >
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-10 py-4 text-left text-lg font-medium focus:outline-none"
      >
        <span className="mr-2 text-sm md:text-lg">{question}</span>
        <motion.span
          className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-black"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>
      

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-10 pb-4 text-white/80">
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
              >
                {answer}
              </motion.p>
            </div>
            
          </motion.div>
          
        )}
        
      </AnimatePresence>
        
    </motion.div>
    
    
  );
}
