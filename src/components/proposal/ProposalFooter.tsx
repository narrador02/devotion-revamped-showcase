import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import AcceptProposalDialog from "./AcceptProposalDialog";
import { Proposal } from "@/types/proposal";

interface ProposalFooterProps {
    proposal: Proposal;
}

export default function ProposalFooter({ proposal }: ProposalFooterProps) {
    const { t, i18n } = useTranslation();
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isRental = proposal.proposalType === 'rental';
    const isReadyToAccept = !isRental || (dateRange?.from && dateRange?.to);

    const handleAcceptClick = () => {
        if (isReadyToAccept) {
            setIsDialogOpen(true);
        } else {
            // Scroll to calendar if not selected
            const calendarElement = document.getElementById('rental-calendar');
            calendarElement?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="space-y-12 pb-20">
            <div className="text-center space-y-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white font-rajdhani">
                    {t("proposal.readyToStart", "Ready to start the race?")}
                </h3>

                {isRental && (
                    <div id="rental-calendar" className="max-w-md mx-auto bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                        <p className="text-gray-400 mb-4 text-sm uppercase tracking-wider font-semibold">
                            {t("proposal.selectDates", "Select Your Rental Dates")}
                        </p>
                        <div className="flex justify-center">
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={1}
                                disabled={(date) => date < new Date()}
                                locale={i18n.language === 'es' ? es : enUS}
                                className="bg-transparent text-white"
                                classNames={{
                                    day_selected: "bg-red-600 text-white hover:bg-red-600",
                                    day_today: "bg-gray-800 text-white",
                                }}
                            />
                        </div>
                        {dateRange?.from && dateRange?.to && (
                            <p className="mt-4 text-red-500 font-mono text-sm">
                                {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        onClick={handleAcceptClick}
                        disabled={isRental && (!dateRange?.from || !dateRange?.to)}
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
                        {t("proposal.acceptOffer", "Accept Proposal")}
                    </Button>
                </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center space-y-4">
                <img
                    src="/logo.png"
                    alt="DevotionSim"
                    className="h-10 mx-auto brightness-0 invert opacity-80 hover:opacity-100 transition-all duration-300"
                />
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} DevotionSim. All rights reserved.
                </p>
            </div>

            <AcceptProposalDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                clientName={proposal.clientName}
                proposalId={proposal.id}
                proposalType={proposal.proposalType}
                selectedDates={
                    dateRange?.from && dateRange?.to
                        ? { start: dateRange.from, end: dateRange.to }
                        : undefined
                }
            />
        </footer>
    );
}
