import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { es, enUS } from "date-fns/locale";
import AcceptProposalDialog from "./AcceptProposalDialog";
import { Proposal } from "@/types/proposal";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface ProposalFooterProps {
    proposal: Proposal;
    dateRange?: DateRange;
    setDateRange?: (range: DateRange | undefined) => void;
    showBranding?: boolean;
    brandingPrice?: number;
    brandingLabel?: string;
    showFlightCase?: boolean;
    flightCasePrice?: number;
    showPianola?: boolean;
    pianolaPrice?: number;
    showAudioSystem?: boolean;
    audioSystemPrice?: number;
    selectedSimulator?: string;
}

export default function ProposalFooter({ proposal, dateRange, setDateRange, showBranding, brandingPrice, brandingLabel, showFlightCase, flightCasePrice, showPianola, pianolaPrice, showAudioSystem, audioSystemPrice, selectedSimulator }: ProposalFooterProps) {
    const { t, i18n } = useTranslation();
    // Local state for dialog only, dateRange is now lifted
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showUpdateMessage, setShowUpdateMessage] = useState(false);
    const [busyDates] = useState<{ start: string; end: string; }[]>([]);
    const [isLoadingAvailability] = useState(false);
    const [overlapError] = useState(false);

    const isRental = proposal.proposalType === 'rental';
    const requireDownPayment = isRental && proposal.rentalDetails?.requireDownPayment;
    const downPaymentPercentage = proposal.rentalDetails?.downPaymentPercentage || 30;
    const isReadyToAccept = !isRental || (dateRange?.from && dateRange?.to);

    // Fetch calendar availability - TEMPORARILY DISABLED
    /*
    useEffect(() => {
        if (!isRental) return;

        async function fetchAvailability() {
            setIsLoadingAvailability(true);
            try {
                const response = await fetch('/api/calendar');
                if (response.ok) {
                    const data = await response.json();
                    setBusyDates(data.busy || []);
                }
            } catch (error) {
                console.error("Failed to fetch calendar availability:", error);
            } finally {
                setIsLoadingAvailability(false);
            }
        }

        fetchAvailability();
    }, [isRental]);
    */

    // Check for overlap whenever dateRange changes - TEMPORARILY DISABLED
    /*
    useEffect(() => {
        if (!dateRange?.from || !dateRange?.to) {
            setOverlapError(false);
            return;
        }

        const hasOverlap = busyDates.some(busy => {
            const busyStart = new Date(busy.start);
            const busyEnd = new Date(busy.end);
            return (
                (dateRange.from! <= busyEnd && dateRange.to! >= busyStart)
            );
        });

        setOverlapError(hasOverlap);
    }, [dateRange, busyDates]);
    */

    // Show update message when dates change AND duration is different from original
    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            const selectedDays = differenceInDays(dateRange.to, dateRange.from) + 1;
            const originalDays = proposal.rentalDetails?.numberOfDays || 1;

            // Only show if days are different
            if (selectedDays !== originalDays) {
                setShowUpdateMessage(true);
                const timer = setTimeout(() => setShowUpdateMessage(false), 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [dateRange, proposal.rentalDetails?.numberOfDays]);

    const handleAcceptClick = () => {
        if (isReadyToAccept) {
            setIsDialogOpen(true);
        } else {
            // Scroll to calendar if not selected
            const calendarElement = document.getElementById('rental-calendar');
            calendarElement?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDateSelect = (range: DateRange | undefined) => {
        if (setDateRange) {
            setDateRange(range);
        }
    };

    return (
        <footer className="space-y-12 pb-20">
            <div className="text-center space-y-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white font-rajdhani">
                    {t("proposal.readyToStart", "Ready to start the race?")}
                </h3>

                {isRental && (
                    <div id="rental-calendar" className="max-w-md mx-auto relative">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm z-10 relative">
                            <p className="text-gray-400 mb-4 text-sm uppercase tracking-wider font-semibold">
                                {t("proposal.selectDates", "Select Your Rental Dates")}
                            </p>
                            <div className="flex justify-center flex-col items-center">
                                <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={handleDateSelect}
                                    numberOfMonths={1}
                                    disabled={(date) => {
                                        // Disable past dates
                                        if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;

                                        // Disable busy dates from calendar
                                        return busyDates.some(busy => {
                                            const busyStart = new Date(busy.start);
                                            const busyEnd = new Date(busy.end);
                                            // Reset time parts for comparison
                                            const checkDate = new Date(date).setHours(0, 0, 0, 0);
                                            const start = new Date(busyStart).setHours(0, 0, 0, 0);
                                            const end = new Date(busyEnd).setHours(23, 59, 59, 999);
                                            return checkDate >= start && checkDate <= end;
                                        });
                                    }}
                                    locale={i18n.language === 'es' ? es : enUS}
                                    className="bg-transparent text-white"
                                    classNames={{
                                        day_selected: "bg-red-600 text-white hover:bg-red-600",
                                        day_today: "bg-gray-800 text-white",
                                        day_disabled: "text-gray-600 opacity-30 line-through cursor-not-allowed",
                                    }}
                                />
                                {isLoadingAvailability && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                        Checking availability...
                                    </div>
                                )}
                            </div>
                            {overlapError && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                                    {t("proposal.dateUnavailable", "Fecha no disponible actualmente, consúltanos para posibles opciones")}
                                </div>
                            )}
                            {dateRange?.from && dateRange?.to && (
                                <p className="mt-4 text-red-500 font-mono text-sm capitalize">
                                    {format(dateRange.from, "MMM d", { locale: i18n.language === 'es' ? es : enUS })} - {format(dateRange.to, "MMM d, yyyy", { locale: i18n.language === 'es' ? es : enUS })}
                                    <span className="text-gray-500 ml-2 normal-case">
                                        ({differenceInDays(dateRange.to, dateRange.from) + 1} {t("proposal.days", "days")})
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Price Update Notification */}
                        <AnimatePresence>
                            {showUpdateMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute -bottom-24 left-0 right-0 mx-auto z-20 pointer-events-none"
                                >
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 border border-red-500/30 text-white px-4 py-3 rounded-lg shadow-xl shadow-red-900/10 backdrop-blur-md">
                                        <RefreshCw className="w-4 h-4 text-red-500 animate-spin" />
                                        <span className="text-sm font-medium">
                                            {t("proposal.priceUpdated", "Price updated based on selected duration")}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {requireDownPayment && (
                    <div className="text-gray-400 text-sm max-w-md mx-auto px-4 mt-6">
                        {t("proposal.reserveMessage", { percentage: downPaymentPercentage })}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button
                        onClick={handleAcceptClick}
                        disabled={(isRental && (!dateRange?.from || !dateRange?.to)) || overlapError}
                        size="lg"
                        className={`
                            w-full sm:w-auto font-bold px-12 py-8 text-xl uppercase tracking-wider transition-all duration-300
                            ${isRental && (!dateRange?.from || !dateRange?.to)
                                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-110 hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] animate-pulse hover:animate-none"
                            }
                        `}
                        style={isReadyToAccept ? { animationDuration: '3s' } : {}}
                    >
                        {requireDownPayment
                            ? t("proposal.reserveDates", { percentage: downPaymentPercentage })
                            : t("proposal.acceptOffer", "Accept Proposal")
                        }
                    </Button>
                </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center space-y-4">
                <img
                    src="/logo.png"
                    alt="DevotionSim"
                    className="h-10 mx-auto brightness-0 invert opacity-80 hover:opacity-100 transition-all duration-300"
                />
                <div className="space-y-1">
                    <p className="text-sm text-gray-400 font-medium">
                        {t("proposal.expiresOn", {
                            date: new Intl.DateTimeFormat(i18n.language, {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }).format(new Date(proposal.expiresAt))
                        })}
                    </p>
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} DevotionSim. All rights reserved.
                    </p>
                </div>
            </div>

            <AcceptProposalDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                clientName={proposal.clientName}
                proposalId={proposal.id}
                proposalType={proposal.proposalType}
                proposal={proposal}
                showBranding={showBranding}
                brandingPrice={brandingPrice}
                brandingLabel={brandingLabel}
                showFlightCase={showFlightCase}
                flightCasePrice={flightCasePrice}
                showPianola={showPianola}
                pianolaPrice={pianolaPrice}
                showAudioSystem={showAudioSystem}
                audioSystemPrice={audioSystemPrice}
                selectedSimulator={selectedSimulator}
                selectedDates={
                    dateRange?.from && dateRange?.to
                        ? { start: dateRange.from, end: dateRange.to }
                        : undefined
                }
            />
        </footer>
    );
}
