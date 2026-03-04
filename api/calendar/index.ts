import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

async function getGoogleToken(): Promise<string> {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!clientEmail || !privateKey) throw new Error('Missing Google Credentials');
    privateKey = privateKey.replace(/\\n/g, '\n');

    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const claim = {
        iss: clientEmail,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
    };

    const toB64 = (obj: any) => Buffer.from(JSON.stringify(obj)).toString('base64url');
    const unsignedToken = `${toB64(header)}.${toB64(claim)}`;
    const signature = crypto.createSign('RSA-SHA256').update(unsignedToken).sign(privateKey, 'base64url');
    const jwt = `${unsignedToken}.${signature}`;

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
    });

    const data = await response.json();
    return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // TEMPORARILY DISABLED
    if (req.method === 'GET') {
        return res.status(200).json({ busy: [] });
    }
    if (req.method === 'POST') {
        return res.status(200).json({ success: true, message: 'Calendar disabled' });
    }
    return res.status(405).json({ error: 'Method not allowed' });
}
