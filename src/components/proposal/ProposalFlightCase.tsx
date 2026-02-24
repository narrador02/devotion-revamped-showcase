import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useState } from "react";

import flightcaseExterior from "@/assets/flightcase-exterior.png";
import flightcaseInterior from "@/assets/flightcase-interior.png";

interface ProposalFlightCaseProps {
    isSelected: boolean;
    onToggle: (selected: boolean) => void;
    price: number;
}

export default function ProposalFlightCase({ isSelected, onToggle, price }: ProposalFlightCaseProps) {
    const [activeImage, setActiveImage] = useState(0);
    const images = [flightcaseExterior, flightcaseInterior];

    return (
        <div className="py-16 bg-black relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <Card className={`overflow-hidden transition-all duration-500 border-2 ${isSelected ? 'border-red-600 bg-gray-900' : 'border-gray-800 bg-black'
                    }`}>
                    <div className="p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 text-red-500 font-semibold uppercase tracking-wider text-sm">
                                <ShieldCheck className="w-5 h-5" />
                                Add-on Opcional
                            </div>

                            <h3 className="text-4xl font-bold text-white">
                                Flight Case
                            </h3>

                            <p className="text-gray-400 leading-relaxed max-w-2xl">
                                Protege tu simulador con la máxima garantía. Nuestra maleta de transporte Flight Case,
                                fabricada a medida con materiales de grado profesional, asegura la integridad total de tu
                                inversión durante cada traslado.
                            </p>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>Estructura reforzada con perfilería de aluminio</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>Interior acolchado con espuma técnica a medida</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>Cuatro ruedas de alta resistencia para facilitar traslados</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>Cierres de seguridad de tipo butterfly</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-center gap-6 p-8 bg-gray-900/50 rounded-2xl border border-gray-700 min-w-[300px] shadow-2xl">
                            <div className="text-center">
                                <span className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
                                    Añadir a la Propuesta
                                </span>
                                <div className="text-5xl font-bold text-white tracking-tight">
                                    +{price}€
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
                                    Aplicado al Total
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="px-8 md:px-12 pb-10">
                        <div className="relative rounded-xl overflow-hidden border border-gray-800">
                            <motion.img
                                key={activeImage}
                                src={images[activeImage]}
                                alt="Flight Case"
                                className="w-full h-[350px] md:h-[450px] object-contain bg-gradient-to-b from-gray-900/80 to-gray-950"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            />

                            {/* Image selector dots */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${activeImage === i
                                            ? 'bg-red-500 scale-125'
                                            : 'bg-gray-600 hover:bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
