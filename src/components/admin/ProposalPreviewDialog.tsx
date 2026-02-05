import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Proposal } from "@/types/proposal";
import ProposalDisplay from "@/components/proposal/ProposalDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProposalPreviewDialogProps {
    data: Partial<Proposal>;
    disabled?: boolean;
}

export default function ProposalPreviewDialog({ data, disabled }: ProposalPreviewDialogProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    // Construct a temporary proposal object for display
    const previewProposal = {
        ...data,
        id: "preview",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    } as Proposal;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className="w-full sm:w-auto border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
                >
                    <Eye className="w-4 h-4 mr-2" />
                    {t("admin.proposals.preview", "Preview")}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] h-[90vh] p-0 bg-gray-900 border-gray-800 overflow-hidden">
                <ScrollArea className="h-full w-full">
                    <ProposalDisplay proposal={previewProposal} />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
