import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import About from './pages/About';
import Blog from './pages/Blog';
import CourseReviews from './pages/CourseReviews';

function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
          <NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>Blog</NavLink>
          <NavLink to="/courses" className={({ isActive }) => isActive ? 'active' : ''}>Courses</NavLink>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/courses" element={<CourseReviews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
