import { useState, useEffect, useMemo } from 'react';
import PageLayout from '../components/PageLayout';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllPosts, getPostBySlug, parseFrontmatter, logDate } from '../utils/posts';

const BASE_URL = 'https://darrenpinto.me';

// Turn heading text into a URL-safe anchor id
function slugify(text) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

// Extract plain text from rendered markdown children, which may contain
// elements (e.g. <strong> from **bold**) — children.toString() would give
// "[object Object]" and break the heading id
function getNodeText(node) {
    if (node == null) return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getNodeText).join('');
    if (typeof node === 'object' && node.props) return getNodeText(node.props.children);
    return '';
}

function Blog() {
    const { slug } = useParams();
    const [isVisible, setIsVisible] = useState(false);
    const [filter, setFilter] = useState('ALL');

    const blogPosts = useMemo(() => getAllPosts(), []);

    // Category tabs are derived from the posts that actually exist
    const categories = useMemo(() => {
        const seen = [];
        blogPosts.forEach((p) => {
            const c = (p.category || 'General').toUpperCase();
            if (!seen.includes(c)) seen.push(c);
        });
        return ['ALL', ...seen];
    }, [blogPosts]);

    const shownPosts = useMemo(() => (
        filter === 'ALL'
            ? blogPosts
            : blogPosts.filter((p) => (p.category || 'General').toUpperCase() === filter)
    ), [blogPosts, filter]);

    const yearRange = useMemo(() => {
        const years = blogPosts
            .map((p) => String(p.date).slice(0, 4))
            .filter((y) => /^\d{4}$/.test(y))
            .sort();
        if (!years.length) return '';
        return years[0] === years[years.length - 1]
            ? years[0]
            : `${years[0]}—${years[years.length - 1]}`;
    }, [blogPosts]);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const activePostData = useMemo(() => {
        if (!slug) return null;
        // getPostBySlug ignores the draft filter so drafts stay previewable
        const post = getPostBySlug(slug);
        if (!post) return null;
        const { metadata, content } = parseFrontmatter(post.content);
        return { ...post, metadata, markdownContent: content };
    }, [slug]);

    const MarkdownComponents = {
        h2: ({ children, ...props }) => (
            <h2 id={slugify(getNodeText(children))} {...props}>{children}</h2>
        ),
        h3: ({ children, ...props }) => (
            <h3 id={slugify(getNodeText(children))} {...props}>{children}</h3>
        ),
        img: ({ src, alt, ...props }) => (
            <img src={src} alt={alt || 'Blog post image'} loading="lazy" decoding="async" {...props} />
        ),
    };

    const articleSchema = activePostData ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: activePostData.title,
        description: activePostData.excerpt,
        image: activePostData.image.startsWith('http') ? activePostData.image : `${BASE_URL}${activePostData.image}`,
        datePublished: activePostData.date,
        dateModified: activePostData.date,
        author: { '@type': 'Person', name: 'Darren Pinto', url: BASE_URL },
        publisher: { '@type': 'Person', name: 'Darren Pinto', url: BASE_URL },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${slug}` },
    } : null;

    return (
        <PageLayout>
            <Helmet>
                <title>{activePostData ? `${activePostData.title} | Blog` : 'Blog | Darren Pinto'}</title>
                <meta name="description" content={activePostData ? activePostData.excerpt : "Thoughts on robotics, engineering, embedded systems, and more by Darren Pinto."} />
                <link rel="canonical" href={activePostData ? `${BASE_URL}/blog/${slug}` : `${BASE_URL}/blog`} />
                {activePostData && (
                    <>
                        <meta property="og:type" content="article" />
                        <meta property="og:url" content={`${BASE_URL}/blog/${slug}`} />
                        <meta property="og:title" content={activePostData.title} />
                        <meta property="og:description" content={activePostData.excerpt} />
                        <meta property="og:image" content={activePostData.image.startsWith('http') ? activePostData.image : `${BASE_URL}${activePostData.image}`} />
                        <meta property="og:site_name" content="Darren Pinto" />
                        <meta property="article:published_time" content={activePostData.date} />
                        <meta property="og:image:alt" content={activePostData.title} />
                        <meta property="twitter:card" content="summary_large_image" />
                        <meta property="twitter:url" content={`${BASE_URL}/blog/${slug}`} />
                        <meta property="twitter:title" content={activePostData.title} />
                        <meta property="twitter:description" content={activePostData.excerpt} />
                        <meta property="twitter:image" content={activePostData.image.startsWith('http') ? activePostData.image : `${BASE_URL}${activePostData.image}`} />
                        <meta property="twitter:image:alt" content={activePostData.title} />
                        {articleSchema && (
                            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
                        )}
                    </>
                )}
            </Helmet>
            <main id="main" className="container">
                {slug ? (
                    <div className={`post-view pre-animate ${isVisible ? 'fade-in-visible' : ''}`}>
                        <Link to="/blog" className="back-link">
                            <span aria-hidden="true">←</span> Back to blog
                        </Link>

                        {!activePostData ? (
                            <div className="loading-state">
                                <p>Post not found.</p>
                                <p style={{ marginTop: '1.5rem' }}>
                                    <Link to="/blog" className="back-link" style={{ marginRight: '1.5rem', marginBottom: 0 }}>
                                        Back to blog
                                    </Link>
                                    <Link to="/" className="back-link" style={{ marginBottom: 0 }}>Home</Link>
                                </p>
                            </div>
                        ) : (
                            <article>
                                <header className="post-header">
                                    <div className="post-meta-row">
                                        <span className="post-cat">{activePostData.category}</span>
                                        <span className="post-date">{logDate(activePostData.date, true)}</span>
                                    </div>
                                    <h1 className="post-article-title">{activePostData.title}</h1>
                                </header>
                                <div className="markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                                        {activePostData.markdownContent}
                                    </ReactMarkdown>
                                </div>
                            </article>
                        )}
                    </div>
                ) : (
                    <>
                        <div className={`blog-head pre-animate ${isVisible ? 'fade-in-visible' : ''}`}>
                            <div>
                                <h1>Blog<span className="hero-tail">.</span></h1>
                                <p className="page-sub">Hackathons, competitions, and projects from CMU and beyond.</p>
                            </div>
                            {blogPosts.length > 0 && (
                                <div className="head-count">
                                    {String(shownPosts.length).padStart(2, '0')}
                                    {filter === 'ALL' ? '' : `/${String(blogPosts.length).padStart(2, '0')}`} POSTS
                                    {yearRange ? ` · ${yearRange}` : ''}
                                </div>
                            )}
                        </div>

                        {categories.length > 2 && (
                            <div className={`filter-row pre-animate delay-100 ${isVisible ? 'fade-in-visible' : ''}`} role="group" aria-label="Filter posts by category">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        className="filter-tab"
                                        aria-pressed={filter === cat}
                                        onClick={() => setFilter(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}

                        {shownPosts.length > 0 ? (
                            <div className={`posts-grid pre-animate delay-200 ${isVisible ? 'fade-in-visible' : ''}`}>
                                {shownPosts.map((post) => (
                                    <Link to={`/blog/${post.slug}`} key={post.slug} className="post-card">
                                        <div className="post-media">
                                            <img src={post.image} alt="" loading="lazy" decoding="async" />
                                        </div>
                                        <div className="post-body">
                                            <div className="post-meta-row">
                                                <span className="post-cat">{post.category}</span>
                                                <span className="post-date">{logDate(post.date, true)}</span>
                                            </div>
                                            <h2 className="post-title">{post.title}</h2>
                                            <p className="post-excerpt">{post.excerpt}</p>
                                            <div className="post-read">Read <span aria-hidden="true">→</span></div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <h2>No posts found.</h2>
                                <p>{blogPosts.length ? 'Nothing in this category yet.' : 'Check back later!'}</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </PageLayout>
    );
}

export default Blog;
