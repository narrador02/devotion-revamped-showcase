import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, Palette, Target } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

interface ProposalBrandingProps {
    isSelected: boolean;
    onToggle: (selected: boolean) => void;
    price: number;
}

export default function ProposalBranding({ isSelected, onToggle, price }: ProposalBrandingProps) {
    const { t } = useTranslation();

    return (
        <div className="py-16 bg-black relative">
            <div className="max-w-4xl mx-auto px-4">
                <Card className={`overflow-hidden transition-all duration-500 border-2 ${isSelected ? 'border-red-600 bg-gray-900' : 'border-gray-800 bg-black'
                    }`}>
                    <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 text-red-500 font-semibold uppercase tracking-wider text-sm mb-2">
                                <Palette className="w-5 h-5" />
                                {t("proposal.branding.optional", "Optional Add-on")}
                            </div>

                            <h3 className="text-3xl font-bold text-white">
                                {t("proposal.branding.title", "Custom Brand Integration")}
                            </h3>

                            <p className="text-gray-400 leading-relaxed">
                                {t("proposal.branding.description", "Maximize your brand impact. We wrap the simulator chassis with your corporate identity and integrate your logos directly into the simulation software for a fully branded experience.")}
                            </p>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left">
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>Full Chassis Vinyl Wrap</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>In-Game Billboards</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>Custom Rider Suit</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>Branded UI Overlay</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-center gap-6 p-6 bg-gray-900/50 rounded-2xl border border-gray-700 min-w-[280px]">
                            <div className="text-center">
                                <span className="text-gray-400 text-sm uppercas block mb-1">Add to Proposal</span>
                                <div className="text-4xl font-bold text-white">
                                    +{price}€
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`text-sm font-medium transition-colors ${!isSelected ? 'text-white' : 'text-gray-500'}`}>No</span>
                                <Switch
                                    checked={isSelected}
                                    onCheckedChange={onToggle}
                                    className="data-[state=checked]:bg-red-600 scale-125"
                                />
                                <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-gray-500'}`}>Yes</span>
                            </div>

                            {isSelected && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30 flex items-center gap-2"
                                >
                                    <Check className="w-3 h-3" />
                                    APPLIED TO TOTAL
                                </motion.div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
