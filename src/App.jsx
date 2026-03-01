import { useState, useEffect, useRef, useLayoutEffect, lazy } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import SuspenseWithFade from './components/SuspenseWithFade';
import PageSkeleton from './components/PageSkeleton';
// import LidarScanReveal from './components/LidarScanReveal';
import About from './pages/About';

const Blog = lazy(() => import('./pages/Blog'));
const CourseReviews = lazy(() => import('./pages/CourseReviews'));
const NotFound = lazy(() => import('./pages/NotFound'));

// const ENABLE_LIDAR_ANIMATION = true; // Set to false to disable

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

  // Update indicator position
  useLayoutEffect(() => {
    const activeKey = location.pathname === '/'
      ? '/'
      : location.pathname.startsWith('/blog')
        ? '/blog'
        : location.pathname.startsWith('/courses')
          ? '/courses'
          : '/';
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

  // Keep indicator aligned when viewport size changes
  useEffect(() => {
    const handleResize = () => {
      const activeKey = location.pathname === '/'
        ? '/'
        : location.pathname.startsWith('/blog')
          ? '/blog'
          : location.pathname.startsWith('/courses')
            ? '/courses'
            : '/';
      const activeLink = linksRef.current[activeKey];
      const nav = navRef.current;
      const indicator = indicatorRef.current;

      if (activeLink && nav && indicator) {
        const navRect = nav.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        indicator.style.width = `${linkRect.width}px`;
        indicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  // const [showLidar, setShowLidar] = useState(() =>
  //   ENABLE_LIDAR_ANIMATION
  //   && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // );
  // const [contentReady, setContentReady] = useState(false);

  // const handleLidarComplete = useCallback(() => {
  //   setShowLidar(false);
  // }, []);

  // Load Umami analytics after main UI is visible (when lidar completes or is disabled)
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

      <div className="main-content content-revealed">
        <SuspenseWithFade fallback={<PageSkeleton />}>
          <AnimatedRoutes />
        </SuspenseWithFade>
      </div>

      {/* {showLidar && (
        <LidarScanReveal
          onComplete={handleLidarComplete}
          contentReady={contentReady}
        />
      )} */}
    </BrowserRouter>
  );
}

export default App;
