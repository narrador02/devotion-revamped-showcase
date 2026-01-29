import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";

export default function ExpiredProposal() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <Clock className="w-10 h-10 text-gray-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-700 mb-3">
                    {t("proposal.expiredTitle")}
                </h1>
                <p className="text-gray-500 max-w-sm mx-auto">
                    {t("proposal.expiredMessage")}
                </p>
                <div className="mt-8 pt-6 border-t border-gray-300">
                    <p className="text-sm text-gray-400">
                        <span className="font-semibold">DevotionSim</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
