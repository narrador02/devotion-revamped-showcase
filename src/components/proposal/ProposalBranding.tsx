import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

import custom1 from "@/assets/custom1.jpeg";
import custom2 from "@/assets/custom2.jpeg";
import custom3 from "@/assets/custom3.jpeg";
import custom4 from "@/assets/custom4.jpeg";
import custom5 from "@/assets/custom5.jpeg";
import custom6 from "@/assets/custom6.jpeg";

interface ProposalBrandingProps {
    isSelected: boolean;
    onToggle: (selected: boolean) => void;
    price: number;
}

export default function ProposalBranding({ isSelected, onToggle, price }: ProposalBrandingProps) {
    const { t } = useTranslation();
    const brandingImages = [custom1, custom2, custom3, custom4, custom5, custom6];

    return (
        <div className="py-16 bg-black relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <Card className={`overflow-hidden transition-all duration-500 border-2 ${isSelected ? 'border-red-600 bg-gray-900' : 'border-gray-800 bg-black'
                    }`}>
                    <div className="p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 text-red-500 font-semibold uppercase tracking-wider text-sm">
                                <Palette className="w-5 h-5" />
                                {t("proposal.branding.optional", "Optional Add-on")}
                            </div>

                            <h3 className="text-4xl font-bold text-white">
                                {t("proposal.branding.title", "Custom Brand Integration")}
                            </h3>

                            <p className="text-gray-400 leading-relaxed max-w-2xl">
                                {t("proposal.branding.description", "Maximize your brand impact. We wrap the simulator chassis with your corporate identity and integrate your logos directly into the simulation software.")}
                            </p>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>{t("proposal.branding.vinyl", "Full Chassis Vinyl Wrap")}</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>{t("proposal.branding.billboards", "In-Game Billboards")}</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>{t("proposal.branding.ui", "Branded UI Overlay")}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-center gap-6 p-8 bg-gray-900/50 rounded-2xl border border-gray-700 min-w-[300px] shadow-2xl">
                            <div className="text-center">
                                <span className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
                                    {t("proposal.branding.addToProposal", "Add to Proposal")}
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
                                    {t("proposal.branding.applied", "Applied to Total")}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Infinite Marquee of Examples */}
                    <div className="mt-12 mb-8 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10" />

                        {/* Subtitle removed as requested */}

                        <div className="flex overflow-hidden">
                            <motion.div
                                className="flex gap-4 px-4"
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                                style={{ width: "max-content" }}
                            >
                                {[...brandingImages, ...brandingImages].map((img, i) => (
                                    <div key={i} className="relative w-80 h-52 rounded-lg overflow-hidden shrink-0 border border-gray-800 group">
                                        <img
                                            src={img}
                                            alt="Custom Branding Example"
                                            className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                                        />
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
