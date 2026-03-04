import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { action } = req.query;

    // 1. BLOB UPLOAD
    if (action === 'upload') {
        try {
            const body = req.body as HandleUploadBody;
            const jsonResponse = await handleUpload({
                body,
                request: req as unknown as Request,
                onBeforeGenerateToken: async (pathname) => {
                    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
                    const extension = pathname.toLowerCase().substring(pathname.lastIndexOf('.'));
                    if (!allowedExtensions.includes(extension)) {
                        throw new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.');
                    }
                    return {
                        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
                        maximumSizeInBytes: 5 * 1024 * 1024,
                    };
                },
                onUploadCompleted: async ({ blob }) => {
                    console.log('Upload completed:', blob.url);
                },
            });
            return res.status(200).json(jsonResponse);
        } catch (error) {
            console.error('Upload error:', error);
            return res.status(400).json({ error: error instanceof Error ? error.message : 'Upload failed' });
        }
    }

    // 2. AI PHRASE GENERATION
    if (action === 'generate-phrase') {
        // Verify admin authentication for AI processing
        const cookies = req.cookies || {};
        if (cookies.adminAuth !== 'true') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        try {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                return res.status(500).json({ error: 'Gemini API not configured' });
            }
            const { clientName, locale = 'es' } = req.body || {};
            if (!clientName) {
                return res.status(400).json({ error: 'Client name is required' });
            }

            const isSpanish = locale === 'es' || locale.startsWith('es-');
            const prompt = isSpanish
                ? `Eres un copywriter experto que trabaja para una empresa de simuladores de motociclismo de gama premium llamada DevotionSim. Genera una frase de captación personalizada para la empresa: "${clientName}". Max 2-3 oraciones. Tono pro.`
                : `You are an expert copywriter working for a premium motorcycling simulator company called DevotionSim. Generate a personalized hook phrase for: "${clientName}". Max 2-3 sentences. Pro tone.`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.8, maxOutputTokens: 150 }
                    })
                }
            );

            if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
            const data = await response.json();
            const phrase = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            return res.status(200).json({ phrase });
        } catch (error: any) {
            return res.status(500).json({ error: 'Failed to generate phrase', message: error.message });
        }
    }

    return res.status(400).json({ error: 'Invalid action' });
}
