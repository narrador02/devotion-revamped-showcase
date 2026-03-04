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

        const cookieOptions = [`adminAuth=true`, `Max-Age=${7 * 24 * 60 * 60}`, `Path=/`, `HttpOnly`, `SameSite=Strict`, process.env.NODE_ENV === 'production' ? 'Secure' : ''].filter(Boolean).join('; ');
        res.setHeader('Set-Cookie', cookieOptions);
        return res.status(200).json({ success: true });
    }

    // 3. Logout (POST)
    if (action === 'logout' && req.method === 'POST') {
        res.setHeader('Set-Cookie', 'adminAuth=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict');
        return res.status(200).json({ success: true });
    }

    // 4. Verify (GET)
    if (action === 'verify') {
        const cookies = req.cookies || {};
        return res.status(200).json({ authenticated: cookies.adminAuth === 'true' });
    }

    return res.status(400).json({ error: 'Invalid action or method' });
}
