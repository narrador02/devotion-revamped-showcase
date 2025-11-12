import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

const VideoModal = ({ isOpen, onClose, videoId, title }: VideoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="font-rajdhani text-2xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full overflow-hidden rounded-b-lg">
          {isOpen && (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="border-0"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
