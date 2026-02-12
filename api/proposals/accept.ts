import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define the expected payload structure
interface AcceptPayload {
    proposalId: string;
    clientName: string;
    fullName: string;
    email: string;
    phone: string;
    comments?: string;
    proposalType: 'rental' | 'purchase';
    selectedDates?: {
        start: string;
        end: string;
    };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const payload = req.body as AcceptPayload;

        // Validation
        if (!payload.proposalId || !payload.email || !payload.phone || !payload.fullName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Forward to Formspree
        // You would typically use process.env.FORMSPREE_ENDPOINT here
        const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgvrveqe"; // Using the ID from UnifiedContactForm

        const formspreePayload = {
            subject: `New Proposal Acceptance: ${payload.clientName}`,
            ...payload,
            _subject: `Proposal Acceptance: ${payload.clientName} (${payload.proposalType})`,
            _replyto: payload.email,
        };

        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formspreePayload),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Formspree error:', error);
            // Even if email fails, we might want to log it to our DB in a real app
            // For now, we propagate the error to the UI
            throw new Error('Failed to send email notification');
        }

        return res.status(200).json({ success: true });

    } catch (error: any) {
        console.error('Accept API Error:', error);
        return res.status(500).json({ error: 'Failed to process acceptance' });
    }
}
