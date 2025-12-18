import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import ComparisonTable from "./ComparisonTable";

interface CompareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CompareDialog = ({ open, onOpenChange }: CompareDialogProps) => {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-rajdhani font-bold text-center mb-6">
                        {t("products.comparison.title")}
                    </DialogTitle>
                </DialogHeader>

                <ComparisonTable />

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t border-border">
                    <Button className="w-full sm:w-auto" size="lg">
                        {t("products.cta.bookDemo")}
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto" size="lg">
                        {t("products.cta.contact")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CompareDialog;
