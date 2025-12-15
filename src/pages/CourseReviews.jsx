import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import Footer from '../components/Footer';
import FadeIn from '../components/FadeIn';
import { Helmet } from 'react-helmet-async';

// Modern star rating component with filled gradient
function StarRating({ rating }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(<span key={i} className="star filled">★</span>);
        } else if (i - rating < 1 && i - rating > 0) {
            stars.push(<span key={i} className="star half">★</span>);
        } else {
            stars.push(<span key={i} className="star empty">★</span>);
        }
    }

    return (
        <div className="star-rating" title={`${rating}/5`}>
            {stars}
            <span className="rating-number">{rating.toFixed(1)}</span>
        </div>
    );
}

// Fall 2025 CMU courses with ratings and instructor info
const courses = [
    {
        semester: "Fall 2025",
        items: [
            {
                code: "21-241",
                name: "Matrices and Linear Transformations",
                instructor: "Riley Thornton",
                units: "11",
                rating: 3,
                hoursPerWeek: "6-8",
                difficulty: "Medium",
                description: `To be completed`
            },
            {
                code: "18-100",
                name: "Introduction to Electrical and Computer Engineering",
                instructor: "Jian-Gang (Jimmy) Zhu",
                units: "12",
                rating: 3.5,
                hoursPerWeek: "6-8",
                difficulty: "Easy",
                description: `To be completed`
            },
            {
                code: "21-127",
                name: "Concepts of Mathematics",
                instructor: "Gregory Johnson",
                units: "12",
                rating: 4.5,
                hoursPerWeek: "12-15",
                difficulty: "Hard",
                description: `To be completed`
            },
            {
                code: "79-101",
                name: "Interpretation and Argument",
                instructor: "Peter Mayshle",
                units: "9",
                rating: 3,
                hoursPerWeek: "4-6",
                difficulty: "Easy",
                description: `To be completed`
            },
            {
                code: "39-101",
                name: "CIT First Year Seminar",
                instructor: "Kaz Shindle & Alaine Allen",
                units: "1",
                rating: 1,
                hoursPerWeek: "1",
                difficulty: "Very Easy",
                description: `To be completed`
            }
        ]
    }
];

// Sort courses within each semester by rating (highest first)
const sortedCourses = courses.map(semester => ({
    ...semester,
    items: [...semester.items].sort((a, b) => b.rating - a.rating)
}));

const departmentNames = {
    "18": "Electrical & Computer Engineering",
    "21": "Mathematics",
    "79": "History & Humanities",
    "39": "Engineering",
};

const getDepartment = (code) => {
    const prefix = code.split('-')[0];
    return departmentNames[prefix] || "Other";
};

// Extract unique departments for filter
const allDepartments = ["All", ...new Set(
    courses.flatMap(sem => sem.items.map(c => getDepartment(c.code)))
)].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return a.localeCompare(b);
});

// Helper for sorting semesters chronologically
const getSemesterValue = (semester) => {
    const [season, year] = semester.split(' ');
    const seasonValue = { 'Spring': 0, 'Summer': 1, 'Fall': 2 }[season] || 0;
    return parseInt(year) * 10 + seasonValue;
};

// Group all courses by Department for the Index, preserving semester info
const coursesForIndex = courses.flatMap(sem =>
    sem.items.map(course => ({ ...course, semester: sem.semester }))
).reduce((acc, course) => {
    const dept = getDepartment(course.code);
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(course);
    return acc;
}, {});

function CourseReviews() {
    const [expandedCourse, setExpandedCourse] = useState(null);

    const toggleCourse = (code) => {
        setExpandedCourse(expandedCourse === code ? null : code);
    };

    const scrollToCourse = (code) => {
        const element = document.getElementById(code);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            // Auto expand the course when navigating to it
            setExpandedCourse(code);
        }
    };



    return (
        <PageLayout>
            <Helmet>
                <title>Coursework & Grades | Darren Pinto</title>
                <meta name="description" content="A list of my computer science and engineering coursework at CMU, including ratings, reviews, and project links." />
                <link rel="canonical" href="https://darrenpinto.me/courses" />
            </Helmet>
            <main className="container">
                <div className="animate-blur-fade">
                    <h1>CMU Course Reviews</h1>
                    <p className="subtitle">
                        My thoughts and experiences with courses at Carnegie Mellon University.
                    </p>
                </div>

                <div className="course-intro prose animate-blur-fade delay-100">
                    <p>
                        As an ECE student at CMU, I'm documenting my journey through the curriculum.
                        Below you'll find my honest reviews of courses I've taken, organized by semester.
                        Use the index below to jump to specific topics.
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.7, marginTop: '1rem' }}>
                        Last updated: December 2025
                    </p>
                </div>

                {/* Course Index Section */}
                <div className="course-index animate-blur-fade delay-200">
                    <h2>Course Index</h2>
                    <div className="course-index-grid">
                        {Object.keys(coursesForIndex).sort().map(dept => (
                            <div key={dept} className="index-category">
                                <h3>{dept}</h3>
                                <ul>
                                    {coursesForIndex[dept].sort((a, b) => getSemesterValue(a.semester) - getSemesterValue(b.semester)).map(course => (
                                        <li key={course.code}>
                                            <a onClick={() => scrollToCourse(course.code)} className="index-link">
                                                <span className="index-code">{course.code}</span>
                                                <span className="index-name">{course.name}</span>
                                                <span className="index-semester">{course.semester}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="course-reviews animate-blur-fade delay-350">
                    {sortedCourses.map((semester) => (
                        <div key={semester.semester} className="semester-section">
                            <h2 className="semester-title">{semester.semester}</h2>
                            <div className="course-list">
                                {semester.items.map((course, index) => (
                                    <FadeIn key={course.code} delay={index * 0.1}>
                                        <div
                                            id={course.code}
                                            className={`course-card ${expandedCourse === course.code ? 'expanded' : ''}`}
                                            onClick={() => toggleCourse(course.code)}
                                        >
                                            <div className="course-header">
                                                <div className="course-info">
                                                    <div className="course-title-row">
                                                        <span className="course-code">{course.code}</span>
                                                        <span className="course-name">{course.name}</span>
                                                    </div>
                                                    <div className="course-instructor">
                                                        Instructor: {course.instructor}
                                                    </div>
                                                </div>
                                                <div className="course-meta">
                                                    <StarRating rating={course.rating} />
                                                    <span className="course-units">{course.units} units</span>
                                                    <span className="course-expand-icon">
                                                        {expandedCourse === course.code ? '−' : '+'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`course-expand-wrapper ${expandedCourse === course.code ? 'open' : ''}`}>
                                                <div className="course-expand-inner">
                                                    <div className="course-expanded">
                                                        <div className="course-description">
                                                            <p>{course.description}</p>
                                                        </div>
                                                        <div className="course-stats">
                                                            <div className="stat-item">
                                                                <span className="stat-label">Hours/Week</span>
                                                                <span className="stat-value">{course.hoursPerWeek}</span>
                                                            </div>
                                                            <div className="stat-item">
                                                                <span className="stat-label">Difficulty</span>
                                                                <span className="stat-value">{course.difficulty}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </PageLayout>
    );
}

export default CourseReviews;
