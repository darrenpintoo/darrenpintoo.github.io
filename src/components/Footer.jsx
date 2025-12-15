import FadeIn from './FadeIn';

function Footer() {
    return (
        <FadeIn>
            <footer className="footer" style={{ opacity: 0.4, fontStyle: 'italic', fontSize: '0.7rem' }}>
                <p>Designed & Built by Darren Pinto</p>
            </footer>
        </FadeIn>
    );
}

export default Footer;
