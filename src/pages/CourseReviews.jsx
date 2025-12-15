import { useState } from 'react';

// Star rating component
function StarRating({ rating }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="star-rating" title={`${rating}/5`}>
            {[...Array(fullStars)].map((_, i) => (
                <span key={`full-${i}`} className="star filled">★</span>
            ))}
            {hasHalfStar && <span className="star half">★</span>}
            {[...Array(emptyStars)].map((_, i) => (
                <span key={`empty-${i}`} className="star empty">★</span>
            ))}
        </div>
    );
}

// Fall 2025 CMU courses with ratings (1-5)
const courses = [
    {
        semester: "Fall 2025",
        items: [
            {
                code: "21-241",
                name: "Matrices and Linear Transformations",
                units: "11",
                rating: 4.5,
                description: `This course is a rigorous introduction to linear algebra, covering matrix operations, 
                vector spaces, linear transformations, eigenvalues and eigenvectors, and applications. 
                The course provides a solid mathematical foundation essential for electrical and computer engineering, 
                as well as machine learning and computer graphics.`
            },
            {
                code: "18-100",
                name: "Introduction to Electrical and Computer Engineering",
                units: "12",
                rating: 4,
                description: `A broad introduction to ECE, covering the fundamentals of circuits, signals, 
                digital logic, and embedded systems. Hands-on labs provide experience with oscilloscopes, 
                function generators, and building actual circuits. A great starting point for understanding 
                the hardware side of computing.`
            },
            {
                code: "21-127",
                name: "Concepts of Mathematics",
                units: "12",
                rating: 4,
                description: `Introduction to mathematical reasoning and proof techniques. Topics include 
                logic, set theory, relations, functions, cardinality, and introductory number theory. 
                This course develops the rigorous mathematical thinking required for upper-level CS and math courses.`
            },
            {
                code: "79-101",
                name: "Interpretation and Argument",
                units: "9",
                rating: 3.5,
                description: `A writing-intensive course focused on developing critical reading and 
                argumentation skills. Students analyze texts from various disciplines and learn to 
                construct well-reasoned arguments. Essential for developing clear communication skills 
                that are valuable in any field.`
            },
            {
                code: "39-101",
                name: "CIT First Year Seminar",
                units: "1",
                rating: 3,
                description: `A seminar designed to help first-year students transition to CMU and the 
                College of Engineering. Topics include academic success strategies, career exploration, 
                and introduction to research opportunities within CIT.`
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
                                        <span className="course-code">{course.code}</span>
                                        <span className="course-name">{course.name}</span>
                                        <StarRating rating={course.rating} />
                                        <span className="course-units">{course.units} units</span>
                                        <span className="course-expand-icon">
                                            {expandedCourse === course.code ? '−' : '+'}
                                        </span>
                                    </div>
                                    {expandedCourse === course.code && (
                                        <div className="course-description">
                                            <p>{course.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default CourseReviews;
