import PageLayout from '../components/PageLayout';

function Blog() {
    return (
        <PageLayout>
            <main className="container">
                <div className="animate-blur-fade">
                    <h1>Blog</h1>
                    <p className="subtitle">Thoughts on robotics, engineering, and more.</p>
                </div>

                <div className="blog-content animate-blur-fade delay-100">
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
                            In the meantime, feel free to check out my <a href="/courses">course reviews</a> or
                            connect with me on social media.
                        </p>
                    </div>
                </div>
            </main>
        </PageLayout>
    );
}

export default Blog;
