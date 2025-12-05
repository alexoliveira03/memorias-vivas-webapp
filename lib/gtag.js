// Google Analytics 4 - Event tracking utilities

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Custom events for Memorias Vivas
export const trackPhotoUpload = (photoCount) => {
    event({
        action: 'photo_upload',
        category: 'engagement',
        label: `${photoCount} photos`,
        value: photoCount,
    });
};

export const trackFreeTrialUsed = (photoCount) => {
    event({
        action: 'free_trial_used',
        category: 'conversion',
        label: `${photoCount} photos`,
        value: photoCount,
    });
};

export const trackCheckoutStarted = (amount, currency, photoCount) => {
    event({
        action: 'begin_checkout',
        category: 'ecommerce',
        label: `${photoCount} photos - ${currency} ${amount}`,
        value: parseFloat(amount),
    });
};

export const trackPaymentCompleted = (amount, currency, photoCount, transactionId) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'purchase', {
            transaction_id: transactionId,
            value: parseFloat(amount),
            currency: currency,
            items: [
                {
                    item_id: 'video_generation',
                    item_name: 'AI Video Generation',
                    quantity: photoCount,
                    price: parseFloat(amount) / photoCount,
                }
            ]
        });
    }
};

export const trackLogin = (method = 'google') => {
    event({
        action: 'login',
        category: 'engagement',
        label: method,
    });
};
