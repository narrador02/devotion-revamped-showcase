import { createClient } from '@vercel/kv';

export function getKVClient() {
    // 1. Try standard KV env vars (Vercel automatic injection)
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        return createClient({
            url: process.env.KV_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN
        });
    }

    // 2. Fallback: Try to derive from REDIS_URL (Custom/Integration injection)
    if (process.env.REDIS_URL) {
        try {
            console.log('Attempting to configure KV client from REDIS_URL...');

            // Format: redis://[user]:[password]@[host]:[port]
            const url = new URL(process.env.REDIS_URL);

            const host = url.hostname;
            const password = url.password;

            // Construct REST URL (Upstash supports https://<host>)
            const restUrl = `https://${host}`;

            if (host && password) {
                console.log(`Auto-configured KV client for host: ${host}`);
                return createClient({
                    url: restUrl,
                    token: password
                });
            }
        } catch (error) {
            console.error('Failed to parse REDIS_URL for KV configuration:', error);
        }
    }

    throw new Error(
        'Missing Vercel KV configuration. Please ensure KV_REST_API_URL/KV_REST_API_TOKEN are set, or REDIS_URL is valid.'
    );
}
