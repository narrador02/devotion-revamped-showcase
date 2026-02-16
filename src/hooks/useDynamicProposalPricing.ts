import { useMemo } from 'react';
import { Proposal, RentalDetails } from '@/types/proposal';
import { DateRange } from 'react-day-picker';
import { differenceInDays } from 'date-fns';

export function useDynamicProposalPricing(proposal: Proposal, dateRange: DateRange | undefined) {
    return useMemo(() => {
        // If not rental or no dates selected, return original
        if (proposal.proposalType !== 'rental' || !proposal.rentalDetails || !dateRange?.from || !dateRange?.to) {
            return proposal.rentalDetails;
        }

        const original = proposal.rentalDetails;

        // Calculate days (inclusive)
        const daysDiff = differenceInDays(dateRange.to, dateRange.from);
        const newDays = daysDiff >= 0 ? daysDiff + 1 : 1;

        // If days haven't changed from original proposal context (if we knew it), 
        // strictly speaking we should still recalculate to be safe, 
        // but we need the *original* unit prices.
        // Assuming the proposal object contains the totals based on the *original* days.
        // We need to derive unit costs if they aren't explicit, OR rely on the fact that
        // basePrice is per event? No, basePrice is usually per simulator per day in this context?
        // Let's check RentalFormFields logic:
        // simulatorSubtotal = basePrice * simCount * days;
        // So basePrice IS per day/event unit?
        // Wait, in RentalFormFields: setValue("rentalBasePrice", isVIP ? 550 : 750);
        // And calculation: const simulatorSubtotal = inputs.basePrice * simCount * days;
        // So yes, basePrice is the daily rate per simulator.

        // Simulators
        const simCount = original.numberOfSimulators || 1;
        const simulatorSubtotal = original.basePrice * simCount * newDays;

        // Transport (Fixed, dependent on km, not days)
        const transportCost = original.transport?.totalCost || 0;

        // Staff
        let staffTotalCost = 0;
        let newStaffDetails = undefined;

        if (original.staff) {
            const staffCount = original.staff.numberOfStaff || 0;
            const pricePerStaffDay = original.staff.pricePerStaffDay;
            const staffDailyCost = staffCount * newDays * pricePerStaffDay;

            // Travel (Fixed)
            const travelExpenses = original.staff.travelExpenses || 0;

            // Hotel (Usually per night, so days - 1? or days? Let's assume proportional to days for now 
            // OR keep it fixed if it was a lump sum estimate. 
            // In RentalFormFields it's a manual input "staffHotel". 
            // If we want to be smart, we might scale it. 
            // But safely, let's keep fixed expenses fixed and only scale daily rates.)
            const hotelExpenses = original.staff.hotelExpenses || 0;

            staffTotalCost = staffDailyCost + travelExpenses + hotelExpenses;

            newStaffDetails = {
                ...original.staff,
                numberOfDays: newDays,
                totalCost: staffTotalCost
            };
        }

        const grandTotal = simulatorSubtotal + transportCost + staffTotalCost;

        const newRentalDetails: RentalDetails = {
            ...original,
            numberOfSimulators: simCount, // explicit
            subtotal: simulatorSubtotal, // This might be semantically different in different contexts but usually means sim total
            total: grandTotal,
            staff: newStaffDetails,
            // We probably want to store the computed days for display too, 
            // but RentalDetails doesn't have a top-level 'days' field, it's inside staff? 
            // Actually RentalFormFields has 'numberOfDays' input but it's not explicitly in RentalDetails interface separately?
            // Checking types/proposal.ts: RentalDetails does NOT have numberOfDays. StaffDetails DOES.
            // This is a bit of a data model quirk. We'll rely on the Staff details showing the days,
            // or we might need to patch the type if we want to show it elsewhere.
            // For now, calculating the total is the priority.
        };

        return newRentalDetails;

    }, [proposal, dateRange]);
}
