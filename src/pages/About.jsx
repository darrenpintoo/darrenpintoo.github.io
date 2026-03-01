import { profile } from '../data';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Helmet } from 'react-helmet-async';
import PreviewLink from '../components/PreviewLink';
import { getLatestPost } from '../utils/posts';
import { ChevronRight } from 'lucide-react';

function formatDate(isoDate) {
    if (!isoDate || isoDate === 'Unknown Date') return isoDate;
    try {
        const d = new Date(isoDate);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return isoDate;
    }
}

function About() {
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef(null);
    const latestPost = getLatestPost();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const currentFooterRef = footerRef.current;
        if (currentFooterRef) {
            observer.observe(currentFooterRef);
        }

        return () => {
            if (currentFooterRef) {
                observer.unobserve(currentFooterRef);
            }
        };
    }, []);



    return (
        <PageLayout>
            <Helmet>
                <title>Darren Pinto | Robotics Researcher & Engineer</title>
                <meta name="description" content="Darren Pinto's Personal Portfolio. Undergraduate Student & Robotics Researcher at Carnegie Mellon University building intelligent systems." />
                <link rel="canonical" href="https://darrenpinto.me/" />
            </Helmet>
            <main id="main" className="container">
                <div className="animate-blur-fade">
                    <h1><strong>Darren</strong> Pinto</h1>
                    <p className="subtitle">
                        Undergraduate Student & Robotics Researcher at <PreviewLink href="https://www.cmu.edu/" target="_blank" rel="noreferrer">Carnegie Mellon University</PreviewLink>
                    </p>
                </div>

                <div className="profile-section prose animate-blur-fade delay-100">
                    <img
                        src="/darren.jpg"
                        alt="Darren Pinto"
                        className="profile-image"
                        loading="lazy"
                        decoding="async"
                    />

                    <p>
                        Hi, I'm Darren. I build intelligent systems at the intersection of hardware and software,
                        with a focus on <strong>robotics</strong>, <strong>reinforcement learning</strong>,
                        and <strong>embedded systems</strong>.
                    </p>

                    <p>
                        I am an Electrical and Computer Engineering student at{' '}
                        <PreviewLink href="https://www.cmu.edu/" target="_blank" rel="noreferrer">Carnegie Mellon University</PreviewLink>.
                        At CMU, I conduct research at the <PreviewLink href="https://biorobotics.org/" target="_blank" rel="noreferrer">Biorobotics Lab</PreviewLink>,
                        exploring reinforcement learning for modular robot manipulation using NVIDIA IsaacSim and integrating
                        depth perception for robotic learning experiments. This upcoming summer I will be interning at <PreviewLink href="https://www.ibm.com/" target="_blank" rel="noreferrer">IBM</PreviewLink> in their Silicon Valley Laboratory.
                    </p>

                    <p>
                        Previously, I interned at <PreviewLink href="https://www.cadreforensics.com/" target="_blank" rel="noreferrer">Cadre Research</PreviewLink>,
                        where I designed embedded systems and high-performance computing prototypes. My background also includes
                        leading a World Championship Finalist <PreviewLink href="https://www.firstinspires.org/robotics/ftc" target="_blank" rel="noreferrer">FIRST Tech Challenge</PreviewLink> team,
                        where my team was a Control Award Finalist for the custom software libraries I developed.
                    </p>

                    <p>
                        Beyond engineering, I channel my creativity into game development. My <PreviewLink href="https://www.roblox.com/games/114162328499203/Find-the-Toons" target="_blank" rel="noreferrer">projects on Roblox</PreviewLink> have
                        engaged a community of over 175,000 players with more than 6 million play sessions, allowing me to explore
                        large-scale data-driven design.
                    </p>

                    <p>
                        I'm always exploring new ideas and working on creative problems. Feel free to reach out—I'm happy to chat.
                    </p>

                    <p style={{ marginTop: '2rem', fontStyle: 'italic', fontSize: '0.95rem' }}>
                        Check out my <Link to="/blog">blogs</Link> or <Link to="/courses">CMU course reviews</Link>.
                    </p>
                </div>

                {latestPost && (
                    <Link to={`/blog/${latestPost.slug}`} className="latest-post-card animate-blur-fade delay-100">
                        <div className="latest-post-card-image">
                            <img src={latestPost.image} alt={latestPost.title} loading="lazy" decoding="async" />
                        </div>
                        <div className="latest-post-card-content">
                            <span className="latest-post-card-label">Latest from the blog</span>
                            <h3 className="latest-post-card-title">{latestPost.title}</h3>
                            <p className="latest-post-card-excerpt">{latestPost.excerpt}</p>
                            <span className="latest-post-card-meta">
                                {formatDate(latestPost.date)} · {latestPost.category}
                            </span>
                            <span className="latest-post-card-cta">
                                Read post <ChevronRight size={16} />
                            </span>
                        </div>
                    </Link>
                )}

                <div
                    ref={footerRef}
                    className={`socials-section fade-in-section ${isVisible ? 'is-visible' : ''}`}
                >
                    <div className="social-links icons">
                        <a href={`mailto:${profile.contact.email}`} aria-label="Email">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </a>
                        <a href={`https://${profile.contact.github}`} target="_blank" rel="noreferrer" aria-label="GitHub">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        </a>
                        <a href={`https://${profile.contact.linkedin}`} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                    </div>
                </div>
            </main>
        </PageLayout>
    );
}

export default About;
