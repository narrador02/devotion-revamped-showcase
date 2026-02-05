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

    // If new purchase structure
    const packages = purchaseDetails.packages;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Packages Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Basic */}
                <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-500 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-gray-300 text-sm font-medium uppercase tracking-widest text-center">
                            {t("proposal.packBasic")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-8">
                        <div className="text-3xl font-bold text-white mb-2">{packages.basic}</div>
                        <p className="text-xs text-gray-500">{t("proposal.purchase.baseConfig")}</p>
                    </CardContent>
                </Card>

                {/* Professional - Highlighted */}
                <Card className="bg-gradient-to-b from-red-600 to-red-800 border-red-500 transform md:-translate-y-4 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-red-100 text-sm font-medium uppercase tracking-widest text-center">
                            {t("proposal.packProfessional")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-8">
                        <div className="text-4xl font-bold text-white mb-2">{packages.professional}</div>
                        <p className="text-xs text-red-200">{t("proposal.purchase.proConfig")}</p>
                        <div className="mt-6 text-sm text-white/80 font-medium">
                            {t("proposal.purchase.recommended")}
                        </div>
                    </CardContent>
                </Card>

                {/* Complete */}
                <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-500 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-gray-300 text-sm font-medium uppercase tracking-widest text-center">
                            {t("proposal.packComplete")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-8">
                        <div className="text-3xl font-bold text-white mb-2">{packages.complete}</div>
                        <p className="text-xs text-gray-500">{t("proposal.purchase.fullConfig")}</p>
                    </CardContent>
                </Card>
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
        </div>
    );
}
