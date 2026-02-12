import type { VercelRequest, VercelResponse } from '@vercel/node';
import { nanoid } from 'nanoid';
import type { Proposal, ProposalType } from '../../src/types/proposal';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify admin authentication
    const cookies = req.cookies || {};
    if (cookies.adminAuth !== 'true') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
        proposalType,
        clientName,
        clientLogoUrl,
        personalMessage,
        rentalDetails,
        purchaseDetails,
        notes
    } = req.body || {};

    // Validate required fields
    if (!proposalType || (proposalType !== 'rental' && proposalType !== 'purchase')) {
        return res.status(400).json({ error: 'Invalid proposal type' });
    }

    if (!clientName || typeof clientName !== 'string' || clientName.trim() === '') {
        return res.status(400).json({ error: 'Client name is required' });
    }

    if (!clientLogoUrl || typeof clientLogoUrl !== 'string') {
        return res.status(400).json({ error: 'Client logo is required' });
    }

    // Validate type-specific fields
    if (proposalType === 'rental') {
        if (!rentalDetails || typeof rentalDetails !== 'object') {
            return res.status(400).json({ error: 'Rental details are required for rental proposals' });
        }
    }

    if (proposalType === 'purchase') {
        if (!purchaseDetails || typeof purchaseDetails !== 'object') {
            return res.status(400).json({ error: 'Purchase details are required for purchase proposals' });
        }
    }

    try {
        const id = nanoid(11); // 11 chars like YouTube IDs
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days

        const proposal: Proposal = {
            id,
            proposalType: proposalType as ProposalType,
            clientName: clientName.trim(),
            clientLogoUrl,
            personalMessage: personalMessage?.trim() || undefined,
            rentalDetails: proposalType === 'rental' ? rentalDetails : undefined,
            purchaseDetails: proposalType === 'purchase' ? purchaseDetails : undefined,
            notes: notes?.trim() || undefined,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
        };

        // Dynamically import KV
        const { kv } = await import('@vercel/kv');

        // Store proposal in KV
        await kv.set(`proposal:${id}`, JSON.stringify(proposal), {
            ex: 15 * 24 * 60 * 60, // 15 days TTL
        });

        // Add to recent proposals list (keep last 50)
        await kv.lpush('proposals:list', id);
        await kv.ltrim('proposals:list', 0, 49);

        return res.status(201).json({
            success: true,
            proposal: {
                id,
                proposalType: proposal.proposalType,
                clientName: proposal.clientName,
                createdAt: proposal.createdAt,
                expiresAt: proposal.expiresAt,
            },
        });
    } catch (error: any) {
        console.error('Error creating proposal:', error);
        return res.status(500).json({
            error: 'Failed to create proposal',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
