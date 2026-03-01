import { Suspense, useEffect, useState } from 'react';

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

export default function SuspenseWithFade({ fallback, children, delayMs = 250 }) {
    return (
        <div className="suspense-fade-wrapper">
            <Suspense fallback={<DelayedFallback delayMs={delayMs} fallback={fallback} />}>
                <div className="suspense-content">{children}</div>
            </Suspense>
        </div>
    );
}
