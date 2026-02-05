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
}

export interface RentalCalculatorResults {
    simulatorSubtotal: number;
    transportCost: number;
    staffDailyCost: number;
    staffTotalCost: number;
    grandTotal: number;
    hasOptionalFields: boolean;
}

export function useRentalCalculator(inputs: RentalCalculatorInputs): RentalCalculatorResults {
    return useMemo(() => {
        // Simulator costs
        const simCount = inputs.numberOfSimulators || 1;
        const simulatorSubtotal = inputs.basePrice * simCount;

        // Transport costs
        const transportCost = inputs.transportKm
            ? inputs.transportKm * inputs.transportMultiplier
            : 0;

        // Staff costs
        const staffCount = inputs.numberOfStaff || 0;
        const staffDays = inputs.numberOfDays || 0;
        const staffDailyCost = staffCount * staffDays * inputs.staffMultiplier;
        const staffTravel = inputs.staffTravel || 0;
        const staffHotel = inputs.staffHotel || 0;
        const staffTotalCost = staffDailyCost + staffTravel + staffHotel;

        // Grand total
        const grandTotal = simulatorSubtotal + transportCost + staffTotalCost;

        // Check if any optional fields were provided
        const hasOptionalFields = !!(
            inputs.transportKm ||
            inputs.numberOfStaff ||
            inputs.staffTravel ||
            inputs.staffHotel
        );

        return {
            simulatorSubtotal,
            transportCost,
            staffDailyCost,
            staffTotalCost,
            grandTotal,
            hasOptionalFields,
        };
    }, [inputs]);
}
