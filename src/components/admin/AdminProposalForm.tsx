import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { upload } from "@vercel/blob/client";
import {
    Upload, Loader2, Image as ImageIcon, X, FileText,
    Building2, Cloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhraseGenerator from "./PhraseGenerator";
import ProposalSettingsDialog from "./ProposalSettingsDialog";
import RentalFormFields from "./RentalFormFields";
import PurchaseFormFields from "./PurchaseFormFields";
import ProposalPreviewDialog from "./ProposalPreviewDialog";
import { useRentalCalculator } from "@/hooks/useRentalCalculator";
import { Proposal } from "@/types/proposal";

interface AdminProposalFormProps {
    onSuccess: (proposalId: string, clientName: string) => void;
    onCancel?: () => void;
    initialData?: Proposal | null;
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
    hotelNights: z.number().optional().or(z.nan()),
    requireDownPayment: z.boolean().default(false),
    downPaymentPercentage: z.number().min(0).max(100).default(30),
    eventReference: z.string().optional().or(z.literal("")),
    discountAmount: z.number().min(0).optional().or(z.nan()),
    discountConcept: z.string().optional().or(z.literal("")),

    // Purchase fields
    purchasePriceTimeAttack: z.number().min(1).default(23000),
    purchasePriceSlady: z.number().min(1).default(26000),
    purchasePriceTopGun: z.number().min(1).default(30000),
    paymentTerms: z.string().optional().or(z.literal("")),

    notes: z.string().max(2000).optional().or(z.literal("")),

    // Purchase conditional simulators
    selectedPurchaseSimulators: z.object({
        timeAttack: z.boolean(),
        slady: z.boolean(),
        topGun: z.boolean(),
    }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminProposalForm({ onSuccess, onCancel, initialData }: AdminProposalFormProps) {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // logoFile removed as unused
    const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.clientLogoUrl || null);
    const [logoUrl, setLogoUrl] = useState<string | null>(initialData?.clientLogoUrl || null);
    const [isPickerLoading, setIsPickerLoading] = useState(false);

    // Load Google script on mount
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        
        const gsiScript = document.createElement("script");
        gsiScript.src = "https://accounts.google.com/gsi/client";
        gsiScript.async = true;
        gsiScript.defer = true;
        document.body.appendChild(gsiScript);

        return () => {
            document.body.removeChild(script);
            document.body.removeChild(gsiScript);
        };
    }, []);

    const openGooglePicker = async () => {
        setIsPickerLoading(true);
        try {
            const res = await fetch("/api/admin?action=google-token", { credentials: "include" });
            if (!res.ok) throw new Error("Google not connected");
            const { accessToken, apiKey } = await res.json();

            const loadPicker = () => {
                return new Promise((resolve) => {
                    // @ts-ignore
                    window.gapi.load('picker', { callback: resolve });
                });
            };

            await loadPicker();

            // Create a view for images but include folders for navigation
            // @ts-ignore
            const docsView = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
                .setIncludeFolders(true)
                .setMimeTypes('image/jpeg,image/png,image/webp');

            // Restore last used folder if available
            const lastFolderId = localStorage.getItem("lastGoogleFolderId");
            if (lastFolderId) {
                docsView.setParent(lastFolderId);
            }

            // @ts-ignore
            const picker = new window.google.picker.PickerBuilder()
                .addView(docsView)
                .setOAuthToken(accessToken)
                .setDeveloperKey(apiKey)
                .setCallback(async (data: any) => {
                    // @ts-ignore
                    if (data.action === window.google.picker.Action.PICKED) {
                        const file = data.docs[0];
                        const fileId = file.id;
                        
                        // Store the parent folder ID for persistence if available
                        if (file.parentId) {
                            localStorage.setItem("lastGoogleFolderId", file.parentId);
                        }
                        
                        // Fetch the file blob using the access token
                        setIsUploading(true);
                        try {
                            const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                                headers: { Authorization: `Bearer ${accessToken}` }
                            });
                            const blob = await fileRes.blob();
                            
                            // Create a File object from blob
                            const logoFile = new File([blob], file.name, { type: file.mimeType });
                            await handleFileSelect(logoFile);
                        } catch (err) {
                            console.error("Error fetching Drive file:", err);
                            setUploadError("Failed to fetch image from Google Drive");
                        } finally {
                            setIsUploading(false);
                        }
                    }
                })
                .build();
            picker.setVisible(true);
        } catch (err: any) {
            console.error("Picker error:", err);
            if (err.message === "Google not connected") {
                setUploadError("Google Drive is not connected. Please click 'Connect Google Drive' in the header first.");
            } else {
                setUploadError("Error opening picker. Check your console for details or ensure popups are allowed.");
            }
        } finally {
            setIsPickerLoading(false);
        }
    };
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [simSelectionError, setSimSelectionError] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Settings for multipliers
    const [settings, setSettings] = useState({
        transportMultiplier: 1.6,
        staffMultiplier: 280,
        simulatorPrice: 750,
        simulatorPriceVIP: 550,
        purchasePriceTimeAttack: 23000,
        purchasePriceSlady: 26000,
        purchasePriceTopGun: 30000,
        downPaymentPercentage: 30,
        brandingPricePlatform: 290,
        brandingPriceSimulator: 360,
        brandingPricePack: 600,
        flightCasePrice: 840,
        pianolaPrice: 480,
        audioSystemPrice: 490,
    });

    // Load saved settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch("/api/admin?action=settings");
                if (response.ok) {
                    const data = await response.json();
                    if (data.settings) {
                        const loadedSettings = {
                            transportMultiplier: data.settings.transportMultiplier ?? 1.6,
                            staffMultiplier: data.settings.staffMultiplier ?? 280,
                            simulatorPrice: data.settings.simulatorPrice ?? 750,
                            simulatorPriceVIP: data.settings.simulatorPriceVIP ?? 550,
                            purchasePriceTimeAttack: data.settings.purchasePriceTimeAttack ?? 23000,
                            purchasePriceSlady: data.settings.purchasePriceSlady ?? 26000,
                            purchasePriceTopGun: data.settings.purchasePriceTopGun ?? 30000,
                            downPaymentPercentage: data.settings.downPaymentPercentage ?? 30,
                            brandingPricePlatform: data.settings.brandingPricePlatform ?? 290,
                            brandingPriceSimulator: data.settings.brandingPriceSimulator ?? 360,
                            brandingPricePack: data.settings.brandingPricePack ?? 600,
                            flightCasePrice: data.settings.flightCasePrice ?? 840,
                            pianolaPrice: data.settings.pianolaPrice ?? 480,
                            audioSystemPrice: data.settings.audioSystemPrice ?? 490,
                        };
                        setSettings(loadedSettings);
                        // Update form defaults from loaded settings
                        if (!form.getValues("isVIP")) {
                            form.setValue("rentalBasePrice", loadedSettings.simulatorPrice);
                        }
                        form.setValue("purchasePriceTimeAttack", loadedSettings.purchasePriceTimeAttack);
                        form.setValue("purchasePriceSlady", loadedSettings.purchasePriceSlady);
                        form.setValue("purchasePriceTopGun", loadedSettings.purchasePriceTopGun);
                        form.setValue("downPaymentPercentage", loadedSettings.downPaymentPercentage);
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
            proposalType: initialData?.proposalType || "rental",
            clientName: initialData?.clientName || "",
            personalMessage: initialData?.personalMessage || "",
            isVIP: initialData?.rentalDetails?.isVIP || false,
            rentalBasePrice: initialData?.rentalDetails?.basePrice || 750,
            numberOfSimulators: initialData?.rentalDetails?.numberOfSimulators || 1,
            purchasePriceTimeAttack: initialData?.purchaseDetails?.packages?.timeAttack || 23000,
            purchasePriceSlady: initialData?.purchaseDetails?.packages?.slady || 26000,
            purchasePriceTopGun: initialData?.purchaseDetails?.packages?.topGun || 30000,
            requireDownPayment: initialData?.rentalDetails?.requireDownPayment || false,
            downPaymentPercentage: initialData?.rentalDetails?.downPaymentPercentage || 30,
            notes: initialData?.notes || "",
            eventReference: initialData?.rentalDetails?.eventReference || "",
            discountAmount: initialData?.rentalDetails?.discountAmount,
            discountConcept: initialData?.rentalDetails?.discountConcept || "",
            transportKm: initialData?.rentalDetails?.transport?.kilometers,
            numberOfStaff: initialData?.rentalDetails?.staff?.numberOfStaff,
            numberOfDays: initialData?.rentalDetails?.numberOfDays || initialData?.rentalDetails?.staff?.numberOfDays || 1,
            staffTravel: initialData?.rentalDetails?.staff?.travelExpenses,
            staffHotel: initialData?.rentalDetails?.staff?.hotelExpenses,
            hotelNights: initialData?.rentalDetails?.staff?.numberOfDays,
            paymentTerms: initialData?.purchaseDetails?.paymentTerms || "",
            selectedPurchaseSimulators: {
                timeAttack: initialData?.purchaseDetails?.packages?.timeAttack !== undefined,
                slady: initialData?.purchaseDetails?.packages?.slady !== undefined,
                topGun: initialData?.purchaseDetails?.packages?.topGun !== undefined,
            }
        },
    });

    const proposalType = form.watch("proposalType");
    const rentalValues = form.watch(); // Watch all for rental calculations

    // Calculate rental totals for submission
    const rentalTotals = useRentalCalculator({
        basePrice: rentalValues.isVIP ? settings.simulatorPriceVIP : settings.simulatorPrice,
        numberOfSimulators: rentalValues.numberOfSimulators || 0,
        transportKm: rentalValues.transportKm || 0,
        transportMultiplier: settings.transportMultiplier,
        numberOfStaff: rentalValues.numberOfStaff || 0,
        numberOfDays: rentalValues.numberOfDays || 0,
        staffMultiplier: settings.staffMultiplier,
        staffTravel: rentalValues.staffTravel || 0,
        staffHotel: (rentalValues.staffHotel || 0) * (rentalValues.hotelNights || rentalValues.numberOfDays || 1),
        discountAmount: rentalValues.discountAmount || 0,
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

        setSimSelectionError(false);

        setIsSubmitting(true);

        try {
            interface BasePayload {
                proposalType: "rental" | "purchase";
                clientName: string;
                clientLogoUrl: string;
                personalMessage?: string;
                notes?: string;
                brandingPrices?: { none: number; platform: number; simulator: number; full: number; };
                flightCasePrice?: number;
                pianolaPrice?: number;
                audioSystemPrice?: number;
            }

            interface RentalPayload extends BasePayload {
                proposalType: "rental";
                rentalDetails: {
                    basePrice: number;
                    isVIP: boolean;
                    numberOfSimulators: number;
                    requireDownPayment?: boolean;
                    downPaymentPercentage?: number;
                    transport?: {
                        kilometers: number;
                        pricePerKm: number;
                        totalCost: number;
                    };
                    staff?: {
                        numberOfStaff?: number;
                        numberOfDays?: number;
                        pricePerStaffDay: number;
                        travelExpenses?: number;
                        hotelExpenses?: number;
                        totalCost: number;
                    };
                    numberOfDays?: number;
                    subtotal: number;
                    total: number;
                    eventReference?: string;
                    discountAmount?: number;
                    discountConcept?: string;
                };
            }

            interface PurchasePayload extends BasePayload {
                proposalType: "purchase";
                purchaseDetails: {
                    packages: {
                        timeAttack?: number;
                        slady?: number;
                        topGun?: number;
                    };
                    paymentTerms?: string;
                };
            }

            type ProposalPayload = RentalPayload | PurchasePayload;

            let payload: ProposalPayload;

            if (values.proposalType === "rental") {
                payload = {
                    proposalType: "rental",
                    clientName: values.clientName,
                    clientLogoUrl: logoUrl,
                    personalMessage: values.personalMessage || undefined,
                    notes: values.notes || undefined,
                    brandingPrices: {
                        none: 0,
                        platform: settings.brandingPricePlatform,
                        simulator: settings.brandingPriceSimulator,
                        full: settings.brandingPricePack,
                    },
                    flightCasePrice: settings.flightCasePrice,
                    pianolaPrice: settings.pianolaPrice,
                    audioSystemPrice: settings.audioSystemPrice,
                    rentalDetails: {
                        basePrice: Number(values.isVIP ? settings.simulatorPriceVIP : settings.simulatorPrice),
                        isVIP: values.isVIP,
                        numberOfSimulators: Number(values.numberOfSimulators) || 1,
                        requireDownPayment: values.requireDownPayment,
                        downPaymentPercentage: values.requireDownPayment ? Number(values.downPaymentPercentage) : undefined,
                        transport: values.transportKm ? {
                            kilometers: Number(values.transportKm),
                            pricePerKm: settings.transportMultiplier,
                            totalCost: rentalTotals.transportCost
                        } : undefined,
                        staff: (values.numberOfStaff || values.numberOfDays) ? {
                            numberOfStaff: Number(values.numberOfStaff) || 0,
                            numberOfDays: Math.max(0, Number(values.numberOfDays) || 0),
                            pricePerStaffDay: settings.staffMultiplier,
                            travelExpenses: Number(values.staffTravel) || 0,
                            hotelExpenses: (Number(values.staffHotel) || 0) * (Number(values.hotelNights) || Number(values.numberOfDays) || 1),
                            totalCost: rentalTotals.staffTotalCost
                        } : undefined,
                        numberOfDays: Math.max(1, Number(values.numberOfDays) || 1),
                        subtotal: rentalTotals.totalBeforeDiscount,
                        total: rentalTotals.grandTotal,
                        eventReference: values.eventReference?.trim() || undefined,
                        discountAmount: values.discountAmount ? Number(values.discountAmount) : undefined,
                        discountConcept: values.discountConcept?.trim() || undefined
                    }
                };
            } else {
                const selectedSimulators = values.selectedPurchaseSimulators || { timeAttack: false, slady: false, topGun: false };

                // Validation: Ensure at least one simulator is selected
                if (!selectedSimulators.timeAttack && !selectedSimulators.slady && !selectedSimulators.topGun) {
                    setSimSelectionError(true);
                    setIsSubmitting(false);
                    return;
                }

                payload = {
                    proposalType: "purchase",
                    clientName: values.clientName,
                    clientLogoUrl: logoUrl,
                    personalMessage: values.personalMessage || undefined,
                    notes: values.notes || undefined,
                    brandingPrices: {
                        none: 0,
                        platform: settings.brandingPricePlatform,
                        simulator: settings.brandingPriceSimulator,
                        full: settings.brandingPricePack,
                    },
                    flightCasePrice: settings.flightCasePrice,
                    pianolaPrice: settings.pianolaPrice,
                    audioSystemPrice: settings.audioSystemPrice,
                    purchaseDetails: {
                        packages: {
                            ...(selectedSimulators.timeAttack ? { timeAttack: values.purchasePriceTimeAttack } : {}),
                            ...(selectedSimulators.slady ? { slady: values.purchasePriceSlady } : {}),
                            ...(selectedSimulators.topGun ? { topGun: values.purchasePriceTopGun } : {}),
                        },
                        paymentTerms: values.paymentTerms || undefined
                    }
                };

                // Auto-persist modified prices as new defaults (only if selected)
                if (
                    (selectedSimulators.timeAttack && values.purchasePriceTimeAttack !== settings.purchasePriceTimeAttack) ||
                    (selectedSimulators.slady && values.purchasePriceSlady !== settings.purchasePriceSlady) ||
                    (selectedSimulators.topGun && values.purchasePriceTopGun !== settings.purchasePriceTopGun)
                ) {
                    const updatedSettings = {
                        ...settings,
                        ...(selectedSimulators.timeAttack ? { purchasePriceTimeAttack: values.purchasePriceTimeAttack } : {}),
                        ...(selectedSimulators.slady ? { purchasePriceSlady: values.purchasePriceSlady } : {}),
                        ...(selectedSimulators.topGun ? { purchasePriceTopGun: values.purchasePriceTopGun } : {}),
                    };
                    fetch("/api/admin?action=settings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedSettings),
                    }).catch(err => console.error("Failed to persist purchase prices:", err));
                    setSettings(updatedSettings);
                }
            }

            const url = initialData ? `/api/proposals/${initialData.id}` : "/api/proposals";
            const method = initialData ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                let errorMessage = errorData.error || (initialData ? "Failed to update proposal" : "Failed to create proposal");
                if (errorData.details) {
                    errorMessage += `: ${errorData.details}`;
                }
                if (errorData.env_check) {
                    const missing = [];
                    if (!errorData.env_check.has_url) missing.push("KV_REST_API_URL");
                    if (!errorData.env_check.has_token) missing.push("KV_REST_API_TOKEN");
                    if (missing.length > 0) {
                        errorMessage += ` (Missing env vars: ${missing.join(", ")})`;
                    }
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            onSuccess(data.proposal.id, values.clientName);
        } catch (err: any) {
            console.error("Error creating proposal:", err);
            setUploadError(err.message || t("admin.proposals.createError"));
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
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        onKeyDown={(e) => {
                            // Prevent form submission on Enter, unless it's a textarea
                            if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                                e.preventDefault();
                            }
                        }}
                    >

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
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-800 flex justify-center">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openGooglePicker();
                                            }}
                                            disabled={isPickerLoading}
                                            className="bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                                        >
                                            {isPickerLoading ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Cloud className="w-4 h-4 mr-2" />
                                            )}
                                            {t("admin.proposals.google.pick", "Pick from Drive")}
                                        </Button>
                                    </div>
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
                                simulatorPrice={settings.simulatorPrice}
                                simulatorPriceVIP={settings.simulatorPriceVIP}
                                defaultDownPaymentPct={settings.downPaymentPercentage}
                            />
                        ) : (
                            <PurchaseFormFields
                                defaultPriceTimeAttack={settings.purchasePriceTimeAttack}
                                defaultPriceSlady={settings.purchasePriceSlady}
                                defaultPriceTopGun={settings.purchasePriceTopGun}
                                hasError={simSelectionError}
                            />
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
                                        basePrice: Number(rentalValues.isVIP ? settings.simulatorPriceVIP : settings.simulatorPrice),
                                        isVIP: rentalValues.isVIP,
                                        numberOfSimulators: Number(rentalValues.numberOfSimulators) || 1,
                                        numberOfDays: Math.max(1, Number(rentalValues.numberOfDays) || 1),
                                        transport: rentalValues.transportKm ? {
                                            kilometers: Number(rentalValues.transportKm),
                                            pricePerKm: settings.transportMultiplier,
                                            totalCost: rentalTotals.transportCost
                                        } : undefined,
                                        staff: (rentalValues.numberOfStaff || rentalValues.numberOfDays) ? {
                                            numberOfStaff: Number(rentalValues.numberOfStaff) || 0,
                                            numberOfDays: Math.max(0, Number(rentalValues.numberOfDays) || 0),
                                            pricePerStaffDay: settings.staffMultiplier,
                                            travelExpenses: Number(rentalValues.staffTravel) || 0,
                                            hotelExpenses: (Number(rentalValues.staffHotel) || 0) * (Number(rentalValues.hotelNights) || Number(rentalValues.numberOfDays) || 1),
                                            totalCost: rentalTotals.staffTotalCost
                                        } : undefined,
                                        subtotal: rentalTotals.totalBeforeDiscount,
                                        total: rentalTotals.grandTotal,
                                        eventReference: form.watch("eventReference"),
                                        discountAmount: form.watch("discountAmount") ? Number(form.watch("discountAmount")) : undefined,
                                        discountConcept: form.watch("discountConcept")
                                    } : undefined,
                                    purchaseDetails: form.watch("proposalType") === "purchase" ? {
                                        packages: {
                                            ...(form.watch("selectedPurchaseSimulators")?.timeAttack ? { timeAttack: form.watch("purchasePriceTimeAttack") || 23000 } : {}),
                                            ...(form.watch("selectedPurchaseSimulators")?.slady ? { slady: form.watch("purchasePriceSlady") || 26000 } : {}),
                                            ...(form.watch("selectedPurchaseSimulators")?.topGun ? { topGun: form.watch("purchasePriceTopGun") || 30000 } : {}),
                                        },
                                        paymentTerms: form.watch("paymentTerms")
                                    } : undefined
                                }}
                                disabled={!form.watch("clientName")}
                            />

                            {initialData && onCancel && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    className="flex-1 bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                    {t("common.discardChanges", "Descartar cambios")}
                                </Button>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting || isUploading}
                                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-5 shadow-lg shadow-red-500/20"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {initialData ? t("admin.proposals.updating", "Guardando cambios...") : t("admin.proposals.creating")}
                                    </>
                                ) : (
                                    initialData ? t("admin.proposals.saveChanges", "Guardar cambios") : t("admin.proposals.submit")
                                )}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
