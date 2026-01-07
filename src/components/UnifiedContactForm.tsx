import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Formspree endpoint - replace with your new endpoint
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgvrveqe";

type RequestType = "general" | "rent" | "buy";

interface UnifiedContactFormProps {
    defaultRequestType?: RequestType;
    showCard?: boolean;
}

const UnifiedContactForm = ({
    defaultRequestType = "general",
    showCard = true
}: UnifiedContactFormProps) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requestType, setRequestType] = useState<RequestType>(defaultRequestType);

    // Dynamic form schema based on request type
    const formSchema = useMemo(() => {
        const baseSchema = {
            requestType: z.enum(["general", "rent", "buy"]),
            fullName: z.string().min(1, { message: t('unifiedForm.validation.required') }),
            email: z.string().email({ message: t('unifiedForm.validation.invalidEmail') }),
            phone: z.string().min(1, { message: t('unifiedForm.validation.required') }),
            message: z.string().min(1, { message: t('unifiedForm.validation.required') }),
        };

        if (requestType === "general") {
            return z.object({
                ...baseSchema,
                subject: z.string().min(1, { message: t('unifiedForm.validation.required') }),
            });
        } else if (requestType === "rent") {
            return z.object({
                ...baseSchema,
                startDate: z.date({ required_error: t('unifiedForm.validation.required') }),
                endDate: z.date({ required_error: t('unifiedForm.validation.required') }),
                country: z.string().min(1, { message: t('unifiedForm.validation.required') }),
                city: z.string().min(1, { message: t('unifiedForm.validation.required') }),
                model: z.string().optional(),
            }).refine((data) => data.endDate > data.startDate, {
                message: t('unifiedForm.validation.endDateAfterStart'),
                path: ["endDate"],
            });
        } else {
            // Buy
            return z.object({
                ...baseSchema,
                country: z.string().min(1, { message: t('unifiedForm.validation.required') }),
                city: z.string().min(1, { message: t('unifiedForm.validation.required') }),
                model: z.string().optional(),
            });
        }
    }, [requestType, t]);

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requestType: defaultRequestType,
            fullName: "",
            email: "",
            phone: "",
            message: "",
            ...(requestType === "general" ? { subject: "" } : {}),
            ...(requestType === "rent" || requestType === "buy" ? {
                country: "",
                city: "",
                model: "",
            } : {}),
        } as FormValues,
    });

    // Reset form when request type changes
    const handleRequestTypeChange = (value: RequestType) => {
        setRequestType(value);
        form.reset({
            requestType: value,
            fullName: form.getValues("fullName"),
            email: form.getValues("email"),
            phone: form.getValues("phone"),
            message: form.getValues("message"),
        } as FormValues);
    };

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            // Build submission data, only including present fields
            const submissionData: Record<string, unknown> = {
                request_type: values.requestType,
                full_name: values.fullName,
                email: values.email,
                phone: values.phone,
                message: values.message,
                _subject: `DevotionSim Contact: ${t(`unifiedForm.requestType.${values.requestType}`)}`,
            };

            if (requestType === "general" && "subject" in values) {
                submissionData.subject = values.subject;
            }

            if ((requestType === "rent" || requestType === "buy") && "country" in values) {
                submissionData.country = values.country;
                submissionData.city = values.city;
                if (values.model) {
                    submissionData.model = values.model;
                }
            }

            if (requestType === "rent" && "startDate" in values && "endDate" in values) {
                submissionData.start_date = format(values.startDate as Date, "yyyy-MM-dd");
                submissionData.end_date = format(values.endDate as Date, "yyyy-MM-dd");
            }

            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            toast({
                title: t('unifiedForm.success'),
                description: t('unifiedForm.successDesc'),
            });
            form.reset();
        } catch (error) {
            toast({
                title: t('unifiedForm.error'),
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldVariants = {
        hidden: { opacity: 0, height: 0, marginBottom: 0 },
        visible: { opacity: 1, height: "auto", marginBottom: 24 },
    };

    const formContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Request Type Selector */}
                <FormField
                    control={form.control}
                    name="requestType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('unifiedForm.requestType.label')} *</FormLabel>
                            <Select
                                onValueChange={(value: RequestType) => {
                                    field.onChange(value);
                                    handleRequestTypeChange(value);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder={t('unifiedForm.requestType.label')} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="general">{t('unifiedForm.requestType.general')}</SelectItem>
                                    <SelectItem value="rent">{t('unifiedForm.requestType.rent')}</SelectItem>
                                    <SelectItem value="buy">{t('unifiedForm.requestType.buy')}</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Common Fields: Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('unifiedForm.fields.fullName')} *</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder={t('unifiedForm.fields.fullNamePlaceholder')}
                                        className="h-11 focus:border-primary focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('unifiedForm.fields.email')} *</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder={t('unifiedForm.fields.emailPlaceholder')}
                                        className="h-11 focus:border-primary focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Phone Number */}
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('unifiedForm.fields.phone')} *</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="tel"
                                    placeholder={t('unifiedForm.fields.phonePlaceholder')}
                                    className="h-11 focus:border-primary focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Subject - Only for General */}
                <AnimatePresence mode="wait">
                    {requestType === "general" && (
                        <motion.div
                            key="subject"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={fieldVariants}
                            transition={{ duration: 0.3 }}
                        >
                            <FormField
                                control={form.control}
                                name={"subject" as keyof FormValues}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('unifiedForm.fields.subject')} *</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value as string || ""}
                                                placeholder={t('unifiedForm.fields.subjectPlaceholder')}
                                                className="h-11 focus:border-primary focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Date Range - Only for Rent */}
                <AnimatePresence mode="wait">
                    {requestType === "rent" && (
                        <motion.div
                            key="dates"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={fieldVariants}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name={"startDate" as keyof FormValues}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>{t('unifiedForm.fields.startDate')} *</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "h-11 w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value as Date, "PPP")
                                                            ) : (
                                                                <span>{t('unifiedForm.fields.startDate')}</span>
                                                            )}
                                                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={field.value as Date}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"endDate" as keyof FormValues}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>{t('unifiedForm.fields.endDate')} *</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "h-11 w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value as Date, "PPP")
                                                            ) : (
                                                                <span>{t('unifiedForm.fields.endDate')}</span>
                                                            )}
                                                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={field.value as Date}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Country & City - For Rent and Buy */}
                <AnimatePresence mode="wait">
                    {(requestType === "rent" || requestType === "buy") && (
                        <motion.div
                            key="location"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={fieldVariants}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name={"country" as keyof FormValues}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('unifiedForm.fields.country')} *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value as string || ""}
                                                    placeholder={t('unifiedForm.fields.countryPlaceholder')}
                                                    className="h-11 focus:border-primary focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"city" as keyof FormValues}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('unifiedForm.fields.city')} *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value as string || ""}
                                                    placeholder={t('unifiedForm.fields.cityPlaceholder')}
                                                    className="h-11 focus:border-primary focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Model Selector - Optional for Rent and Buy */}
                <AnimatePresence mode="wait">
                    {(requestType === "rent" || requestType === "buy") && (
                        <motion.div
                            key="model"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={fieldVariants}
                            transition={{ duration: 0.3 }}
                        >
                            <FormField
                                control={form.control}
                                name={"model" as keyof FormValues}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('unifiedForm.fields.model')}</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value as string}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder={t('unifiedForm.fields.modelPlaceholder')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="time-attack">{t('unifiedForm.models.timeAttack')}</SelectItem>
                                                <SelectItem value="slady">{t('unifiedForm.models.slady')}</SelectItem>
                                                <SelectItem value="top-gun">{t('unifiedForm.models.topGun')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Message */}
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('unifiedForm.fields.message')} *</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder={t('unifiedForm.fields.messagePlaceholder')}
                                    className="min-h-[120px] resize-none focus:border-primary focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full gap-2 py-6 bg-gradient-to-r from-primary to-red-600 hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all disabled:opacity-70"
                    >
                        <Send size={18} />
                        {isSubmitting ? t('unifiedForm.submitting') : t('unifiedForm.submit')}
                    </Button>
                </motion.div>
            </form>
        </Form>
    );

    if (showCard) {
        return (
            <div className="bg-card p-8 rounded-2xl border-2 border-primary/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                {formContent}
            </div>
        );
    }

    return formContent;
};

export default UnifiedContactForm;
