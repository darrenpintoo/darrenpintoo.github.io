import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ArrowUpRight, FileText, Github, Linkedin, Mail, Package } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import PreviewLink from '../components/PreviewLink';
import { profile, news, research, experience, projects, honors, education } from '../data';
import { getAllPosts, formatDate } from '../utils/posts';

// Internal paths route in-app; everything else opens in a new tab
function SmartLink({ href, children, ...props }) {
    if (href.startsWith('/')) return <Link to={href} {...props}>{children}</Link>;
    if (href.startsWith('mailto:')) return <a href={href} {...props}>{children}</a>;
    return <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>;
}

function Section({ id, title, children }) {
    return (
        <section className="section" id={id} aria-labelledby={`${id}-title`}>
            <h2 className="section-title" id={`${id}-title`}>{title}</h2>
            <div className="section-body">{children}</div>
        </section>
    );
}

function Entry({ title, date, meta, image, stats, description, tags, links }) {
    return (
        <article className="entry">
            <div className="entry-media" aria-hidden="true">
                {image
                    ? <img src={image} alt="" loading="lazy" decoding="async" />
                    : <Package className="entry-media-icon" size={28} strokeWidth={1.25} />}
            </div>
            <div className="entry-body">
                <div className="entry-head">
                    <h3 className="entry-title">{title}</h3>
                    <span className="entry-date">{date}</span>
                </div>
                {meta && <p className="entry-meta">{meta}</p>}
                {stats && <p className="entry-stats">{stats}</p>}
                <p className="entry-desc">{description}</p>
                {(tags?.length > 0 || links?.length > 0) && (
                    <div className="entry-foot">
                        {tags?.length > 0 && <span className="entry-tags">{tags.join(' · ')}</span>}
                        {links?.map((link) => (
                            <SmartLink key={link.href} href={link.href} className="entry-link">
                                {link.label}
                                {link.href.startsWith('/') ? <ArrowRight size={13} /> : <ArrowUpRight size={13} />}
                            </SmartLink>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}

function DatedList({ items, render }) {
    return (
        <ul className="dated-list">
            {items.map((item, i) => (
                <li className="dated-item" key={i}>
                    <span className="dated-date">{item.date}</span>
                    <div className="dated-body">{render(item)}</div>
                </li>
            ))}
        </ul>
    );
}

function About() {
    const recentPosts = getAllPosts().slice(0, 3);
    const iconProps = { size: 15, strokeWidth: 1.75, 'aria-hidden': true };
    const contactLinks = [
        { label: 'Email', href: `mailto:${profile.email}`, icon: <Mail {...iconProps} /> },
        profile.links.cv && { label: 'CV', href: profile.links.cv, icon: <FileText {...iconProps} /> },
        { label: 'GitHub', href: profile.links.github, icon: <Github {...iconProps} /> },
        { label: 'LinkedIn', href: profile.links.linkedin, icon: <Linkedin {...iconProps} /> },
    ].filter(Boolean);

    return (
        <PageLayout>
            <Helmet>
                <title>Darren Pinto | Robotics Researcher & Engineer</title>
                <meta name="description" content="Darren Pinto is an Electrical & Computer Engineering student at Carnegie Mellon University researching reinforcement learning for robot manipulation in the CMU Biorobotics Lab." />
                <link rel="canonical" href="https://darrenpinto.me/" />
            </Helmet>
            <main id="main" className="container home">
                <div className="hero">
                    <div className="hero-media animate-blur-fade">
                        <img
                            src="/darren.jpg"
                            alt="Portrait of Darren Pinto"
                            className="profile-image"
                            width="400"
                            height="400"
                            fetchPriority="high"
                            decoding="async"
                        />
                    </div>

                    <div className="hero-body animate-blur-fade delay-100">
                        <h1>{profile.name}</h1>
                        <p className="hero-affiliation">{profile.affiliation}</p>

                        <div className="prose hero-bio">
                            <p>
                                I'm an Electrical and Computer Engineering undergraduate at{' '}
                                <PreviewLink href="https://www.cmu.edu/" target="_blank" rel="noreferrer">Carnegie Mellon University</PreviewLink>.
                                I build intelligent systems where hardware meets software, with a focus
                                on <strong>robotics</strong>, <strong>reinforcement learning</strong>,
                                and <strong>embedded systems</strong>.
                            </p>
                            <p>
                                At CMU I do research in the{' '}
                                <PreviewLink href="https://biorobotics.org/" target="_blank" rel="noreferrer">Biorobotics Lab</PreviewLink>,
                                working on reinforcement learning for modular robot manipulation in NVIDIA Isaac Sim
                                and depth perception for robot-learning experiments. I've interned at{' '}
                                <PreviewLink href="https://www.ibm.com/" target="_blank" rel="noreferrer">IBM</PreviewLink>'s
                                Silicon Valley Lab and at{' '}
                                <PreviewLink href="https://www.cadreforensics.com/" target="_blank" rel="noreferrer">Cadre Research</PreviewLink>,
                                where I designed low-power embedded systems and an HPC prototype for 3D virtual microscopy.
                            </p>
                            <p>
                                Before CMU, I was software lead of a World Championship Finalist{' '}
                                <PreviewLink href="https://www.firstinspires.org/robotics/ftc" target="_blank" rel="noreferrer">FIRST Tech Challenge</PreviewLink> team.
                                I also build games: my{' '}
                                <PreviewLink href="https://www.roblox.com/games/114162328499203/Find-the-Toons" target="_blank" rel="noreferrer">Roblox projects</PreviewLink>{' '}
                                have reached 175,000+ players and 6M+ play sessions.
                            </p>
                            <p>
                                I'm always happy to talk about research, robots, or new ideas. Email is the best way to reach me.
                            </p>
                        </div>

                        <ul className="hero-links">
                            {contactLinks.map(({ label, href, icon }) => (
                                <li key={label}>
                                    <SmartLink href={href} className="hero-link">
                                        {icon}
                                        {label}
                                    </SmartLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="animate-blur-fade delay-200">
                    <Section id="news" title="News">
                        <DatedList
                            items={news}
                            render={(item) => item.href
                                ? <SmartLink href={item.href} className="quiet-link">{item.text}</SmartLink>
                                : item.text}
                        />
                    </Section>
                </div>

                <Section id="research" title="Research">
                    {research.map((item) => (
                        <Entry
                            key={item.title}
                            title={item.title}
                            date={item.date}
                            image={item.image}
                            meta={
                                <>
                                    {item.role} · <SmartLink href={item.orgUrl} className="quiet-link">{item.org}</SmartLink>
                                    {item.advisor && <> · Advised by {item.advisor}</>}
                                </>
                            }
                            description={item.description}
                            tags={item.tags}
                        />
                    ))}
                </Section>

                <Section id="experience" title="Experience">
                    <ul className="cv-list">
                        {experience.map((item) => (
                            <li className="cv-item" key={item.org}>
                                <div className="cv-head">
                                    <h3 className="cv-title">
                                        <SmartLink href={item.orgUrl} className="quiet-link">{item.org}</SmartLink>
                                    </h3>
                                    <span className="entry-date">{item.date}</span>
                                </div>
                                <p className="cv-sub">{item.role} · {item.location}</p>
                                {item.summary && <p className="cv-summary">{item.summary}</p>}
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section id="projects" title="Projects">
                    {projects.map((item) => (
                        <Entry
                            key={item.title}
                            title={item.title}
                            date={item.date}
                            image={item.image}
                            meta={item.subtitle}
                            stats={item.stats}
                            description={item.description}
                            tags={item.tags}
                            links={item.links}
                        />
                    ))}
                </Section>

                <Section id="honors" title="Honors">
                    <DatedList
                        items={honors}
                        render={(item) => (
                            <>
                                <span className="honor-title">{item.title}</span>
                                <span className="honor-event">{item.event}</span>
                            </>
                        )}
                    />
                </Section>

                {recentPosts.length > 0 && (
                    <Section id="writing" title="Writing">
                        <DatedList
                            items={recentPosts.map((post) => ({ ...post, date: formatDate(post.date) }))}
                            render={(post) => (
                                <>
                                    <Link to={`/blog/${post.slug}`} className="quiet-link post-line-title">{post.title}</Link>
                                    <span className="honor-event">{post.category}</span>
                                </>
                            )}
                        />
                        <Link to="/blog" className="section-more">
                            All writing <ArrowRight size={14} />
                        </Link>
                    </Section>
                )}

                <Section id="education" title="Education">
                    <ul className="cv-list">
                        {education.map((item) => (
                            <li className="cv-item" key={item.school}>
                                <div className="cv-head">
                                    <h3 className="cv-title">{item.school}</h3>
                                    <span className="entry-date">{item.date}</span>
                                </div>
                                <p className="cv-sub">{item.degree}</p>
                                {item.detail && (
                                    <p className="cv-summary">
                                        {item.detail}{' '}
                                        {item.link && (
                                            <Link to={item.link.href} className="inline-more">
                                                {item.link.label} <ArrowRight size={13} />
                                            </Link>
                                        )}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </Section>
            </main>
        </PageLayout>
    );
}

export default About;
