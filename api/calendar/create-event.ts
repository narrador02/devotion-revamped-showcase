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
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const calendarId = process.env.GOOGLE_CALENDAR_ID;
        if (!calendarId) {
            console.error('Missing GOOGLE_CALENDAR_ID');
            return res.status(500).json({ error: 'Calendar API not configured' });
        }

        const { eventName, description, startDate, endDate, clientEmail, location } = req.body;

        if (!eventName || !startDate || !endDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const token = await getGoogleToken();

        const eventData = {
            summary: eventName,
            location: location || '',
            description: description || '',
            start: {
                // If it's a full-day event vs timed (we'll just use explicit dates/times from frontend)
                date: startDate.includes('T') ? undefined : startDate,
                dateTime: startDate.includes('T') ? startDate : undefined,
                timeZone: 'Europe/Madrid' // Default timezone for Devotion Sim
            },
            end: {
                date: endDate.includes('T') ? undefined : endDate,
                dateTime: endDate.includes('T') ? endDate : undefined,
                timeZone: 'Europe/Madrid'
            },
            attendees: clientEmail ? [{ email: clientEmail }] : [],
            reminders: {
                useDefault: true
            }
        };

        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Google Calendar Insert Error:", err);
            return res.status(500).json({ error: 'Failed to create calendar event' });
        }

        const result = await response.json();

        return res.status(200).json({
            success: true,
            eventId: result.id,
            eventLink: result.htmlLink
        });

    } catch (error: any) {
        console.error("Calendar create-event error:", error);
        return res.status(500).json({ error: error.message });
    }
}
