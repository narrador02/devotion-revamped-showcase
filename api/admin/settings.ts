import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

interface AdminSettings {
    transportMultiplier: number;
    staffMultiplier: number;
    simulatorPrice: number;
    simulatorPriceVIP: number;
    purchasePriceTimeAttack: number;
    purchasePriceSlady: number;
    purchasePriceTopGun: number;
    downPaymentPercentage: number;
}

const DEFAULT_SETTINGS: AdminSettings = {
    transportMultiplier: 1.6,
    staffMultiplier: 280,
    simulatorPrice: 750,
    simulatorPriceVIP: 550,
    purchasePriceTimeAttack: 23000,
    purchasePriceSlady: 26000,
    purchasePriceTopGun: 30000,
    downPaymentPercentage: 30, // Default 30% reservation down payment
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
            // Merge with defaults to ensure new fields are always present
            return res.status(200).json({
                settings: { ...DEFAULT_SETTINGS, ...(settings || {}) }
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
            return res.status(200).json({
                settings: DEFAULT_SETTINGS
            });
        }
    }

    if (req.method === 'POST') {
        const body = req.body || {};

        // Validate rental inputs
        if (typeof body.transportMultiplier !== 'number' || body.transportMultiplier <= 0) {
            return res.status(400).json({ error: 'Invalid transport multiplier' });
        }
        if (typeof body.staffMultiplier !== 'number' || body.staffMultiplier <= 0) {
            return res.status(400).json({ error: 'Invalid staff multiplier' });
        }
        if (typeof body.simulatorPrice !== 'number' || body.simulatorPrice <= 0) {
            return res.status(400).json({ error: 'Invalid simulator price' });
        }
        if (typeof body.simulatorPriceVIP !== 'number' || body.simulatorPriceVIP <= 0) {
            return res.status(400).json({ error: 'Invalid VIP simulator price' });
        }

        try {
            // Load existing settings to merge, ensuring new fields get defaults
            let existing: AdminSettings = DEFAULT_SETTINGS;
            try {
                const stored = await kv.get<AdminSettings>('admin:settings');
                if (stored) existing = { ...DEFAULT_SETTINGS, ...stored };
            } catch { /* use defaults */ }

            const settings: AdminSettings = {
                transportMultiplier: body.transportMultiplier,
                staffMultiplier: body.staffMultiplier,
                simulatorPrice: body.simulatorPrice,
                simulatorPriceVIP: body.simulatorPriceVIP,
                purchasePriceTimeAttack: typeof body.purchasePriceTimeAttack === 'number' ? body.purchasePriceTimeAttack : existing.purchasePriceTimeAttack,
                purchasePriceSlady: typeof body.purchasePriceSlady === 'number' ? body.purchasePriceSlady : existing.purchasePriceSlady,
                purchasePriceTopGun: typeof body.purchasePriceTopGun === 'number' ? body.purchasePriceTopGun : existing.purchasePriceTopGun,
                downPaymentPercentage: typeof body.downPaymentPercentage === 'number' ? body.downPaymentPercentage : existing.downPaymentPercentage,
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
