import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Euro, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

interface PurchaseFormFieldsProps {
    defaultPriceTimeAttack: number;
    defaultPriceSlady: number;
    defaultPriceTopGun: number;
}

export default function PurchaseFormFields({ defaultPriceTimeAttack, defaultPriceSlady, defaultPriceTopGun }: PurchaseFormFieldsProps) {
    const { t } = useTranslation();
    const { control, watch, setValue } = useFormContext();

    const selectedSimulators = watch("selectedPurchaseSimulators") || {
        timeAttack: false,
        slady: false,
        topGun: false,
    };

    const toggleSimulator = (sim: 'timeAttack' | 'slady' | 'topGun') => {
        setValue("selectedPurchaseSimulators", {
            ...selectedSimulators,
            [sim]: !selectedSimulators[sim]
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                        <Euro className="w-4 h-4 text-red-400" />
                        {t("admin.proposals.purchase.simulatorPrices", "Precios por Simulador")}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <FormField
                            control={control}
                            name="purchasePriceTimeAttack"
                            render={({ field }) => (
                                <FormItem className={`transition-all duration-300 ${!selectedSimulators.timeAttack ? 'opacity-50 grayscale cursor-pointer' : ''}`} onClick={() => !selectedSimulators.timeAttack && toggleSimulator('timeAttack')}>
                                    <FormLabel className="text-gray-400 text-sm flex justify-between items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleSimulator('timeAttack'); }}>
                                        Time Attack
                                        <div className={`w-3 h-3 rounded-full ${selectedSimulators.timeAttack ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-gray-600'}`} />
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                {...field}
                                                disabled={!selectedSimulators.timeAttack}
                                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder={defaultPriceTimeAttack.toLocaleString("es-ES")}
                                                className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 pr-8 ${!selectedSimulators.timeAttack ? 'pointer-events-none' : ''}`}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="purchasePriceSlady"
                            render={({ field }) => (
                                <FormItem className={`transition-all duration-300 ${!selectedSimulators.slady ? 'opacity-50 grayscale cursor-pointer' : ''}`} onClick={() => !selectedSimulators.slady && toggleSimulator('slady')}>
                                    <FormLabel className="text-gray-400 text-sm flex justify-between items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleSimulator('slady'); }}>
                                        Slady
                                        <div className={`w-3 h-3 rounded-full ${selectedSimulators.slady ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gray-600'}`} />
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                {...field}
                                                disabled={!selectedSimulators.slady}
                                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder={defaultPriceSlady.toLocaleString("es-ES")}
                                                className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 pr-8 ${!selectedSimulators.slady ? 'pointer-events-none' : ''}`}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="purchasePriceTopGun"
                            render={({ field }) => (
                                <FormItem className={`transition-all duration-300 ${!selectedSimulators.topGun ? 'opacity-50 grayscale cursor-pointer' : ''}`} onClick={() => !selectedSimulators.topGun && toggleSimulator('topGun')}>
                                    <FormLabel className="text-gray-400 text-sm flex justify-between items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleSimulator('topGun'); }}>
                                        Top Gun
                                        <div className={`w-3 h-3 rounded-full ${selectedSimulators.topGun ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-gray-600'}`} />
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                {...field}
                                                disabled={!selectedSimulators.topGun}
                                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder={defaultPriceTopGun.toLocaleString("es-ES")}
                                                className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 pr-8 ${!selectedSimulators.topGun ? 'pointer-events-none' : ''}`}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="pt-4">
                        <div className="flex items-center gap-2 text-gray-300 font-medium mb-4">
                            <FileText className="w-4 h-4 text-red-400" />
                            {t("admin.proposals.purchase.paymentTerms")}
                        </div>

                        <FormField
                            control={control}
                            name="paymentTerms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder={t("admin.proposals.purchase.paymentTermsPlaceholder")}
                                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 min-h-[80px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
