import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Truck, Users, Monitor } from "lucide-react";
import { Proposal } from "@/types/proposal";

interface RentalProposalTemplateProps {
    proposal: Proposal;
    showBranding?: boolean;
    brandingPrice?: number;
}

export default function RentalProposalTemplate({ proposal, showBranding = false, brandingPrice = 550 }: RentalProposalTemplateProps) {
    const { t } = useTranslation();
    const { rentalDetails } = proposal;

    if (!rentalDetails) return null;

    const finalTotal = rentalDetails.total + (showBranding ? brandingPrice : 0);

    const features = [
        t("proposal.features.setup", "Full setup & installation"),
        t("proposal.features.support", "Technical support"),
        t("proposal.features.branding", "Digital branding"),
        t("proposal.features.insurance", "Liability insurance"),
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Main Pricing Card */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm overflow-hidden text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900" />
                <CardContent className="p-8 sm:p-12 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-400 uppercase tracking-widest">
                            {t("proposal.rental.title", "Event Rental")}
                        </h3>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-5xl sm:text-7xl font-bold text-white tracking-tight">
                                {finalTotal.toLocaleString("es-ES")}€
                            </span>
                            <span className="text-xl text-gray-500 self-end mb-2">+ IVA</span>
                        </div>
                        {rentalDetails.isVIP && (
                            <span className="inline-block px-3 py-1 bg-red-500/10 text-red-500 text-sm font-medium rounded-full border border-red-500/20">
                                {t("proposal.rental.vipApplied", "VIP Partner Rate Applied")}
                            </span>
                        )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-gray-300">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-red-500" />
                                </div>
                                {feature}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Breakdown */}
            <Card className="bg-black/20 border-gray-800">
                <CardContent className="p-6 sm:p-8 space-y-6">
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-gray-400" />
                        {t("proposal.rental.breakdown", "Cost Breakdown")}
                    </h4>

                    <div className="space-y-4 text-sm sm:text-base">
                        {/* Simulators */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                            <span className="text-gray-400">
                                {rentalDetails.numberOfSimulators}x MotoGP Simulator ({rentalDetails.basePrice}€/unit)
                            </span>
                            <span className="text-white font-medium">{rentalDetails.subtotal.toLocaleString()}€</span>
                        </div>

                        {/* Transport */}
                        {rentalDetails.transport && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Truck className="w-4 h-4" />
                                    <span>
                                        Transport ({rentalDetails.transport.kilometers}km @ {rentalDetails.transport.pricePerKm}€/km)
                                    </span>
                                </div>
                                <span className="text-white font-medium">{rentalDetails.transport.totalCost.toLocaleString()}€</span>
                            </div>
                        )}

                        {/* Staff */}
                        {rentalDetails.staff && (
                            <div className="space-y-2 py-2 border-b border-gray-800">
                                <div className="flex justify-between items-center text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>
                                            Staff ({rentalDetails.staff.numberOfStaff} staff x {rentalDetails.staff.numberOfDays || 1} days)
                                        </span>
                                    </div>
                                    <span className="text-white font-medium">
                                        {(rentalDetails.staff.numberOfStaff! * (rentalDetails.staff.numberOfDays || 1) * rentalDetails.staff.pricePerStaffDay).toLocaleString()}€
                                    </span>
                                </div>
                                {(rentalDetails.staff.travelExpenses || 0) > 0 && (
                                    <div className="flex justify-between items-center text-gray-500 pl-6 text-xs">
                                        <span>Travel Expenses</span>
                                        <span>{rentalDetails.staff.travelExpenses}€</span>
                                    </div>
                                )}
                                {(rentalDetails.staff.hotelExpenses || 0) > 0 && (
                                    <div className="flex justify-between items-center text-gray-500 pl-6 text-xs">
                                        <span>Hotel Expenses</span>
                                        <span>{rentalDetails.staff.hotelExpenses}€</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Branding */}
                        {showBranding && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-800 bg-red-900/10 px-2 -mx-2 rounded">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="font-medium text-red-200">{t("proposal.branding.lineItem", "Custom Branding & Vinyls")}</span>
                                </div>
                                <span className="text-white font-bold">{brandingPrice.toLocaleString()}€</span>
                            </div>
                        )}

                        {/* Disclaimer if optional fields missing */}
                        {(!rentalDetails.transport || !rentalDetails.staff) && (
                            <div className="py-4 text-xs text-gray-500 italic text-center">
                                {t("proposal.rental.disclaimer", "* Transport and staff costs not included unless specified above. Prices exclude VAT.")}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Notes */}
            {proposal.notes && (
                <div className="text-gray-400 text-sm leading-relaxed p-6 bg-gray-900/50 rounded-lg border border-gray-800">
                    <p className="whitespace-pre-wrap">{proposal.notes}</p>
                </div>
            )}
        </div>
    );
}
