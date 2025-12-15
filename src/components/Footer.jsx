import { useState, useEffect } from 'react';

function Footer() {
    return (
        <footer className="footer fade-in-section is-visible" style={{ animationDelay: '0.5s', opacity: 0.25, fontStyle: 'italic', fontSize: '0.7rem' }}>
            <p>Designed & Built by Darren Pinto</p>
        </footer>
    );
}

export default Footer;
