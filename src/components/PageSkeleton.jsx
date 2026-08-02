import { useLocation } from 'react-router-dom';

function S({ width = '100%', height = '1rem', radius = '4px', delay = 0, style }) {
    return (
        <div
            className="skeleton-block"
            style={{
                width,
                height,
                borderRadius: radius,
                animationDelay: delay ? `${delay}s` : undefined,
                ...style,
            }}
        />
    );
}

function Row({ i }) {
    return (
        <div style={{ padding: '1.1rem 0', borderBottom: '1px solid var(--line)' }}>
            <S width="90px" height="0.7rem" delay={i * 0.08} style={{ marginBottom: '0.6rem' }} />
            <S width="65%" height="1.1rem" delay={i * 0.08} style={{ marginBottom: '0.5rem' }} />
            <S width="90%" height="0.8rem" delay={i * 0.08} />
        </div>
    );
}

function AboutSkeleton() {
    return (
        <main className="container skeleton-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <S width="220px" height="2.4rem" style={{ marginBottom: '0.9rem' }} />
                    <S width="330px" height="0.9rem" style={{ maxWidth: '90%' }} />
                </div>
                <S width="108px" height="108px" radius="50%" style={{ flexShrink: 0 }} />
            </div>
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--line)' }}>
                {[0, 1].map((i) => (
                    <div key={i} style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--line)' }}>
                        <S width="60%" height="0.8rem" delay={i * 0.08} />
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '2.5rem' }}>
                <S width="100%" height="1rem" style={{ marginBottom: '0.85rem' }} />
                <S width="95%" height="1rem" style={{ marginBottom: '0.85rem' }} delay={0.08} />
                <S width="88%" height="1rem" style={{ marginBottom: '0.85rem' }} delay={0.16} />
                <S width="60%" height="1rem" delay={0.24} />
            </div>
            <div style={{ marginTop: '3.5rem' }}>
                <S width="140px" height="0.7rem" style={{ marginBottom: '1.5rem' }} />
                {[0, 1, 2].map((i) => (
                    <Row key={i} i={i} />
                ))}
            </div>
        </main>
    );
}

function BlogListSkeleton() {
    return (
        <main className="container skeleton-page">
            <S width="160px" height="2.4rem" style={{ marginBottom: '0.9rem' }} />
            <S width="380px" height="0.9rem" style={{ marginBottom: '2.5rem', maxWidth: '90%' }} />
            <div style={{ borderTop: '1px solid var(--line)' }}>
                {[0, 1, 2, 3].map((i) => (
                    <Row key={i} i={i} />
                ))}
            </div>
        </main>
    );
}

function BlogPostSkeleton() {
    return (
        <main className="container skeleton-page">
            <S width="120px" height="0.7rem" style={{ marginBottom: '2.5rem' }} />
            <S width="140px" height="0.7rem" style={{ marginBottom: '1rem' }} />
            <S width="80%" height="2rem" style={{ marginBottom: '2rem' }} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <S
                    key={i}
                    width={['100%', '97%', '92%', '100%', '85%', '55%'][i]}
                    height="1rem"
                    style={{ marginBottom: '0.9rem' }}
                    delay={i * 0.05}
                />
            ))}
        </main>
    );
}

function CoursesSkeleton() {
    return (
        <main className="container skeleton-page">
            <S width="280px" height="2.4rem" style={{ marginBottom: '0.9rem' }} />
            <S width="100%" height="0.9rem" style={{ marginBottom: '0.5rem', maxWidth: '560px' }} />
            <S width="80%" height="0.9rem" style={{ marginBottom: '1.75rem', maxWidth: '480px' }} />
            <div style={{ display: 'flex', gap: '1.5rem', padding: '0.8rem 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', marginBottom: '2.5rem' }}>
                <S width="90px" height="0.7rem" />
                <S width="90px" height="0.7rem" delay={0.08} />
                <S width="90px" height="0.7rem" delay={0.16} style={{ marginLeft: 'auto' }} />
            </div>
            {[0, 1, 2, 3].map((i) => (
                <Row key={i} i={i} />
            ))}
        </main>
    );
}

export default function PageSkeleton() {
    const location = useLocation();
    const path = location.pathname;

    if (path === '/blog') return <BlogListSkeleton />;
    if (path.startsWith('/blog/')) return <BlogPostSkeleton />;
    if (path.startsWith('/courses')) return <CoursesSkeleton />;
    return <AboutSkeleton />;
}
