import { NextResponse } from 'next/server';
import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    console.log('[Stripe API] Checkout request received');

    try {
        const body = await request.json();
        console.log('[Stripe API] Request body keys:', Object.keys(body));

        const { images, duration, currency, userEmail, userId, sessionId, orderId } = body;

        if (!images || !images.length) {
            console.error('[Stripe API] No images provided');
            return NextResponse.json({ error: 'No images provided' }, { status: 400 });
        }

        // Calculate price on server side to prevent tampering
        let unitPrice = 0;
        if (currency === 'BRL') {
            unitPrice = duration === 5 ? 2.90 : 5.90;
        } else {
            unitPrice = duration === 5 ? 0.90 : 1.80;
        }

        // Stripe expects amount in cents
        const unitAmount = Math.round(unitPrice * 100);
        console.log('[Stripe API] Calculated unit amount:', unitAmount, 'cents for', currency);

        console.log('[Stripe API] Creating Stripe session...');

        // Build session config
        const sessionConfig = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: `Video Generation (${images.length} images, ${duration}s each)`,
                            description: `AI Video Generation for ${images.length} photos. Duration: ${duration}s per image.`,
                            images: images.slice(0, 8),
                        },
                        unit_amount: unitAmount,
                    },
                    quantity: images.length,
                },
            ],
            mode: 'payment',
            allow_promotion_codes: true, // Enables promotion code field in Stripe Checkout
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?canceled=true`,
            metadata: {
                userId: userId || '',
                sessionId: sessionId || '',
                orderId: orderId || '',
                duration: String(duration),
            },
        };

        // Only add customer_email if userEmail exists
        if (userEmail) {
            sessionConfig.customer_email = userEmail;
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        console.log('[Stripe API] Session created successfully:', session.id);
        console.log('[Stripe API] Checkout URL:', session.url);

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('[Stripe API] Error:', error);
        console.error('[Stripe API] Error details:', error.message);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
