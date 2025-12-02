import { Play, Quote } from "lucide-react";

interface VideoCardProps {
  videoId: string;
  title: string; // Author/Name
  quote?: string; // The catchy phrase
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
  const thumbnailUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`; // Try maxres for better quality

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
            // Fallback to hqdefault if maxres doesn't exist
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />

      {/* Content Container */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">

        {/* Top: Play Button (Hidden by default, shows on hover) */}
        <div className="flex justify-end">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-110">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>

        {/* Bottom: Text Content */}
        <div className="transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
          <Quote className="w-8 h-8 text-cyan-400 mb-3 opacity-0 -translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 delay-75" />

          <h3 className="text-2xl md:text-3xl font-rajdhani font-bold text-white leading-none mb-3 line-clamp-3 drop-shadow-lg">
            {quote || title}
          </h3>

          <div className="flex items-center gap-2">
            <div className="h-0.5 w-8 bg-cyan-500 rounded-full" />
            <p className="text-base font-semibold text-white tracking-wide drop-shadow-md">
              {quote ? title : "Watch Video"}
            </p>
          </div>
        </div>
      </div>

      {/* Hover Border Glow */}
      <div className="absolute inset-0 border-2 border-white/0 rounded-2xl transition-colors duration-300 group-hover:border-cyan-500/50 pointer-events-none" />
    </div>
  );
};

export default VideoCard;
