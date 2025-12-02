import { NextResponse } from 'next/server';
import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const N8N_WEBHOOK_URL = 'https://n8n.alexoliveiraiaautomation.shop/webhook/40f7b59b-f948-4b3f-bd2c-2d831ba4c365';

export async function POST(request) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('[Stripe Webhook] Signature verification failed:', err.message);
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    console.log('[Stripe Webhook] Event received:', event.type);

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        console.log('[Stripe Webhook] Payment successful for session:', session.id);
        console.log('[Stripe Webhook] Metadata:', session.metadata);

        try {
            // Extract order data from session metadata
            const { userId, orderId, duration, music } = session.metadata;

            // Get pending order from localStorage (stored before redirect)
            // Since we're server-side, we need to retrieve order data differently
            // We'll send what we have in metadata to n8n

            const webhookPayload = {
                sessionId: session.id,
                userId: userId,
                orderId: orderId,
                userEmail: session.customer_email,
                duration: parseInt(duration),
                music: music,
                paymentStatus: 'paid',
                paidAt: new Date().toISOString(),
            };

            console.log('[Stripe Webhook] Calling n8n webhook with payload:', webhookPayload);

            // Call n8n webhook
            const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookPayload),
            });

            if (!n8nResponse.ok) {
                console.error('[Stripe Webhook] n8n webhook call failed:', await n8nResponse.text());
                throw new Error(`n8n webhook returned status ${n8nResponse.status}`);
            }

            const n8nResult = await n8nResponse.json();
            console.log('[Stripe Webhook] n8n webhook response:', n8nResult);

            return NextResponse.json({
                received: true,
                n8nTriggered: true,
                message: 'Video generation started'
            });

        } catch (error) {
            console.error('[Stripe Webhook] Error triggering n8n:', error);
            // Return 200 to Stripe even if n8n fails, to avoid retries
            return NextResponse.json({
                received: true,
                n8nTriggered: false,
                error: error.message
            });
        }
    }

    // Return 200 for other event types
    return NextResponse.json({ received: true });
}
