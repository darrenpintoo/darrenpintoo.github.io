import { profile, news, experiences, projects } from '../data';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Helmet } from 'react-helmet-async';
import PreviewLink from '../components/PreviewLink';
import { getLatestPost, formatDate } from '../utils/posts';
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
                    <div className="hero-text">
                        <h1><strong>Darren</strong> Pinto</h1>
                        <p className="subtitle">
                            Undergraduate Student & Robotics Researcher at{' '}
                            <PreviewLink href="https://www.cmu.edu/" target="_blank" rel="noreferrer">Carnegie Mellon University</PreviewLink>.
                        </p>
                    </div>
                    <img
                        src="/darren.jpg"
                        alt="Darren Pinto"
                        className="hero-portrait"
                        width="400"
                        height="400"
                        fetchPriority="high"
                        decoding="async"
                    />
                    <div className="hero-status">
                        <div className="hero-status-line">
                            <span className="hero-status-when"><span className="status-dot" />Now</span>
                            <span>Research at the <PreviewLink href="https://biorobotics.org/" target="_blank" rel="noreferrer">Biorobotics Lab</PreviewLink> @ CMU</span>
                        </div>
                        <div className="hero-status-line">
                            <span className="hero-status-when">Summer 2026</span>
                            <span>Intern at <PreviewLink href="https://www.ibm.com/" target="_blank" rel="noreferrer">IBM</PreviewLink>, Silicon Valley Laboratory</span>
                        </div>
                    </div>
                </div>

                <div className="prose animate-blur-fade delay-100" style={{ marginTop: '2.5rem' }}>
                    <p>
                        Hi, I'm Darren. I build intelligent systems at the intersection of hardware and software,
                        with a focus on <strong>robotics</strong>, <strong>reinforcement learning</strong>,
                        and <strong>embedded systems</strong>.
                    </p>

                    <p>
                        At CMU I conduct research at the <PreviewLink href="https://biorobotics.org/" target="_blank" rel="noreferrer">Biorobotics Lab</PreviewLink>,
                        exploring reinforcement learning for modular robot manipulation using NVIDIA IsaacSim and integrating
                        depth perception for robotic learning experiments. Previously, I interned
                        at <PreviewLink href="https://www.cadreforensics.com/" target="_blank" rel="noreferrer">Cadre Research</PreviewLink>,
                        where I designed embedded systems and high-performance computing prototypes, and led a World Championship
                        Finalist <PreviewLink href="https://www.firstinspires.org/robotics/ftc" target="_blank" rel="noreferrer">FIRST Tech Challenge</PreviewLink> team.
                    </p>

                    <p>
                        Beyond engineering, my <PreviewLink href="https://www.roblox.com/games/114162328499203/Find-the-Toons" target="_blank" rel="noreferrer">projects on Roblox</PreviewLink> have
                        engaged over 175,000 players across 6 million play sessions — a running experiment in
                        large-scale, data-driven design.
                    </p>
                </div>

                <FadeIn className="home-section">
                    <section aria-labelledby="experience-title">
                        <h2 className="folio" id="experience-title"><span className="folio-num">01</span> Experience</h2>
                        {experiences.map((exp) => (
                            <div className="experience-row" key={exp.company}>
                                <p className="experience-heading">
                                    {exp.role}
                                    {' '}<span className="experience-org">
                                        · <PreviewLink href={exp.url} target="_blank" rel="noreferrer">{exp.company}</PreviewLink>
                                    </span>
                                </p>
                                <span className="experience-date">{exp.date}</span>
                                <p className="experience-summary">{exp.summary}</p>
                            </div>
                        ))}
                    </section>
                </FadeIn>

                <FadeIn className="home-section">
                    <section aria-labelledby="work-title">
                        <h2 className="folio" id="work-title"><span className="folio-num">02</span> Selected Work</h2>
                        <div className="work-grid">
                            {projects.map((project) => (
                                <div className="work-card" key={project.title}>
                                    <h3 className="work-card-title">
                                        {project.title}
                                        <span className="work-card-context">{project.subtitle}</span>
                                    </h3>
                                    <span className="work-card-stats">{project.stats}</span>
                                    <p className="work-card-desc">{project.blurb}</p>
                                    {project.link && (
                                        <div className="work-card-links">
                                            <a href={project.link.href} target="_blank" rel="noreferrer">
                                                {project.link.label} <span aria-hidden="true">↗</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </FadeIn>

                <FadeIn className="home-section">
                    <section aria-labelledby="news-title">
                        <h2 className="folio" id="news-title"><span className="folio-num">03</span> News</h2>
                        <ul className="news-list">
                            {news.map((item) => (
                                <li className="news-item" key={`${item.date}-${item.text}`}>
                                    <span className="news-date">{item.date}</span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </FadeIn>

                {latestPost && (
                    <FadeIn className="home-section">
                        <section aria-labelledby="writing-title">
                            <h2 className="folio" id="writing-title"><span className="folio-num">04</span> Latest Writing</h2>
                            <Link to={`/blog/${latestPost.slug}`} className="latest-post-row">
                                <div className="row-meta">
                                    <span>{formatDate(latestPost.date)}</span>
                                    <span>{latestPost.category}</span>
                                </div>
                                <div className="latest-title">{latestPost.title}</div>
                                <p className="latest-excerpt">{latestPost.excerpt}</p>
                            </Link>
                        </section>
                    </FadeIn>
                )}

                <FadeIn className="home-section">
                    <section aria-labelledby="contact-title">
                        <h2 className="folio" id="contact-title"><span className="folio-num">05</span> Contact</h2>
                        <p className="contact-line">
                            I'm always exploring new ideas and working on creative problems — if you'd like
                            to chat, reach out.
                        </p>
                        <div className="contact-links">
                            <a href={`mailto:${profile.contact.email}`}>EMAIL</a>
                            <a href={`https://${profile.contact.github}`} target="_blank" rel="noreferrer">GITHUB</a>
                            <a href={`https://${profile.contact.linkedin}`} target="_blank" rel="noreferrer">LINKEDIN</a>
                        </div>
                    </section>
                </FadeIn>
            </main>
        </PageLayout>
    );
}

export default About;
