import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Proposal } from "@/types/proposal";
import ProposalHero from "./ProposalHero";
import ProposalExperience from "./ProposalExperience";
import ProposalBranding, { BrandingOption, BRANDING_PRICES, BRANDING_LABELS } from "./ProposalBranding";
import ProposalFlightCase from "./ProposalFlightCase";
import ProposalPianolas from "./ProposalPianolas";
import ProposalAudioSystem from "./ProposalAudioSystem";
import RentalProposalTemplate from "./RentalProposalTemplate";
import PurchaseProposalTemplate from "./PurchaseProposalTemplate";
import ProposalFooter from "./ProposalFooter";
import ProposalPDF from "./ProposalPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { useDynamicProposalPricing } from "@/hooks/useDynamicProposalPricing";

interface ProposalDisplayProps {
    proposal: Proposal;
}

export default function ProposalDisplay({ proposal }: ProposalDisplayProps) {
    const { t } = useTranslation();
    const [brandingOption, setBrandingOption] = useState<BrandingOption>('none');
    const [showFlightCase, setShowFlightCase] = useState(false);
    const [showPianola, setShowPianola] = useState(false);
    const [showAudioSystem, setShowAudioSystem] = useState(false);

    // Make sure we default to an existing simulator when displaying a purchase proposal
    const packages = (proposal.purchaseDetails?.packages || {}) as any;

    // Check which simulators have prices set and find the best default
    const defaultPurchaseSim =
        packages.topGun !== undefined && packages.topGun > 0 ? 'Top Gun' :
            packages.slady !== undefined && packages.slady > 0 ? 'Slady' :
                packages.timeAttack !== undefined && packages.timeAttack > 0 ? 'Time Attack' :
                    'Slady'; // Fallback

    const [selectedSimulator, setSelectedSimulator] = useState(defaultPurchaseSim);

    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

    const brandingPrices = proposal.brandingPrices || BRANDING_PRICES;
    const brandingPrice = brandingPrices[brandingOption];
    const brandingLabel = BRANDING_LABELS[brandingOption];
    const showBranding = brandingOption !== 'none';
    const flightCasePrice = proposal.flightCasePrice ?? 840;
    const pianolaPrice = proposal.pianolaPrice ?? 480;
    const audioSystemPrice = proposal.audioSystemPrice ?? 490;
    const isPurchase = proposal.proposalType === 'purchase';

    // Detect payment success from URL params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('payment') === 'success') {
            setShowPaymentSuccess(true);
            // Clean the URL without reloading
            const url = new URL(window.location.href);
            url.searchParams.delete('payment');
            window.history.replaceState({}, '', url.toString());
        }
    }, []);

    // Calculate dynamic pricing based on selected dates
    const dynamicRentalDetails = useDynamicProposalPricing(proposal, dateRange);

    const displayProposal = {
        ...proposal,
        rentalDetails: dynamicRentalDetails || proposal.rentalDetails
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500/30 overflow-x-hidden">

            {/* Payment Success Banner */}
            <AnimatePresence>
                {showPaymentSuccess && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-green-600 to-emerald-600 shadow-2xl shadow-green-500/30"
                    >
                        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-white" />
                                <div>
                                    <p className="text-white font-bold">
                                        {t("proposal.paymentSuccess", "Payment Successful!")}
                                    </p>
                                    <p className="text-green-100 text-sm">
                                        {t("proposal.paymentSuccessDesc", "Thank you! Your payment has been processed. We will contact you shortly to confirm details.")}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPaymentSuccess(false)}
                                className="text-white/80 hover:text-white transition-colors p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. Hero Section (Replaces old ProposalHeader) */}
            <ProposalHero
                clientName={proposal.clientName}
                clientLogoUrl={proposal.clientLogoUrl}
            />

            {/* 2. Experience Section (Simulators) */}
            <ProposalExperience
                selectedSimulator={isPurchase ? selectedSimulator : undefined}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 space-y-12">

                {/* 4. Branding Add-on */}
                <ProposalBranding
                    selected={brandingOption}
                    onSelect={setBrandingOption}
                    prices={brandingPrices}
                />

                {/* 5. Flight Case Add-on (Purchase only) */}
                {isPurchase && (
                    <ProposalFlightCase
                        isSelected={showFlightCase}
                        onToggle={setShowFlightCase}
                        price={flightCasePrice}
                    />
                )}

                {/* 6. Pianolas Add-on (Purchase only) */}
                {isPurchase && (
                    <ProposalPianolas
                        isSelected={showPianola}
                        onToggle={setShowPianola}
                        price={pianolaPrice}
                    />
                )}

                {/* 6b. Audio System Add-on (Purchase only) */}
                {isPurchase && (
                    <ProposalAudioSystem
                        isSelected={showAudioSystem}
                        onToggle={setShowAudioSystem}
                        price={audioSystemPrice}
                    />
                )}

                {/* 7. Detailed Proposal & Pricing */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    id="proposal-details"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {t("proposal.details.title", "Your Personalized Proposal")}
                        </h2>
                        {proposal.personalMessage && (
                            <p className="text-gray-400 max-w-2xl mx-auto italic border-l-2 border-red-500 pl-4 py-2 bg-gray-900/50">
                                "{proposal.personalMessage}"
                            </p>
                        )}
                    </div>

                    {proposal.proposalType === 'rental' ? (
                        <RentalProposalTemplate
                            proposal={displayProposal}
                            showBranding={showBranding}
                            brandingPrice={brandingPrice}
                            brandingLabel={brandingLabel}
                        />
                    ) : (
                        <PurchaseProposalTemplate
                            proposal={proposal}
                            selectedSimulator={selectedSimulator}
                            onSelectSimulator={setSelectedSimulator}
                            showBranding={showBranding}
                            brandingPrice={brandingPrice}
                            brandingLabel={brandingLabel}
                            showFlightCase={showFlightCase}
                            flightCasePrice={flightCasePrice}
                            showPianola={showPianola}
                            pianolaPrice={pianolaPrice}
                            showAudioSystem={showAudioSystem}
                            audioSystemPrice={audioSystemPrice}
                        />
                    )}
                </motion.div>

                {/* Footer */}
                <ProposalFooter
                    proposal={displayProposal}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    showBranding={showBranding}
                    brandingPrice={brandingPrice}
                    brandingLabel={brandingLabel}
                    showFlightCase={isPurchase ? showFlightCase : false}
                    flightCasePrice={flightCasePrice}
                    showPianola={isPurchase ? showPianola : false}
                    pianolaPrice={pianolaPrice}
                    showAudioSystem={isPurchase ? showAudioSystem : false}
                    audioSystemPrice={audioSystemPrice}
                    selectedSimulator={isPurchase ? selectedSimulator : undefined}
                />
            </div>

            {/* PDF Download Button (Floating) */}
            <div className="fixed bottom-6 right-6 z-50">
                <PDFDownloadLink
                    document={
                        <ProposalPDF
                            proposal={proposal}
                            selectedSimulator={selectedSimulator}
                            showBranding={showBranding}
                            brandingPrice={brandingPrice}
                            brandingLabel={brandingLabel}
                            showFlightCase={showFlightCase}
                            flightCasePrice={flightCasePrice}
                            showPianola={showPianola}
                            pianolaPrice={pianolaPrice}
                            showAudioSystem={showAudioSystem}
                            audioSystemPrice={audioSystemPrice}
                        />
                    }
                    fileName={`DevotionSim_Proposal_${proposal.clientName.replace(/\s+/g, '_')}.pdf`}
                >
                    {({ loading }) => (
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-14 w-14 rounded-full shadow-2xl bg-red-600 border-none hover:bg-red-700 text-white transition-all duration-300 hover:scale-110"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <Download className="h-6 w-6" />
                            )}
                        </Button>
                    )}
                </PDFDownloadLink>
            </div>
        </div>
    );
}
