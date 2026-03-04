import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

// Local interface to avoid path aliasing issues in Vercel functions
interface Proposal {
    id: string;
    proposalType: 'rental' | 'purchase';
    clientName: string;
    clientLogoUrl: string;
    personalMessage?: string;
    rentalDetails?: any;
    purchaseDetails?: any;
    notes?: string;
    createdAt: string;
    expiresAt: string;
    accepted?: boolean;
    acceptedAt?: string;
    customerDetails?: any;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,POST,OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.query;
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'ID is required' });

    // 1. Get Proposal (GET)
    if (req.method === 'GET') {
        try {
            const data = await kv.get(`proposal:${id}`);
            if (!data) return res.status(404).json({ error: 'Not found' });
            const proposal = typeof data === 'string' ? JSON.parse(data) : data;
            return res.status(200).json({ proposal });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch' });
        }
    }

    // 2. Delete Proposal (DELETE)
    if (req.method === 'DELETE') {
        const cookies = req.cookies || {};
        if (cookies.adminAuth !== 'true') return res.status(401).json({ error: 'Unauthorized' });
        try {
            await kv.del(`proposal:${id}`);
            await kv.lrem('proposals:list', 0, id);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete' });
        }
    }

    // 3. Accept Proposal (POST) - Merged from accept.ts
    if (req.method === 'POST') {
        try {
            const { customerDetails } = req.body || {};
            const data = await kv.get(`proposal:${id}`);
            if (!data) return res.status(404).json({ error: 'Proposal not found' });

            const proposal = typeof data === 'string' ? JSON.parse(data) : data;
            proposal.accepted = true;
            proposal.acceptedAt = new Date().toISOString();
            proposal.customerDetails = customerDetails;

            await kv.set(`proposal:${id}`, JSON.stringify(proposal));
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to accept proposal' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
