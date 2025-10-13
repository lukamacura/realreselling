"use client";

import { useEffect } from "react";

export default function PixelTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard

    (async () => {
      const mod = await import("react-facebook-pixel");
      const ReactPixel = mod.default;

      const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "622346010959688";
      ReactPixel.init(pixelId);
      ReactPixel.pageView();
    })();
  }, []);

  return null;
}
