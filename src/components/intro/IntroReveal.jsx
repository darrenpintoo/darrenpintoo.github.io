import CoordinatedReveal from './CoordinatedReveal';
import ShaderReveal from './ShaderReveal';
import OrbitIntro from './OrbitIntro';
import BallDropIntro from './BallDropIntro';
import FlowFieldIntro from './FlowFieldIntro';
import ScanReveal from '../ScanReveal';
import { getForcedIntro, getIntroSlowMo, DEFAULT_INTRO } from './introUtils';

const VARIANTS = {
    coord: CoordinatedReveal,
    shader: ShaderReveal,
    orbit: OrbitIntro,
    balls: BallDropIntro,
    flow: FlowFieldIntro,
    scan: ScanReveal,
};

function IntroReveal({ onComplete }) {
    const name = getForcedIntro() || DEFAULT_INTRO;
    if (name === 'none') return null;
    const Variant = VARIANTS[name] || VARIANTS[DEFAULT_INTRO];
    return <Variant onComplete={onComplete} slow={getIntroSlowMo()} />;
}

export default IntroReveal;
