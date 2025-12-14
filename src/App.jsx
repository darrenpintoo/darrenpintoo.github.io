import { profile } from './data';

const Header = () => (
  <header className="fade-in" style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)' }}>
      Darren Pinto
    </div>
    <nav>
      <ul style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem' }}>
        <li><a href={`https://${profile.contact.github}`} target="_blank" rel="noreferrer">GitHub</a></li>
        <li><a href={`https://${profile.contact.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a></li>
        <li><a href={`mailto:${profile.contact.email}`}>Email</a></li>
      </ul>
    </nav>
  </header>
);

const Hero = ({ data }) => (
  <section className="section fade-in" style={{ paddingTop: '6rem', paddingBottom: '2rem' }}>
    <h1 style={{ fontSize: '2.8rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
      {data.name}
    </h1>
    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '0' }}>
      {data.tagline}
    </p>
  </section>
);

const About = () => (
  <section className="section prose fade-in" style={{ paddingTop: '1rem' }}>
    <p>
      Hello! I'm an incoming Electrical and Computer Engineering student at{' '}
      <a href="https://www.cmu.edu/" target="_blank" rel="noreferrer">Carnegie Mellon University</a>.
      I'm passionate about building intelligent systems at the intersection of hardware and software,
      with a focus on <strong>robotics</strong> and <strong>reinforcement learning</strong>.
    </p>
    <p>
      Currently, I'm an undergraduate researcher at CMU's{' '}
      <a href="https://www.cmu.edu/robotics/" target="_blank" rel="noreferrer">Biorobotics Lab</a>,
      where I work on integrating depth perception with ROS for robotic learning experiments.
      Previously, I interned at <a href="https://www.cadreresearch.com/" target="_blank" rel="noreferrer">Cadre Research</a> (Cadre Forensics),
      where I designed low-power PCBs, developed stepper motor control systems, and built an HPC prototype on Azure.
    </p>
    <p>
      For four years, I led the software team for the <a href="https://www.firstinspires.org/robotics/ftc" target="_blank" rel="noreferrer">FIRST Tech Challenge</a> robotics team,
      building libraries for control theory, state-space modeling, and computer vision. Our work was showcased to 15,000+ professionals
      at the Rockwell Industrial Automation Fair, and we went on to become 3x Illinois State Champions and World Championship Finalists.
    </p>
    <p>
      Outside of engineering, I've built and released games on Roblox that have garnered over 6 million play sessions and a
      community of 175,000 players. It's a creative outlet that lets me explore game design and data-driven development.
    </p>
    <p>
      In my free time, I enjoy working on side projects, tinkering with electronics, and exploring new ideas.
      Feel free to reach out—I'm always open to chatting about interesting problems.
    </p>
  </section>
);

function App() {
  return (
    <div className="container">
      <Header />
      <Hero data={profile} />
      <About />

      <footer style={{ padding: '4rem 0 2rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', borderTop: '1px solid #ddd', marginTop: '2rem' }}>
        &copy; {new Date().getFullYear()} {profile.name}
      </footer>
    </div>
  );
}

export default App;
