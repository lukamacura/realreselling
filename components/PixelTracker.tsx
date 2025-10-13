"use client";

import { useEffect, useRef } from "react";
import ReactPixel from "react-facebook-pixel";
import { usePathname, useSearchParams } from "next/navigation";

export default function PixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "YOUR_PIXEL_ID";
    if (!pixelId) return;
    if (!initialized.current) {
      ReactPixel.init(pixelId, undefined, { autoConfig: true, debug: false });
      initialized.current = true;
    }
    ReactPixel.pageView(); // initial
  }, []);

  useEffect(() => {
    if (initialized.current) ReactPixel.pageView();
  }, [pathname, searchParams]);

  return null;
}
