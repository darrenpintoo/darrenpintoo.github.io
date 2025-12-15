import { useState } from 'react';

// Sample course data - can be moved to data.js later
const courses = [
    {
        semester: "Fall 2025",
        items: [
            {
                code: "18-220",
                name: "Electronic Devices and Analog Circuits",
                rating: "⭐⭐⭐⭐",
                description: "Introduction to semiconductor devices, diodes, transistors, and analog circuit design."
            }
        ]
    },
    {
        semester: "Spring 2025",
        items: [
            {
                code: "15-112",
                name: "Fundamentals of Programming",
                rating: "⭐⭐⭐⭐⭐",
                description: "A rigorous introduction to programming in Python. Great course for building strong foundations."
            },
            {
                code: "18-100",
                name: "Introduction to Electrical and Computer Engineering",
                rating: "⭐⭐⭐⭐",
                description: "Broad overview of ECE topics including circuits, signals, and systems."
            }
        ]
    }
];

function CourseReviews() {
    const [expandedCourse, setExpandedCourse] = useState(null);

    const toggleCourse = (code) => {
        setExpandedCourse(expandedCourse === code ? null : code);
    };

    return (
        <main className="container">
            <h1>Course Reviews</h1>
            <p className="subtitle">My thoughts on courses at Carnegie Mellon University.</p>

            <div className="course-reviews">
                {courses.map((semester) => (
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
                                        <span className="course-rating">{course.rating}</span>
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
