import { useState, useEffect, useMemo } from 'react';
import PageLayout from '../components/PageLayout';
import Footer from '../components/Footer';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Tag, ChevronRight } from 'lucide-react';
import { getAllPosts, parseFrontmatter, formatDate } from '../utils/posts';

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

// Strip inline markdown (links, emphasis, code) so TOC slugs match the
// ids generated from the rendered heading text
function stripInlineMarkdown(text) {
    return text
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[*_`]/g, '');
}

// TOC Generator Helper
function generateTOC(content) {
    const headings = [];
    const lines = content.split('\n');
    lines.forEach((line) => {
        const match = line.match(/^(#{2,3})\s+(.*)$/);
        if (match) {
            const level = match[1].length;
            const text = stripInlineMarkdown(match[2].trim());
            headings.push({ level, text, slug: slugify(text) });
        }
    });
    return headings;
}

function Blog() {
    const { slug } = useParams();
    const [isVisible, setIsVisible] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    const blogPosts = useMemo(() => getAllPosts(), []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    const activePostData = useMemo(() => {
        if (!slug) return null;
        const post = blogPosts.find(p => p.slug === slug);
        if (!post) return null;
        const { metadata, content } = parseFrontmatter(post.content);
        return { ...post, metadata, markdownContent: content, toc: generateTOC(content) };
    }, [slug, blogPosts]);

    // Handle scroll for TOC highlighting (rAF-throttled so the layout reads
    // run at most once per frame)
    useEffect(() => {
        if (!slug || !activePostData?.toc.length) return;

        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                ticking = false;
                const scrollValues = activePostData.toc.map(item => {
                    const element = document.getElementById(item.slug);
                    if (!element) return { id: item.slug, offset: Infinity };
                    return { id: item.slug, offset: Math.abs(element.getBoundingClientRect().top - 150) };
                });

                const closest = scrollValues.sort((a, b) => a.offset - b.offset)[0];
                if (closest && closest.offset < 500) {
                    setActiveSection(closest.id);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug, activePostData]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(id);

            // Update URL hash without jumping
            window.history.pushState(null, null, `#${id}`);
        }
    };

    const handleTocClick = (event, id) => {
        event.preventDefault();
        scrollToSection(id);
    };

    // Custom renderer: IDs for headings, alt fallback for images
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

    // Article schema for SEO (single post view)
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
                    // Single Post View with Sidebar
                    <div className={`blog-post-view pre-animate ${isVisible ? 'fade-in-visible' : ''}`}>
                        <Link to="/blog" className="back-link">
                            <ArrowLeft size={18} />
                            Back to Blog
                        </Link>

                        {!activePostData ? (
                            <div className="loading-state">
                                <p>Post not found.</p>
                                <p style={{ marginTop: '1rem' }}>
                                    <Link to="/blog" className="back-link" style={{ display: 'inline-flex', marginRight: '1rem' }}>
                                        <ArrowLeft size={18} style={{ marginRight: '0.25rem' }} />
                                        Back to Blog
                                    </Link>
                                    <Link to="/" className="back-link" style={{ display: 'inline-flex' }}>
                                        Home
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            <div className="blog-post-layout">
                                {/* Sidebar TOC - Sticky on Left */}
                                {activePostData.toc && activePostData.toc.length > 0 && (
                                    <aside className="blog-sidebar">
                                        <h4 className="toc-title">On This Page</h4>
                                        <ul className="toc-list">
                                            {activePostData.toc.map((item) => (
                                                <li key={item.slug} style={{ paddingLeft: item.level === 3 ? '0.75rem' : '0' }}>
                                                    <a
                                                        href={`#${item.slug}`}
                                                        className={`toc-link ${activeSection === item.slug ? 'active' : ''}`}
                                                        onClick={(event) => handleTocClick(event, item.slug)}
                                                        aria-current={activeSection === item.slug ? 'location' : undefined}
                                                    >
                                                        {item.text}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </aside>
                                )}

                                <div className="blog-content-wrapper">
                                    <article className="prose blog-article">
                                        <header className="post-header">
                                            <h1 className="post-title">{activePostData.title}</h1>
                                            <div className="post-meta">
                                                <span className="meta-item">
                                                    <Calendar size={14} />
                                                    {formatDate(activePostData.date)}
                                                </span>
                                                <span className="meta-item">
                                                    <Tag size={14} />
                                                    {activePostData.category}
                                                </span>
                                            </div>
                                        </header>
                                        <div className="markdown-content">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={MarkdownComponents}
                                            >
                                                {activePostData.markdownContent}
                                            </ReactMarkdown>
                                        </div>
                                    </article>
                                </div>
                            </div>
                        )}
                    </div>

                ) : (
                    // List View
                    <>
                        <div className={`pre-animate ${isVisible ? 'fade-in-visible' : ''}`}>
                            <h1>Blog</h1>
                            <p className="subtitle">Hackathons, competitions, and projects from CMU and beyond.</p>
                        </div>

                        <div className={`blog-list pre-animate delay-100 ${isVisible ? 'fade-in-visible' : ''}`}>
                            {blogPosts.length > 0 ? (
                                <div className="posts-grid">
                                    {blogPosts.map((post) => (
                                        <Link to={`/blog/${post.slug}`} key={post.slug} className="post-card">
                                            <div className="post-card-image-wrapper">
                                                <img src={post.image} alt={post.title} className="post-card-image" loading="lazy" decoding="async" />
                                            </div>
                                            <div className="post-card-content">

                                                <div className="post-card-tags">
                                                    <span className="post-tag-pill">{post.category}</span>
                                                </div>

                                                <div className="post-card-meta">
                                                    <span className="post-date">{formatDate(post.date)}</span>
                                                </div>
                                                <h2 className="post-card-title">{post.title}</h2>
                                                <p className="post-card-excerpt">{post.excerpt}</p>
                                                <div className="post-card-footer">
                                                    <span className="read-more">
                                                        Read More <ChevronRight size={16} />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="blog-coming-soon">
                                    <h2>No posts found.</h2>
                                    <p>Check back later!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </PageLayout>
    );
}

export default Blog;
