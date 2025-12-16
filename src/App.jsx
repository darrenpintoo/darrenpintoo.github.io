import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import About from './pages/About';
import Blog from './pages/Blog';
import CourseReviews from './pages/CourseReviews';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/courses" element={<CourseReviews />} />
      </Routes>
    </div>
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
      <header className="header animate-blur-fade">
        <div className="header-inner">
          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
            <NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>Blog</NavLink>
            <NavLink to="/courses" className={({ isActive }) => isActive ? 'active' : ''}>Courses</NavLink>
          </nav>
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

      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
