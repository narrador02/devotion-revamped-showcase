import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Clear the authentication cookie
    const cookieOptions = [
        `adminAuth=`,
        `Max-Age=0`,
        `Path=/`,
        `HttpOnly`,
        `SameSite=Strict`,
        process.env.NODE_ENV === 'production' ? 'Secure' : ''
    ].filter(Boolean).join('; ');

    res.setHeader('Set-Cookie', cookieOptions);
    return res.status(200).json({ success: true });
}
