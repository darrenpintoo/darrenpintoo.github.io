import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import Footer from '../components/Footer';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogPosts } from '../data/blog';
import { ArrowLeft, Calendar, Tag, ChevronRight } from 'lucide-react';

function Blog() {
    const { slug } = useParams();
    const [isVisible, setIsVisible] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (slug) {
            setIsLoading(true);
            fetch(`/posts/${slug}.md`)
                .then(res => {
                    if (!res.ok) throw new Error('Post not found');
                    return res.text();
                })
                .then(text => {
                    setPostContent(text);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setPostContent('# Post Not Found\nSorry, the post you are looking for does not exist.');
                    setIsLoading(false);
                });
        }
    }, [slug]);

    const activePost = slug ? blogPosts.find(p => p.slug === slug) : null;

    return (
        <PageLayout>
            <Helmet>
                <title>{activePost ? `${activePost.title} | Blog` : 'Blog | Darren Pinto'}</title>
                <meta name="description" content={activePost ? activePost.excerpt : "Thoughts on robotics, engineering, embedded systems, and more by Darren Pinto."} />
                <link rel="canonical" href={activePost ? `https://darrenpinto.me/blog/${slug}` : "https://darrenpinto.me/blog"} />
            </Helmet>
            <main className="container">
                {slug ? (
                    // Single Post View
                    <div className={`blog-post-view pre-animate ${isVisible ? 'fade-in-visible' : ''}`}>
                        <Link to="/blog" className="back-link">
                            <ArrowLeft size={18} />
                            Back to Blog
                        </Link>

                        {isLoading ? (
                            <div className="loading-state">Loading post...</div>
                        ) : (
                            <article className="prose blog-article">
                                <header className="post-header">
                                    {activePost && (
                                        <div className="post-meta">
                                            <span className="meta-item">
                                                <Calendar size={14} />
                                                {activePost.date}
                                            </span>
                                            <span className="meta-item">
                                                <Tag size={14} />
                                                {activePost.category}
                                            </span>
                                        </div>
                                    )}
                                    <h1 className="post-title">{activePost?.title || 'Blog Post'}</h1>
                                </header>
                                <div className="markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {postContent}
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
                                    <div className="coming-soon-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                                            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                            <path d="M2 2l7.586 7.586"></path>
                                            <circle cx="11" cy="11" r="2"></circle>
                                        </svg>
                                    </div>
                                    <h2>Coming Soon</h2>
                                    <p>
                                        I'm working on some exciting content! Soon I'll be sharing my experiences,
                                        tutorials, and insights on robotics, embedded systems, and engineering projects.
                                    </p>
                                    <p className="coming-soon-hint">
                                        In the meantime, feel free to check out my <Link to="/courses">course reviews</Link> or
                                        connect with me on social media.
                                    </p>
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
