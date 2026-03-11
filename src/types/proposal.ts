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
    requireDownPayment?: boolean;
    downPaymentPercentage?: number;
    transport?: TransportDetails;
    staff?: StaffDetails;
    subtotal: number;
    total: number;
    eventReference?: string;
    discountAmount?: number;
    discountConcept?: string;
}

export interface PurchaseDetails {
    packages: {
        timeAttack?: number;
        slady?: number;
        topGun?: number;
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

    brandingPrices?: { none: number; platform: number; simulator: number; full: number; };
    flightCasePrice?: number;
    pianolaPrice?: number;
    audioSystemPrice?: number;

    notes?: string;
    createdAt: string;
    expiresAt: string;

    // Acceptance data (saved when the client accepts the proposal)
    accepted?: boolean;
    acceptedAt?: string;
    customerDetails?: {
        fullName?: string;
        email?: string;
        phone?: string;
        comments?: string;
    } | null;
    acceptedSimulator?: string;
    acceptedAddOns?: {
        branding: { label: string; price: number } | null;
        flightCase: number | null;
        pianola: number | null;
        audioSystem: number | null;
    } | null;
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
    purchasePriceTimeAttack: number; // Default: 23000
    purchasePriceSlady: number; // Default: 26000
    purchasePriceTopGun: number; // Default: 30000
    downPaymentPercentage: number; // Default: 30
    brandingPricePlatform: number; // Default: 290
    brandingPriceSimulator: number; // Default: 360
    brandingPricePack: number; // Default: 600
    flightCasePrice: number; // Default: 840
    pianolaPrice: number; // Default: 480
    audioSystemPrice: number; // Default: 490
}
