import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SquareClient, SquareEnvironment, WebhooksHelper } from 'square';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { action } = req.query;

    // 1. Create Payment Link (POST)
    if (action === 'create-payment-link' && req.method === 'POST') {
        try {
            const { proposalId, clientName, total, lineItems, isDownPayment, downPaymentPercentage, lang, redirectBase } = req.body || {};
            const accessToken = (process.env.SQUARE_ACCESS_TOKEN || '').trim();
            const locationId = (process.env.SQUARE_LOCATION_ID || '').trim();
            if (!accessToken || !locationId) return res.status(500).json({ error: 'Square API not configured' });

            const client = new SquareClient({
                token: accessToken,
                environment: process.env.SQUARE_ENVIRONMENT === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
            });

            let orderLineItems = isDownPayment ? [{
                name: `Reserva ${clientName} (${downPaymentPercentage}% del total)`,
                quantity: '1',
                basePriceMoney: { amount: BigInt(Math.round(total * (downPaymentPercentage / 100) * 100)), currency: 'EUR' as const },
            }] : lineItems.map((item: any) => ({
                name: item.name,
                quantity: String(item.quantity),
                basePriceMoney: { amount: BigInt(Math.round(item.unitPrice * 100)), currency: 'EUR' as const },
            }));

            const baseUrl = redirectBase || (req.headers.origin || `https://${req.headers.host}`);
            const redirectUrl = isDownPayment ? `${baseUrl}/payment-success${lang ? `?lang=${lang}` : ''}` : `${baseUrl}/proposal/${proposalId}?payment=success`;

            const response = await client.checkout.paymentLinks.create({
                idempotencyKey: crypto.randomUUID(),
                order: { locationId, lineItems: orderLineItems, referenceId: proposalId },
                checkoutOptions: { redirectUrl, askForShippingAddress: false },
            });

            if (!response.paymentLink?.url) throw new Error('Square did not return a link');

            try {
                const { getKVClient } = await import('../_lib/kv-client.js');
                const kv = getKVClient();
                await kv.set(`proposal:${proposalId}:payment`, JSON.stringify({
                    paymentLinkId: response.paymentLink.id,
                    orderId: response.paymentLink.orderId,
                    url: response.paymentLink.url,
                }), { ex: 15 * 24 * 60 * 60 });
            } catch (e) { }

            return res.status(200).json({ success: true, checkoutUrl: response.paymentLink.url });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 2. Webhook (POST) - Usually hit without an 'action' param if pointed directly to /api/square
    // We check if it's a webhook by signature or lack of action
    if (req.method === 'POST' && (!action || action === 'webhook')) {
        try {
            const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
            if (signatureKey) {
                const signature = req.headers['x-square-hmacsha256-signature'] as string;
                if (!WebhooksHelper.verifySignature({
                    requestBody: JSON.stringify(req.body),
                    signatureHeader: signature,
                    signatureKey,
                    notificationUrl: `https://${req.headers.host}/api/square`,
                })) return res.status(403).json({ error: 'Invalid signature' });
            }

            const event = req.body;
            if (event?.type === 'payment.completed' || event?.type === 'payment.updated') {
                const orderId = event?.data?.object?.payment?.order_id;
                if (orderId) {
                    const { getKVClient } = await import('../_lib/kv-client.js');
                    const kv = getKVClient();
                    const keys = await kv.keys('proposal:*:payment');
                    for (const key of keys) {
                        const paymentData = await kv.get(key);
                        if (paymentData && (typeof paymentData === 'string' ? JSON.parse(paymentData) : paymentData).orderId === orderId) {
                            const proposalId = key.replace('proposal:', '').replace(':payment', '');
                            await kv.set(`proposal:${proposalId}:paid`, JSON.stringify({ paid: true, paidAt: new Date().toISOString() }), { ex: 90 * 24 * 60 * 60 });
                            break;
                        }
                    }
                }
            }
            return res.status(200).json({ received: true });
        } catch (error: any) {
            return res.status(200).json({ received: true, error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
