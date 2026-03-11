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
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
            <DialogContent 
                className="fixed inset-0 sm:inset-auto z-[9999] w-full sm:w-[95vw] max-w-none sm:max-w-[95vw] h-full sm:h-[90vh] p-0 bg-black border-none sm:border-gray-800 overflow-hidden flex flex-col sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 !static !left-0 !top-0 !translate-x-0 !translate-y-0 sm:!fixed sm:!left-1/2 sm:!top-1/2 sm:!-translate-x-1/2 sm:!-translate-y-1/2 [&>button]:hidden sm:[&>button]:block"
            >
                <ScrollArea className="flex-1 w-full">
                    <ProposalDisplay proposal={previewProposal} />
                </ScrollArea>
                {/* Visual indicator for mobile users that it's a preview */}
                <div className="sm:hidden bg-black/80 border-t border-gray-800 p-4 text-center">
                   <Button onClick={() => setIsOpen(false)} className="w-full bg-red-600 hover:bg-red-700">
                       {t("common.close", "Cerrar Previsualización")}
                   </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
