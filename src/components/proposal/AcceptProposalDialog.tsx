import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Check, CreditCard, ExternalLink } from "lucide-react";
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
import { Proposal } from "@/types/proposal";

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
    proposal: Proposal;
    selectedDates?: {
        start: Date;
        end: Date;
    };
}

// Build line items from proposal for Square checkout
function buildLineItems(proposal: Proposal): { name: string; quantity: number; unitPrice: number }[] {
    const items: { name: string; quantity: number; unitPrice: number }[] = [];

    if (proposal.proposalType === "rental" && proposal.rentalDetails) {
        const rd = proposal.rentalDetails;

        // Simulators — basePrice is per-simulator-per-day
        const days = rd.numberOfDays || 1;
        items.push({
            name: `MotoGP Simulator${rd.numberOfSimulators && rd.numberOfSimulators > 1 ? 's' : ''} (${rd.basePrice}€/unit × ${days} day${days > 1 ? 's' : ''})`,
            quantity: rd.numberOfSimulators || 1,
            unitPrice: rd.basePrice * days,
        });

        // Transport
        if (rd.transport && rd.transport.totalCost > 0) {
            items.push({
                name: `Transport (${rd.transport.kilometers}km)`,
                quantity: 1,
                unitPrice: rd.transport.totalCost,
            });
        }

        // Staff
        if (rd.staff) {
            const staffCost = (rd.staff.numberOfStaff || 0) * (rd.staff.numberOfDays || 1) * rd.staff.pricePerStaffDay;
            if (staffCost > 0) {
                items.push({
                    name: `Staff (${rd.staff.numberOfStaff} × ${rd.staff.numberOfDays || 1} days)`,
                    quantity: 1,
                    unitPrice: staffCost,
                });
            }
            if ((rd.staff.travelExpenses || 0) > 0) {
                items.push({
                    name: "Staff Travel Expenses",
                    quantity: 1,
                    unitPrice: rd.staff.travelExpenses!,
                });
            }
            if ((rd.staff.hotelExpenses || 0) > 0) {
                items.push({
                    name: "Staff Hotel Expenses",
                    quantity: 1,
                    unitPrice: rd.staff.hotelExpenses!,
                });
            }
        }
    } else if (proposal.proposalType === "purchase" && proposal.purchaseDetails) {
        const pd = proposal.purchaseDetails;

        // For purchase, include all 3 simulator prices as line items
        items.push(
            { name: "Simulator Time Attack", quantity: 1, unitPrice: pd.packages.timeAttack },
            { name: "Simulator Slady", quantity: 1, unitPrice: pd.packages.slady },
            { name: "Simulator Top Gun", quantity: 1, unitPrice: pd.packages.topGun },
        );
    }

    return items;
}

function getProposalTotal(proposal: Proposal): number {
    if (proposal.proposalType === "rental" && proposal.rentalDetails) {
        return proposal.rentalDetails.total;
    }
    if (proposal.proposalType === "purchase" && proposal.purchaseDetails) {
        const p = proposal.purchaseDetails.packages;
        return p.timeAttack + p.slady + p.topGun;
    }
    return 0;
}

export default function AcceptProposalDialog({
    isOpen,
    onClose,
    clientName,
    proposalId,
    proposalType,
    proposal,
    selectedDates
}: AcceptProposalDialogProps) {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [step, setStep] = useState<"form" | "redirecting">("form");

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
        setPaymentError(null);

        try {
            // Step 1: Save contact info via existing accept endpoint
            const acceptPayload = {
                proposalId,
                clientName,
                ...values,
                proposalType,
                selectedDates: selectedDates ? {
                    start: format(selectedDates.start, "yyyy-MM-dd"),
                    end: format(selectedDates.end, "yyyy-MM-dd"),
                } : undefined,
            };

            const acceptResponse = await fetch("/api/proposals/accept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(acceptPayload),
            });

            if (!acceptResponse.ok) throw new Error("Failed to submit contact info");

            // Step 2: Create Square payment link
            setStep("redirecting");

            const isDownPayment = !!(proposal.rentalDetails?.requireDownPayment);
            const downPaymentPercentage = proposal.rentalDetails?.downPaymentPercentage ?? 30;

            const lineItems = buildLineItems(proposal);
            const total = getProposalTotal(proposal);

            const lang = typeof window !== 'undefined' ? (localStorage.getItem('i18nextLng') || 'es') : 'es';

            const paymentResponse = await fetch("/api/square/create-payment-link", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proposalId,
                    clientName,
                    proposalType,
                    total,
                    lineItems,
                    isDownPayment,
                    downPaymentPercentage: isDownPayment ? downPaymentPercentage : undefined,
                    lang,
                    contact: {
                        name: values.fullName,
                        email: values.email,
                        phone: values.phone,
                    },
                    redirectBase: window.location.origin,
                }),
            });

            if (!paymentResponse.ok) {
                const err = await paymentResponse.json();
                throw new Error(err.details || err.error || "Failed to create payment link");
            }

            const { checkoutUrl } = await paymentResponse.json();

            if (checkoutUrl) {
                // Redirect to Square checkout
                window.location.href = checkoutUrl;
            } else {
                throw new Error("No checkout URL received");
            }

        } catch (error: any) {
            console.error("Submission error:", error);
            setPaymentError(error.message || "An error occurred. Please try again.");
            setStep("form");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSuccess) {
            onClose();
            setTimeout(() => {
                setIsSuccess(false);
                setStep("form");
                setPaymentError(null);
                form.reset();
            }, 500);
        } else {
            onClose();
            setStep("form");
            setPaymentError(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {step === "redirecting" ? (
                            <>
                                <CreditCard className="w-5 h-5 text-red-500" />
                                {t("proposal.accept.redirecting", "Redirecting to payment...")}
                            </>
                        ) : isSuccess ? (
                            <Check className="w-5 h-5 text-green-500" />
                        ) : (
                            t("proposal.accept.title", "Finalize Your Booking")
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {step === "redirecting"
                            ? t("proposal.accept.redirectingDesc", "You will be redirected to our secure payment page to complete your booking.")
                            : isSuccess
                                ? t("proposal.accept.successDescription", "Thank you! We have received your request and will contact you shortly to confirm details.")
                                : t("proposal.accept.description", "Please provide your contact details to proceed with the reservation.")
                        }
                    </DialogDescription>
                </DialogHeader>

                {step === "redirecting" ? (
                    <div className="py-10 space-y-6 text-center">
                        <div className="relative mx-auto w-16 h-16">
                            <Loader2 className="w-16 h-16 animate-spin text-red-500" />
                            <CreditCard className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-white font-medium">
                                {t("proposal.accept.preparingPayment", "Preparing secure payment...")}
                            </p>
                            <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                {t("proposal.accept.squareRedirect", "Powered by Square")}
                            </p>
                        </div>
                    </div>
                ) : isSuccess ? (
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

                            {paymentError && (
                                <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3 text-center">
                                    <p className="text-red-400 text-sm">{paymentError}</p>
                                </div>
                            )}

                            {/* Total summary */}
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm uppercase tracking-wider">
                                        {t("proposal.accept.total", "Total")}
                                    </span>
                                    <span className="text-white text-xl font-bold">
                                        {getProposalTotal(proposal).toLocaleString("es-ES")}€
                                        <span className="text-gray-500 text-xs ml-1">+ IVA</span>
                                    </span>
                                </div>
                            </div>

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
                                    <>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        {t("proposal.accept.payNow", "Proceed to Payment")}
                                    </>
                                )}
                            </Button>

                            <p className="text-center text-xs text-gray-600 flex items-center justify-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                {t("proposal.accept.securePayment", "Secure payment powered by Square")}
                            </p>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
