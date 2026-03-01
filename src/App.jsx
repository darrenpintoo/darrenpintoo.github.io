import { useState, useEffect, useRef, useLayoutEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';

const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const CourseReviews = lazy(() => import('./pages/CourseReviews'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
          <Route path="/courses" element={<CourseReviews />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

// Navigation component with sliding highlight
function Navigation() {
  const location = useLocation();
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const linksRef = useRef({});

  // Determine which nav item is active based on pathname
  const getActiveKey = () => {
    if (location.pathname === '/') return '/';
    if (location.pathname.startsWith('/blog')) return '/blog';
    if (location.pathname.startsWith('/courses')) return '/courses';
    return '/';
  };

  // Update indicator position
  useLayoutEffect(() => {
    const activeKey = getActiveKey();
    const activeLink = linksRef.current[activeKey];
    const nav = navRef.current;
    const indicator = indicatorRef.current;

    if (activeLink && nav && indicator) {
      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      indicator.style.width = `${linkRect.width}px`;
      indicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
    }
  }, [location.pathname]);

  return (
    <nav className="nav-links" ref={navRef}>
      <div className="nav-indicator" ref={indicatorRef} />
      <NavLink
        to="/"
        ref={(el) => linksRef.current['/'] = el}
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        About
      </NavLink>
      <NavLink
        to="/blog"
        ref={(el) => linksRef.current['/blog'] = el}
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Blog
      </NavLink>
      <NavLink
        to="/courses"
        ref={(el) => linksRef.current['/courses'] = el}
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Courses
      </NavLink>
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
      metaThemeColor.setAttribute('content', isDarkMode ? '#121212' : '#ffffff');
    }

    // Remove transitioning class after animation completes
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 500);

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
          <Navigation />
          <button
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
        </div>
      </header>

      <Suspense fallback={<div className="container" style={{ paddingTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }} aria-live="polite">Loading…</div>}>
        <AnimatedRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

