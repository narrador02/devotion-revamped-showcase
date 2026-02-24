import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Euro } from "lucide-react";
import { Proposal } from "@/types/proposal";

interface PurchaseProposalTemplateProps {
    proposal: Proposal;
    selectedSimulator: string;
    onSelectSimulator: (name: string) => void;
    showBranding?: boolean;
    brandingPrice?: number;
    showFlightCase?: boolean;
    flightCasePrice?: number;
}

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

    const simulators = [
        { name: "Time Attack", price: packages.timeAttack },
        { name: "Slady", price: packages.slady },
        { name: "Top Gun", price: packages.topGun },
    ];

    // Calculate total for the selected simulator
    const selected = simulators.find(s => s.name === selectedSimulator) || simulators[1];
    const basePrice = selected.price;
    const addOnsTotal = (showBranding ? brandingPrice : 0) + (showFlightCase ? flightCasePrice : 0);
    const subtotal = basePrice + addOnsTotal;
    const iva = Math.round(subtotal * 0.21);
    const totalWithIva = subtotal + iva;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Simulators Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {simulators.map((sim) => {
                    const isSelected = sim.name === selectedSimulator;
                    return (
                        <Card
                            key={sim.name}
                            onClick={() => onSelectSimulator(sim.name)}
                            className={`cursor-pointer transition-all duration-300 ${isSelected
                                ? "bg-gradient-to-b from-red-600 to-red-800 border-red-500 transform md:-translate-y-4 shadow-2xl relative overflow-hidden ring-2 ring-red-500/50"
                                : "bg-gray-800/50 border-gray-700 hover:border-gray-500 hover:bg-gray-800/80"
                                }`}
                        >
                            {isSelected && (
                                <div className="absolute top-0 right-0 p-3">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className={`text-sm font-medium uppercase tracking-widest text-center ${isSelected ? "text-red-100" : "text-gray-300"}`}>
                                    {sim.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center pb-8">
                                <div className={`font-bold text-white mb-2 ${isSelected ? "text-4xl" : "text-3xl"}`}>
                                    {sim.price.toLocaleString("es-ES")}€
                                </div>
                                <p className={`text-xs ${isSelected ? "text-red-200" : "text-gray-500"}`}>+ IVA</p>
                                {isSelected && (
                                    <div className="mt-6 text-sm text-white/80 font-medium">
                                        Seleccionado
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Final Price Summary */}
            <Card className="bg-gray-900/80 border-gray-700 overflow-hidden">
                <CardContent className="p-6 sm:p-8">
                    <div className="space-y-4">
                        {/* Selected simulator */}
                        <div className="flex justify-between items-center text-gray-300">
                            <span>Simulador {selectedSimulator}</span>
                            <span className="font-mono">{basePrice.toLocaleString("es-ES")}€</span>
                        </div>

                        {/* Add-ons */}
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
                            <span className="text-white font-semibold text-lg uppercase tracking-wider">Total</span>
                            <span className="text-white text-3xl font-bold">
                                {totalWithIva.toLocaleString("es-ES")}€
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

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
