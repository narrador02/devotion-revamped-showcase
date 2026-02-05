import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

interface AdminSettings {
    transportMultiplier: number;
    staffMultiplier: number;
}

const DEFAULT_SETTINGS: AdminSettings = {
    transportMultiplier: 1.6,
    staffMultiplier: 280,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // TEMPORARILY DISABLED FOR DEMO - RE-ENABLE BEFORE PRODUCTION
    /* ORIGINAL AUTH CODE - UNCOMMENT TO RE-ENABLE:
    const cookies = req.cookies || {};
    if (cookies.adminAuth !== 'true') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    */

    if (req.method === 'GET') {
        try {
            const settings = await kv.get<AdminSettings>('admin:settings');
            return res.status(200).json({
                settings: settings || DEFAULT_SETTINGS
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
            return res.status(200).json({
                settings: DEFAULT_SETTINGS
            });
        }
    }

    if (req.method === 'POST') {
        const { transportMultiplier, staffMultiplier } = req.body || {};

        // Validate inputs
        if (typeof transportMultiplier !== 'number' || transportMultiplier <= 0) {
            return res.status(400).json({ error: 'Invalid transport multiplier' });
        }

        if (typeof staffMultiplier !== 'number' || staffMultiplier <= 0) {
            return res.status(400).json({ error: 'Invalid staff multiplier' });
        }

        try {
            const settings: AdminSettings = {
                transportMultiplier,
                staffMultiplier,
            };

            await kv.set('admin:settings', JSON.stringify(settings));

            return res.status(200).json({
                success: true,
                settings
            });
        } catch (error) {
            console.error('Error saving settings:', error);
            return res.status(500).json({ error: 'Failed to save settings' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
