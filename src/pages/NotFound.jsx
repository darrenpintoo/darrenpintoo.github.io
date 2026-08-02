import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Helmet } from 'react-helmet-async';

function NotFound() {
    return (
        <PageLayout>
            <Helmet>
                <title>Page Not Found | Darren Pinto</title>
                <meta name="robots" content="noindex" />
            </Helmet>
            <main id="main" className="container">
                <div className="simple-page animate-blur-fade">
                    <h1 className="page-title">404<span className="hero-tail">.</span></h1>
                    <p className="page-sub">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <p>
                        <Link to="/" className="back-link" style={{ marginBottom: 0 }}>
                            <span aria-hidden="true">←</span> Back to home
                        </Link>
                    </p>
                </div>
            </main>
        </PageLayout>
    );
}

export default NotFound;
