import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

// Get Google access token using Service Account credentials
async function getGoogleToken(): Promise<string> {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
        throw new Error('Missing Google Credentials in env');
    }

    // Handle escaped newlines in env vars
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

    const signature = crypto
        .createSign('RSA-SHA256')
        .update(unsignedToken)
        .sign(privateKey, 'base64url');

    const jwt = `${unsignedToken}.${signature}`;

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to get Google Token: ${errText}`);
    }

    const data = await response.json();
    return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const calendarId = process.env.GOOGLE_CALENDAR_ID;
        if (!calendarId) {
            // Return empty list safely if not configured yet
            return res.status(200).json({ busy: [] });
        }

        const token = await getGoogleToken();

        // Get events for the next 6 months to avoid fetching everything
        const timeMin = new Date().toISOString();
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + 6);
        const timeMax = futureDate.toISOString();

        const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
        url.searchParams.append('timeMin', timeMin);
        url.searchParams.append('timeMax', timeMax);
        url.searchParams.append('singleEvents', 'true'); // Expands recurring events
        url.searchParams.append('orderBy', 'startTime');

        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Google Calendar Error:", err);
            return res.status(500).json({ error: 'Failed to fetch calendar events' });
        }

        const data = await response.json();
        const busyDates: Array<{ start: string, end: string }> = [];

        if (data.items) {
            data.items.forEach((event: any) => {
                // If the event spans whole days (date) vs explicit times (dateTime)
                const start = event.start.dateTime || event.start.date;
                const end = event.end.dateTime || event.end.date;

                if (start && end) {
                    busyDates.push({ start, end });
                }
            });
        }

        return res.status(200).json({ busy: busyDates });

    } catch (error: any) {
        console.error("Calendar availability error:", error);
        return res.status(500).json({ error: error.message });
    }
}
