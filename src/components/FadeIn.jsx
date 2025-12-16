import { useState, useEffect, useRef } from 'react';

function FadeIn({ children, delay = 0, className = '', visible = null }) {
    const [isInternalVisible, setIsInternalVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        // If controlled externally (visible prop is not null), skip internal observer
        if (visible !== null) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsInternalVisible(true);
                }
            });
        }, { threshold: 0.1 });

        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [visible]);

    // Determine final visibility: external prop takes precedence if provided, otherwise internal state
    const isVisible = visible !== null ? visible : isInternalVisible;

    // If delay is provided, use it as seconds
    const style = delay ? { animationDelay: `${delay}s` } : {};

    return (
        <div
            ref={domRef}
            className={`${className} ${isVisible ? 'animate-blur-fade' : 'opacity-0'}`}
            style={style}
        >
            {children}
        </div>
    );
}

export default FadeIn;
