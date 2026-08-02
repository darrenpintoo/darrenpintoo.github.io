import { profile } from '../data';

function Footer() {
    return (
        <footer className="footer">
            <div>Designed &amp; built by Darren Pinto</div>
            <nav className="footer-links" aria-label="Contact links">
                <a href={`mailto:${profile.contact.email}`}>Email</a>
                <a href={`https://${profile.contact.github}`} target="_blank" rel="noreferrer">GitHub</a>
                <a href={`https://${profile.contact.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>
            </nav>
        </footer>
    );
}

export default Footer;
