import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

// Define minimal local interface to avoid import issues
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
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS for testing if needed, though usually same-origin
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Debug: Check Environment Variables
        if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
            throw new Error('Missing Vercel KV Environment Variables (KV_REST_API_URL or KV_REST_API_TOKEN)');
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

        // 2. Validate required fields
        if (!proposalType || (proposalType !== 'rental' && proposalType !== 'purchase')) {
            return res.status(400).json({ error: 'Invalid proposal type' });
        }

        if (!clientName) return res.status(400).json({ error: 'Client name is required' });
        if (!clientLogoUrl) return res.status(400).json({ error: 'Client logo is required' });

        // 3. Generate ID using native crypto (no external deps)
        const id = crypto.randomUUID().slice(0, 11); // Shorten UUID for URL friendliness
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days

        const proposal: Proposal = {
            id,
            proposalType: proposalType as 'rental' | 'purchase',
            clientName: clientName.trim(),
            clientLogoUrl,
            personalMessage: personalMessage?.trim() || undefined,
            rentalDetails: proposalType === 'rental' ? rentalDetails : undefined,
            purchaseDetails: proposalType === 'purchase' ? purchaseDetails : undefined,
            notes: notes?.trim() || undefined,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
        };

        // 4. Dynamically import KV inside handler
        const { kv } = await import('@vercel/kv');

        // 5. Store proposal
        await kv.set(`proposal:${id}`, JSON.stringify(proposal), {
            ex: 15 * 24 * 60 * 60, // 15 days TTL
        });

        // 6. Add to list
        await kv.lpush('proposals:list', id);
        await kv.ltrim('proposals:list', 0, 49);

        return res.status(201).json({
            success: true,
            proposal: {
                id,
                proposalType: proposal.proposalType,
                clientName: proposal.clientName,
            },
        });

    } catch (error: any) {
        console.error('CRITICAL API ERROR:', error);
        // Return detailed error for debugging
        return res.status(500).json({
            error: 'Server Error',
            details: error.message,
            stack: error.stack, // Helpful for debugging
            env_check: {
                has_url: !!process.env.KV_REST_API_URL,
                has_token: !!process.env.KV_REST_API_TOKEN
            }
        });
    }
}
