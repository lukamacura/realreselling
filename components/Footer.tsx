import React from "react";
import { Instagram } from "lucide-react";

/**
 * Footer component for Real Reselling
 * - Instagram link (opens in new tab)
 * - Copyright with current year
 * - Link to /terms (Uslovi i politika)
 *
 * TailwindCSS required. lucide-react is used for the Instagram icon.
 */

export type FooterProps = {
  brandName?: string;
  instagramUrl?: string; // e.g. "https://instagram.com/real.reselling"
  className?: string;
};

const Footer: React.FC<FooterProps> = ({
  brandName = "Real Reselling",
  instagramUrl = "https://www.instagram.com/rrealreselling/",
  className = "",
}) => {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`pb-40 w-full border-t border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-neutral-950/60 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
          {/* Left: Copyright */}
          <div className="text-md text-neutral-600 dark:text-neutral-400">
            © {year} {brandName}. Real Reselling is operated by RR Team Consulting LLC, a registered company in Wyoming, USA
          </div>

          {/* Middle: /terms link */}
          <a
            href="/terms"
            className="text-xs font-medium text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
          >
            Terms of Service
          </a>
          <a
            href="/privacy"
            className="text-xs font-medium text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
          >
            Privacy Policy
          </a>

          {/* Right: Instagram */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
            aria-label="Instagram profil"
            title="Instagram"
          >
            <Instagram className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">Instagram</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
