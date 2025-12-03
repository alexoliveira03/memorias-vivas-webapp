"use client";
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const EXAMPLES = [
    {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/memorias-vivas-eb4c0.firebasestorage.app/o/uploads%2Fsession-1764749518323-3c3pe3cdy%2F1764768968287_0_1000062363.jpg?alt=media&token=43723370-d16b-449c-8991-7e42e285288a'
    },
    {
        type: 'video',
        url: 'https://cdn.shotstack.io/au/stage/ymu1cfr7y9/0c90fc8f-983d-440b-938a-fa93849f1f91.mp4'
    },
    {
        type: 'image',
        url: '/examples/example-baby.jpg'
    },
    {
        type: 'video',
        url: 'https://cdn.shotstack.io/au/stage/ymu1cfr7y9/2446b9f9-5dfb-4fc2-9b63-adbf46c93d6e.mp4'
    },
    {
        type: 'image',
        url: '/examples/example-family.jpg'
    },
    {
        type: 'video',
        url: 'https://cdn.shotstack.io/au/stage/ymu1cfr7y9/24f5c4ac-466f-4372-b651-a5bc60bb8082.mp4'
    }
];

// Duplicate for infinite loop
const ITEMS = [...EXAMPLES, ...EXAMPLES];

export default function ExamplesCarousel() {
    const scrollRef = useRef(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let scrollPosition = 0;
        const scrollSpeed = 0.5; // pixels per frame

        const animate = () => {
            scrollPosition += scrollSpeed;

            // Reset when we've scrolled through half (one set of examples)
            const cardWidth = 232; // w-52 (208px) + gap (24px)
            const maxScroll = EXAMPLES.length * cardWidth;

            if (scrollPosition >= maxScroll) {
                scrollPosition = 0;
            }

            scrollContainer.scrollLeft = scrollPosition;
            requestAnimationFrame(animate);
        };

        const animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return (
        <div className="relative w-full overflow-hidden">
            {/* Gradient overlays for edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            {/* Scrolling container */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-hidden py-8"
                style={{ scrollBehavior: 'auto' }}
            >
                {ITEMS.map((item, index) => (
                    <motion.div
                        key={`${item.type}-${index}`}
                        className="flex-shrink-0 w-52 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        {item.type === 'image' ? (
                            <div className="relative w-full h-full group">
                                <img
                                    src={item.url}
                                    alt="Example"
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        console.error('Failed to load image:', item.url);
                                    }}
                                />
                                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    ANTES
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full h-full">
                                <video
                                    src={item.url}
                                    className="w-full h-full object-contain"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    onError={(e) => {
                                        console.error('Failed to load video:', item.url);
                                    }}
                                />
                                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    DEPOIS
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
