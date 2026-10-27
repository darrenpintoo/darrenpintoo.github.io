import { useState, useEffect, useRef, useLayoutEffect, useCallback, lazy } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import SuspenseWithFade from './components/SuspenseWithFade';
import PageSkeleton from './components/PageSkeleton';
import Footer from './components/Footer';
import IntroReveal from './components/intro/IntroReveal';
import { getForcedIntro } from './components/intro/introUtils';
import About from './pages/About';
import { profile } from './data';

const Blog = lazy(() => import('./pages/Blog'));
const CourseReviews = lazy(() => import('./pages/CourseReviews'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PortraitLab = lazy(() => import('./pages/PortraitLab'));

const SCAN_REVEAL_KEY = 'scan_reveal_played';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const lastPathRef = useRef(null);

  // Entrances play fully on the first page only; later in-app navigations
  // get a quick fade (see html.entrances-quiet in index.css). Compare against
  // the previous pathname rather than a run-once flag so StrictMode's
  // double-invoked mount effect can't mark the first page as a navigation.
  useEffect(() => {
    if (lastPathRef.current !== null && lastPathRef.current !== location.pathname) {
      document.documentElement.classList.add('entrances-quiet');
    }
    lastPathRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
          <Route path="/courses" element={<CourseReviews />} />
          <Route path="/portrait-lab" element={<PortraitLab />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

function Navigation() {
  const navClass = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <nav className="nav-links" aria-label="Primary">
      <NavLink to="/" end className={navClass}>About</NavLink>
      <NavLink to="/blog" className={navClass}>Writing</NavLink>
      <NavLink to="/courses" className={navClass}>Courses</NavLink>
      {profile.links.cv && (
        <a href={profile.links.cv} target="_blank" rel="noreferrer">CV</a>
      )}
    </nav>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or system preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Intro reveal: first visit per session only, never for reduced motion.
  // A ?intro= query param forces a variant (for testing/comparing).
  const [showIntro, setShowIntro] = useState(() => {
    if (getForcedIntro()) return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try {
      return sessionStorage.getItem(SCAN_REVEAL_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  // While the intro plays, the shader owns the reveal: freeze the elements'
  // own entrance animations so the dissolve unveils settled content instead of
  // two motions fighting. Set before paint (any first-frame flash is under the
  // opaque cover anyway).
  useLayoutEffect(() => {
    if (showIntro) {
      document.documentElement.classList.add('intro-freeze');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIntroComplete = useCallback(() => {
    // Lock the now-revealed hero into its final state so lifting the freeze
    // can't replay its entrance, then restore normal entrance animations for
    // future in-app navigations.
    document.querySelectorAll('.animate-blur-fade, .pre-animate, .profile-image')
      .forEach((el) => {
        el.style.animation = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    document.documentElement.classList.remove('intro-freeze');
    setShowIntro(false);
    try {
      sessionStorage.setItem(SCAN_REVEAL_KEY, 'true');
    } catch { /* ignore */ }
  }, []);

  // Load Umami analytics after main UI is visible
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector('script[data-website-id="5085e392-f6e1-4180-b5b9-d7fcfd42da29"]')) {
      const s = document.createElement('script');
      s.defer = true;
      s.src = 'https://cloud.umami.is/script.js';
      s.setAttribute('data-website-id', '5085e392-f6e1-4180-b5b9-d7fcfd42da29');
      document.head.appendChild(s);
    }
  }, []);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';

    // Add transitioning class for smooth synchronized animation
    document.documentElement.classList.add('theme-transitioning');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update theme-color meta for iOS status bar
    const metaThemeColor = document.getElementById('theme-color-meta');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#121212' : '#fcfbf9');
    }

    // Remove transitioning class after animation completes
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);

    return () => clearTimeout(timeout);
  }, [isDarkMode]);

  useEffect(() => {
    // Easter egg for console inspectors - only show once per session
    const hasGreeted = sessionStorage.getItem('console_greeted');
    if (!hasGreeted) {
      console.log(
        "%c you shouldn't be looking here.....",
        'font-weight: bold; font-size: 14px; color: #ff6b6b;'
      );
      sessionStorage.setItem('console_greeted', 'true');
    }
  }, []);

  return (
    <BrowserRouter>
      <a href="#main" className="skip-link">Skip to main content</a>
      <header className="header animate-blur-fade">
        <div className="header-inner">
          <Link to="/" className="wordmark" aria-label="Darren Pinto — home">
            <span className="wordmark-full">Darren Pinto</span>
            <span className="wordmark-short">DP</span>
          </Link>
          <div className="header-controls">
            <Navigation />
            <button
              className="theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={17} strokeWidth={1.75} /> : <Moon size={17} strokeWidth={1.75} />}
            </button>
          </div>
        </div>
      </header>

      <div className="main-content content-revealed">
        <SuspenseWithFade fallback={<PageSkeleton />}>
          <AnimatedRoutes />
        </SuspenseWithFade>
      </div>

      <Footer />

      {showIntro && <IntroReveal onComplete={handleIntroComplete} />}
    </BrowserRouter>
  );
}

export default App;
