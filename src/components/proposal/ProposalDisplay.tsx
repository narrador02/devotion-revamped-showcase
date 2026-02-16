import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Proposal } from "@/types/proposal";
import ProposalHero from "./ProposalHero";
import ProposalExperience from "./ProposalExperience";
import ProposalVR from "./ProposalVR";
import ProposalBranding from "./ProposalBranding";
import RentalProposalTemplate from "./RentalProposalTemplate";
import PurchaseProposalTemplate from "./PurchaseProposalTemplate";
import ProposalFooter from "./ProposalFooter";
import ProposalPDF from "./ProposalPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { useDynamicProposalPricing } from "@/hooks/useDynamicProposalPricing";

interface ProposalDisplayProps {
    proposal: Proposal;
}

export default function ProposalDisplay({ proposal }: ProposalDisplayProps) {
    const { t } = useTranslation();
    const [showBranding, setShowBranding] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const brandingPrice = 550;

    // Calculate dynamic pricing based on selected dates
    const dynamicRentalDetails = useDynamicProposalPricing(proposal, dateRange);

    const displayProposal = {
        ...proposal,
        rentalDetails: dynamicRentalDetails || proposal.rentalDetails
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500/30 overflow-x-hidden">

            {/* 1. Hero Section (Replaces old ProposalHeader) */}
            <ProposalHero
                clientName={proposal.clientName}
                clientLogoUrl={proposal.clientLogoUrl}
            />

            {/* 2. Experience Section (Simulators) */}
            <ProposalExperience />

            {/* 3. VR Section */}
            <ProposalVR />

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 space-y-12">

                {/* 4. Branding Add-on (Only for Rental, or both? Assuming Rental for now primarily) */}
                {proposal.proposalType === 'rental' && (
                    <ProposalBranding
                        isSelected={showBranding}
                        onToggle={setShowBranding}
                        price={brandingPrice}
                    />
                )}

                {/* 5. Detailed Proposal & Pricing */}
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
                        />
                    ) : (
                        <PurchaseProposalTemplate proposal={proposal} />
                    )}
                </motion.div>

                {/* Footer */}
                <ProposalFooter
                    proposal={displayProposal}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            </div>

            {/* PDF Download Button (Floating) */}
            <div className="fixed bottom-6 right-6 z-50">
                <PDFDownloadLink
                    document={
                        <ProposalPDF
                            proposal={proposal}
                        // Pass branding info to PDF if supported in future, currently PDF might not reflect dynamic state unless updated
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
