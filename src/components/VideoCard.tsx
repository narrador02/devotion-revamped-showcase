import { Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoCardProps {
  videoId: string;
  title: string;
  onClick: () => void;
}

const VideoCard = ({ videoId, title, onClick }: VideoCardProps) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-primary/20 bg-card/50 backdrop-blur transition-all hover:scale-105 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full bg-primary p-4 transition-transform duration-300 group-hover:scale-110">
              <Play className="h-8 w-8 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-center font-rajdhani text-lg font-semibold text-foreground">
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
