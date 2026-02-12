import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";

const formSchema = z.object({
    fullName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    comments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AcceptProposalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    clientName: string;
    proposalId: string;
    proposalType: "rental" | "purchase";
    selectedDates?: {
        start: Date;
        end: Date;
    };
}

export default function AcceptProposalDialog({
    isOpen,
    onClose,
    clientName,
    proposalId,
    proposalType,
    selectedDates
}: AcceptProposalDialogProps) {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: clientName,
            email: "",
            phone: "",
            comments: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            const payload = {
                proposalId,
                clientName,
                ...values,
                proposalType,
                selectedDates: selectedDates ? {
                    start: format(selectedDates.start, "yyyy-MM-dd"),
                    end: format(selectedDates.end, "yyyy-MM-dd"),
                } : undefined,
            };

            const response = await fetch("/api/proposals/accept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to submit");

            setIsSuccess(true);
        } catch (error) {
            console.error("Submission error:", error);
            // Optionally handle error state
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSuccess) {
            onClose();
            // Reset state after closing
            setTimeout(() => {
                setIsSuccess(false);
                form.reset();
            }, 500);
        } else {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {isSuccess ? (
                            <Check className="w-5 h-5 text-green-500" />
                        ) : (
                            t("proposal.accept.title", "Finalize Your Booking")
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {isSuccess
                            ? t("proposal.accept.successDescription", "Thank you! We have received your request and will contact you shortly to confirm details.")
                            : t("proposal.accept.description", "Please provide your contact details to proceed with the reservation.")
                        }
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-6 space-y-4">
                        <div className="bg-green-900/20 border border-green-900/50 rounded-lg p-4 text-center">
                            <p className="text-green-400 font-medium mb-2">
                                {t("proposal.accept.successTitle", "Request Sent Successfully!")}
                            </p>
                            <p className="text-sm text-gray-400">
                                {t("proposal.accept.emailSent", "A confirmation email has been sent to {{email}}.", { email: form.getValues().email })}
                            </p>
                        </div>
                        <Button
                            onClick={handleClose}
                            className="w-full bg-gray-800 hover:bg-gray-700"
                        >
                            {t("common.close", "Close")}
                        </Button>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">
                                            {t("proposal.accept.fullName", "Full Name")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="bg-gray-800 border-gray-700 focus:border-red-500/50"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-300">
                                                {t("proposal.accept.email", "Email")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    className="bg-gray-800 border-gray-700 focus:border-red-500/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-300">
                                                {t("proposal.accept.phone", "Phone")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="tel"
                                                    className="bg-gray-800 border-gray-700 focus:border-red-500/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {selectedDates && (
                                <div className="bg-gray-800/50 rounded p-3 text-sm text-gray-300 flex justify-between items-center border border-gray-700">
                                    <span>{t("proposal.accept.dates", "Selected Dates")}:</span>
                                    <span className="font-mono font-bold text-red-400">
                                        {format(selectedDates.start, "MMM d")} - {format(selectedDates.end, "MMM d, yyyy")}
                                    </span>
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="comments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">
                                            {t("proposal.accept.comments", "Additional Comments (Optional)")}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className="bg-gray-800 border-gray-700 focus:border-red-500/50 min-h-[80px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-6 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("common.sending", "Sending...")}
                                    </>
                                ) : (
                                    t("proposal.accept.confirm", "Confirm Request")
                                )}
                            </Button>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
