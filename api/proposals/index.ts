import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import crypto from 'crypto';

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
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 1. List Proposals (GET)
    if (req.method === 'GET') {
        try {
            const proposalIds = await kv.lrange('proposals:list', 0, 49) as string[];
            if (!proposalIds || proposalIds.length === 0) return res.status(200).json({ proposals: [] });

            const proposals: any[] = [];
            for (const id of proposalIds) {
                const data = await kv.get(`proposal:${id}`);
                if (data) {
                    const proposal = typeof data === 'string' ? JSON.parse(data) : data;
                        let calculatedPrice = null;
                        if (proposal.proposalType === 'rental') {
                            calculatedPrice = proposal.rentalDetails?.total;
                        } else if (proposal.purchaseDetails?.packages && Object.keys(proposal.purchaseDetails.packages).length === 1) {
                            const packagePrice = Object.values(proposal.purchaseDetails.packages)[0] as number;
                            const subtotal = packagePrice + 
                                (proposal.flightCasePrice || 0) + 
                                (proposal.pianolaPrice || 0) + 
                                (proposal.audioSystemPrice || 0) + 
                                (proposal.brandingPrices?.full || proposal.brandingPrices?.simulator || proposal.brandingPrices?.platform || 0);
                            calculatedPrice = subtotal;
                        }

                        proposals.push({
                            id: proposal.id,
                            proposalType: proposal.proposalType || 'purchase',
                            clientName: proposal.clientName,
                            createdAt: proposal.createdAt,
                            expiresAt: proposal.expiresAt,
                            isExpired: new Date(proposal.expiresAt) < new Date(),
                            price: calculatedPrice,
                        accepted: proposal.accepted || false,
                        acceptedAt: proposal.acceptedAt || null,
                        customerDetails: proposal.customerDetails || null,
                    });
                }
            }
            return res.status(200).json({ proposals });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch proposals' });
        }
    }

    // 2. Create Proposal (POST)
    if (req.method === 'POST') {
        try {
            const { proposalType, clientName, clientLogoUrl, personalMessage, rentalDetails, purchaseDetails, notes } = req.body || {};
            if (!clientName || !clientLogoUrl) return res.status(400).json({ error: 'Missing required fields' });

            const id = crypto.randomUUID().slice(0, 11);
            const now = new Date();
            const proposal: Proposal = {
                id,
                proposalType,
                clientName: clientName.trim(),
                clientLogoUrl,
                personalMessage,
                rentalDetails,
                purchaseDetails,
                notes,
                createdAt: now.toISOString(),
                expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            };

            await kv.set(`proposal:${id}`, JSON.stringify(proposal), { ex: 30 * 24 * 60 * 60 });
            await kv.lpush('proposals:list', id);
            await kv.ltrim('proposals:list', 0, 99);

            return res.status(201).json({ success: true, proposal: { id, clientName: proposal.clientName } });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to create proposal' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
