"use client";

import { useEffect } from "react";
import ReactPixel from "react-facebook-pixel";

export default function PixelTracker() {
  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "622346010959688";
    ReactPixel.init(pixelId);
    ReactPixel.pageView();
  }, []);

  return null;
}
