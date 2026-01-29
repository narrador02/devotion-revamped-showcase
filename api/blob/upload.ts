import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Verify admin authentication
    const cookies = req.cookies || {};
    if (cookies.adminAuth !== 'true') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const body = req.body as HandleUploadBody;

        const jsonResponse = await handleUpload({
            body,
            request: req as unknown as Request,
            onBeforeGenerateToken: async (pathname) => {
                // Validate file type
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
                const extension = pathname.toLowerCase().substring(pathname.lastIndexOf('.'));

                if (!allowedExtensions.includes(extension)) {
                    throw new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.');
                }

                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
                    maximumSizeInBytes: 5 * 1024 * 1024, // 5MB max
                };
            },
            onUploadCompleted: async ({ blob }) => {
                console.log('Upload completed:', blob.url);
            },
        });

        return res.status(200).json(jsonResponse);
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(400).json({
            error: error instanceof Error ? error.message : 'Upload failed'
        });
    }
}
