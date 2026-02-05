import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Truck, Users, Euro, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRentalCalculator } from "@/hooks/useRentalCalculator";

interface RentalFormFieldsProps {
    transportMultiplier: number;
    staffMultiplier: number;
}

export default function RentalFormFields({ transportMultiplier, staffMultiplier }: RentalFormFieldsProps) {
    const { t } = useTranslation();
    const { control, watch, setValue } = useFormContext();

    // Watch fields for calculation
    const isVIP = watch("isVIP");
    const numberOfSimulators = watch("numberOfSimulators");
    const transportKm = watch("transportKm");
    const numberOfStaff = watch("numberOfStaff");
    const numberOfDays = watch("numberOfDays");
    const staffTravel = watch("staffTravel");
    const staffHotel = watch("staffHotel");

    // Update base price when VIP changes
    useEffect(() => {
        setValue("rentalBasePrice", isVIP ? 550 : 750);
    }, [isVIP, setValue]);

    // Calculate totals
    const totals = useRentalCalculator({
        basePrice: isVIP ? 550 : 750,
        numberOfSimulators: parseFloat(numberOfSimulators) || 0,
        transportKm: parseFloat(transportKm) || 0,
        transportMultiplier,
        numberOfStaff: parseFloat(numberOfStaff) || 0,
        numberOfDays: parseFloat(numberOfDays) || 0,
        staffMultiplier,
        staffTravel: parseFloat(staffTravel) || 0,
        staffHotel: parseFloat(staffHotel) || 0,
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Base Price & VIP Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="space-y-0.5">
                    <Label className="text-base text-white">{t("admin.proposals.rental.isVIP")}</Label>
                    <p className="text-sm text-gray-400">
                        {isVIP ? "550€" : "750€"} {t("admin.proposals.rental.basePrice")}
                    </p>
                </div>
                <FormField
                    control={control}
                    name="isVIP"
                    render={({ field }) => (
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-red-600"
                            />
                        </FormControl>
                    )}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Simulators */}
                <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="pt-6">
                        <FormField
                            control={control}
                            name="numberOfSimulators"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-gray-300">
                                        <Calculator className="w-4 h-4 text-red-400" />
                                        {t("admin.proposals.rental.simulators")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Transport */}
                <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                            <Truck className="w-4 h-4 text-red-400" />
                            {t("admin.proposals.rental.transport")}
                        </div>

                        <FormField
                            control={control}
                            name="transportKm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs text-gray-400">{t("admin.proposals.rental.km")}</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                className="bg-gray-700 border-gray-600 text-white pr-16"
                                            />
                                            <div className="absolute right-3 top-2.5 text-xs text-gray-500">
                                                x {transportMultiplier}€
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {totals.transportCost > 0 && (
                            <div className="text-right text-sm text-green-400 font-mono">
                                + {totals.transportCost.toFixed(2)}€
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Staff */}
                <Card className="bg-gray-800/50 border-gray-700 md:col-span-2">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-gray-300 font-medium mb-4">
                            <Users className="w-4 h-4 text-red-400" />
                            {t("admin.proposals.rental.staff")}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <FormField
                                control={control}
                                name="numberOfStaff"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs text-gray-400">{t("admin.proposals.rental.staffCount")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                className="bg-gray-700 border-gray-600 text-white"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="numberOfDays"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs text-gray-400">{t("admin.proposals.rental.days")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                className="bg-gray-700 border-gray-600 text-white"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="staffTravel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs text-gray-400">{t("admin.proposals.rental.travel")}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                    className="bg-gray-700 border-gray-600 text-white pl-6"
                                                />
                                                <span className="absolute left-2 top-2.5 text-gray-500">€</span>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="staffHotel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs text-gray-400">{t("admin.proposals.rental.hotel")}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                    className="bg-gray-700 border-gray-600 text-white pl-6"
                                                />
                                                <span className="absolute left-2 top-2.5 text-gray-500">€</span>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {totals.staffTotalCost > 0 && (
                            <div className="mt-4 text-right text-sm text-green-400 font-mono">
                                + {totals.staffTotalCost.toFixed(2)}€
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Totals Summary */}
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 space-y-2">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                    {t("admin.proposals.rental.totals")}
                </h4>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t("admin.proposals.rental.simTotal")}</span>
                    <span className="text-white">{totals.simulatorSubtotal.toFixed(2)}€</span>
                </div>

                {totals.transportCost > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t("admin.proposals.rental.transportTotal")}</span>
                        <span className="text-white">{totals.transportCost.toFixed(2)}€</span>
                    </div>
                )}

                {totals.staffTotalCost > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t("admin.proposals.rental.staffTotal")}</span>
                        <span className="text-white">{totals.staffTotalCost.toFixed(2)}€</span>
                    </div>
                )}

                <Separator className="bg-gray-700 my-2" />

                <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">{t("admin.proposals.rental.total")}</span>
                    <span className="text-red-500">{totals.grandTotal.toFixed(2)}€</span>
                </div>
            </div>
        </div>
    );
}
