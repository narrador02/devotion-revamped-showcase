import { useTranslation } from "react-i18next";
import { CheckCircle, Copy, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ProposalSuccessProps {
    proposalId: string;
    clientName: string;
    onCreateAnother: () => void;
}

export default function ProposalSuccess({ proposalId, clientName, onCreateAnother }: ProposalSuccessProps) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const proposalUrl = `${window.location.origin}/p/${proposalId}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(proposalUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="max-w-md mx-auto text-center space-y-6 py-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                    {t("admin.proposals.successTitle")}
                </h2>
                <p className="text-gray-400">
                    {t("admin.proposals.successMessage", { clientName })}
                </p>
            </div>

            <div className="space-y-3">
                <label className="text-sm text-gray-400 block text-left">
                    {t("admin.proposals.proposalLink")}
                </label>
                <div className="flex gap-2">
                    <Input
                        value={proposalUrl}
                        readOnly
                        className="bg-gray-800 border-gray-700 text-gray-300 font-mono text-sm"
                    />
                    <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="shrink-0 border-gray-700 hover:bg-gray-800"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                <span className="text-green-500">{t("admin.proposals.copied")}</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-2" />
                                {t("admin.proposals.copy")}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <Button
                onClick={onCreateAnother}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            >
                <Plus className="w-4 h-4 mr-2" />
                {t("admin.proposals.createAnother")}
            </Button>
        </div>
    );
}
