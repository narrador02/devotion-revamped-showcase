import { useTranslation } from "react-i18next";

interface Proposal {
    id: string;
    clientName: string;
    clientLogoUrl: string;
    personalMessage?: string;
    pricing: {
        basic: string;
        professional: string;
        complete: string;
    };
    notes?: string;
    createdAt: string;
    expiresAt: string;
}

interface ProposalDisplayProps {
    proposal: Proposal;
}

export default function ProposalDisplay({ proposal }: ProposalDisplayProps) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header with Logo */}
                <header className="text-center mb-12">
                    <div className="mb-6">
                        <img
                            src={proposal.clientLogoUrl}
                            alt={`${proposal.clientName} logo`}
                            className="max-h-24 mx-auto object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t("proposal.titleFor", { clientName: proposal.clientName })}
                    </h1>
                    {proposal.personalMessage && (
                        <p className="text-lg text-gray-600 italic mt-4 max-w-lg mx-auto">
                            "{proposal.personalMessage}"
                        </p>
                    )}
                </header>

                {/* Pricing Section */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                        {t("proposal.pricingTitle")}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {/* Basic Package */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                                {t("proposal.packBasic")}
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {proposal.pricing.basic}
                            </p>
                        </div>

                        {/* Professional Package */}
                        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 shadow-lg text-center transform sm:scale-105">
                            <h3 className="text-sm font-medium text-red-100 uppercase tracking-wide mb-3">
                                {t("proposal.packProfessional")}
                            </h3>
                            <p className="text-2xl font-bold text-white">
                                {proposal.pricing.professional}
                            </p>
                        </div>

                        {/* Complete Package */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                                {t("proposal.packComplete")}
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {proposal.pricing.complete}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Additional Notes */}
                {proposal.notes && (
                    <section className="mb-12">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {t("proposal.notesTitle")}
                        </h2>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <p className="text-gray-600 whitespace-pre-wrap">{proposal.notes}</p>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="text-center text-sm text-gray-500 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <img
                            src="/devotion-logo.png"
                            alt="DevotionSim"
                            className="h-6 object-contain"
                            onError={(e) => {
                                // Hide if logo doesn't exist
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        <span className="font-semibold text-gray-700">DevotionSim</span>
                    </div>
                    <p>{t("proposal.footer")}</p>
                </footer>
            </div>
        </div>
    );
}
