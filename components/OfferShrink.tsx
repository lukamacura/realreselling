// components/Collapsible.tsx
"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";

export default function OfferShrink({
  title,
  children,
  defaultOpen = false,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const ease = cubicBezier(0.22, 1, 0.36, 1);

  return (
    <div className="rounded-2xl border my-2 border-white/10 bg-[#0E1319]/70">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl text-sm px-4 py-3 text-left"
      >
        <span className="font-semibold text-white/90">{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease }}
          className="shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-white/70" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
