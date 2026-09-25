import { profile } from '../data';

// Stamped by vite.config.js at build time, so "last updated" tracks deploys
// without anyone having to remember to edit it
const built = new Date(__BUILD_DATE__);
const lastUpdated = built.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

function Footer() {
    return (
        <footer className="footer">
            <p className="footer-meta">
                © {built.getFullYear()} {profile.name} · Last updated {lastUpdated}
            </p>
            <nav className="footer-links" aria-label="Contact links">
                <a href={`mailto:${profile.email}`}>Email</a>
                {profile.links.cv && <a href={profile.links.cv} target="_blank" rel="noreferrer">CV</a>}
                <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </nav>
        </footer>
    );
}

export default Footer;
