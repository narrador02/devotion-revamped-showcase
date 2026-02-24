import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SquareClient, SquareEnvironment } from 'square';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const {
            proposalId,
            clientName,
            proposalType,
            total,
            lineItems,
            isDownPayment,
            downPaymentPercentage,
            lang,
            contact,
            redirectBase,
        } = req.body || {};

        // Validate
        if (!proposalId || !clientName || total == null || total <= 0 || !lineItems?.length) {
            return res.status(400).json({ error: 'Missing required fields (proposalId, clientName, total, lineItems)' });
        }

        const accessToken = (process.env.SQUARE_ACCESS_TOKEN || '').trim();
        const locationId = (process.env.SQUARE_LOCATION_ID || '').trim();

        if (!accessToken || !locationId) {
            return res.status(500).json({ error: 'Square API not configured' });
        }

        const environment = process.env.SQUARE_ENVIRONMENT === 'production'
            ? SquareEnvironment.Production
            : SquareEnvironment.Sandbox;

        const client = new SquareClient({
            token: accessToken,
            environment,
        });

        // Build Square order line items
        // If this is a down payment, collapse everything into a single descriptive line item
        let orderLineItems;
        if (isDownPayment && downPaymentPercentage) {
            const downPaymentAmount = Math.round(total * (downPaymentPercentage / 100));
            orderLineItems = [{
                name: `Reserva ${clientName} (${downPaymentPercentage}% del total)`,
                quantity: '1',
                basePriceMoney: {
                    amount: BigInt(Math.round(downPaymentAmount * 100)),
                    currency: 'EUR' as const,
                },
            }];
        } else {
            orderLineItems = lineItems.map((item: { name: string; quantity: number; unitPrice: number }) => ({
                name: item.name,
                quantity: String(item.quantity),
                basePriceMoney: {
                    amount: BigInt(Math.round(item.unitPrice * 100)),
                    currency: 'EUR' as const,
                },
            }));
        }

        // Determine redirect URL
        const baseUrl = redirectBase || (req.headers.origin || `https://${req.headers.host}`);
        const langParam = lang ? `?lang=${lang}` : '';
        const redirectUrl = isDownPayment
            ? `${baseUrl}/payment-success${langParam}`
            : `${baseUrl}/proposal/${proposalId}?payment=success`;

        const idempotencyKey = crypto.randomUUID();

        const response = await client.checkout.paymentLinks.create({
            idempotencyKey,
            order: {
                locationId: locationId,
                lineItems: orderLineItems,
                referenceId: proposalId,
            },
            checkoutOptions: {
                redirectUrl,
                askForShippingAddress: false,
            },
            paymentNote: `Proposal ${proposalId} - ${clientName} (${proposalType})`,
        });

        const paymentLink = response?.paymentLink;

        if (!paymentLink?.url) {
            console.error('Square response:', JSON.stringify(response, (_, v) => typeof v === 'bigint' ? v.toString() : v));
            return res.status(500).json({ error: 'Square did not return a payment link' });
        }

        // Store the payment link ID in KV for later webhook verification
        try {
            // @ts-ignore
            const { getKVClient } = await import('../_lib/kv-client.js');
            const kv = getKVClient();
            await kv.set(`proposal:${proposalId}:payment`, JSON.stringify({
                paymentLinkId: paymentLink.id,
                orderId: paymentLink.orderId,
                url: paymentLink.url,
                createdAt: new Date().toISOString(),
            }), { ex: 15 * 24 * 60 * 60 }); // 15 days TTL
        } catch (kvError) {
            console.error('Failed to store payment link in KV (non-critical):', kvError);
        }

        return res.status(200).json({
            success: true,
            checkoutUrl: paymentLink.url,
            paymentLinkId: paymentLink.id,
        });

    } catch (error: any) {
        // Enhanced error logging for debugging
        const tokenPrefix = process.env.SQUARE_ACCESS_TOKEN?.substring(0, 10) || 'NOT_SET';
        const envValue = process.env.SQUARE_ENVIRONMENT || 'NOT_SET';
        console.error('Square API Error:', {
            message: error.message,
            statusCode: error.statusCode,
            body: error.body,
            tokenPrefix: `${tokenPrefix}...`,
            environment: envValue,
        });
        return res.status(500).json({
            error: 'Failed to create payment link',
            details: error.body ? JSON.stringify(error.body) : (error.message || String(error)),
            debug: {
                tokenPrefix: `${tokenPrefix}...`,
                environment: envValue,
                locationId: process.env.SQUARE_LOCATION_ID?.substring(0, 6) + '...',
            }
        });
    }
}
