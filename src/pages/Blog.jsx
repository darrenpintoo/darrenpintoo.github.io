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

// TOC Generator Helper
function generateTOC(content) {
    const headings = [];
    const lines = content.split('\n');
    lines.forEach((line) => {
        // Match ## and ###
        const match = line.match(/^(#{2,3})\s+(.*)$/);
        if (match) {
            const level = match[1].length;
            const text = match[2].trim();
            // Create a simple slug
            const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            headings.push({ level, text, slug });
        }
    });
    return headings;
}

function Blog() {
    const { slug } = useParams();
    const [isVisible, setIsVisible] = useState(false);
    const [activeSection, setActiveSection] = useState('');

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
        return { ...post, metadata, markdownContent: content, toc: generateTOC(content) };
    }, [slug, blogPosts]);

    // Handle scroll for TOC highlighting
    useEffect(() => {
        if (!slug || !activePostData?.toc.length) return;

        const handleScroll = () => {
            const scrollValues = activePostData.toc.map(item => {
                const element = document.getElementById(item.slug);
                if (!element) return { id: item.slug, offset: Infinity };
                return { id: item.slug, offset: Math.abs(element.getBoundingClientRect().top - 150) };
            });

            const closest = scrollValues.sort((a, b) => a.offset - b.offset)[0];
            if (closest && closest.offset < 500) {
                setActiveSection(closest.id);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug, activePostData]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    // Custom renderer to add IDs to headings
    const MarkdownComponents = {
        h2: ({ node, ...props }) => {
            const id = props.children[0]?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return <h2 id={id} {...props} />;
        },
        h3: ({ node, ...props }) => {
            const id = props.children[0]?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return <h3 id={id} {...props} />;
        }
    };

    return (
        <PageLayout>
            <Helmet>
                <title>{activePostData ? `${activePostData.title} | Blog` : 'Blog | Darren Pinto'}</title>
                <meta name="description" content={activePostData ? activePostData.excerpt : "Thoughts on robotics, engineering, embedded systems, and more by Darren Pinto."} />
                <link rel="canonical" href={activePostData ? `https://darrenpinto.me/blog/${slug}` : "https://darrenpinto.me/blog"} />
            </Helmet>
            <main className="container">
                {slug ? (
                    // Single Post View with Sidebar
                    <div className={`blog-post-view pre-animate ${isVisible ? 'fade-in-visible' : ''}`}>
                        <Link to="/blog" className="back-link">
                            <ArrowLeft size={18} />
                            Back to Blog
                        </Link>

                        {!activePostData ? (
                            <div className="loading-state">Post not found</div>
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
                                                        className={`toc-link ${activeSection === item.slug ? 'active' : ''}`}
                                                        onClick={() => scrollToSection(item.slug)}
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
                                        </header>
                                        <div className="markdown-content">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={MarkdownComponents}
                                            >
                                                {activePostData.markdownContent}
                                            </ReactMarkdown>
                                        </div>
                                        <footer className="post-footer">
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
                                        </footer>
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
                            <p className="subtitle">Thoughts on robotics, engineering, and more.</p>
                        </div>

                        <div className={`blog-list pre-animate delay-100 ${isVisible ? 'fade-in-visible' : ''}`}>
                            {blogPosts.length > 0 ? (
                                <div className="posts-grid">
                                    {blogPosts.map((post) => (
                                        <Link to={`/blog/${post.slug}`} key={post.slug} className="post-card">
                                            <div className="post-card-image-wrapper">
                                                <img src={post.image} alt={post.title} className="post-card-image" />
                                            </div>
                                            <div className="post-card-content">

                                                <div className="post-card-tags">
                                                    <span className="post-tag-pill">{post.category}</span>
                                                </div>

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

