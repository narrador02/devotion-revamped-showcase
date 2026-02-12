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
        // 1. Debug check (relaxed to allow REDIS_URL fallback)
        if (!process.env.KV_REST_API_URL && !process.env.KV_REST_API_TOKEN && !process.env.REDIS_URL) {
            throw new Error('Missing KV Environment Variables (KV_* or REDIS_URL)');
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

        // 4. Get configured KV client
        // @ts-ignore - Local helper import
        const { getKVClient } = await import('../_lib/kv-client.js');
        const kv = getKVClient();

        // 5. Store proposal with timeout
        const strProposal = JSON.stringify(proposal);

        // Helper for timeout
        const withTimeout = (promise: Promise<any>, ms: number) => Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Database Timeout')), ms))
        ]);

        console.log(`Attempting to set proposal:${id}...`);
        await withTimeout(kv.set(`proposal:${id}`, strProposal, {
            ex: 15 * 24 * 60 * 60, // 15 days TTL
        }), 5000);

        // 6. Add to list
        console.log(`Attempting to push to proposals:list...`);
        await withTimeout(kv.lpush('proposals:list', id), 5000);
        await kv.ltrim('proposals:list', 0, 49).catch(console.error); // Non-critical

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
            stack: error.stack,
            likely_cause: error.message.includes('Timeout') ? 'Firewall/Connection blocked. Your REDIS_URL might be TCP-only (port 6379) but we need HTTP (port 80/443).' : undefined,
            env_check: {
                has_url: !!process.env.KV_REST_API_URL,
                has_token: !!process.env.KV_REST_API_TOKEN
            }
        });
    }
}
