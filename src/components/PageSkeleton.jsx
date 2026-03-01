import { useLocation } from 'react-router-dom';

function SkeletonBlock({ width = '100%', height = '1rem', radius = '8px', style }) {
    return (
        <div
            className="skeleton-block"
            style={{ width, height, borderRadius: radius, ...style }}
        />
    );
}

function AboutSkeleton() {
    return (
        <main className="container skeleton-page">
            <SkeletonBlock width="180px" height="2.2rem" style={{ marginBottom: '0.75rem' }} />
            <SkeletonBlock width="340px" height="1rem" style={{ marginBottom: '2.5rem' }} />
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <SkeletonBlock width="200px" height="200px" radius="50%" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <SkeletonBlock width="100%" height="1rem" style={{ marginBottom: '0.75rem' }} />
                    <SkeletonBlock width="95%" height="1rem" style={{ marginBottom: '0.75rem' }} />
                    <SkeletonBlock width="88%" height="1rem" style={{ marginBottom: '0.75rem' }} />
                    <SkeletonBlock width="92%" height="1rem" style={{ marginBottom: '0.75rem' }} />
                    <SkeletonBlock width="60%" height="1rem" />
                </div>
            </div>
        </main>
    );
}

function BlogSkeleton() {
    return (
        <main className="container skeleton-page">
            <SkeletonBlock width="80px" height="2.2rem" style={{ marginBottom: '0.75rem' }} />
            <SkeletonBlock width="360px" height="1rem" style={{ marginBottom: '3rem' }} />
            <div className="skeleton-card-grid">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="skeleton-card">
                        <SkeletonBlock width="100%" height="0" style={{ paddingBottom: '56.25%' }} radius="0" />
                        <div style={{ padding: '1.25rem 1.4rem' }}>
                            <SkeletonBlock width="80px" height="0.65rem" style={{ marginBottom: '0.6rem' }} />
                            <SkeletonBlock width="100px" height="0.65rem" style={{ marginBottom: '0.6rem' }} />
                            <SkeletonBlock width="90%" height="1rem" style={{ marginBottom: '0.5rem' }} />
                            <SkeletonBlock width="100%" height="0.75rem" style={{ marginBottom: '0.35rem' }} />
                            <SkeletonBlock width="70%" height="0.75rem" />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

function CoursesSkeleton() {
    return (
        <main className="container skeleton-page">
            <SkeletonBlock width="140px" height="2.2rem" style={{ marginBottom: '0.75rem' }} />
            <SkeletonBlock width="280px" height="1rem" style={{ marginBottom: '2.5rem' }} />
            {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card" style={{ marginBottom: '1.25rem', padding: '1.5rem' }}>
                    <SkeletonBlock width="120px" height="0.8rem" style={{ marginBottom: '0.5rem' }} />
                    <SkeletonBlock width="70%" height="1.1rem" style={{ marginBottom: '0.75rem' }} />
                    <SkeletonBlock width="100%" height="0.75rem" style={{ marginBottom: '0.35rem' }} />
                    <SkeletonBlock width="85%" height="0.75rem" />
                </div>
            ))}
        </main>
    );
}

export default function PageSkeleton() {
    const location = useLocation();
    const path = location.pathname;

    if (path.startsWith('/blog')) return <BlogSkeleton />;
    if (path.startsWith('/courses')) return <CoursesSkeleton />;
    return <AboutSkeleton />;
}
