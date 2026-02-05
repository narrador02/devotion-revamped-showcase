import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Proposal } from "@/types/proposal";
import ProposalHeader from "./ProposalHeader";
import RentalProposalTemplate from "./RentalProposalTemplate";
import PurchaseProposalTemplate from "./PurchaseProposalTemplate";
import ProposalFooter from "./ProposalFooter";
import ProposalPDF from "./ProposalPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProposalDisplayProps {
    proposal: Proposal;
}

export default function ProposalDisplay({ proposal }: ProposalDisplayProps) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-red-500/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black" />
                <div className="absolute top-0 left-0 w-full h-[500px] bg-red-600/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-12">
                {/* PDF Download Button (Floating) */}
                <div className="fixed bottom-6 right-6 z-50">
                    <PDFDownloadLink
                        document={<ProposalPDF proposal={proposal} />}
                        fileName={`DevotionSim_Proposal_${proposal.clientName.replace(/\s+/g, '_')}.pdf`}
                    >
                        {({ loading }) => (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 rounded-full shadow-xl bg-gray-900/90 border-red-500/50 hover:bg-red-600 hover:border-red-600 transition-all duration-300"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                                ) : (
                                    <Download className="h-5 w-5 text-white" />
                                )}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>

                {/* Header */}
                <ProposalHeader proposal={proposal} />

                {/* Main Content - Template Switcher */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {proposal.proposalType === 'rental' ? (
                        <RentalProposalTemplate proposal={proposal} />
                    ) : (
                        <PurchaseProposalTemplate proposal={proposal} />
                    )}
                </motion.div>

                {/* Footer */}
                <ProposalFooter />
            </div>
        </div>
    );
}
