import { Suspense, useEffect, useState, useRef } from 'react';

function DelayedFallback({ delayMs, fallback }) {
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
        const timerId = window.setTimeout(() => {
            setShowFallback(true);
        }, delayMs);

        return () => window.clearTimeout(timerId);
    }, [delayMs]);

    if (!showFallback) {
        return null;
    }

    return <div className="suspense-delayed-fallback">{fallback}</div>;
}

function ContentFadeIn({ children, onContentReady }) {
    const notifiedRef = useRef(false);
    useEffect(() => {
        if (!notifiedRef.current) {
            notifiedRef.current = true;
            onContentReady?.();
        }
    }, [onContentReady]);

    return <div className="suspense-content suspense-content-visible">{children}</div>;
}

export default function SuspenseWithFade({ fallback, children, delayMs = 250, onContentReady }) {
    return (
        <div className="suspense-fade-wrapper">
            <Suspense fallback={<DelayedFallback delayMs={delayMs} fallback={fallback} />}>
                <ContentFadeIn onContentReady={onContentReady}>{children}</ContentFadeIn>
            </Suspense>
        </div>
    );
}
