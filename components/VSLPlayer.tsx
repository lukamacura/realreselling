type Props = {
  src?: string;
  poster?: string;
  className?: string;
};

export default function VSLPlayer({
  src = "/videos/vsl.mp4",
  poster = "/videos/vsl-poster.jpg",
  className = "",
}: Props) {
  return (
    <div className={`w-full max-w-4xl mx-auto rounded-2xl overflow-hidden ${className}`}>
      <video
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="w-full h-auto"
        style={{ aspectRatio: "16 / 9" }} // sprečava CLS
      />
    </div>
  );
}
