import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { upload } from "@vercel/blob/client";
import {
    Upload, Loader2, Image as ImageIcon, X, FileText,
    Building2, Euro
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import PhraseGenerator from "./PhraseGenerator";

interface AdminProposalFormProps {
    onSuccess: (proposalId: string, clientName: string) => void;
}

const formSchema = z.object({
    clientName: z.string().min(1, "Client name is required").max(100),
    personalMessage: z.string().max(500).optional(),
    pricingBasic: z.string().min(1, "Basic package pricing is required"),
    pricingProfessional: z.string().min(1, "Professional package pricing is required"),
    pricingComplete: z.string().min(1, "Complete package pricing is required"),
    notes: z.string().max(2000).optional(),
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

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientName: "",
            personalMessage: "",
            pricingBasic: "",
            pricingProfessional: "",
            pricingComplete: "",
            notes: "",
        },
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
            const response = await fetch("/api/proposals/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clientName: values.clientName,
                    clientLogoUrl: logoUrl,
                    personalMessage: values.personalMessage || undefined,
                    pricing: {
                        basic: values.pricingBasic,
                        professional: values.pricingProfessional,
                        complete: values.pricingComplete,
                    },
                    notes: values.notes || undefined,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to create proposal");
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
            <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-500" />
                    {t("admin.proposals.formTitle")}
                </CardTitle>
                <CardDescription className="text-gray-400">
                    {t("admin.proposals.formDescription")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                            placeholder={t("admin.proposals.personalMessagePlaceholder")}
                                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[80px]"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />

                                    {/* AI Phrase Generator */}
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

                        {/* Pricing Section */}
                        <div className="space-y-4">
                            <Label className="text-gray-300 flex items-center gap-2">
                                <Euro className="w-4 h-4" />
                                {t("admin.proposals.pricing")} *
                            </Label>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <FormField
                                    control={form.control}
                                    name="pricingBasic"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-400 text-sm">
                                                {t("admin.proposals.packBasic")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="500€"
                                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pricingProfessional"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-400 text-sm">
                                                {t("admin.proposals.packProfessional")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="900€"
                                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pricingComplete"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-400 text-sm">
                                                {t("admin.proposals.packComplete")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="1200€"
                                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

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
                                            placeholder={t("admin.proposals.notesPlaceholder")}
                                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-5 shadow-lg shadow-red-500/20"
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
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
