import type { VercelRequest, VercelResponse } from '@vercel/node';

// Admin authentication verification endpoint
// TEMPORARILY DISABLED FOR DEMO - RE-ENABLE BEFORE PRODUCTION
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // TEMPORARILY AUTO-AUTHENTICATE FOR DEMO
    return res.status(200).json({
        authenticated: true
    });

    /* ORIGINAL AUTH CODE - UNCOMMENT TO RE-ENABLE:
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
    */
}
