import { Helmet } from 'react-helmet-async';
import PageLayout from '../components/PageLayout';
import DepthPortrait from '../components/DepthPortrait';

// Unlinked comparison page for choosing the headshot treatment. Every variant
// is computed from the real photos (and IMG_9394's iPhone depth map); none is
// AI-generated. Not in the nav or sitemap, and marked noindex.

const BASE = '/images/portrait';

const stills = [
    { file: 'p9394-square.jpg', title: 'Original', note: 'IMG_9394, square crop, untouched.' },
    { file: 'v-9394-depthblur.jpg', title: 'Depth blur + grade', note: 'Background softened using the real depth map; face pixels untouched. Quiet editorial grade.' },
    { file: 'v-9397-front.jpg', title: 'Facing camera', note: 'IMG_9397 cropped to you only, same grade. No depth map in this shot, so no 3D.' },
    { file: 'v-9394-voronoi.jpg', title: 'Voronoi cells', note: 'You, rebuilt from the pavilion’s own polygon geometry. Cells are denser on your face and edges.' },
    { file: 'v-9394-turbo.jpg', title: 'Measured depth', note: 'False-color depth from the phone’s sensor over the photo’s luminance.' },
    { file: 'v-9394-pointcloud.jpg', title: 'Point cloud (still)', note: 'Every pixel placed at its measured depth, camera rotated 30°.' },
    { file: 'v-9394-duotone.jpg', title: 'Crimson duotone', note: 'Site ink → accent → paper gradient map.' },
];

function Thumb({ src }) {
    return <img src={src} alt="" className="lab-thumb" loading="lazy" decoding="async" />;
}

function PortraitLab() {
    return (
        <PageLayout>
            <Helmet>
                <title>Portrait lab | Darren Pinto</title>
                <meta name="robots" content="noindex" />
            </Helmet>
            <main id="main" className="container">
                <div className="page-head">
                    <h1>Portrait lab</h1>
                    <p className="subtitle">
                        Headshot candidates, all computed from the real photos. Nothing here is AI-generated.
                        The first two react to your pointer; on touch screens they drift on their own.
                    </p>
                </div>

                <h2 className="lab-heading">Interactive</h2>
                <div className="lab-grid lab-grid-interactive">
                    <figure className="lab-card">
                        <DepthPortrait
                            src={`${BASE}/p9394-square.jpg`}
                            depth={`${BASE}/p9394-square-depth.png`}
                            matte={`${BASE}/p9394-square-matte.png`}
                            fill={`${BASE}/p9394-square-bg.jpg`}
                            mode="parallax"
                            alt="Darren Pinto, 3D depth tilt"
                            className="lab-media"
                            autoplay
                        />
                        <figcaption>
                            <strong>Depth tilt</strong>
                            <span>Move over the photo: you (cut out using the phone’s depth map) slide against the pavilion behind you. Candidate for the headshot itself.</span>
                        </figcaption>
                    </figure>
                    <figure className="lab-card">
                        <DepthPortrait
                            src={`${BASE}/p9394-wide.jpg`}
                            depth={`${BASE}/p9394-wide-depth.png`}
                            mode="points"
                            alt="Darren Pinto, 3D point cloud"
                            className="lab-media lab-media-tall"
                            autoplay
                        />
                        <figcaption>
                            <strong>Point cloud orbit</strong>
                            <span>The scene as a 3D point cloud from the phone’s depth sensor. The black gaps are what the camera couldn’t see. Candidate for a hover state or the About page.</span>
                        </figcaption>
                    </figure>
                </div>

                <h2 className="lab-heading">Stills</h2>
                <div className="lab-grid">
                    {stills.map((s) => (
                        <figure className="lab-card" key={s.file}>
                            <img src={`${BASE}/${s.file}`} alt={s.title} className="lab-media" loading="lazy" decoding="async" />
                            <figcaption>
                                <div className="lab-caption-head">
                                    <strong>{s.title}</strong>
                                    <Thumb src={`${BASE}/${s.file}`} />
                                </div>
                                <span>{s.note}</span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </main>
        </PageLayout>
    );
}

export default PortraitLab;
