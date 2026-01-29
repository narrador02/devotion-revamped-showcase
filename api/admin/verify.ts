import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const cookies = req.cookies || {};
    const isAuthenticated = cookies.adminAuth === 'true';

    if (!isAuthenticated) {
        return res.status(401).json({
            authenticated: false,
            error: 'Not authenticated'
        });
    }

    return res.status(200).json({
        authenticated: true
    });
}
