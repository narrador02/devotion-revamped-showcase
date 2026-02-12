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

        // Check API configuration
        const apiKey = process.env.OPENAI_API_KEY;
        const hasKey = !!apiKey;
        const keyLen = apiKey?.length || 0;

        if (!hasKey) {
            console.error('OPENAI_API_KEY missing');
            return res.status(500).json({
                error: 'OpenAI not configured',
                debug: {
                    env: process.env.VERCEL_ENV,
                    hasKey: false,
                    keyLen
                }
            });
        }

        const { clientName, locale = 'es' } = req.body || {};

        if (!clientName || typeof clientName !== 'string') {
            return res.status(400).json({ error: 'Client name is required' });
        }

        const isSpanish = locale === 'es' || locale.startsWith('es-');

        const systemPrompt = isSpanish
            ? `Eres un copywriter experto que trabaja para una empresa de simuladores de motociclismo de gama premium llamada DevotionSim. Tu tarea es escribir frases de captación breves, persuasivas y profesionales para propuestas comerciales. Las frases deben:
- Ser de máximo 2-3 oraciones
- Tener un tono profesional y premium
- Estar enfocadas en el valor para el negocio del cliente
- No incluir precios ni cifras
- No usar clichés genéricos`
            : `You are an expert copywriter working for a premium motorcycling simulator company called DevotionSim. Your task is to write short, persuasive, and professional hook phrases for business proposals. The phrases should:
- Be maximum 2-3 sentences
- Have a professional and premium tone
- Focus on the value for the client's business
- Not include prices or figures
- Avoid generic clichés`;

        const userPrompt = isSpanish
            ? `Genera una frase de captación personalizada para la empresa: "${clientName}". La frase debe hacer que quieran saber más sobre cómo nuestros simuladores pueden beneficiar su negocio.`
            : `Generate a personalized hook phrase for the company: "${clientName}". The phrase should make them want to learn more about how our simulators can benefit their business.`;

        // Use native fetch instead of OpenAI library to avoid package dependency issues
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 100,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OpenAI API Error:', errorData);
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const phrase = data.choices?.[0]?.message?.content?.trim();

        if (!phrase) {
            throw new Error('No phrase generated from OpenAI response');
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
