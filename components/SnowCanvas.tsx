"use client";

import { useEffect, useRef } from "react";

export default function SnowCanvas({
  className = "",
  density = 140,
  speed = 0.6,
}: {
  className?: string;
  density?: number;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const DPR = Math.min(2, window.devicePixelRatio || 1);

    type Flake = {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      a: number;
      tw: number;
    };

    let flakes: Flake[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      const rect = parent
        ? parent.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };

      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      flakes = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 2.4,
        vx: (-0.15 + Math.random() * 0.3) * 60 * speed,
        vy: (0.25 + Math.random() * 0.85) * 60 * speed,
        a: 0.25 + Math.random() * 0.55,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (const f of flakes) {
        f.tw += 0.02;
        const twinkle = 0.75 + 0.25 * Math.sin(f.tw);

        f.x += f.vx / 60;
        f.y += f.vy / 60;

        if (f.y - f.r > h) {
          f.y = -f.r;
          f.x = Math.random() * w;
        }
        if (f.x < -10) f.x = w + 10;
        if (f.x > w + 10) f.x = -10;

        ctx.beginPath();
        ctx.globalAlpha = f.a * twinkle;
        ctx.fillStyle = "rgba(255, 250, 240, 1)";
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    resize();
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [density, speed]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
