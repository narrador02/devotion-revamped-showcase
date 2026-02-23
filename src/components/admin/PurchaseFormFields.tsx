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
    const { control } = useFormContext();

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
                                <FormItem>
                                    <FormLabel className="text-gray-400 text-sm">
                                        Time Attack
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder={defaultPriceTimeAttack.toLocaleString("es-ES")}
                                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 pr-8"
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
                                <FormItem>
                                    <FormLabel className="text-gray-400 text-sm">
                                        Slady
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder={defaultPriceSlady.toLocaleString("es-ES")}
                                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 pr-8"
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
                                <FormItem>
                                    <FormLabel className="text-gray-400 text-sm">
                                        Top Gun
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder={defaultPriceTopGun.toLocaleString("es-ES")}
                                                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 pr-8"
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
