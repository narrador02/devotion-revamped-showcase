import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Euro, Zap, Gauge, Rocket, Star, ChevronRight } from "lucide-react";
import { Proposal } from "@/types/proposal";
import { simulatorsData } from "@/data/simulators";
import { motion } from "framer-motion";

interface PurchaseProposalTemplateProps {
    proposal: Proposal;
    selectedSimulator: string;
    onSelectSimulator: (name: string) => void;
    showBranding?: boolean;
    brandingPrice?: number;
    showFlightCase?: boolean;
    flightCasePrice?: number;
}

const iconMap = {
    Zap: Zap,
    Gauge: Gauge,
    Rocket: Rocket,
};

export default function PurchaseProposalTemplate({
    proposal,
    selectedSimulator,
    onSelectSimulator,
    showBranding,
    brandingPrice = 0,
    showFlightCase,
    flightCasePrice = 0,
}: PurchaseProposalTemplateProps) {
    const { t } = useTranslation();
    const { purchaseDetails } = proposal;

    if (!purchaseDetails) return null;

    const packages = purchaseDetails.packages;
    const priceMap: Record<string, number> = {
        "Time Attack": packages.timeAttack,
        "Slady": packages.slady,
        "Top Gun": packages.topGun,
    };

    const modelMap: Record<string, typeof simulatorsData.models[0]> = {
        "Time Attack": simulatorsData.models[0],
        "Slady": simulatorsData.models[1],
        "Top Gun": simulatorsData.models[2],
    };

    const simulatorEntries = [
        { name: "Time Attack", popular: false },
        { name: "Slady", popular: true },
        { name: "Top Gun", popular: false },
    ];

    // Calculate total for the selected simulator
    const selectedPrice = priceMap[selectedSimulator] ?? packages.slady;
    const addOnsTotal = (showBranding ? brandingPrice : 0) + (showFlightCase ? flightCasePrice : 0);
    const subtotal = selectedPrice + addOnsTotal;
    const iva = Math.round(subtotal * 0.21);
    const totalWithIva = subtotal + iva;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Section Header */}
            <div className="text-center mb-4">
                <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">
                    Elige tu simulador
                </p>
                <p className="text-gray-500 text-sm max-w-xl mx-auto">
                    Selecciona el modelo que mejor se adapta a tus necesidades. Cada simulador ofrece una experiencia diferente.
                </p>
            </div>

            {/* Simulator Cards */}
            <div className="space-y-6">
                {simulatorEntries.map((entry, index) => {
                    const model = modelMap[entry.name];
                    const price = priceMap[entry.name];
                    const isSelected = entry.name === selectedSimulator;
                    const Icon = iconMap[model.iconName as keyof typeof iconMap] || Zap;
                    const imgSrc = typeof model.image === 'string' ? model.image : model.image.src;

                    return (
                        <motion.div
                            key={entry.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card
                                onClick={() => onSelectSimulator(entry.name)}
                                className={`cursor-pointer overflow-hidden transition-all duration-500 relative group ${isSelected
                                    ? `border-2 ${model.borderClass} bg-gradient-to-r ${model.gradientClass} shadow-2xl ring-1 ring-white/10`
                                    : 'border border-gray-800 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-900/80'
                                    }`}
                            >
                                {/* Popular Badge */}
                                {entry.popular && (
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg">
                                            <Star className="w-3 h-3 text-white fill-white" />
                                            <span className="text-[11px] font-bold text-white uppercase tracking-wider">El más popular</span>
                                        </div>
                                    </div>
                                )}

                                {/* Selection Indicator */}
                                {isSelected && (
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${model.gradientClass} border-2 ${model.borderClass} flex items-center justify-center`}>
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                )}

                                <CardContent className="p-0">
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Image */}
                                        <div className="relative w-full lg:w-2/5 aspect-[4/3] lg:aspect-auto overflow-hidden">
                                            <img
                                                src={imgSrc}
                                                alt={t(model.title)}
                                                className={`w-full h-full object-cover transition-all duration-700 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-900/90 hidden lg:block" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent lg:hidden" />

                                            {/* Axis Badge */}
                                            <div className={`absolute top-4 left-4 lg:top-auto lg:bottom-4 lg:left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border ${model.borderClass}`}>
                                                <span className={`text-xs font-bold ${model.textClass}`}>{model.badge}</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                                            <div>
                                                {/* Header */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${model.gradientClass} border ${model.borderClass} flex items-center justify-center shrink-0`}>
                                                        <Icon className="text-white" size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl lg:text-3xl font-bold text-white font-rajdhani">
                                                            {t(model.title)}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                                                            {t('products.bestFor')}: {t(model.usage)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3 lg:line-clamp-none">
                                                    {t(model.shortDescription)}
                                                </p>

                                                {/* Features Grid */}
                                                <div className="grid grid-cols-2 gap-2 mb-5">
                                                    {model.features.map((featureKey, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <Check className={`w-3.5 h-3.5 ${model.textClass} shrink-0`} />
                                                            <span className="text-gray-300 text-xs">{t(featureKey)}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Comparison Row */}
                                                <div className="flex flex-wrap gap-3 mb-5">
                                                    <ComparisonPill label="Inclinación" value={t(model.maxLean)} active />
                                                    <ComparisonPill label="Wheelie" value={t(model.wheelie)} active={t(model.wheelie) !== "No"} />
                                                    <ComparisonPill label="Derrape" value={t(model.rearSlide)} active={t(model.rearSlide) !== "No"} />
                                                    <ComparisonPill label="Aceleración" value={t(model.surge)} active={t(model.surge) !== "No"} />
                                                </div>
                                            </div>

                                            {/* Price + CTA */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                                                <div>
                                                    <span className="text-3xl lg:text-4xl font-bold text-white">
                                                        {price.toLocaleString("es-ES")}€
                                                    </span>
                                                    <span className="text-gray-500 text-xs ml-2">+ IVA</span>
                                                </div>
                                                <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${isSelected
                                                    ? `${model.buttonClass} text-white shadow-lg`
                                                    : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white'
                                                    }`}>
                                                    {isSelected ? (
                                                        <>
                                                            <Check className="w-4 h-4" />
                                                            Seleccionado
                                                        </>
                                                    ) : (
                                                        <>
                                                            Seleccionar
                                                            <ChevronRight className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Final Price Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border-gray-700 overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-gray-300">
                                <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${modelMap[selectedSimulator]?.buttonClass || 'bg-red-500'}`} />
                                    Simulador {selectedSimulator}
                                </span>
                                <span className="font-mono text-white">{selectedPrice.toLocaleString("es-ES")}€</span>
                            </div>

                            {showBranding && brandingPrice > 0 && (
                                <div className="flex justify-between items-center text-gray-400 text-sm">
                                    <span>Branding Personalizado</span>
                                    <span className="font-mono">+{brandingPrice.toLocaleString("es-ES")}€</span>
                                </div>
                            )}
                            {showFlightCase && flightCasePrice > 0 && (
                                <div className="flex justify-between items-center text-gray-400 text-sm">
                                    <span>Flight Case</span>
                                    <span className="font-mono">+{flightCasePrice.toLocaleString("es-ES")}€</span>
                                </div>
                            )}

                            <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-gray-400 text-sm">
                                <span>Subtotal</span>
                                <span className="font-mono">{subtotal.toLocaleString("es-ES")}€</span>
                            </div>

                            <div className="flex justify-between items-center text-gray-400 text-sm">
                                <span>IVA (21%)</span>
                                <span className="font-mono">+{iva.toLocaleString("es-ES")}€</span>
                            </div>

                            <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                                <span className="text-white font-semibold text-lg uppercase tracking-wider flex items-center gap-2">
                                    <Euro className="w-5 h-5 text-red-500" />
                                    Total
                                </span>
                                <span className="text-white text-3xl font-bold">
                                    {totalWithIva.toLocaleString("es-ES")}€
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Payment Terms */}
            {purchaseDetails.paymentTerms && (
                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6 sm:p-8">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Euro className="w-5 h-5 text-gray-400" />
                            {t("proposal.purchase.terms", "Payment Terms")}
                        </h4>
                        <p className="text-gray-400 whitespace-pre-wrap leading-relaxed">
                            {purchaseDetails.paymentTerms}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Notes */}
            {proposal.notes && (
                <div className="text-gray-500 text-sm leading-relaxed p-6 text-center border-t border-gray-800 pt-8">
                    <p className="whitespace-pre-wrap">{proposal.notes}</p>
                </div>
            )}
        </div>
    );
}

// Helper component for comparison pills
function ComparisonPill({ label, value, active }: { label: string; value: string; active: boolean }) {
    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${active
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-gray-800/50 border-gray-700 text-gray-600'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-400' : 'bg-gray-600'}`} />
            {label}: {value}
        </div>
    );
}
