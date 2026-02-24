import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verify admin authentication
        const cookies = req.cookies || {};
        if (cookies.adminAuth !== 'true') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check API configuration — uses free Google Gemini API
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('GEMINI_API_KEY missing');
            return res.status(500).json({
                error: 'Gemini API not configured',
                debug: {
                    env: process.env.VERCEL_ENV,
                    hasKey: false,
                }
            });
        }

        const { clientName, locale = 'es' } = req.body || {};

        if (!clientName || typeof clientName !== 'string') {
            return res.status(400).json({ error: 'Client name is required' });
        }

        const isSpanish = locale === 'es' || locale.startsWith('es-');

        const prompt = isSpanish
            ? `Eres un copywriter experto que trabaja para una empresa de simuladores de motociclismo de gama premium llamada DevotionSim. Genera una frase de captación personalizada para la empresa: "${clientName}".

Reglas:
- Máximo 2-3 oraciones
- Tono profesional y premium
- Enfocada en el valor para el negocio del cliente
- No incluir precios ni cifras
- No usar clichés genéricos
- La frase debe hacer que quieran saber más sobre cómo nuestros simuladores pueden beneficiar su negocio.

Responde SOLO con la frase, sin comillas ni explicaciones adicionales.`
            : `You are an expert copywriter working for a premium motorcycling simulator company called DevotionSim. Generate a personalized hook phrase for the company: "${clientName}".

Rules:
- Maximum 2-3 sentences
- Professional and premium tone
- Focus on the value for the client's business
- Do not include prices or figures
- Avoid generic clichés
- The phrase should make them want to learn more about how our simulators can benefit their business.

Respond ONLY with the phrase, no quotes or additional explanations.`;

        // Call Google Gemini API (free tier: 15 RPM, 1M tokens/day)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 150,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API Error:', errorData);

            if (response.status === 429) {
                return res.status(429).json({
                    error: 'Gemini Rate Limit Exceeded',
                    details: 'Too many requests — please wait a moment',
                });
            }

            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const phrase = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!phrase) {
            throw new Error('No phrase generated from Gemini response');
        }

        return res.status(200).json({ phrase });

    } catch (error: any) {
        console.error('Handler critical error:', error);
        return res.status(500).json({
            error: 'Failed to generate phrase',
            message: error.message || 'Unknown error',
            type: error.constructor.name
        });
    }
}
