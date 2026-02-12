import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import type { Proposal } from '@/types/proposal';

// Legacy proposal interface for backwards compatibility
interface LegacyProposal {
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
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Proposal ID is required' });
    }

    if (req.method === 'DELETE') {
        const cookies = req.cookies || {};
        if (cookies.adminAuth !== 'true') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            // @ts-ignore
            const { getKVClient } = await import('../_lib/kv-client.js');
            const kv = getKVClient();

            // Execute delete
            // 1. Delete the proposal object
            await kv.del(`proposal:${id}`);
            // 2. Remove ID from the list
            await kv.lrem('proposals:list', 0, id);

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error deleting proposal:', error);
            return res.status(500).json({ error: 'Failed to delete proposal' });
        }
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = await kv.get(`proposal:${id}`);

        if (!data) {
            return res.status(404).json({
                error: 'Proposal not found',
                code: 'NOT_FOUND'
            });
        }

        const rawProposal = typeof data === 'string' ? JSON.parse(data) : data;

        // Check if it's a legacy proposal (no proposalType field)
        const isLegacy = !rawProposal.proposalType;

        let proposal: Proposal;

        if (isLegacy) {
            // Convert legacy proposal to new format (as purchase type)
            const legacy = rawProposal as LegacyProposal;
            proposal = {
                id: legacy.id,
                proposalType: 'purchase',
                clientName: legacy.clientName,
                clientLogoUrl: legacy.clientLogoUrl,
                personalMessage: legacy.personalMessage,
                purchaseDetails: {
                    packages: legacy.pricing,
                },
                notes: legacy.notes,
                createdAt: legacy.createdAt,
                expiresAt: legacy.expiresAt,
            };
        } else {
            proposal = rawProposal as Proposal;
        }

        const isExpired = new Date(proposal.expiresAt) < new Date();

        if (isExpired) {
            return res.status(410).json({
                error: 'Proposal has expired',
                code: 'EXPIRED'
            });
        }

        return res.status(200).json({ proposal, isLegacy });
    } catch (error) {
        console.error('Error fetching proposal:', error);
        return res.status(500).json({ error: 'Failed to fetch proposal' });
    }
}
