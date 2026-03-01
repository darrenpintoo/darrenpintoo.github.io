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
                <h1>Page not found</h1>
                <p className="subtitle" style={{ marginBottom: '1.5rem' }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <p>
                    <Link to="/" className="back-link" style={{ display: 'inline-flex' }}>
                        Go home
                    </Link>
                </p>
            </main>
        </PageLayout>
    );
}

export default NotFound;
