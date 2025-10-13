// lib/pixel.ts
"use client";

// Minimalni tipovi za react-facebook-pixel (lib nema zvanične tipove)
type PixelParams = Record<string, unknown>;

interface ReactFacebookPixel {
  init: (
    pixelId: string,
    advancedMatching?: PixelParams,
    options?: PixelParams
  ) => void;
  pageView: () => void;
  track: (event: string, params?: PixelParams) => void;
  trackCustom: (event: string, params?: PixelParams) => void;
}

let _pixel: ReactFacebookPixel | null = null;
let _initDone = false;

async function getPixel(): Promise<ReactFacebookPixel> {
  if (_pixel) return _pixel;

  // Dinamički import i “cast” na naš interfejs
  const mod = await import("react-facebook-pixel");
  const ReactPixel = (mod.default ?? mod) as unknown as ReactFacebookPixel;

  _pixel = ReactPixel;
  return ReactPixel;
}

export async function initPixel(): Promise<void> {
  if (_initDone) return;

  const id = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  if (!id) return;

  const ReactPixel = await getPixel();
  ReactPixel.init(id, undefined, { autoConfig: true, debug: false });
  _initDone = true;
}

export async function pageView(): Promise<void> {
  await initPixel();
  const ReactPixel = await getPixel();
  ReactPixel.pageView();
}

export async function track(
  eventName: string,
  params?: PixelParams
): Promise<void> {
  await initPixel();
  const ReactPixel = await getPixel();
  ReactPixel.track(eventName, params);
}

export async function trackCustom(
  eventName: string,
  params?: PixelParams
): Promise<void> {
  await initPixel();
  const ReactPixel = await getPixel();
  ReactPixel.trackCustom(eventName, params);
}
