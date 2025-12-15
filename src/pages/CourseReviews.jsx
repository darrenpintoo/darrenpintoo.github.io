import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import Footer from '../components/Footer';

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

function CourseReviews() {
    const [expandedCourse, setExpandedCourse] = useState(null);

    const toggleCourse = (code) => {
        setExpandedCourse(expandedCourse === code ? null : code);
    };

    return (
        <PageLayout>
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
                        Below you'll find my honest reviews of courses I've taken, including workload,
                        teaching quality, and key takeaways. Click on any course to expand the review.
                        Courses are sorted by my personal rating.
                    </p>
                </div>

                <div className="course-reviews animate-blur-fade delay-200">
                    {sortedCourses.map((semester) => (
                        <div key={semester.semester} className="semester-section">
                            <h2 className="semester-title">{semester.semester}</h2>
                            <div className="course-list">
                                {semester.items.map((course) => (
                                    <div
                                        key={course.code}
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
                                        {expandedCourse === course.code && (
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
                                        )}
                                    </div>
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
