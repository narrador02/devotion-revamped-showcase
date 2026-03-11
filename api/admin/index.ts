import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Devotion0500';
const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 60 * 1000;

interface RateLimitData {
    count: number;
    resetAt: number;
}

interface AdminSettings {
    transportMultiplier: number;
    staffMultiplier: number;
    simulatorPrice: number;
    simulatorPriceVIP: number;
    purchasePriceTimeAttack: number;
    purchasePriceSlady: number;
    purchasePriceTopGun: number;
    downPaymentPercentage: number;
    brandingPricePlatform: number;
    brandingPriceSimulator: number;
    brandingPricePack: number;
    flightCasePrice: number;
    pianolaPrice: number;
    audioSystemPrice: number;
}

const DEFAULT_SETTINGS: AdminSettings = {
    transportMultiplier: 1.6,
    staffMultiplier: 280,
    simulatorPrice: 750,
    simulatorPriceVIP: 550,
    purchasePriceTimeAttack: 23000,
    purchasePriceSlady: 26000,
    purchasePriceTopGun: 30000,
    downPaymentPercentage: 30,
    brandingPricePlatform: 290,
    brandingPriceSimulator: 360,
    brandingPricePack: 600,
    flightCasePrice: 840,
    pianolaPrice: 480,
    audioSystemPrice: 490,
};

async function getRateLimitData(ip: string): Promise<RateLimitData | null> {
    try {
        return await kv.get<RateLimitData>(`ratelimit:${ip}`);
    } catch (error) {
        return null;
    }
}

async function setRateLimitData(ip: string, data: RateLimitData): Promise<void> {
    try {
        await kv.set(`ratelimit:${ip}`, data, { ex: 300 });
    } catch (error) { }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { action } = req.query;

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    
    // Determine the redirect URI dynamically based on the current request
    const protocol = req.headers['x-forwarded-proto'] || (req.headers.host?.includes('localhost') ? 'http' : 'https');
    const host = req.headers.host;
    const REDIRECT_URI = `${protocol}://${host}/api/admin?action=google-callback`;

    // 1. Settings (GET/POST) - Special case for settings
    if (action === 'settings') {
        if (req.method === 'GET') {
            try {
                const settings = await kv.get<AdminSettings>('admin:settings');
                return res.status(200).json({
                    settings: { ...DEFAULT_SETTINGS, ...(settings || {}) }
                });
            } catch (error) {
                return res.status(200).json({ settings: DEFAULT_SETTINGS });
            }
        }

        if (req.method === 'POST') {
            const body = req.body || {};
            try {
                let existing: AdminSettings = DEFAULT_SETTINGS;
                const stored = await kv.get<AdminSettings>('admin:settings');
                if (stored) existing = { ...DEFAULT_SETTINGS, ...stored };

                const settings: AdminSettings = {
                    transportMultiplier: body.transportMultiplier || existing.transportMultiplier,
                    staffMultiplier: body.staffMultiplier || existing.staffMultiplier,
                    simulatorPrice: body.simulatorPrice || existing.simulatorPrice,
                    simulatorPriceVIP: body.simulatorPriceVIP || existing.simulatorPriceVIP,
                    purchasePriceTimeAttack: body.purchasePriceTimeAttack || existing.purchasePriceTimeAttack,
                    purchasePriceSlady: body.purchasePriceSlady || existing.purchasePriceSlady,
                    purchasePriceTopGun: body.purchasePriceTopGun || existing.purchasePriceTopGun,
                    downPaymentPercentage: body.downPaymentPercentage || existing.downPaymentPercentage,
                    brandingPricePlatform: body.brandingPricePlatform || existing.brandingPricePlatform,
                    brandingPriceSimulator: body.brandingPriceSimulator || existing.brandingPriceSimulator,
                    brandingPricePack: body.brandingPricePack || existing.brandingPricePack,
                    flightCasePrice: body.flightCasePrice || existing.flightCasePrice,
                    pianolaPrice: body.pianolaPrice || existing.pianolaPrice,
                    audioSystemPrice: body.audioSystemPrice || existing.audioSystemPrice,
                };
                await kv.set('admin:settings', JSON.stringify(settings));
                return res.status(200).json({ success: true, settings });
            } catch (error) {
                return res.status(500).json({ error: 'Failed to save settings' });
            }
        }
    }

    // 2. Login (POST)
    if (action === 'login' && req.method === 'POST') {
        const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
        const rateLimitData = await getRateLimitData(ip);

        if (rateLimitData && rateLimitData.count >= MAX_ATTEMPTS && Date.now() < rateLimitData.resetAt) {
            return res.status(429).json({ error: 'Too many attempts', code: 'RATE_LIMITED' });
        }

        const { password } = req.body || {};
        if (password !== ADMIN_PASSWORD) {
            const newCount = (rateLimitData?.count || 0) + 1;
            await setRateLimitData(ip, { count: newCount, resetAt: Date.now() + COOLDOWN_MS });
            return res.status(401).json({ error: 'Invalid password' });
        }

        const cookieOptions = [`adminAuth=true`, `Max-Age=${7 * 24 * 60 * 60}`, `Path=/`, `HttpOnly`, `SameSite=Lax`, process.env.NODE_ENV === 'production' ? 'Secure' : ''].filter(Boolean).join('; ');
        res.setHeader('Set-Cookie', cookieOptions);
        return res.status(200).json({ success: true });
    }

    // 3. Logout (POST)
    if (action === 'logout' && req.method === 'POST') {
        res.setHeader('Set-Cookie', 'adminAuth=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax');
        return res.status(200).json({ success: true });
    }

    // 4. Verify (GET)
    if (action === 'verify') {
        const cookies = req.cookies || {};
        return res.status(200).json({ authenticated: cookies.adminAuth === 'true' });
    }

    // 5. Google Drive OAuth (Admin Only)
    const cookies = req.cookies || {};
    const isAdmin = cookies.adminAuth === 'true';

    if (action?.toString().startsWith('google-') && !isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // 5a. Get Auth URL
    if (action === 'google-auth-url') {
        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_API_KEY) {
            return res.status(500).json({ error: 'Google OAuth credentials not configured in environment variables' });
        }

        const scopes = [
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/drive.metadata.readonly',
            'https://www.googleapis.com/auth/calendar.events'
        ].join(' ');
        
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
            `client_id=${GOOGLE_CLIENT_ID}&` +
            `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(scopes)}&` +
            `access_type=offline&` +
            `prompt=consent`;
            
        return res.status(200).json({ url: authUrl });
    }

    // 5b. Callback
    if (action === 'google-callback') {
        const { code } = req.query;
        if (!code) return res.status(400).json({ error: 'Code required' });

        try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code: code.toString(),
                    client_id: GOOGLE_CLIENT_ID!,
                    client_secret: GOOGLE_CLIENT_SECRET!,
                    redirect_uri: REDIRECT_URI,
                    grant_type: 'authorization_code',
                } as any),
            });

            const tokens = await response.json();
            if (tokens.error) throw new Error(tokens.error_description || tokens.error);

            if (tokens.refresh_token) {
                await kv.set('admin:google_refresh_token', tokens.refresh_token);
            }

            // Redirect back to admin proposals with success flag
            return res.redirect('/admin/proposals?google_setup=success');
        } catch (error: any) {
            console.error('Google callback error:', error);
            return res.redirect(`/admin/proposals?google_setup=error&message=${encodeURIComponent(error.message)}`);
        }
    }

    // 5c. Get Access Token (Internal use or return to client)
    const getAccessToken = async () => {
        const refreshToken = await kv.get<string>('admin:google_refresh_token');
        if (!refreshToken) throw new Error('No Google account connected');

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: GOOGLE_CLIENT_ID!,
                client_secret: GOOGLE_CLIENT_SECRET!,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            } as any),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error_description || data.error);
        return data.access_token;
    };

    if (action === 'google-token') {
        try {
            const accessToken = await getAccessToken();
            return res.status(200).json({
                accessToken,
                apiKey: GOOGLE_API_KEY,
                clientId: GOOGLE_CLIENT_ID
            });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 5d. Create Calendar Event
    if (action === 'google-calendar-event' && req.method === 'POST') {
        try {
            const accessToken = await getAccessToken();
            const { proposalId, title, description, startDate, endDate, location } = req.body || {};

            if (!startDate || !endDate) return res.status(400).json({ error: 'Start and End dates are required' });

            const event = {
                summary: title || 'Devotion Sim Event',
                description: description || `Proposal: ${proposalId}`,
                location: location || '',
                start: {
                    dateTime: new Date(startDate).toISOString(),
                    timeZone: 'Europe/Madrid',
                },
                end: {
                    dateTime: new Date(endDate).toISOString(),
                    timeZone: 'Europe/Madrid',
                },
            };

            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error.message || 'Failed to create event');

            return res.status(200).json({ success: true, eventId: data.id });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 5. Generate Phrase (POST) — admin only
    if (action === 'generate-phrase' && req.method === 'POST') {
        const cookies = req.cookies || {};
        if (cookies.adminAuth !== 'true') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                return res.status(500).json({ error: 'Gemini API not configured' });
            }
            const { clientName, locale = 'es' } = req.body || {};
            if (!clientName) {
                return res.status(400).json({ error: 'Client name is required' });
            }
            const isSpanish = locale === 'es' || locale.startsWith('es-');
            const prompt = isSpanish
                ? `Eres un copywriter experto que trabaja para una empresa de simuladores de motociclismo de gama premium llamada DevotionSim. Genera una frase de captación personalizada para la empresa: "${clientName}". Max 2-3 oraciones. Tono pro.`
                : `You are an expert copywriter working for a premium motorcycling simulator company called DevotionSim. Generate a personalized hook phrase for: "${clientName}". Max 2-3 sentences. Pro tone.`;

            const geminiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.8, maxOutputTokens: 150 }
                    })
                }
            );
            if (!geminiResponse.ok) {
                const errorData = await geminiResponse.json().catch(() => null);
                return res.status(geminiResponse.status).json({
                    error: errorData?.error?.message || `Gemini API error: ${geminiResponse.status}`,
                    details: errorData
                });
            }
            const data = await geminiResponse.json();
            const phrase = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            return res.status(200).json({ phrase });
        } catch (error: any) {
            return res.status(500).json({ error: 'Failed to generate phrase', message: error.message });
        }
    }

    return res.status(400).json({ error: 'Invalid action or method' });
}
