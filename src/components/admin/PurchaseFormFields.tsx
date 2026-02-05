import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Euro, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

export default function PurchaseFormFields() {
    const { t } = useTranslation();
    const { control } = useFormContext();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                        <Euro className="w-4 h-4 text-red-400" />
                        {t("admin.proposals.purchase.packages")}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <FormField
                            control={control}
                            name="purchasePricingBasic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 text-sm">
                                        {t("admin.proposals.packBasic")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="500€"
                                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="purchasePricingProfessional"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 text-sm">
                                        {t("admin.proposals.packProfessional")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="900€"
                                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="purchasePricingComplete"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 text-sm">
                                        {t("admin.proposals.packComplete")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="1200€"
                                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                                        />
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
