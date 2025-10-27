import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1) Optimizuj slike (služe se iz CDN-a i manje pogađaju edge)
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 dana
    // Ako vučeš remote slike, dozvoli samo domene koje treba:
    // remotePatterns: [{ protocol: "https", hostname: "img.example.com" }],
  },

  // 2) Keširanje kroz HTTP zaglavlja (Vercel CDN ih poštuje)
  async headers() {
    return [
      // _next/static i assets iz /public — agresivno keširanje
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // sve slike/ikonice iz /public
        source: "/:all*(png|jpg|jpeg|gif|webp|avif|svg|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // video/audio fajlovi — dugo keširanje (meni 30d je praktično)
        source: "/:all*(mp4|webm|mov|mp3|wav)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, immutable" },
        ],
      },
      {
        // API koji sme da se kešira na CDN-u (stale-while-revalidate)
        source: "/api/public/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=86400" },
        ],
      },
      {
        // Dinamičke HTML strane — bez keša na CDN-u (spreči duplikate)
        source: "/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },

  // 3) (po želji) minify i sl.
  reactStrictMode: true,
  swcMinify: true,
};

export default withNextVideo(nextConfig);