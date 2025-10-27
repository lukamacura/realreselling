// components/YouTube.tsx
type Props = {
  videoId: string;           // npr. "YHgKyEFUQeE"
  title?: string;
  className?: string;
};

export default function YouTube({ videoId, title = "Video", className = "" }: Props) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
  return (
    <div className={`w-full max-w-4xl mx-auto overflow-hidden rounded-2xl ${className}`}>
      <div style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
