import { useMemo } from 'react';

export interface RentalCalculatorInputs {
    basePrice: number;
    numberOfSimulators?: number;
    transportKm?: number;
    transportMultiplier: number;
    numberOfStaff?: number;
    numberOfDays?: number;
    staffMultiplier: number;
    staffTravel?: number;
    staffHotel?: number;
    discountAmount?: number;
}

export interface RentalCalculatorResults {
    simulatorSubtotal: number;
    transportCost: number;
    staffDailyCost: number;
    staffTotalCost: number;
    totalBeforeDiscount: number;
    grandTotal: number;
    hasOptionalFields: boolean;
}

export function useRentalCalculator(inputs: RentalCalculatorInputs): RentalCalculatorResults {
    return useMemo(() => {
        // Simulator costs
        const simCount = inputs.numberOfSimulators || 1;
        const days = inputs.numberOfDays || 1;
        const simulatorSubtotal = inputs.basePrice * simCount * days;

        // Transport costs (minimum 250€)
        const TRANSPORT_MINIMUM = 250;
        const rawTransportCost = inputs.transportKm
            ? inputs.transportKm * inputs.transportMultiplier
            : 0;
        const transportCost = rawTransportCost > 0
            ? Math.max(rawTransportCost, TRANSPORT_MINIMUM)
            : 0;

        // Staff costs
        const staffCount = inputs.numberOfStaff || 0;
        const staffDays = inputs.numberOfDays || 0;
        const staffDailyCost = staffCount * staffDays * inputs.staffMultiplier;
        const staffTravel = inputs.staffTravel || 0;
        const staffHotel = inputs.staffHotel || 0;
        const staffTotalCost = staffDailyCost + staffTravel + staffHotel;

        // Grand total
        const discount = inputs.discountAmount || 0;
        const totalBeforeDiscount = simulatorSubtotal + transportCost + staffTotalCost;
        const grandTotal = Math.max(0, totalBeforeDiscount - discount);

        // Check if any optional fields were provided
        const hasOptionalFields = !!(
            inputs.transportKm ||
            inputs.numberOfStaff ||
            inputs.staffTravel ||
            inputs.staffHotel ||
            inputs.discountAmount
        );

        return {
            simulatorSubtotal,
            transportCost,
            staffDailyCost,
            staffTotalCost,
            totalBeforeDiscount,
            grandTotal,
            hasOptionalFields,
        };
    }, [inputs]);
}
