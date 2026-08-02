import { lazy, Suspense } from 'react';
import ShaderReveal from './ShaderReveal';
import ScanReveal from '../ScanReveal';
import { getForcedIntro, getIntroSlowMo, DEFAULT_INTRO } from './introUtils';

// The default shader dissolve (and the small ScanReveal) ship eagerly so the
// cover paints on first commit; the experimental physics variants are only
// reachable via ?intro= and load on demand so they cost visitors nothing.
const LAZY_VARIANTS = {
    orbit: lazy(() => import('./OrbitIntro')),
    balls: lazy(() => import('./BallDropIntro')),
    flow: lazy(() => import('./FlowFieldIntro')),
};

const EAGER_VARIANTS = {
    shader: ShaderReveal,
    scan: ScanReveal,
};

function IntroReveal({ onComplete }) {
    const name = getForcedIntro() || DEFAULT_INTRO;
    if (name === 'none') return null;

    const Variant = LAZY_VARIANTS[name];
    if (!Variant) {
        const Eager = EAGER_VARIANTS[name] || EAGER_VARIANTS[DEFAULT_INTRO];
        return <Eager onComplete={onComplete} slow={getIntroSlowMo()} />;
    }

    return (
        // Fallback paints the same opaque cover the variant will mount with,
        // so the page never flashes uncovered while the lazy chunk loads
        <Suspense fallback={<div className="intro-overlay" aria-hidden="true"><div className="intro-cover" /></div>}>
            <Variant onComplete={onComplete} slow={getIntroSlowMo()} />
        </Suspense>
    );
}

export default IntroReveal;
