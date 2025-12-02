import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Users, Settings, TrendingUp, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";

interface Event {
    id: string;
    name: string;
    type: 'motogp' | 'corporate' | 'expo';
    year: number;
    location: string;
    client: string;
    description: string;
    setup: {
        simulators: number;
        models: string[];
        duration: string;
        configuration?: string;
    };
    experience: string;
    results: {
        participants: number;
        highlights: string[];
    };
    images?: string[];
}

interface EventModalProps {
    event: Event | null;
    isOpen: boolean;
    onClose: () => void;
}

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
    if (!event) return null;

    const sections = [
        {
            icon: Calendar,
            title: "Información del evento",
            content: (
                <div className="space-y-3">
                    <div>
                        <span className="text-gray-400">Cliente:</span>
                        <span className="text-white ml-2 font-semibold">{event.client}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Lugar y fecha:</span>
                        <span className="text-white ml-2">{event.location}, {event.year}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Tipo:</span>
                        <span className="text-white ml-2 capitalize">{event.type}</span>
                    </div>
                    <p className="text-gray-300 mt-4">{event.description}</p>
                </div>
            )
        },
        {
            icon: Settings,
            title: "Qué instalamos",
            content: (
                <div className="space-y-3">
                    <div>
                        <span className="text-gray-400">Simuladores:</span>
                        <span className="text-white ml-2 font-semibold">{event.setup.simulators} unidades</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Modelos:</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {event.setup.models.map((model, idx) => (
                                <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white">
                                    {model}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <span className="text-gray-400">Duración:</span>
                        <span className="text-white ml-2">{event.setup.duration}</span>
                    </div>
                    {event.setup.configuration && (
                        <div>
                            <span className="text-gray-400">Configuración especial:</span>
                            <p className="text-white mt-2">{event.setup.configuration}</p>
                        </div>
                    )}
                </div>
            )
        },
        {
            icon: Users,
            title: "La experiencia del público",
            content: (
                <p className="text-gray-300 leading-relaxed">{event.experience}</p>
            )
        },
        {
            icon: TrendingUp,
            title: "Resultados",
            content: (
                <div className="space-y-3">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="text-3xl font-bold font-rajdhani text-red-400">
                            ~{event.results.participants.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">Participantes</div>
                    </div>
                    <ul className="space-y-2 mt-4">
                        {event.results.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span className="text-gray-300">{highlight}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-hidden"
                    >
                        <div className="h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col">
                            {/* Header */}
                            <div className="relative p-6 border-b border-white/10">
                                <h2 className="text-2xl md:text-3xl font-bold font-rajdhani text-white pr-12">
                                    {event.name}
                                </h2>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {event.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {event.year}
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="max-w-4xl mx-auto space-y-8">
                                    {sections.map((section, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white/5 border border-white/10 rounded-xl p-6"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <section.icon className="w-5 h-5 text-red-500" />
                                                <h3 className="text-xl font-rajdhani font-bold text-white">
                                                    {section.title}
                                                </h3>
                                            </div>
                                            {section.content}
                                        </motion.div>
                                    ))}

                                    {/* Gallery Section */}
                                    {event.images && event.images.length > 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: sections.length * 0.1 }}
                                            className="bg-white/5 border border-white/10 rounded-xl p-6"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <ImageIcon className="w-5 h-5 text-red-500" />
                                                <h3 className="text-xl font-rajdhani font-bold text-white">Galería</h3>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {event.images.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt={`${event.name} - ${idx + 1}`}
                                                        className="w-full aspect-video object-cover rounded-lg"
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: sections.length * 0.1 }}
                                            className="bg-white/5 border border-white/10 rounded-xl p-6"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <ImageIcon className="w-5 h-5 text-red-500" />
                                                <h3 className="text-xl font-rajdhani font-bold text-white">Galería</h3>
                                            </div>
                                            <div className="text-center py-8 text-gray-400">
                                                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                                <p>Imágenes próximamente</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EventModal;
