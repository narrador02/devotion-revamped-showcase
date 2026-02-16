// Shared TypeScript interfaces for proposals
// Used by both frontend and backend (api routes)

export type ProposalType = 'rental' | 'purchase';

export interface TransportDetails {
    kilometers?: number;
    pricePerKm: number; // Default: 1.6
    totalCost: number;
}

export interface StaffDetails {
    numberOfStaff?: number;
    numberOfDays?: number;
    pricePerStaffDay: number; // Default: 280
    travelExpenses?: number;
    hotelExpenses?: number;
    totalCost: number;
}

export interface RentalDetails {
    basePrice: number; // 750 or 550 for VIP
    isVIP: boolean;
    numberOfDays?: number; // Added for dynamic pricing tracking
    numberOfSimulators?: number;
    transport?: TransportDetails;
    staff?: StaffDetails;
    subtotal: number;
    total: number;
}

export interface PurchaseDetails {
    packages: {
        basic: string;
        professional: string;
        complete: string;
    };
    paymentTerms?: string;
}

export interface Proposal {
    id: string;
    proposalType: ProposalType;
    clientName: string;
    clientLogoUrl: string;
    personalMessage?: string;

    // Type-specific details
    rentalDetails?: RentalDetails;
    purchaseDetails?: PurchaseDetails;

    notes?: string;
    createdAt: string;
    expiresAt: string;
}

export interface ProposalListItem {
    id: string;
    proposalType: ProposalType;
    clientName: string;
    createdAt: string;
    expiresAt: string;
    isExpired: boolean;
}

export interface AdminSettings {
    transportMultiplier: number; // Default: 1.6
    staffMultiplier: number; // Default: 280
    simulatorPrice: number; // Default: 750
    simulatorPriceVIP: number; // Default: 550
}
