import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";

import custom1 from "@/assets/custom1.jpeg";
import custom2 from "@/assets/custom2.jpeg";
import custom3 from "@/assets/custom3.jpeg";
import custom4 from "@/assets/custom4.jpeg";
import custom5 from "@/assets/custom5.jpeg";
import custom6 from "@/assets/custom6.jpeg";
import custom7 from "@/assets/custom7.jpeg";

export type BrandingOption = "none" | "platform" | "simulator" | "full";

export const BRANDING_PRICES: Record<BrandingOption, number> = {
    none: 0,
    platform: 290,
    simulator: 360,
    full: 600,
};

export const BRANDING_LABELS: Record<BrandingOption, string> = {
    none: "",
    platform: "Branding Plataforma",
    simulator: "Branding Simulador (vinilo)",
    full: "Pack Branding Completo",
};

interface BrandingTier {
    key: BrandingOption;
    title: string;
    price: number;
    description: string;
    subtext?: string;
    features: string[];
}

const TIERS: BrandingTier[] = [
    {
        key: "platform",
        title: "Branding Plataforma",
        price: 290,
        description: "Vinilamos la plataforma del simulador con tu identidad corporativa.",
        features: ["Vinilo en plataforma", "Diseño personalizado", "Acabado profesional"],
    },
    {
        key: "simulator",
        title: "Branding Simulador",
        price: 360,
        description: "Vinilamos el carenado completo del simulador con tu marca.",
        subtext: "Vinilo, no pintado",
        features: ["Vinilo en carenado", "Diseño personalizado", "Acabado profesional"],
    },
    {
        key: "full",
        title: "Pack Branding Completo",
        price: 600,
        description: "Vinilamos tanto el carenado como la plataforma. Máximo impacto de marca.",
        features: ["Vinilo en carenado", "Vinilo en plataforma", "Diseño personalizado", "Acabado profesional"],
    },
];

interface ProposalBrandingProps {
    selected: BrandingOption;
    onSelect: (option: BrandingOption) => void;
}

export default function ProposalBranding({ selected, onSelect }: ProposalBrandingProps) {
    const { t } = useTranslation();
    const brandingImages = [custom7, custom1, custom2, custom3, custom4, custom5, custom6];

    const handleToggle = (key: BrandingOption) => {
        // Toggle off if already selected
        onSelect(selected === key ? "none" : key);
    };

    return (
        <div className="py-6 bg-black relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <Card className="overflow-hidden border border-gray-800 bg-black">
                    <div className="p-8 md:p-12 space-y-8">

                        {/* Header */}
                        <div className="text-center lg:text-left space-y-3">
                            <div className="inline-flex items-center gap-2 text-red-500 font-semibold uppercase tracking-wider text-sm">
                                <Palette className="w-5 h-5" />
                                {t("proposal.branding.optional", "Optional Add-on")}
                            </div>
                            <h3 className="text-4xl font-bold text-white">
                                {t("proposal.branding.title", "Custom Brand Integration")}
                            </h3>
                            <p className="text-gray-400 leading-relaxed max-w-2xl">
                                {t("proposal.branding.description", "Maximizamos el impacto de tu marca. Vinilamos el carenado y la plataforma del simulador con tu identidad corporativa.")}
                            </p>
                        </div>

                        {/* Three Tier Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {TIERS.map((tier) => {
                                const isSelected = selected === tier.key;
                                return (
                                    <motion.div
                                        key={tier.key}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleToggle(tier.key)}
                                        className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 ${isSelected
                                                ? "border-red-600 bg-gray-900"
                                                : "border-gray-800 bg-gray-950 hover:border-gray-600"
                                            }`}
                                    >
                                        {/* Selected check */}
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center"
                                            >
                                                <Check className="w-3.5 h-3.5 text-white" />
                                            </motion.div>
                                        )}

                                        {/* Full pack badge */}
                                        {tier.key === "full" && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap">
                                                    Mejor valor
                                                </span>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            {/* Title & Price */}
                                            <div>
                                                <h4 className="text-white font-bold text-lg leading-tight">
                                                    {tier.title}
                                                </h4>
                                                {tier.subtext && (
                                                    <p className="text-gray-500 text-[11px] mt-0.5 italic">
                                                        {tier.subtext}
                                                    </p>
                                                )}
                                                <div className="mt-2 flex items-baseline gap-1">
                                                    <span className={`text-3xl font-bold ${isSelected ? "text-red-400" : "text-white"}`}>
                                                        {tier.price}€
                                                    </span>
                                                    <span className="text-gray-500 text-xs">+ IVA</span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                {tier.description}
                                            </p>

                                            {/* Features */}
                                            <ul className="space-y-1.5">
                                                {tier.features.map((f) => (
                                                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                                                        <Check className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-red-500" : "text-green-500"}`} />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Applied badge */}
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center justify-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold border border-green-500/30 uppercase tracking-wide"
                                                >
                                                    <Check className="w-3 h-3" />
                                                    Añadido a la propuesta
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Infinite Marquee of Examples */}
                    <div className="mt-4 mb-8 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />

                        <div className="flex overflow-hidden">
                            <motion.div
                                className="flex gap-4 px-4"
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                                style={{ width: "max-content" }}
                            >
                                {[...brandingImages, ...brandingImages].map((img, i) => {
                                    const isLandscape = img === custom7;
                                    return (
                                        <div key={i} className={`relative w-80 h-52 rounded-lg overflow-hidden shrink-0 border border-gray-800 group ${isLandscape ? 'bg-gray-900' : ''}`}>
                                            <img
                                                src={img}
                                                alt="Custom Branding Example"
                                                className={`w-full h-full transition-all duration-500 hover:scale-110 ${isLandscape ? 'object-contain' : 'object-cover'}`}
                                            />
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
