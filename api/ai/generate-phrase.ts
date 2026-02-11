import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify admin authentication
    const cookies = req.cookies || {};
    if (cookies.adminAuth !== 'true') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!process.env.OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY not configured in environment variables');
        return res.status(500).json({
            error: 'OpenAI not configured',
            details: 'OPENAI_API_KEY is missing from Vercel environment variables'
        });
    }

    const { clientName, locale = 'es' } = req.body || {};

    if (!clientName || typeof clientName !== 'string') {
        return res.status(400).json({ error: 'Client name is required' });
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

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

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            max_tokens: 100,
            temperature: 0.8,
        });

        const phrase = completion.choices[0]?.message?.content?.trim();

        if (!phrase) {
            throw new Error('No phrase generated');
        }

        return res.status(200).json({ phrase });
    } catch (error) {
        console.error('Error generating phrase:', error);
        return res.status(500).json({
            error: 'Failed to generate phrase',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
