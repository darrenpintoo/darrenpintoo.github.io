import { useState, useEffect, useRef } from 'react';

function FadeIn({ children, delay = 0, className = '' }) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
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
    }, []);

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
