import type { VercelRequest, VercelResponse } from '@vercel/node';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Devotion0500'; // Fallback for debugging
const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 60 * 1000; // 1 minute

interface RateLimitData {
  count: number;
  resetAt: number;
}

async function getRateLimitData(ip: string): Promise<RateLimitData | null> {
  try {
    // Dynamically import KV to make it optional
    const { kv } = await import('@vercel/kv');
    return await kv.get<RateLimitData>(`ratelimit:${ip}`);
  } catch (error) {
    console.warn('KV not available for rate limiting:', error);
    return null;
  }
}

async function setRateLimitData(ip: string, data: RateLimitData): Promise<void> {
  try {
    // Dynamically import KV to make it optional
    const { kv } = await import('@vercel/kv');
    await kv.set(`ratelimit:${ip}`, data, { ex: 300 }); // 5 min TTL
  } catch (error) {
    console.warn('KV not available for rate limiting:', error);
    // Silently fail rate limiting if KV is not available
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD environment variable not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'unknown';

  // Check rate limit
  const rateLimitData = await getRateLimitData(ip);
  if (rateLimitData) {
    if (rateLimitData.count >= MAX_ATTEMPTS && Date.now() < rateLimitData.resetAt) {
      const remainingSeconds = Math.ceil((rateLimitData.resetAt - Date.now()) / 1000);
      return res.status(429).json({
        error: 'Too many attempts',
        code: 'RATE_LIMITED',
        retryAfter: remainingSeconds
      });
    }
  }

  const { password } = req.body || {};

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password required' });
  }

  // Add artificial delay to slow down brute force attacks
  await new Promise(resolve => setTimeout(resolve, 500));

  if (password !== ADMIN_PASSWORD) {
    // Update rate limit counter
    const newCount = (rateLimitData?.count || 0) + 1;
    await setRateLimitData(ip, {
      count: newCount,
      resetAt: Date.now() + COOLDOWN_MS
    });

    return res.status(401).json({
      error: 'Invalid password',
      code: 'INVALID_PASSWORD',
      attemptsRemaining: Math.max(0, MAX_ATTEMPTS - newCount)
    });
  }

  // Clear rate limit on success
  if (rateLimitData) {
    await setRateLimitData(ip, { count: 0, resetAt: 0 });
  }

  // Set authentication cookie
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  const cookieOptions = [
    `adminAuth=true`,
    `Max-Age=${maxAge}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Strict`,
    process.env.NODE_ENV === 'production' ? 'Secure' : ''
  ].filter(Boolean).join('; ');

  res.setHeader('Set-Cookie', cookieOptions);
  return res.status(200).json({ success: true });
}
