import { useState } from 'react';
import { profile, news } from '../data';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Helmet } from 'react-helmet-async';
import PreviewLink from '../components/PreviewLink';
import { getLatestPost, logDate } from '../utils/posts';

const NEWS_PREVIEW = 3;

function About() {
    const latestPost = getLatestPost();
    const [showAllNews, setShowAllNews] = useState(false);
    const visibleNews = showAllNews ? news : news.slice(0, NEWS_PREVIEW);
    const hasMoreNews = news.length > NEWS_PREVIEW;

    return (
        <PageLayout>
            <Helmet>
                <title>Darren Pinto | Robotics Researcher &amp; Engineer</title>
                <meta name="description" content="Darren Pinto's Personal Portfolio. Undergraduate Student & Robotics Researcher at Carnegie Mellon University building intelligent systems." />
                <link rel="canonical" href="https://darrenpinto.me/" />
            </Helmet>
            <main id="main" className="container">
                <div className="about-hero animate-blur-fade">
                    <h1>Darren Pinto<span className="hero-tail">.</span></h1>
                    <p className="page-sub">
                        Undergraduate Student &amp; Robotics Researcher at{' '}
                        <PreviewLink href="https://www.cmu.edu/" target="_blank" rel="noreferrer">Carnegie Mellon University</PreviewLink>.
                    </p>
                </div>

                {/* full-bleed status readout */}
                <div className="status-strip animate-blur-fade delay-100">
                    <div className="status-key" aria-hidden="true">
                        <span className="status-dot" />
                        Status
                    </div>
                    <div className="status-cell">
                        <span className="status-cell-label">Now</span>
                        <span className="status-cell-value">Biorobotics Lab @ CMU</span>
                    </div>
                    <div className="status-cell">
                        <span className="status-cell-label">Next · Summer 2026</span>
                        <span className="status-cell-value">IBM Silicon Valley Lab</span>
                    </div>
                    <div className="status-cell">
                        <span className="status-cell-label">Location</span>
                        <span className="status-cell-value">Pittsburgh, PA</span>
                    </div>
                </div>

                <div className="about-body">
                    <div className="prose animate-blur-fade delay-200">
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
                            depth perception for robotic learning experiments. This upcoming summer I will be interning at{' '}
                            <PreviewLink href="https://www.ibm.com/" target="_blank" rel="noreferrer">IBM</PreviewLink> in their Silicon Valley Laboratory.
                        </p>

                        <p>
                            Previously, I interned at <PreviewLink href="https://www.cadreforensics.com/" target="_blank" rel="noreferrer">Cadre Research</PreviewLink>,
                            where I designed embedded systems and high-performance computing prototypes. My background also includes
                            leading a World Championship Finalist <PreviewLink href="https://www.firstinspires.org/robotics/ftc" target="_blank" rel="noreferrer">FIRST Tech Challenge</PreviewLink> team,
                            where my team was a Control Award Finalist for the custom software libraries I developed.
                        </p>

                        <p>
                            Beyond engineering, I channel my creativity into game development. My{' '}
                            <PreviewLink href="https://www.roblox.com/games/114162328499203/Find-the-Toons" target="_blank" rel="noreferrer">projects on Roblox</PreviewLink> have
                            engaged a community of over 175,000 players with more than 6 million play sessions, allowing me to explore
                            large-scale data-driven design.
                        </p>

                        <p>
                            I'm always exploring new ideas and working on creative problems. Feel free to reach out—I'm happy to chat.
                        </p>
                    </div>

                    <div className="about-rail animate-blur-fade delay-300">
                        <figure className="fig-card">
                            <img
                                src="/darren.jpg"
                                alt="Darren Pinto"
                                className="hero-portrait"
                                width="400"
                                height="400"
                                fetchPriority="high"
                                decoding="async"
                            />
                            <figcaption className="fig-caption">
                                <span>Fig. 01 — Darren Pinto</span>
                                <span className="fig-caption-accent">CMU '29</span>
                            </figcaption>
                        </figure>

                        <section className="rail-block" aria-labelledby="news-label">
                            <h2 className="log-label" id="news-label">// News.log</h2>
                            <div className="news-log">
                                {visibleNews.map((item) => (
                                    <div className="news-entry" key={`${item.date}-${item.text}`}>
                                        <span className="news-date">{logDate(item.date)}</span>
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                                {hasMoreNews && (
                                    <button
                                        type="button"
                                        className="news-expand"
                                        onClick={() => setShowAllNews((v) => !v)}
                                        aria-expanded={showAllNews}
                                    >
                                        <span className="news-expand-box" aria-hidden="true">{showAllNews ? '−' : '+'}</span>
                                        {showAllNews ? 'Show fewer' : `Show all — ${news.length} entries`}
                                    </button>
                                )}
                            </div>
                        </section>

                        <section className="rail-block" aria-labelledby="info-label">
                            <h2 className="log-label" id="info-label">// Info</h2>
                            <div className="info-list">
                                <div><span className="info-key">Study —</span> B.S. ECE, Carnegie Mellon · '29</div>
                                <div>
                                    <span className="info-key">Contact —</span>{' '}
                                    <a href={`mailto:${profile.contact.email}`}>Email</a> ·{' '}
                                    <a href={`https://${profile.contact.github}`} target="_blank" rel="noreferrer">GitHub</a> ·{' '}
                                    <a href={`https://${profile.contact.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {latestPost && (
                    <div className="latest-wrap">
                        <Link to={`/blog/${latestPost.slug}`} className="latest-card">
                            <div className="latest-media">
                                <img src={latestPost.image} alt="" loading="lazy" decoding="async" />
                            </div>
                            <div className="latest-content">
                                <span className="log-label" style={{ color: 'var(--accent)' }}>// Latest post</span>
                                <h2 className="latest-title">{latestPost.title}</h2>
                                <p className="latest-excerpt">{latestPost.excerpt}</p>
                                <div className="latest-meta">
                                    {logDate(latestPost.date, true)} · {latestPost.category.toUpperCase()}
                                </div>
                            </div>
                            <div className="latest-go" aria-hidden="true">
                                <span>→</span>
                            </div>
                        </Link>
                    </div>
                )}
            </main>
        </PageLayout>
    );
}

export default About;
