import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Proposal } from "@/types/proposal";

interface ProposalHeaderProps {
    proposal: Proposal;
}

export default function ProposalHeader({ proposal }: ProposalHeaderProps) {
    const { t } = useTranslation();

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
        >
            {/* Client Logo */}
            <div className="relative inline-block group">
                <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                    src={proposal.clientLogoUrl}
                    alt={proposal.clientName}
                    className="relative h-24 sm:h-32 object-contain mx-auto drop-shadow-2xl"
                />
            </div>

            <div className="space-y-2">
                <h2 className="text-sm font-medium text-red-500 uppercase tracking-[0.2em]">
                    {t("proposal.preparedFor")}
                </h2>
                <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                    {proposal.clientName}
                </h1>
            </div>

            {proposal.personalMessage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="relative">
                        <span className="absolute -top-4 -left-2 text-6xl text-red-600/20 font-serif">"</span>
                        <p className="text-lg sm:text-xl text-gray-300 italic font-light leading-relaxed px-6">
                            {proposal.personalMessage}
                        </p>
                        <span className="absolute -bottom-8 -right-2 text-6xl text-red-600/20 font-serif">"</span>
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}
