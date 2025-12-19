import { Play, Trophy, MapPin, Bike } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
    videoId: string;
    fullName: string;
    competitions: string;
    achievements?: string;
    country?: string;
    quote?: string;
    onClick: () => void;
}

const ProfessionalVideoCard = ({
    videoId,
    fullName,
    competitions,
    achievements,
    country,
    quote,
    onClick,
}: Props) => {
    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={onClick}
            className="cursor-pointer rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all"
        >
            {/* VIDEO */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt={fullName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                        <Play className="text-white ml-1" />
                    </div>
                </div>
            </div>

            {/* INFO */}
            <div className="p-5 space-y-3">
                <h3 className="font-semibold text-lg">{fullName}</h3>

                <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Bike className="w-4 h-4 text-primary" />
                        <span>{competitions}</span>
                    </div>

                    {achievements && (
                        <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary" />
                            <span>{achievements}</span>
                        </div>
                    )}

                    {country && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{country}</span>
                        </div>
                    )}
                </div>

                {quote && (
                    <p className="text-sm italic text-muted-foreground pt-2">
                        “{quote}”
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export default ProfessionalVideoCard;
