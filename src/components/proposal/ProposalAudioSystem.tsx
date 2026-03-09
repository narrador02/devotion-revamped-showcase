import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Speaker } from "lucide-react";

import coverAudio from "@/assets/audio-system.jpg";

interface ProposalAudioSystemProps {
    isSelected: boolean;
    onToggle: (selected: boolean) => void;
    price: number;
}

export default function ProposalAudioSystem({ isSelected, onToggle, price }: ProposalAudioSystemProps) {
    const { t } = useTranslation();

    const features = [
        t("proposal.audioSystem.specs.speakers", "Doble sistema de altavoces integrados en chasis"),
        t("proposal.audioSystem.specs.subwoofer", "Subwoofer interno de alta resonancia"),
        t("proposal.audioSystem.specs.transducer", "Bass Shaker (Transductor Táctil) para vibración del chasis"),
        t("proposal.audioSystem.specs.quality", "Perfiles de audio de competición pre-cargados"),
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-[#111111] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => onToggle(!isSelected)}
        >
            <div className={`absolute inset-0 border-2 transition-colors duration-300 rounded-2xl z-10 
                ${isSelected ? 'border-red-600' : 'border-transparent group-hover:border-gray-700'}`}
            />

            <div className="grid md:grid-cols-2 gap-0 relative z-20">
                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center relative bg-[#111111]">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-red-600 to-transparent opacity-50" />

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                            <Speaker className="w-5 h-5 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">
                            {t("proposal.audioSystem.title", "Sistema de Audio Profesional")}
                        </h3>
                    </div>

                    <p className="text-gray-400 mb-8 leading-relaxed max-w-md">
                        {t("proposal.audioSystem.description", "Mejora radicalmente la inmersión con audio de alta fidelidad. Siente cómo tu cuerpo vibra con las frecuencias emitidas por el audio prerrabado de motos Supersport reales al acelerar y alcanzar las máximas RPM.")}
                    </p>

                    <ul className="space-y-4 mb-8">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-gray-300">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Price and Selection Toggle */}
                    <div className="mt-auto pt-8 border-t border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                ${isSelected ? 'border-red-600 bg-red-600' : 'border-gray-600 group-hover:border-gray-400'}`}
                            >
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                {isSelected ? t("proposal.branding.selected", "Añadido a la propuesta") : t("proposal.addons.clickToAdd", "Click para añadir")}
                            </span>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">
                                +{price.toLocaleString("es-ES")}€
                            </div>
                            <div className="text-gray-500 text-sm">
                                {t("proposal.iva", "+ IVA")}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cover Image */}
                <div className="relative h-64 md:h-auto overflow-hidden bg-black">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-transparent to-transparent z-10" />
                    <img
                        src={coverAudio}
                        alt="High Quality Audio System"
                        className={`w-full h-full object-cover transition-transform duration-700 
                            ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                    />
                </div>
            </div>
        </motion.div>
    );
}
