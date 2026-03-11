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
        // Base inputs with defaults
        const basePrice = Number(inputs.basePrice) || 0;
        const simCount = Math.max(0, Number(inputs.numberOfSimulators) || 0);
        const days = Math.max(1, Number(inputs.numberOfDays) || 1);
        
        // Simulator costs
        const simulatorSubtotal = basePrice * simCount * days;

        // Transport costs (minimum 250€)
        const TRANSPORT_MINIMUM = 250;
        const km = Number(inputs.transportKm) || 0;
        const rawTransportCost = km > 0 ? km * inputs.transportMultiplier : 0;
        const transportCost = rawTransportCost > 0
            ? Math.max(rawTransportCost, TRANSPORT_MINIMUM)
            : 0;

        // Staff costs
        const staffCount = Math.max(0, Number(inputs.numberOfStaff) || 0);
        const staffDays = Math.max(0, Number(inputs.numberOfDays) || 0);
        const staffDailyCost = staffCount * staffDays * inputs.staffMultiplier;
        const staffTravel = Number(inputs.staffTravel) || 0;
        const staffHotel = Number(inputs.staffHotel) || 0;
        const staffTotalCost = staffDailyCost + staffTravel + staffHotel;

        // Grand total
        const discount = Number(inputs.discountAmount) || 0;
        const totalBeforeDiscount = simulatorSubtotal + transportCost + staffTotalCost;
        const grandTotal = Math.max(0, totalBeforeDiscount - discount);

        // Check if any optional fields were provided
        const hasOptionalFields = !!(
            km > 0 ||
            staffCount > 0 ||
            staffTravel > 0 ||
            staffHotel > 0 ||
            discount > 0
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
