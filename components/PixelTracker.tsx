// components/PixelTracker.tsx  (može i .js ako želiš)
// ✅ App Router, Client Component

"use client";

import { useEffect, useRef } from "react";
import ReactPixel from "react-facebook-pixel";
import { usePathname, useSearchParams } from "next/navigation";

const PixelTracker = () => {
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
    // initial page view on first mount
    ReactPixel.pageView();
  }, []);

  useEffect(() => {
    // fire on route/search changes
    if (initialized.current) {
      ReactPixel.pageView();
    }
  }, [pathname, searchParams]);

  return null;
};

export default PixelTracker;
