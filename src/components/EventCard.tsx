import { motion } from "framer-motion";
import { MapPin, Calendar, Tag } from "lucide-react";

interface EventCardProps {
    id: string;
    name: string;
    year: number;
    location: string;
    type: 'motogp' | 'corporate' | 'expo';
    image?: string;
    onClick: () => void;
}

const typeColors = {
    motogp: 'from-red-500 to-orange-500',
    corporate: 'from-blue-500 to-cyan-500',
    expo: 'from-purple-500 to-pink-500'
};

const typeLabels = {
    motogp: 'MotoGP',
    corporate: 'Corporativo',
    expo: 'Feria / Expo'
};

const EventCard = ({ name, year, location, type, image, onClick }: EventCardProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={onClick}
            className="group cursor-pointer relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]"
        >
            {/* Image or Gradient Placeholder */}
            <div className="relative aspect-video overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${typeColors[type]} opacity-20 flex items-center justify-center`}>
                        <div className="text-white/30 text-center p-6">
                            <Calendar className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm font-medium">Imagen del evento</p>
                        </div>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Type tag */}
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${typeColors[type]} text-white shadow-lg`}>
                        {typeLabels[type]}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-rajdhani font-bold text-white mb-3 line-clamp-2 group-hover:text-red-400 transition-colors">
                    {name}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{year}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{location}</span>
                    </div>
                </div>
            </div>

            {/* Hover indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </motion.div>
    );
};

export default EventCard;
