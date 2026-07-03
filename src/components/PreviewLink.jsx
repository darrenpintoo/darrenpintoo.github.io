import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Link preview data - can be extended with more URLs
const linkPreviews = {
    'https://www.cmu.edu/': {
        title: 'Carnegie Mellon University',
        description: 'A private research university in Pittsburgh, Pennsylvania. CMU is known for its programs in computer science, engineering, and the arts.',
        image: '/images/previews/cmu-preview.jpg'
    },
    'https://biorobotics.org/': {
        title: 'CMU Biorobotics Lab',
        description: 'Research lab at Carnegie Mellon developing innovative robots that can locomote, manipulate, and perceive in complex environments.',
        image: '/images/previews/biorobotics-preview.jpg'
    },
    'https://www.cadreforensics.com/': {
        title: 'Cadre Research',
        description: 'Technology company specializing in advanced forensic analysis tools and high-performance computing solutions.',
        image: '/images/previews/cadre-preview.png'
    },
    'https://www.firstinspires.org/robotics/ftc': {
        title: 'FIRST Tech Challenge',
        description: 'A robotics competition where students design, build, and program robots to compete in an alliance format.',
        image: '/images/previews/ftc-preview.jpg'
    },
    'https://www.roblox.com/games/114162328499203/Find-the-Toons': {
        title: 'Find the Toons',
        description: 'A Roblox game with over 175,000 players and 6 million+ play sessions, featuring an engaging treasure hunt experience.',
        image: '/images/previews/roblox-preview.jpg'
    },
    'https://www.ibm.com/': {
        title: 'IBM',
        description: 'IBM is a leading technology and consulting company, with research and innovation in AI, cloud, quantum computing, and enterprise software.',
        image: '/images/previews/ibm-preview.jpg'
    }
};

const OPEN_DELAY_MS = 300;
const FADE_OUT_MS = 200; // must match the .link-preview opacity transition in index.css

// Hover previews only make sense with a real pointer; on touch the
// mouseenter/mouseleave emulation misfires and fights with tap-to-navigate.
const supportsHover = typeof window !== 'undefined'
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const preloadedImages = new Set();
function preloadImage(src) {
    if (!src || preloadedImages.has(src)) return;
    preloadedImages.add(src);
    const img = new Image();
    img.src = src;
}

function PreviewLink({ href, children, ...props }) {
    const [showPreview, setShowPreview] = useState(false);
    const [renderPreview, setRenderPreview] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [placement, setPlacement] = useState('above');
    const linkRef = useRef(null);
    const previewRef = useRef(null);
    const timeoutRef = useRef(null);
    const fadeOutTimeoutRef = useRef(null);

    const normalizedHref = href?.endsWith('/') ? href : href + '/';
    let preview = linkPreviews[normalizedHref] || linkPreviews[href];

    const isInternal = href?.startsWith('/') || href?.includes(window.location.host);
    if (!preview && isInternal) {
        preview = {
            title: 'Personal Webpage',
            description: 'Navigate to another page on this site.',
            image: null,
            isInternal: true
        };
    }

    const computePosition = (linkRect, previewEl) => {
        const PADDING = 16;
        const GAP = 14;
        const previewWidth = previewEl ? previewEl.offsetWidth : 320;
        const previewHeight = previewEl ? previewEl.offsetHeight : 280;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const spaceAbove = linkRect.top;
        const spaceBelow = vh - linkRect.bottom;
        const verticalPlacement = spaceAbove >= previewHeight + GAP + PADDING
            ? 'above'
            : spaceBelow >= previewHeight + GAP + PADDING
                ? 'below'
                : spaceAbove > spaceBelow ? 'above' : 'below';

        let y;
        if (verticalPlacement === 'above') {
            y = linkRect.top - GAP - previewHeight;
        } else {
            y = linkRect.bottom + GAP;
        }
        y = Math.max(PADDING, Math.min(y, vh - previewHeight - PADDING));

        let x = linkRect.left + linkRect.width / 2 - previewWidth / 2;
        x = Math.max(PADDING, Math.min(x, vw - previewWidth - PADDING));

        return { x, y, placement: verticalPlacement };
    };

    const clearTimers = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (fadeOutTimeoutRef.current) {
            clearTimeout(fadeOutTimeoutRef.current);
            fadeOutTimeoutRef.current = null;
        }
    };

    const updatePosition = () => {
        if (!linkRef.current) return;
        const rect = linkRef.current.getBoundingClientRect();
        const { x, y, placement: p } = computePosition(rect, previewRef.current);
        setPosition({ x, y });
        setPlacement(p);
    };

    const handleMouseEnter = () => {
        if (!preview) return;

        clearTimers();
        preloadImage(preview.image);

        // Already mounted (re-entering during fade-out, or returning from the
        // preview card itself): setRenderPreview(true) would be a no-op and the
        // mount effect wouldn't re-fire, so show it again directly.
        if (renderPreview) {
            updatePosition();
            setShowPreview(true);
            return;
        }

        timeoutRef.current = setTimeout(() => {
            updatePosition();
            setRenderPreview(true);
        }, OPEN_DELAY_MS);
    };

    const handleMouseLeave = () => {
        clearTimers();

        setShowPreview(false);
        fadeOutTimeoutRef.current = setTimeout(() => {
            setRenderPreview(false);
        }, FADE_OUT_MS);
    };

    useEffect(() => {
        if (!renderPreview || !linkRef.current) return;

        // Double rAF: first frame lets the browser paint the initial (hidden) state,
        // second frame triggers the transition to visible.
        let id1, id2;
        id1 = requestAnimationFrame(() => {
            updatePosition();
            id2 = requestAnimationFrame(() => {
                setShowPreview(true);
            });
        });

        return () => {
            cancelAnimationFrame(id1);
            cancelAnimationFrame(id2);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderPreview]);

    // The preview is position: fixed, so scrolling detaches it from the link.
    // Dismiss on scroll/resize (like Wikipedia) and on Escape.
    useEffect(() => {
        if (!renderPreview) return;

        const dismiss = () => {
            clearTimers();
            setShowPreview(false);
            fadeOutTimeoutRef.current = setTimeout(() => {
                setRenderPreview(false);
            }, FADE_OUT_MS);
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') dismiss();
        };

        window.addEventListener('scroll', dismiss, { passive: true, capture: true });
        window.addEventListener('resize', dismiss);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('scroll', dismiss, { capture: true });
            window.removeEventListener('resize', dismiss);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [renderPreview]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current);
        };
    }, []);

    if (!preview || !supportsHover) {
        return (
            <a href={href} {...props}>
                {children}
            </a>
        );
    }

    return (
        <>
            <a
                ref={linkRef}
                href={href}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleMouseEnter}
                onBlur={handleMouseLeave}
                {...props}
            >
                {children}
            </a>
            {renderPreview && createPortal(
                <div
                    ref={previewRef}
                    role="tooltip"
                    className={`link-preview link-preview-${placement} ${preview.isInternal ? 'internal-preview' : ''} ${showPreview ? 'is-visible' : 'is-fading'}`}
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`
                    }}
                    onMouseEnter={() => {
                        if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current);
                        setShowPreview(true);
                    }}
                    onMouseLeave={handleMouseLeave}
                >
                    {preview.image && (
                        <div className="link-preview-image">
                            <img src={preview.image} alt={`Preview for ${preview.title}`} />
                        </div>
                    )}
                    <div className="link-preview-content">
                        {preview.isInternal && (
                            <div className="internal-indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                Internal Link
                            </div>
                        )}
                        <div className="link-preview-title">{preview.title}</div>
                        <div className="link-preview-description">{preview.description}</div>
                        <div className="link-preview-url">{new URL(href, window.location.origin).hostname}</div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default PreviewLink;
