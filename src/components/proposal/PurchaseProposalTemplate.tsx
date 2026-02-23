import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Euro } from "lucide-react";
import { Proposal } from "@/types/proposal";

interface PurchaseProposalTemplateProps {
    proposal: Proposal;
}

export default function PurchaseProposalTemplate({ proposal }: PurchaseProposalTemplateProps) {
    const { t } = useTranslation();
    const { purchaseDetails } = proposal;

    if (!purchaseDetails) return null;

    const packages = purchaseDetails.packages;

    const simulators = [
        { name: "Time Attack", price: packages.timeAttack, highlight: false },
        { name: "Slady", price: packages.slady, highlight: true },
        { name: "Top Gun", price: packages.topGun, highlight: false },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Simulators Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {simulators.map((sim) => (
                    <Card
                        key={sim.name}
                        className={sim.highlight
                            ? "bg-gradient-to-b from-red-600 to-red-800 border-red-500 transform md:-translate-y-4 shadow-2xl relative overflow-hidden"
                            : "bg-gray-800/50 border-gray-700 hover:border-gray-500 transition-all duration-300"
                        }
                    >
                        {sim.highlight && (
                            <div className="absolute top-0 right-0 p-3">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className={`text-sm font-medium uppercase tracking-widest text-center ${sim.highlight ? "text-red-100" : "text-gray-300"}`}>
                                {sim.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-8">
                            <div className={`font-bold text-white mb-2 ${sim.highlight ? "text-4xl" : "text-3xl"}`}>
                                {sim.price.toLocaleString("es-ES")}€
                            </div>
                            <p className={`text-xs ${sim.highlight ? "text-red-200" : "text-gray-500"}`}>+ IVA</p>
                            {sim.highlight && (
                                <div className="mt-6 text-sm text-white/80 font-medium">
                                    {t("proposal.purchase.recommended", "Recomendado")}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

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

            {/* Tax disclaimer */}
            <p className="text-center text-xs text-gray-500 pt-4">
                Impuestos no incluidos
            </p>
        </div>
    );
}
