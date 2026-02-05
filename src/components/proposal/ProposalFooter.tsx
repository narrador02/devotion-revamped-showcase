import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

export default function ProposalFooter() {
    const { t } = useTranslation();

    const handleContact = () => {
        window.location.href = "mailto:info@devotionsim.com?subject=Proposal%20Inquiry";
    };

    return (
        <footer className="space-y-12">
            <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-white">
                    {t("proposal.readyToStart", "Ready to start the race?")}
                </h3>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        onClick={handleContact}
                        size="lg"
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-red-600/20 transition-all hover:scale-105"
                    >
                        {t("proposal.acceptOffer", "Accept Proposal")}
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleContact}
                        className="w-full sm:w-auto border-gray-700 text-white hover:bg-white/5 hover:text-white px-8 py-6 text-lg"
                    >
                        {t("proposal.contactUs", "Contact Us")}
                        <Mail className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center space-y-4">
                <img
                    src="/devotion-logo.png"
                    alt="DevotionSim"
                    className="h-8 mx-auto opacity-50 grayscale hover:grayscale-0 transition-all duration-300"
                />
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} DevotionSim. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
