import type { VercelRequest, VercelResponse } from '@vercel/node';
import { WebhooksHelper } from 'square';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Optional: Verify webhook signature if SQUARE_WEBHOOK_SIGNATURE_KEY is set
        const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
        if (signatureKey) {
            const signature = req.headers['x-square-hmacsha256-signature'] as string;
            const notificationUrl = `https://${req.headers.host}/api/square/webhook`;
            const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

            const isValid = WebhooksHelper.verifySignature({
                requestBody: body,
                signatureHeader: signature,
                signatureKey,
                notificationUrl,
            });

            if (!isValid) {
                console.error('Invalid webhook signature');
                return res.status(403).json({ error: 'Invalid signature' });
            }
        }

        const event = req.body;
        const eventType = event?.type;

        console.log(`Square webhook received: ${eventType}`);

        if (eventType === 'payment.completed' || eventType === 'payment.updated') {
            const payment = event?.data?.object?.payment;
            const orderId = payment?.order_id;

            if (orderId) {
                try {
                    // @ts-ignore
                    const { getKVClient } = await import('../_lib/kv-client.js');
                    const kv = getKVClient();

                    // Find the proposal linked to this order
                    // We search through recent proposals to find the matching order
                    const keys = await kv.keys('proposal:*:payment');
                    for (const key of keys) {
                        const paymentData = await kv.get(key);
                        if (paymentData) {
                            const parsed = typeof paymentData === 'string' ? JSON.parse(paymentData) : paymentData;
                            if (parsed.orderId === orderId) {
                                const proposalId = key.replace('proposal:', '').replace(':payment', '');
                                await kv.set(`proposal:${proposalId}:paid`, JSON.stringify({
                                    paid: true,
                                    paymentId: payment.id,
                                    amount: payment.amount_money,
                                    paidAt: new Date().toISOString(),
                                }), { ex: 90 * 24 * 60 * 60 }); // 90 day TTL

                                console.log(`Payment confirmed for proposal ${proposalId}`);

                                // Optionally send notification email via Formspree
                                try {
                                    await fetch("https://formspree.io/f/xgvrveqe", {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                                        body: JSON.stringify({
                                            subject: `Payment Confirmed: Proposal ${proposalId}`,
                                            _subject: `💰 Payment Confirmed for Proposal ${proposalId}`,
                                            proposalId,
                                            paymentId: payment.id,
                                            amount: `${Number(payment.amount_money?.amount || 0) / 100}€`,
                                            status: payment.status,
                                        }),
                                    });
                                } catch (emailErr) {
                                    console.error('Failed to send payment notification email:', emailErr);
                                }

                                break;
                            }
                        }
                    }
                } catch (kvError) {
                    console.error('KV error during webhook processing:', kvError);
                }
            }
        }

        // Always return 200 to acknowledge webhook receipt
        return res.status(200).json({ received: true });

    } catch (error: any) {
        console.error('Webhook error:', error);
        // Still return 200 to prevent Square from retrying
        return res.status(200).json({ received: true, error: error.message });
    }
}
