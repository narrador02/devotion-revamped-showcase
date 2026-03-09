import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, Speaker } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

import coverAudio from "@/assets/audio-system.jpg";

interface ProposalAudioSystemProps {
    isSelected: boolean;
    onToggle: (selected: boolean) => void;
    price: number;
}

export default function ProposalAudioSystem({ isSelected, onToggle, price }: ProposalAudioSystemProps) {
    const { t } = useTranslation();

    const features = [
        t("proposal.audioSystem.specs.speakers", "Sistema de altavoces 2.1 integrados en la moto"),
        t("proposal.audioSystem.specs.subwoofer", "Subwoofer interno de alta resonancia"),
        t("proposal.audioSystem.specs.transducer", "Bass Shaker para vibración del chasis"),
        t("proposal.audioSystem.specs.quality", "Perfiles de audio de competición pre-cargados"),
    ];

    return (
        <div className="py-6 bg-black relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <Card className={`overflow-hidden transition-all duration-500 border-2 ${isSelected ? 'border-red-600 bg-gray-900' : 'border-gray-800 bg-black'
                    }`}>
                    <div className="p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 text-red-500 font-semibold uppercase tracking-wider text-sm">
                                <Speaker className="w-5 h-5" />
                                {t("proposal.audioSystem.optional", "Add-on Opcional")}
                            </div>

                            <h3 className="text-4xl font-bold text-white">
                                {t("proposal.audioSystem.title", "Sistema de Audio Profesional")}
                            </h3>

                            <p className="text-gray-400 leading-relaxed max-w-2xl">
                                {t("proposal.audioSystem.description", "Mejora radicalmente la inmersión con audio de alta fidelidad. Siente cómo tu cuerpo vibra con las frecuencias emitidas por el audio pregrabado de motos Supersport reales al acelerar y alcanzar las máximas RPM.")}
                            </p>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                                {features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-300">
                                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col items-center gap-6 p-8 bg-gray-900/50 rounded-2xl border border-gray-700 min-w-[300px] shadow-2xl">
                            <div className="text-center">
                                <span className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
                                    {t("proposal.branding.addToProposal", "Añadir a la Propuesta")}
                                </span>
                                <div className="text-5xl font-bold text-white tracking-tight">
                                    +{price.toLocaleString("es-ES")}€
                                </div>
                            </div>

                            <div className="scale-150 py-2">
                                <Switch
                                    checked={isSelected}
                                    onCheckedChange={onToggle}
                                    className="data-[state=checked]:bg-red-600"
                                />
                            </div>

                            {isSelected && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold border border-green-500/30 flex items-center gap-2 uppercase tracking-wide"
                                >
                                    <Check className="w-3 h-3" />
                                    {t("proposal.branding.added", "Añadido a la propuesta")}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Image section: Reduced margin and added styling */}
                    <div className="mt-4 mb-4 relative">
                        <div className="flex overflow-hidden justify-center px-4">
                            <div className="relative w-full max-w-4xl aspect-video overflow-hidden rounded-2xl shadow-2xl border border-white/5">
                                <img
                                    src={coverAudio}
                                    alt="Audio System"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
