import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Debug: Check Environment Variables
        // 1. Debug check (relaxed to allow REDIS_URL fallback)
        if (!process.env.KV_REST_API_URL && !process.env.KV_REST_API_TOKEN && !process.env.REDIS_URL) {
            throw new Error('Missing KV Environment Variables (KV_* or REDIS_URL)');
        }

        // 2. Get configured KV client
        // @ts-ignore - Local helper import
        const { getKVClient } = await import('../_lib/kv-client.js');
        const kv = getKVClient();

        // 3. Simple Operation to test connection
        const proposalIds = await kv.lrange('proposals:list', 0, 9);

        if (!proposalIds || proposalIds.length === 0) {
            return res.status(200).json({ proposals: [] });
        }

        const proposals: any[] = [];

        for (const id of proposalIds) {
            const data = await kv.get(`proposal:${id}`);
            if (data) {
                // Handle potential string vs object response
                const proposal = typeof data === 'string' ? JSON.parse(data) : data as any;

                if (proposal && proposal.id) {
                    proposals.push({
                        id: proposal.id,
                        proposalType: proposal.proposalType || 'purchase',
                        clientName: proposal.clientName,
                        createdAt: proposal.createdAt,
                        expiresAt: proposal.expiresAt,
                        isExpired: new Date(proposal.expiresAt) < new Date(),
                    });
                }
            }
        }

        return res.status(200).json({ proposals });

    } catch (error: any) {
        console.error('LIST API ERROR:', error);
        return res.status(500).json({
            error: 'Failed to fetch proposals',
            details: error.message,
            env_check: {
                has_url: !!process.env.KV_REST_API_URL,
                has_token: !!process.env.KV_REST_API_TOKEN
            }
        });
    }
}
