import { useState, useEffect, useMemo } from 'react';
import PageLayout from '../components/PageLayout';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import { getAllPosts, getPostBySlug, parseFrontmatter, formatDate } from '../utils/posts';

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

    const blogPosts = useMemo(() => getAllPosts(), []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    const activePostData = useMemo(() => {
        if (!slug) return null;
        // getPostBySlug ignores the draft filter so draft posts can still be
        // previewed at their direct URL
        const post = getPostBySlug(slug);
        if (!post) return null;
        const { metadata, content } = parseFrontmatter(post.content);
        return { ...post, metadata, markdownContent: content };
    }, [slug]);

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
                <title>{activePostData ? `${activePostData.title} | Writing` : 'Writing | Darren Pinto'}</title>
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
                    <div className={`pre-animate ${isVisible ? 'fade-in-visible' : ''}`}>
                        <Link to="/blog" className="back-link">
                            <ArrowLeft size={14} />
                            Back to Writing
                        </Link>

                        {!activePostData ? (
                            <div className="loading-state">
                                <p>Post not found.</p>
                                <p style={{ marginTop: '1rem' }}>
                                    <Link to="/blog" className="back-link" style={{ display: 'inline-flex', marginRight: '1.5rem', marginBottom: 0 }}>
                                        Back to Writing
                                    </Link>
                                    <Link to="/" className="back-link" style={{ display: 'inline-flex', marginBottom: 0 }}>
                                        Home
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            <article className="blog-article">
                                <header className="post-header">
                                    <div className="post-meta">
                                        <span className="meta-item">{formatDate(activePostData.date)}</span>
                                        <span className="meta-item">{activePostData.category}</span>
                                    </div>
                                    <h1 className="post-title">{activePostData.title}</h1>
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
                        )}
                    </div>
                ) : (
                    <>
                        <div className={`pre-animate ${isVisible ? 'fade-in-visible' : ''}`}>
                            <h1>Writing</h1>
                            <p className="subtitle">Hackathons, competitions, and projects from CMU and beyond.</p>
                        </div>

                        <div className={`pre-animate delay-100 ${isVisible ? 'fade-in-visible' : ''}`}>
                            {blogPosts.length > 0 ? (
                                <div className="writing-list">
                                    {blogPosts.map((post) => (
                                        <Link to={`/blog/${post.slug}`} key={post.slug} className="writing-row">
                                            <span className="writing-date">{formatDate(post.date)}</span>
                                            <span>
                                                <span className="writing-title">{post.title}</span>
                                                <span className="writing-excerpt" style={{ display: 'block' }}>{post.excerpt}</span>
                                                <span className="writing-tag">{post.category}</span>
                                            </span>
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
        </PageLayout>
    );
}

export default Blog;
