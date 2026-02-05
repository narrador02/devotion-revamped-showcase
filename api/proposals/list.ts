import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

interface Proposal {
    id: string;
    proposalType?: 'rental' | 'purchase'; // Optional for legacy proposals
    clientName: string;
    clientLogoUrl: string;
    personalMessage?: string;
    pricing?: {
        basic: string;
        professional: string;
        complete: string;
    };
    notes?: string;
    createdAt: string;
    expiresAt: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // TEMPORARILY DISABLED FOR DEMO - RE-ENABLE BEFORE PRODUCTION
    /* ORIGINAL AUTH CODE - UNCOMMENT TO RE-ENABLE:
    // Verify admin authentication
    const cookies = req.cookies || {};
    if (cookies.adminAuth !== 'true') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    */

    try {
        // Get recent proposal IDs
        const proposalIds = await kv.lrange('proposals:list', 0, 9) as string[];

        if (!proposalIds || proposalIds.length === 0) {
            return res.status(200).json({ proposals: [] });
        }

        // Fetch all proposals
        const proposals: Array<{
            id: string;
            proposalType: 'rental' | 'purchase';
            clientName: string;
            createdAt: string;
            expiresAt: string;
            isExpired: boolean;
        }> = [];

        for (const id of proposalIds) {
            const data = await kv.get(`proposal:${id}`);
            if (data) {
                const proposal = typeof data === 'string' ? JSON.parse(data) : data as Proposal;
                const isExpired = new Date(proposal.expiresAt) < new Date();
                proposals.push({
                    id: proposal.id,
                    proposalType: proposal.proposalType || 'purchase', // Default legacy to purchase
                    clientName: proposal.clientName,
                    createdAt: proposal.createdAt,
                    expiresAt: proposal.expiresAt,
                    isExpired,
                });
            }
        }

        return res.status(200).json({ proposals });
    } catch (error) {
        console.error('Error fetching proposals:', error);
        return res.status(500).json({ error: 'Failed to fetch proposals' });
    }
}
