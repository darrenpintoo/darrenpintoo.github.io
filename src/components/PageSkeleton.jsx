import { useLocation } from 'react-router-dom';

function S({ width = '100%', height = '1rem', radius = '6px', delay = 0, style }) {
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

function AboutSkeleton() {
    return (
        <main className="container skeleton-page">
            <div className="about-hero">
                <S width="420px" height="4rem" style={{ maxWidth: '80%' }} />
                <S width="440px" height="1.2rem" style={{ maxWidth: '90%' }} />
            </div>
            <div className="status-strip" style={{ padding: '18px 0' }}>
                <div style={{ display: 'flex', gap: '36px', paddingLeft: 'var(--gutter)', flexWrap: 'wrap' }}>
                    {[0, 1, 2].map((i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <S width="90px" height="0.7rem" delay={i * 0.08} />
                            <S width="170px" height="1rem" delay={i * 0.08} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="about-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {['100%', '96%', '90%', '98%', '70%', '88%'].map((w, i) => (
                        <S key={i} width={w} height="1.1rem" delay={i * 0.05} />
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <S width="100%" height="248px" radius="14px" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                        <S width="90px" height="0.7rem" />
                        {[0, 1, 2].map((i) => (
                            <S key={i} width="100%" height="0.9rem" delay={i * 0.08} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

function BlogListSkeleton() {
    return (
        <main className="container skeleton-page">
            <div className="blog-head">
                <div style={{ flex: 1 }}>
                    <S width="230px" height="3.5rem" style={{ marginBottom: '14px', maxWidth: '70%' }} />
                    <S width="420px" height="1.1rem" style={{ maxWidth: '90%' }} />
                </div>
            </div>
            <div className="filter-row">
                {[0, 1, 2].map((i) => (
                    <S key={i} width="96px" height="32px" radius="7px" delay={i * 0.08} />
                ))}
            </div>
            <div className="posts-grid">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="post-card skeleton-card-stagger" style={{ animationDelay: `${i * 0.12}s` }}>
                        <S width="100%" height="190px" radius="0" delay={i * 0.12} />
                        <div className="post-body">
                            <S width="70%" height="0.7rem" delay={i * 0.12} />
                            <S width="90%" height="1.3rem" delay={i * 0.12} />
                            <S width="100%" height="0.9rem" delay={i * 0.12} />
                            <S width="55%" height="0.9rem" delay={i * 0.12} />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

function BlogPostSkeleton() {
    return (
        <main className="container skeleton-page">
            <div className="post-view" style={{ paddingTop: '44px' }}>
                <S width="120px" height="0.8rem" style={{ marginBottom: '36px' }} />
                <S width="150px" height="0.75rem" style={{ marginBottom: '14px' }} />
                <S width="80%" height="2.6rem" style={{ marginBottom: '32px' }} />
                {['100%', '97%', '92%', '100%', '85%', '60%'].map((w, i) => (
                    <S key={i} width={w} height="1.1rem" style={{ marginBottom: '0.95rem' }} delay={i * 0.05} />
                ))}
            </div>
        </main>
    );
}

function CoursesSkeleton() {
    return (
        <main className="container skeleton-page">
            <div className="courses-head">
                <S width="480px" height="3.25rem" style={{ maxWidth: '80%' }} />
                <S width="100%" height="1rem" style={{ maxWidth: '760px' }} />
                <S width="70%" height="1rem" style={{ maxWidth: '560px' }} />
            </div>
            <div className="courses-layout">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <S width="110px" height="0.7rem" />
                    {[0, 1].map((i) => (
                        <S key={i} width="100%" height="1.4rem" delay={i * 0.08} />
                    ))}
                </div>
                <div>
                    <S width="180px" height="1.6rem" style={{ marginBottom: '1rem' }} />
                    <div className="ledger">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="course-head" style={{ display: 'flex', gap: '18px' }}>
                                <S width="60px" height="1rem" delay={i * 0.08} />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <S width="55%" height="1.05rem" delay={i * 0.08} />
                                    <S width="35%" height="0.8rem" delay={i * 0.08} />
                                </div>
                                <S width="76px" height="1.6rem" radius="6px" delay={i * 0.08} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
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
