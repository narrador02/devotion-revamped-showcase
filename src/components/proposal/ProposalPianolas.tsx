import { motion } from "framer-motion";
import { Check, Flame } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

// TODO: Replace with actual pianola.jpg once uploaded to assets
import pianolaImg from "@/assets/product-1.jpg";

interface ProposalPianolasProps {
    isSelected: boolean;
    onToggle: (selected: boolean) => void;
    price: number;
}

export default function ProposalPianolas({ isSelected, onToggle, price }: ProposalPianolasProps) {
    const { t } = useTranslation();

    return (
        <div className="py-6 bg-black relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <Card className={`overflow-hidden transition-all duration-500 border-2 ${isSelected ? 'border-red-600 bg-gray-900' : 'border-gray-800 bg-black'
                    }`}>
                    <div className="p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 text-red-500 font-semibold uppercase tracking-wider text-sm">
                                <Flame className="w-5 h-5" />
                                {t("proposal.pianolas.optional", "Add-on Opcional")}
                            </div>

                            <h3 className="text-4xl font-bold text-white uppercase tracking-wider">
                                {t("proposal.pianolas.title", "Pianolas")}
                            </h3>

                            <p className="text-gray-400 leading-relaxed max-w-2xl text-lg">
                                {t("proposal.pianolas.description", "Para los más valientes. Para aquellos dispuestos a llegar al límite en cada curva. Este add-on exclusivo eleva la simulación al máximo nivel, permitiéndote tocar rodilla e incluso codo, acercándote más que nunca a la sensación de un piloto profesional de MotoGP.")}
                            </p>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>{t("proposal.pianolas.feature1", "Simulación extrema de paso por curva")}</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>{t("proposal.pianolas.feature2", "Permite tocar rodilla y codo")}</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>{t("proposal.pianolas.feature3", "Diseñado para pilotos experimentados")}</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>{t("proposal.pianolas.feature4", "La experiencia definitiva de MotoGP")}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-center gap-6 p-8 bg-gray-900/50 rounded-2xl border border-gray-700 min-w-[300px] shadow-2xl">
                            <div className="text-center">
                                <span className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
                                    {t("proposal.branding.addToProposal", "Añadir a la Propuesta")}
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
                                    {t("proposal.pianolas.applied", "Aplicado al Total")}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Singular image with dynamic zoom/pan effect */}
                    <div className="relative h-[24rem] w-full overflow-hidden mt-8 border-t border-gray-800">
                        <motion.div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${pianolaImg})` }}
                            animate={{
                                scale: [1, 1.15, 1],
                                x: ["0%", "-2%", "2%", "0%"],
                                y: ["0%", "2%", "-2%", "0%"]
                            }}
                            transition={{
                                duration: 25,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        {/* Gradient overlays to blend with the card */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-30" />
                    </div>
                </Card>
            </div>
        </div>
    );
}
