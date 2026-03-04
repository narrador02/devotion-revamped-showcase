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
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) return res.status(500).json({ error: 'Google Calendar not configured' });

    // 1. Get Availability (GET)
    if (req.method === 'GET') {
        try {
            const token = await getGoogleToken();
            const timeMin = new Date().toISOString();
            const futureDate = new Date();
            futureDate.setMonth(futureDate.getMonth() + 6);
            const timeMax = futureDate.toISOString();

            const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
            url.searchParams.append('timeMin', timeMin);
            url.searchParams.append('timeMax', timeMax);
            url.searchParams.append('singleEvents', 'true');
            url.searchParams.append('orderBy', 'startTime');

            const response = await fetch(url.toString(), { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            const busy = data.items?.map((event: any) => ({
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.end.date
            })) || [];

            return res.status(200).json({ busy });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 2. Create Event (POST)
    if (req.method === 'POST') {
        try {
            const { eventName, description, startDate, endDate, location } = req.body;
            const token = await getGoogleToken();
            const eventData = {
                summary: eventName,
                location: location || '',
                description: description || '',
                start: { dateTime: startDate.includes('T') ? startDate : undefined, date: startDate.includes('T') ? undefined : startDate, timeZone: 'Europe/Madrid' },
                end: { dateTime: endDate.includes('T') ? endDate : undefined, date: endDate.includes('T') ? undefined : endDate, timeZone: 'Europe/Madrid' },
            };

            const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });
            const result = await response.json();
            return res.status(200).json({ success: true, eventId: result.id });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
