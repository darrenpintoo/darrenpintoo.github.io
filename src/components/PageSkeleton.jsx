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
            <div>
                <S width="180px" height="2.2rem" style={{ marginBottom: '0.75rem' }} />
                <S width="380px" height="1rem" style={{ marginBottom: '2.5rem', maxWidth: '90%' }} />
            </div>

            <div className="profile-section" style={{ overflow: 'hidden' }}>
                <S
                    width="200px" height="200px" radius="50%"
                    style={{ float: 'left', marginRight: '2rem', marginBottom: '1rem', flexShrink: 0 }}
                />
                <S width="100%" height="1rem" style={{ marginBottom: '0.85rem' }} />
                <S width="95%" height="1rem" style={{ marginBottom: '0.85rem' }} delay={0.08} />
                <S width="88%" height="1rem" style={{ marginBottom: '1rem' }} delay={0.16} />
                <S width="280px" height="2rem" radius="40px" delay={0.2} style={{ marginBottom: '1.25rem', maxWidth: '100%' }} />
                <S width="100%" height="1rem" style={{ marginBottom: '0.85rem' }} delay={0.24} />
                <S width="92%" height="1rem" style={{ marginBottom: '0.85rem' }} delay={0.28} />
                <S width="75%" height="1rem" style={{ marginBottom: '1.5rem' }} delay={0.32} />
                <S width="98%" height="1rem" style={{ marginBottom: '0.85rem' }} delay={0.08} />
                <S width="90%" height="1rem" style={{ marginBottom: '0.85rem' }} delay={0.16} />
                <S width="95%" height="1rem" style={{ marginBottom: '0.85rem' }} delay={0.24} />
                <S width="60%" height="1rem" delay={0.32} />
            </div>

            <div className="socials-section" style={{ marginTop: '5rem', paddingTop: '2rem' }}>
                <div className="skeleton-social-row">
                    {[0, 1, 2].map((i) => (
                        <S key={i} width="44px" height="44px" radius="14px" delay={i * 0.1} />
                    ))}
                </div>
            </div>
        </main>
    );
}

function BlogListSkeleton() {
    return (
        <main className="container skeleton-page">
            <div>
                <S width="80px" height="2.2rem" style={{ marginBottom: '0.75rem' }} />
                <S width="420px" height="1rem" style={{ marginBottom: '2.5rem', maxWidth: '90%' }} />
            </div>

            <div className="blog-list" style={{ marginTop: '3rem' }}>
                <div className="posts-grid">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="post-card skeleton-card-stagger" style={{ animationDelay: `${i * 0.15}s` }}>
                            <div className="post-card-image-wrapper">
                                <S width="100%" height="100%" radius="0" style={{ position: 'absolute', inset: 0 }} delay={i * 0.15} />
                            </div>
                            <div className="post-card-content">
                                <div className="post-card-tags">
                                    <S width="80px" height="0.65rem" radius="6px" delay={i * 0.15} />
                                </div>
                                <div className="post-card-meta">
                                    <S width="100px" height="0.65rem" delay={i * 0.15} />
                                </div>
                                <S width="90%" height="1rem" style={{ marginBottom: '0.5rem' }} delay={i * 0.15} />
                                <S width="100%" height="0.75rem" style={{ marginBottom: '0.35rem' }} delay={i * 0.15} />
                                <S width="70%" height="0.75rem" delay={i * 0.15} />
                                <div className="post-card-footer">
                                    <S width="100px" height="0.85rem" delay={i * 0.15} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

function BlogPostSkeleton() {
    return (
        <main className="container skeleton-page">
            <div className="blog-post-view">
                <S width="130px" height="0.9rem" style={{ marginBottom: '3rem' }} />
                <div className="blog-post-layout">
                    <div className="blog-content-wrapper">
                        <S width="80%" height="2rem" style={{ marginBottom: '1rem' }} />
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                            <S width="120px" height="0.85rem" />
                            <S width="100px" height="0.85rem" />
                        </div>
                        <S width="100%" height="1rem" style={{ marginBottom: '0.9rem' }} delay={0.05} />
                        <S width="97%" height="1rem" style={{ marginBottom: '0.9rem' }} delay={0.1} />
                        <S width="92%" height="1rem" style={{ marginBottom: '0.9rem' }} delay={0.15} />
                        <S width="100%" height="1rem" style={{ marginBottom: '0.9rem' }} delay={0.2} />
                        <S width="85%" height="1rem" style={{ marginBottom: '0.9rem' }} delay={0.25} />
                        <S width="95%" height="1rem" style={{ marginBottom: '0.9rem' }} delay={0.3} />
                        <S width="88%" height="1rem" style={{ marginBottom: '0.9rem' }} delay={0.35} />
                        <S width="60%" height="1rem" delay={0.4} />
                    </div>
                </div>
            </div>
        </main>
    );
}

function CoursesSkeleton() {
    return (
        <main className="container skeleton-page">
            <div>
                <S width="200px" height="2.2rem" style={{ marginBottom: '0.75rem' }} />
                <S width="100%" height="1rem" style={{ marginBottom: '0.5rem', maxWidth: '560px' }} />
                <S width="80%" height="1rem" style={{ marginBottom: '1.5rem', maxWidth: '480px' }} />
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <S width="180px" height="0.8rem" />
                    <S width="160px" height="0.8rem" />
                </div>
            </div>

            <div className="course-layout">
                <aside className="course-sidebar">
                    <S width="70px" height="0.65rem" style={{ marginBottom: '1rem' }} />
                    {[0, 1, 2].map((i) => (
                        <S key={i} width="100%" height="1.8rem" radius="6px" style={{ marginBottom: '0.4rem' }} delay={i * 0.1} />
                    ))}
                </aside>

                <div>
                    <S width="120px" height="1.3rem" style={{ marginBottom: '1.25rem' }} />
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="skeleton-course-card" style={{ animationDelay: `${i * 0.08}s` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                                        <S width="60px" height="0.9rem" delay={i * 0.08} />
                                        <S width="65%" height="0.95rem" delay={i * 0.08} />
                                    </div>
                                    <S width="50%" height="0.75rem" delay={i * 0.08} />
                                </div>
                                <S width="55px" height="0.75rem" delay={i * 0.08} />
                            </div>
                        </div>
                    ))}
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
