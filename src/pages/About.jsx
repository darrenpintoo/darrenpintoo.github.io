import { profile, news } from '../data';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Helmet } from 'react-helmet-async';
import PreviewLink from '../components/PreviewLink';
import { getLatestPost, formatDate } from '../utils/posts';
import { ChevronRight } from 'lucide-react';
import FadeIn from '../components/FadeIn';

function About() {
    const latestPost = getLatestPost();

    return (
        <PageLayout>
            <Helmet>
                <title>Darren Pinto | Robotics Researcher & Engineer</title>
                <meta name="description" content="Darren Pinto's Personal Portfolio. Undergraduate Student & Robotics Researcher at Carnegie Mellon University building intelligent systems." />
                <link rel="canonical" href="https://darrenpinto.me/" />
            </Helmet>
            <main id="main" className="container">
                <div className="animate-blur-fade about-hero">
                    <h1><strong>Darren</strong> Pinto</h1>
                    <div className="hero-status">
                        <span className="fact-label hero-status-label">
                            <span className="status-dot" /> Currently
                        </span>
                        <p className="hero-status-value">Biorobotics Lab @ CMU</p>
                        <p className="hero-status-value">IBM Silicon Valley Lab · Summer 2026</p>
                    </div>
                    <p className="subtitle">
                        Undergraduate Student & Robotics Researcher at{' '}
                        <PreviewLink href="https://www.cmu.edu/" target="_blank" rel="noreferrer">Carnegie Mellon University</PreviewLink>.
                    </p>
                </div>

                <div className="profile-section prose animate-blur-fade delay-100">
                    <div className="profile-rail">
                        <img
                            src="/darren.jpg"
                            alt="Darren Pinto"
                            className="profile-image"
                            width="400"
                            height="400"
                            fetchPriority="high"
                            decoding="async"
                        />

                        <div className="rail-news">
                            <span className="fact-label">News</span>
                            <ul className="rail-news-list">
                                {news.map((item) => (
                                    <li className="rail-news-item" key={`${item.date}-${item.text}`}>
                                        <span className="rail-news-date">{item.date}</span>
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <dl className="profile-facts">
                            <div className="fact">
                                <dt className="fact-label">Location</dt>
                                <dd className="fact-value">Pittsburgh, PA</dd>
                            </div>
                            <div className="fact">
                                <dt className="fact-label">Study</dt>
                                <dd className="fact-value">B.S. ECE, Carnegie Mellon · Class of 2029</dd>
                            </div>
                            <div className="fact">
                                <dt className="fact-label">Focus</dt>
                                <dd className="fact-value">Robotics · Reinforcement Learning · Embedded</dd>
                            </div>
                            <div className="fact">
                                <dt className="fact-label">Contact</dt>
                                <dd className="fact-value fact-links">
                                    <a href={`mailto:${profile.contact.email}`}>Email</a>
                                    <a href={`https://${profile.contact.github}`} target="_blank" rel="noreferrer">GitHub</a>
                                    <a href={`https://${profile.contact.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="profile-text">
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

                    <p style={{ marginTop: '2rem', fontSize: '0.95rem' }}>
                        I write about hackathons, projects, and coursework—check out my latest below, or browse my <Link to="/blog">blog</Link> and <Link to="/courses">CMU course reviews</Link>.
                    </p>
                    </div>
                </div>

                {latestPost && (
                    <FadeIn>
                        <Link to={`/blog/${latestPost.slug}`} className="latest-post-card">
                            <div className="latest-post-card-image">
                                <img src={latestPost.image} alt={latestPost.title} loading="lazy" decoding="async" />
                            </div>
                            <div className="latest-post-card-content">
                                <span className="latest-post-card-label">Latest post</span>
                                <h3 className="latest-post-card-title">{latestPost.title}</h3>
                                <p className="latest-post-card-excerpt">{latestPost.excerpt}</p>
                                <div className="latest-post-card-bottom">
                                    <span className="latest-post-card-meta">
                                        {formatDate(latestPost.date)} · {latestPost.category}
                                    </span>
                                    <span className="latest-post-card-cta">
                                        Read <ChevronRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </FadeIn>
                )}
            </main>
        </PageLayout>
    );
}

export default About;
