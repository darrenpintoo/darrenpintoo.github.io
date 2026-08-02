import { lazy, Suspense } from 'react';
import ScanReveal from '../ScanReveal';
import { getForcedIntro, getIntroSlowMo, DEFAULT_INTRO } from './introUtils';

// ScanReveal is the default and ships eagerly; the experimental variants are
// only reachable via ?intro= and load on demand so they cost visitors nothing.
const VARIANTS = {
    shader: lazy(() => import('./ShaderReveal')),
    orbit: lazy(() => import('./OrbitIntro')),
    balls: lazy(() => import('./BallDropIntro')),
    flow: lazy(() => import('./FlowFieldIntro')),
    scan: ScanReveal,
};

function IntroReveal({ onComplete }) {
    const name = getForcedIntro() || DEFAULT_INTRO;
    if (name === 'none') return null;
    const Variant = VARIANTS[name] || VARIANTS[DEFAULT_INTRO];
    if (Variant === ScanReveal) {
        return <ScanReveal onComplete={onComplete} slow={getIntroSlowMo()} />;
    }
    return (
        <Suspense fallback={null}>
            <Variant onComplete={onComplete} slow={getIntroSlowMo()} />
        </Suspense>
    );
}

export default IntroReveal;
