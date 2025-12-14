import { profile } from './data';

function App() {
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a href="#" className="active">About</a>
          <a href={`https://${profile.contact.github}`} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`https://${profile.contact.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </header>

      <main className="container">
        <h1><strong>Darren</strong> Pinto</h1>
        <p className="subtitle">
          ECE Student at <a href="https://www.cmu.edu/" target="_blank" rel="noreferrer">Carnegie Mellon University</a>
        </p>

        <div className="profile-section prose">
          <img
            src="https://placehold.co/220x220/e0e0e0/666?text=Photo"
            alt="Darren Pinto"
            className="profile-image"
          />

          <p>
            Hello! I'm Darren, and I'm passionate about building intelligent systems at the intersection of
            hardware and software. My interests lie in <strong>robotics</strong>, <strong>reinforcement learning</strong>,
            and <strong>embedded systems</strong>.
          </p>

          <p>
            I will be starting my B.S. in Electrical and Computer Engineering at{' '}
            <a href="https://www.cmu.edu/" target="_blank" rel="noreferrer">Carnegie Mellon University</a> in Fall 2025.
            Currently, I'm an undergraduate researcher at CMU's{' '}
            <a href="https://www.cmu.edu/robotics/" target="_blank" rel="noreferrer">Biorobotics Lab</a>,
            working on integrating depth perception with ROS for robotic learning experiments and exploring
            reinforcement learning for modular robot manipulation using NVIDIA IsaacSim.
          </p>

          <p>
            Previously, I interned at <a href="https://www.cadreforensics.com/" target="_blank" rel="noreferrer">Cadre Research</a>, where I worked on embedded systems,
            PCB design, and high-performance computing prototypes. For four years, I led the software team
            for a <a href="https://www.firstinspires.org/robotics/ftc" target="_blank" rel="noreferrer">FIRST Tech Challenge</a> robotics
            team, building control theory libraries, state-space models, and computer vision systems.
            Our work was showcased to 15,000+ professionals at the Rockwell Industrial Automation Fair.
            We became 3x Illinois State Champions and World Championship Finalists.
          </p>

          <p>
            Outside of engineering, I develop <a href="https://www.roblox.com/games/114162328499203/Find-the-Toons" target="_blank" rel="noreferrer">games on Roblox</a>. My projects have reached over 6 million
            play sessions with a community of 175,000+ players. It's a creative outlet that lets me
            explore game design and data-driven development.
          </p>

          <p>
            In my free time, I enjoy tinkering with side projects, exploring new ideas, and working
            on creative problems. Feel free to reach out—I'm always happy to chat.
          </p>
        </div>

        <div className="socials-section">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '400' }}>Connect</h3>
          <div className="social-links">
            <a href={`mailto:${profile.contact.email}`}>Email</a>
            <a href={`https://${profile.contact.github}`} target="_blank" rel="noreferrer">GitHub</a>
            <a href={`https://${profile.contact.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container" style={{ padding: '1rem 0' }}>
          © {new Date().getFullYear()} Darren Pinto
        </div>
      </footer>
    </>
  );
}

export default App;
