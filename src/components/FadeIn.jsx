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

    const delayClass = delay ? `delay-${delay}` : '';

    return (
        <div
            ref={domRef}
            className={`${className} ${isVisible ? `animate-blur-fade ${delayClass}` : 'opacity-0'}`}
        >
            {children}
        </div>
    );
}

export default FadeIn;
