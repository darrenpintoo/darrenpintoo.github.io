import { profile, experiences, projects } from './data';
import { useState, useEffect } from 'react';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';

const Header = () => (
  <header className="fade-in" style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)', letterSpacing: '-0.5px' }}>
      DP<span style={{ color: 'var(--accent)' }}>.</span>
    </div>
    <nav>
      <ul style={{ display: 'flex', gap: '2rem' }}>
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#skills">Skills</a></li>
      </ul>
    </nav>
  </header>
);

const Hero = ({ data }) => (
  <section id="about" className="section fade-in" style={{ padding: '8rem 0 6rem' }}>
    <h1 style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-1px' }}>
      {data.name}
    </h1>
    <h2 style={{ fontSize: '1.8rem', color: 'var(--text-secondary)', fontWeight: '300', marginBottom: '2rem' }}>
      {data.tagline}
    </h2>
    <p style={{ maxWidth: '600px', fontSize: '1.2rem', color: '#ccc', lineHeight: '1.8' }}>
      Passionate about <span style={{ color: 'var(--accent-blue)' }}>robotics</span>, <span style={{ color: 'var(--accent-blue)' }}>reinforcement learning</span>, and <span style={{ color: 'var(--accent-blue)' }}>software engineering</span>.
      Merging electrical engineering with computer science to build intelligent systems.
    </p>
    <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
      <a href={`mailto:${data.contact.email}`} className="btn">Email</a>
      <a href={`https://${data.contact.github}`} target="_blank" rel="noreferrer" className="btn">GitHub</a>
      <a href={`https://${data.contact.linkedin}`} target="_blank" rel="noreferrer" className="btn">LinkedIn</a>
    </div>
    <style jsx>{`
      .btn {
        border: 1px solid var(--text-secondary);
        padding: 0.7rem 1.5rem;
        border-radius: 4px;
        transition: all 0.2s ease;
      }
      .btn:hover {
        border-color: var(--accent);
        color: var(--accent);
        background: rgba(212, 175, 55, 0.1);
      }
    `}</style>
  </section>
);

function App() {
  return (
    <div className="container">
      <Header />
      <Hero data={profile} />

      <section id="experience" className="section">
        <h2 className="section-title">Experience</h2>
        <Experience data={experiences} />
      </section>

      <section id="projects" className="section">
        <h2 className="section-title">Selected Projects</h2>
        <Projects data={projects} />
      </section>

      <section id="skills" className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          <div>
            <h2 className="section-title">Technical Skills</h2>
            <Skills data={profile.skills} />
          </div>
          <div>
            <h2 className="section-title">Education</h2>
            <Education data={profile.education} />
          </div>
        </div>
      </section>

      <footer id="contact" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid #222', marginTop: '4rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Get In Touch</h2>
          <p style={{ marginBottom: '2rem' }}>Currently open to new opportunities.</p>
          <a href={`mailto:${profile.contact.email}`} style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>{profile.contact.email}</a>
        </div>
        <div style={{ marginTop: '4rem' }}>
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
