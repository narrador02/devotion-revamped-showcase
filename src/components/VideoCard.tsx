import { Play, Quote } from "lucide-react";

interface VideoCardProps {
  videoId: string;
  title: string; // Author/Name (Small text at bottom)
  quote?: string; // Main text (Big text)
  onClick: () => void;
  className?: string;
}

const extractVideoId = (input: string) => {
  try {
    if (input.includes("shorts")) {
      return input.split("/shorts/")[1].split("?")[0];
    }
    if (input.includes("youtube.com") || input.includes("youtu.be")) {
      const url = new URL(input);
      return url.searchParams.get("v") || input.split("/").pop();
    }
    return input;
  } catch {
    return input;
  }
};

const VideoCard = ({ videoId, title, quote, onClick, className }: VideoCardProps) => {
  const id = extractVideoId(videoId);
  const thumbnailUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl cursor-pointer aspect-video shadow-2xl ${className}`}
      onClick={onClick}
    >
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 bg-black">
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />

      {/* Play Button - Centered Absolutely */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 transform scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </div>
      </div>

      {/* Content Container - Bottom Aligned */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">

        {/* Quote icon */}
        <Quote className="w-4 h-4 text-red-500 mb-1 opacity-0 -translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 delay-75" />

        {/* Quote text (Big) - 1 Line Only */}
        <h3 className="text-base md:text-lg font-rajdhani font-bold text-white leading-tight mb-2 truncate drop-shadow-lg w-full">
          {quote}
        </h3>

        {/* Red line and Name (Small) */}
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-1.5 bg-red-500 rounded-full shrink-0" />
          <p className="text-xs font-semibold text-white tracking-wide drop-shadow-md truncate opacity-90">
            {title}
          </p>
        </div>
      </div>

      {/* Hover Border Glow */}
      <div className="absolute inset-0 border-2 border-white/0 rounded-2xl transition-colors duration-300 group-hover:border-red-500/50 pointer-events-none" />
    </div>
  );
};

export default VideoCard;
