/* eslint-disable @next/next/no-img-element */
// components/TestimonialsYTVideos.tsx
"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";

type VideoItem = {
  youtubeId: string;
  name: string;
  result: string;
  startSeconds?: number;
};

/* ---------- Galerija rezultata (poziva se VAN grid-a videa) ---------- */
export function ResultsImagesSection({
  images = ["/r1.webp", "/r2.webp", "/r3.webp"],
  title = "Rezultati članova",
  perPage = 3,
}: {
  images?: string[];
  title?: string;
  perPage?: number;
}) {
  const [visible, setVisible] = useState(perPage);
  const canLoadMore = visible < images.length;

  return (
    <section className="mx-auto w-full py-10">
      <div className="container max-w-6xl px-4">
        <h2 className="mb-6 text-center font-display text-3xl font-bold text-white md:text-4xl">
          {title}
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {images.slice(0, visible).map((src, i) => (
            <div
              key={src + i}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#12171E]/70 shadow-[0_18px_50px_rgba(0,0,0,.45)]"
            >
              <div className="relative aspect-[1/1] w-full">
                <Image
                  src={src}
                  alt={`Rezultat ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  priority={i < 3}
                />
              </div>
            </div>
          ))}
        </div>

        {canLoadMore && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() =>
                setVisible((v) => Math.min(v + perPage, images.length))
              }
              className="rounded-full border border-amber-400/60 bg-amber-400/10 px-5 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/20"
            >
              Učitaj još
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Grid sa 3 YouTube videa ---------- */
export default function Testimonials({
  items,
  title = "Iskustva članova",
}: {
  items: VideoItem[];
  title?: string;
}) {
  return (
    <section className="mx-auto w-full py-10" id="recenzije">
      <div className="container max-w-6xl px-4">
        <h2 className="mb-6 text-center font-display text-3xl font-bold text-white md:text-4xl">
          {title}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.slice(0, 3).map((v, i) => (
            <VideoCard key={v.youtubeId + i} {...v} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Pojedinačna kartica videa (bez galerije unutra!) ---------- */
function VideoCard({ youtubeId, name, result, startSeconds }: VideoItem) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#12171E]/80 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
      <div className="relative overflow-hidden rounded-xl bg-black">
        <div className="aspect-video w-full">
          {!playing ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPlaying(true);
                }
              }}
              className="relative block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
              aria-label={`Pusti video: ${name}`}
            >
              <img
                src={thumb}
                alt={`YouTube thumbnail za ${name}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/30">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 ring-2 ring-white/80 transition group-hover:scale-105">
                  <Play className="ml-[2px] h-7 w-7 text-black" aria-hidden />
                </span>
              </span>
            </button>
          ) : (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1${
                startSeconds ? `&start=${startSeconds}` : ""
              }`}
              title={name}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; autoplay"
              allowFullScreen
            />
          )}
        </div>
      </div>

      <div className="mt-3 px-1 pb-1">
        <h3 className="font-display text-lg font-semibold text-white">{name}</h3>
        <p className="mt-1 text-sm text-white/80">{result}</p>
      </div>
    </article>
  );
}
