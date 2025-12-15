import { useState, useEffect, useRef } from 'react';

// Set this to true to enable infinite scroll on all pages
const ENABLE_INFINITE_SCROLL = false;

function PageLayout({ children, enableInfiniteScroll = ENABLE_INFINITE_SCROLL }) {
    const [infiniteLines, setInfiniteLines] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!enableInfiniteScroll) return;

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                        const baseText = "engineer • researcher • builder • ";
                        const text = baseText.repeat(8);
                        setInfiniteLines(prev => [...prev, text, text]);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [enableInfiniteScroll]);

    return (
        <>
            <div ref={containerRef}>
                {children}
            </div>
            {enableInfiniteScroll && (
                <div className="infinite-scroll-container">
                    {infiniteLines.map((line, i) => (
                        <p key={i} className="infinite-text-line">{line}</p>
                    ))}
                </div>
            )}
        </>
    );
}

export default PageLayout;
