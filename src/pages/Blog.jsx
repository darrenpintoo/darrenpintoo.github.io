import { useState, useEffect, useMemo } from 'react';
import PageLayout from '../components/PageLayout';
import Footer from '../components/Footer';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Tag, ChevronRight } from 'lucide-react';

// Automatically discover all markdown files in src/posts
const postFiles = import.meta.glob('../posts/*.md', { query: '?raw', eager: true });

function parseFrontmatter(markdown) {
    const frontmatterRegex = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);

    if (!match) return { metadata: {}, content: markdown };

    const yamlStr = match[1];
    const content = match[2];
    const metadata = {};

    yamlStr.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
            metadata[key.trim()] = value;
        }
    });

    return { metadata, content };
}

function Blog() {
    const { slug } = useParams();
    const [isVisible, setIsVisible] = useState(false);

    // Process all discovered posts
    const blogPosts = useMemo(() => {
        return Object.entries(postFiles).map(([path, module]) => {
            const fileName = path.split('/').pop().replace('.md', '');
            const { metadata } = parseFrontmatter(module.default);
            return {
                slug: fileName,
                title: metadata.title || 'Untitled Post',
                date: metadata.date || 'Unknown Date',
                category: metadata.category || 'General',
                excerpt: metadata.excerpt || '',
                image: metadata.image || '/blog-placeholder.png',
                content: module.default
            };
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, []);

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
        return { ...post, metadata, markdownContent: content };
    }, [slug, blogPosts]);

    return (
        <PageLayout>
            <Helmet>
                <title>{activePostData ? `${activePostData.title} | Blog` : 'Blog | Darren Pinto'}</title>
                <meta name="description" content={activePostData ? activePostData.excerpt : "Thoughts on robotics, engineering, embedded systems, and more by Darren Pinto."} />
                <link rel="canonical" href={activePostData ? `https://darrenpinto.me/blog/${slug}` : "https://darrenpinto.me/blog"} />
            </Helmet>
            <main className="container">
                {slug ? (
                    // Single Post View
                    <div className={`blog-post-view pre-animate ${isVisible ? 'fade-in-visible' : ''}`}>
                        <Link to="/blog" className="back-link">
                            <ArrowLeft size={18} />
                            Back to Blog
                        </Link>

                        {!activePostData ? (
                            <div className="loading-state">Post not found</div>
                        ) : (
                            <article className="prose blog-article">
                                <header className="post-header">
                                    <div className="post-meta">
                                        <span className="meta-item">
                                            <Calendar size={14} />
                                            {activePostData.date}
                                        </span>
                                        <span className="meta-item">
                                            <Tag size={14} />
                                            {activePostData.category}
                                        </span>
                                    </div>
                                    <h1 className="post-title">{activePostData.title}</h1>
                                </header>
                                <div className="markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {activePostData.markdownContent}
                                    </ReactMarkdown>
                                </div>
                            </article>
                        )}
                    </div>
                ) : (
                    // List View
                    <>
                        <div className={`pre-animate ${isVisible ? 'fade-in-visible' : ''}`}>
                            <h1>Blog</h1>
                            <p className="subtitle">Thoughts on robotics, engineering, and more.</p>
                        </div>

                        <div className={`blog-list pre-animate delay-100 ${isVisible ? 'fade-in-visible' : ''}`}>
                            {blogPosts.length > 0 ? (
                                <div className="posts-grid">
                                    {blogPosts.map((post) => (
                                        <Link to={`/blog/${post.slug}`} key={post.slug} className="post-card">
                                            <div className="post-card-image-wrapper">
                                                <img src={post.image} alt={post.title} className="post-card-image" />
                                                <div className="post-card-overlay">
                                                    <span className="post-category">{post.category}</span>
                                                </div>
                                            </div>
                                            <div className="post-card-content">
                                                <div className="post-card-meta">
                                                    <span className="post-date">{post.date}</span>
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
