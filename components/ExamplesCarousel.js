"use client";
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const EXAMPLES = [
    {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/memorias-vivas-eb4c0.firebasestorage.app/o/uploads%2FtlK1akL5JzYvM5tqBP8fiuiST0c2%2F1764870568973_1_e5cf5aff-07c0-41a3-af06-80cb7dc5b2c6.jpeg?alt=media&token=0088b7ce-f8d4-4782-ba67-25bddaf8c95a'
    },
    {
        type: 'video',
        url: '/examples/example1.mp4'
    },
    {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/memorias-vivas-eb4c0.firebasestorage.app/o/uploads%2FtlK1akL5JzYvM5tqBP8fiuiST0c2%2F1764869559856_4_IMG_6677.jpeg?alt=media&token=0b4f0aef-73c3-49f0-b1c3-3b4d02bf7e9c'
    },
    {
        type: 'video',
        url: '/examples/example2.mp4'
    },
    {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/memorias-vivas-eb4c0.firebasestorage.app/o/uploads%2FtlK1akL5JzYvM5tqBP8fiuiST0c2%2F1764869559940_5_IMG_6680.jpeg?alt=media&token=e12e6cf0-90ac-4f73-95d2-e8a352085505'
    },
    {
        type: 'video',
        url: '/examples/example3.mp4'
    },
    {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/memorias-vivas-eb4c0.firebasestorage.app/o/uploads%2FtlK1akL5JzYvM5tqBP8fiuiST0c2%2F1764869559591_0_IMG_6682.jpeg?alt=media&token=76d89850-973b-4c20-9daf-c8296718429e'
    },
    {
        type: 'video',
        url: '/examples/example4.mp4'
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
