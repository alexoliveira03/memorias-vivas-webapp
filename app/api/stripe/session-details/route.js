import { NextResponse } from 'next/server';
import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        console.log('[Session Details] Retrieving session:', sessionId);

        // Retrieve session with expanded details to get discount information
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['total_details.breakdown']
        });

        console.log('[Session Details] Session retrieved:', session.id);

        // Extract coupon/discount information
        const discounts = session.total_details?.breakdown?.discounts || [];
        const hasCoupon = discounts.length > 0;
        const couponCode = hasCoupon ? discounts[0]?.discount?.coupon?.id || '' : '';

        console.log('[Session Details] Coupon detected:', hasCoupon, couponCode);

        return NextResponse.json({
            sessionId: session.id,
            couponUsed: hasCoupon,
            couponCode: couponCode,
            customerEmail: session.customer_email,
            paymentStatus: session.payment_status
        });

    } catch (error) {
        console.error('[Session Details] Error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to retrieve session details'
        }, { status: 500 });
    }
}
