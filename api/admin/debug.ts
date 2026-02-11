import type { VercelRequest, VercelResponse } from '@vercel/node';

// Temporary debug endpoint to check environment variables
export default async function handler(req: VercelRequest, res: VercelResponse) {
    const hasAdminPassword = !!process.env.ADMIN_PASSWORD;
    const passwordLength = process.env.ADMIN_PASSWORD?.length || 0;
    const allEnvKeys = Object.keys(process.env).filter(key =>
        key.includes('ADMIN') || key.includes('PASSWORD')
    );

    return res.status(200).json({
        hasAdminPassword,
        passwordLength,
        matchingEnvKeys: allEnvKeys,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
    });
}
