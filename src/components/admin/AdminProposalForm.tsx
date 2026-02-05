import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { upload } from "@vercel/blob/client";
import {
    Upload, Loader2, Image as ImageIcon, X, FileText,
    Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhraseGenerator from "./PhraseGenerator";
import ProposalSettingsDialog from "./ProposalSettingsDialog";
import RentalFormFields from "./RentalFormFields";
import PurchaseFormFields from "./PurchaseFormFields";
import ProposalPreviewDialog from "./ProposalPreviewDialog";
import { useRentalCalculator } from "@/hooks/useRentalCalculator";

interface AdminProposalFormProps {
    onSuccess: (proposalId: string, clientName: string) => void;
}

const formSchema = z.object({
    proposalType: z.enum(["rental", "purchase"]),
    clientName: z.string().min(1, "Client name is required").max(100),
    personalMessage: z.string().max(500).optional().or(z.literal("")),

    // Rental fields
    isVIP: z.boolean().default(false),
    rentalBasePrice: z.number().default(750),
    numberOfSimulators: z.number().min(1).default(1),
    transportKm: z.number().optional().or(z.nan()),
    numberOfStaff: z.number().optional().or(z.nan()),
    numberOfDays: z.number().optional().or(z.nan()),
    staffTravel: z.number().optional().or(z.nan()),
    staffHotel: z.number().optional().or(z.nan()),

    // Purchase fields
    purchasePricingBasic: z.string().optional().or(z.literal("")),
    purchasePricingProfessional: z.string().optional().or(z.literal("")),
    purchasePricingComplete: z.string().optional().or(z.literal("")),
    paymentTerms: z.string().optional().or(z.literal("")),

    notes: z.string().max(2000).optional().or(z.literal("")),
}).superRefine((data, ctx) => {
    if (data.proposalType === "purchase") {
        if (!data.purchasePricingBasic) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Basic pricing is required",
                path: ["purchasePricingBasic"]
            });
        }
        if (!data.purchasePricingProfessional) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Professional pricing is required",
                path: ["purchasePricingProfessional"]
            });
        }
        if (!data.purchasePricingComplete) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Complete pricing is required",
                path: ["purchasePricingComplete"]
            });
        }
    }
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminProposalForm({ onSuccess }: AdminProposalFormProps) {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Settings for multipliers
    const [settings, setSettings] = useState({
        transportMultiplier: 1.6,
        staffMultiplier: 280
    });

    // Load saved settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch("/api/admin/settings");
                if (response.ok) {
                    const data = await response.json();
                    if (data.settings) {
                        setSettings({
                            transportMultiplier: data.settings.transportMultiplier ?? 1.6,
                            staffMultiplier: data.settings.staffMultiplier ?? 280
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to load settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            proposalType: "rental",
            clientName: "",
            personalMessage: "",
            isVIP: false,
            rentalBasePrice: 750,
            numberOfSimulators: 1,
            notes: "",
        },
    });

    const proposalType = form.watch("proposalType");
    const rentalValues = form.watch(); // Watch all for rental calculations

    // Calculate rental totals for submission
    const rentalTotals = useRentalCalculator({
        basePrice: rentalValues.isVIP ? 550 : 750,
        numberOfSimulators: rentalValues.numberOfSimulators || 0,
        transportKm: rentalValues.transportKm || 0,
        transportMultiplier: settings.transportMultiplier,
        numberOfStaff: rentalValues.numberOfStaff || 0,
        numberOfDays: rentalValues.numberOfDays || 0,
        staffMultiplier: settings.staffMultiplier,
        staffTravel: rentalValues.staffTravel || 0,
        staffHotel: rentalValues.staffHotel || 0,
    });

    const handleFileSelect = async (file: File) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError(t("admin.proposals.invalidFileType"));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setUploadError(t("admin.proposals.fileTooLarge"));
            return;
        }

        setLogoFile(file);
        setUploadError(null);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setLogoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Vercel Blob
        setIsUploading(true);
        try {
            const blob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/blob/upload',
            });
            setLogoUrl(blob.url);
        } catch (err) {
            console.error("Upload error:", err);
            setUploadError(t("admin.proposals.uploadError"));
            setLogoFile(null);
            setLogoPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const removeFile = () => {
        setLogoFile(null);
        setLogoPreview(null);
        setLogoUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = async (values: FormValues) => {
        if (!logoUrl) {
            setUploadError(t("admin.proposals.logoRequired"));
            return;
        }

        setIsSubmitting(true);

        try {
            const payload: any = {
                proposalType: values.proposalType,
                clientName: values.clientName,
                clientLogoUrl: logoUrl,
                personalMessage: values.personalMessage || undefined,
                notes: values.notes || undefined,
            };

            if (values.proposalType === "rental") {
                payload.rentalDetails = {
                    basePrice: values.isVIP ? 550 : 750,
                    isVIP: values.isVIP,
                    numberOfSimulators: values.numberOfSimulators,
                    transport: values.transportKm ? {
                        kilometers: values.transportKm,
                        pricePerKm: settings.transportMultiplier,
                        totalCost: rentalTotals.transportCost
                    } : undefined,
                    staff: (values.numberOfStaff || values.numberOfDays) ? {
                        numberOfStaff: values.numberOfStaff,
                        numberOfDays: values.numberOfDays,
                        pricePerStaffDay: settings.staffMultiplier,
                        travelExpenses: values.staffTravel,
                        hotelExpenses: values.staffHotel,
                        totalCost: rentalTotals.staffTotalCost
                    } : undefined,
                    subtotal: rentalTotals.simulatorSubtotal,
                    total: rentalTotals.grandTotal
                };
            } else {
                payload.purchaseDetails = {
                    packages: {
                        basic: values.purchasePricingBasic,
                        professional: values.purchasePricingProfessional,
                        complete: values.purchasePricingComplete,
                    },
                    paymentTerms: values.paymentTerms || undefined
                };
            }

            const response = await fetch("/api/proposals/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create proposal");
            }

            const data = await response.json();
            onSuccess(data.proposal.id, values.clientName);
        } catch (err) {
            console.error("Error creating proposal:", err);
            // Show error toast or message
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="bg-gray-900/90 border-gray-800">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-red-500" />
                        {t("admin.proposals.formTitle")}
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-1">
                        {t("admin.proposals.formDescription")}
                    </CardDescription>
                </div>
                <ProposalSettingsDialog onSettingsChange={setSettings} />
            </CardHeader>
            <CardContent>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Proposal Type Toggle */}
                        <FormField
                            control={form.control}
                            name="proposalType"
                            render={({ field }) => (
                                <Tabs
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                                        <TabsTrigger value="rental" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                                            {t("admin.proposals.type.rental")}
                                        </TabsTrigger>
                                        <TabsTrigger value="purchase" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                                            {t("admin.proposals.type.purchase")}
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            )}
                        />

                        {/* Client Name */}
                        <FormField
                            control={form.control}
                            name="clientName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300 flex items-center gap-2">
                                        <Building2 className="w-4 h-4" />
                                        {t("admin.proposals.clientName")} *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={t("admin.proposals.clientNamePlaceholder")}
                                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Logo Upload */}
                        <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                {t("admin.proposals.clientLogo")} *
                            </Label>

                            {!logoPreview ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-600 hover:bg-gray-800/30 transition-colors"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileSelect(file);
                                        }}
                                    />
                                    <Upload className="w-10 h-10 mx-auto text-gray-500 mb-3" />
                                    <p className="text-gray-400 text-sm">
                                        {t("admin.proposals.dropOrClick")}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        JPG, PNG, WEBP (max 5MB)
                                    </p>
                                </div>
                            ) : (
                                <div className="relative inline-block">
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="max-h-32 rounded-lg border border-gray-700"
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            )}

                            {uploadError && (
                                <p className="text-sm text-red-400">{uploadError}</p>
                            )}
                        </div>

                        {/* Personal Message */}
                        <FormField
                            control={form.control}
                            name="personalMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">
                                        {t("admin.proposals.personalMessage")}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            value={field.value || ""}
                                            placeholder={t("admin.proposals.personalMessagePlaceholder")}
                                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[80px]"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />

                                    <div className="mt-3">
                                        <PhraseGenerator
                                            clientName={form.watch("clientName")}
                                            onSelectPhrase={(phrase) => form.setValue("personalMessage", phrase)}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Rental or Purchase Specific Fields */}
                        {proposalType === "rental" ? (
                            <RentalFormFields
                                transportMultiplier={settings.transportMultiplier}
                                staffMultiplier={settings.staffMultiplier}
                            />
                        ) : (
                            <PurchaseFormFields />
                        )}

                        {/* Additional Notes */}
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">
                                        {t("admin.proposals.notes")}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            value={field.value || ""}
                                            placeholder={t("admin.proposals.notesPlaceholder")}
                                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <ProposalPreviewDialog
                                data={{
                                    proposalType: form.watch("proposalType"),
                                    clientName: form.watch("clientName") || "Client Name",
                                    clientLogoUrl: logoUrl || "/placeholder-logo.png", // Fallback for preview
                                    personalMessage: form.watch("personalMessage"),
                                    notes: form.watch("notes"),
                                    rentalDetails: form.watch("proposalType") === "rental" ? {
                                        basePrice: rentalValues.isVIP ? 550 : 750,
                                        isVIP: rentalValues.isVIP,
                                        numberOfSimulators: rentalValues.numberOfSimulators || 1,
                                        transport: rentalValues.transportKm ? {
                                            kilometers: rentalValues.transportKm,
                                            pricePerKm: settings.transportMultiplier,
                                            totalCost: rentalTotals.transportCost
                                        } : undefined,
                                        staff: (rentalValues.numberOfStaff || rentalValues.numberOfDays) ? {
                                            numberOfStaff: rentalValues.numberOfStaff,
                                            numberOfDays: rentalValues.numberOfDays,
                                            pricePerStaffDay: settings.staffMultiplier,
                                            travelExpenses: rentalValues.staffTravel,
                                            hotelExpenses: rentalValues.staffHotel,
                                            totalCost: rentalTotals.staffTotalCost
                                        } : undefined,
                                        subtotal: rentalTotals.simulatorSubtotal,
                                        total: rentalTotals.grandTotal
                                    } : undefined,
                                    purchaseDetails: form.watch("proposalType") === "purchase" ? {
                                        packages: {
                                            basic: form.watch("purchasePricingBasic") || "500€",
                                            professional: form.watch("purchasePricingProfessional") || "900€",
                                            complete: form.watch("purchasePricingComplete") || "1200€",
                                        },
                                        paymentTerms: form.watch("paymentTerms")
                                    } : undefined
                                }}
                                disabled={!form.watch("clientName")}
                            />

                            <Button
                                type="submit"
                                disabled={isSubmitting || isUploading}
                                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-5 shadow-lg shadow-red-500/20"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {t("admin.proposals.creating")}
                                    </>
                                ) : (
                                    t("admin.proposals.submit")
                                )}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
