import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

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
                        className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold px-12 py-8 text-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] uppercase tracking-wider animate-pulse hover:animate-none"
                        style={{ animationDuration: '3s' }}
                    >
                        {t("proposal.acceptOffer", "Accept Proposal")}
                    </Button>
                </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center space-y-4">
                <img
                    src="/logo.png"
                    alt="DevotionSim"
                    className="h-10 mx-auto brightness-0 invert opacity-80 hover:opacity-100 transition-all duration-300"
                />
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} DevotionSim. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
