import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Settings, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface AdminSettings {
    transportMultiplier: number;
    staffMultiplier: number;
    simulatorPrice: number;
    simulatorPriceVIP: number;
}

interface ProposalSettingsDialogProps {
    onSettingsChange: (settings: AdminSettings) => void;
}

export default function ProposalSettingsDialog({ onSettingsChange }: ProposalSettingsDialogProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState<AdminSettings>({
        transportMultiplier: 1.6,
        staffMultiplier: 280,
        simulatorPrice: 750,
        simulatorPriceVIP: 550,
    });

    // Load settings on open
    useEffect(() => {
        if (isOpen) {
            loadSettings();
        }
    }, [isOpen]);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/settings");
            if (response.ok) {
                const data = await response.json();
                setSettings(data.settings);
                onSettingsChange(data.settings);
            }
        } catch (error) {
            console.error("Failed to load settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                onSettingsChange(settings);
                setIsOpen(false);
            }
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
                <DialogHeader>
                    <DialogTitle>{t("admin.proposals.settings.title", "Proposal Settings")}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {t("admin.proposals.settings.description", "Adjust global multipliers for calculations.")}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                    </div>
                ) : (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="transport" className="text-right col-span-2">
                                {t("admin.proposals.settings.transport", "Transport (€/km)")}
                            </Label>
                            <Input
                                id="transport"
                                type="number"
                                step="0.1"
                                value={settings.transportMultiplier}
                                onChange={(e) => setSettings({ ...settings, transportMultiplier: parseFloat(e.target.value) })}
                                className="col-span-2 bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="staff" className="text-right col-span-2">
                                {t("admin.proposals.settings.staff", "Staff (€/day)")}
                            </Label>
                            <Input
                                id="staff"
                                type="number"
                                value={settings.staffMultiplier}
                                onChange={(e) => setSettings({ ...settings, staffMultiplier: parseFloat(e.target.value) })}
                                className="col-span-2 bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="simulatorPrice" className="text-right col-span-2">
                                {t("admin.proposals.settings.simulatorPrice", "Sim. Base Price (€)")}
                            </Label>
                            <Input
                                id="simulatorPrice"
                                type="number"
                                value={settings.simulatorPrice}
                                onChange={(e) => setSettings({ ...settings, simulatorPrice: parseFloat(e.target.value) })}
                                className="col-span-2 bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="simulatorPriceVIP" className="text-right col-span-2">
                                {t("admin.proposals.settings.simulatorPriceVIP", "Sim. VIP Price (€)")}
                            </Label>
                            <Input
                                id="simulatorPriceVIP"
                                type="number"
                                value={settings.simulatorPriceVIP}
                                onChange={(e) => setSettings({ ...settings, simulatorPriceVIP: parseFloat(e.target.value) })}
                                className="col-span-2 bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {t("admin.proposals.settings.save", "Save Changes")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
