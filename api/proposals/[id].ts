import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

interface Proposal {
    id: string;
    clientName: string;
    clientLogoUrl: string;
    personalMessage?: string;
    pricing: {
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

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Proposal ID is required' });
    }

    try {
        const data = await kv.get(`proposal:${id}`);

        if (!data) {
            return res.status(404).json({
                error: 'Proposal not found',
                code: 'NOT_FOUND'
            });
        }

        const proposal = typeof data === 'string' ? JSON.parse(data) : data as Proposal;
        const isExpired = new Date(proposal.expiresAt) < new Date();

        if (isExpired) {
            return res.status(410).json({
                error: 'Proposal has expired',
                code: 'EXPIRED'
            });
        }

        return res.status(200).json({ proposal });
    } catch (error) {
        console.error('Error fetching proposal:', error);
        return res.status(500).json({ error: 'Failed to fetch proposal' });
    }
}
