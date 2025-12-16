import { useState, useRef, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import Footer from '../components/Footer';
import FadeIn from '../components/FadeIn';
import { Helmet } from 'react-helmet-async';



// Fall 2025 CMU courses with ratings and instructor info
const courses = [
    {
        semester: "Spring 2026",
        description: "Currently in progress.",
        items: [
            {
                code: "15-122",
                name: "Principles of Imperative Computation",
                instructor: "Iliano Cervesato & Anne Kohlbrenner",
                units: "12",
                hoursPerWeek: "TBD",
                difficulty: "TBD",
                description: "Currently taking this course."
            },
            {
                code: "21-266",
                name: "Vector Calculus using Matrix Algebra",
                instructor: "Clive Newstead",
                units: "10",
                hoursPerWeek: "TBD",
                difficulty: "TBD",
                description: "Currently taking this course."
            },
            {
                code: "24-101",
                name: "Fundamentals of Mechanical Engineering",
                instructor: "Burak Aksak & Diana Haidar",
                units: "12",
                hoursPerWeek: "TBD",
                difficulty: "TBD",
                description: "Currently taking this course."
            },
            {
                code: "33-142",
                name: "Physics II for Engineering and Physics Students",
                instructor: "David Anderson",
                units: "12",
                hoursPerWeek: "TBD",
                difficulty: "TBD",
                description: "Currently taking this course."
            }
        ]
    },
    {
        semester: "Fall 2025",
        reflection: "21-127 lol",
        items: [
            {
                code: "21-241",
                name: "Matrices and Linear Transformations",
                instructor: "Riley Thornton",
                units: "11",

                hoursPerWeek: "6-8",
                difficulty: "Medium",
                description: `To be completed`
            },
            {
                code: "18-100",
                name: "Introduction to Electrical and Computer Engineering",
                instructor: "Jian-Gang (Jimmy) Zhu",
                units: "12",

                hoursPerWeek: "6-8",
                difficulty: "Easy",
                description: `To be completed`
            },
            {
                code: "21-127",
                name: "Concepts of Mathematics",
                instructor: "Gregory Johnson",
                units: "12",

                hoursPerWeek: "12-15",
                difficulty: "Hard",
                description: `To be completed`
            },
            {
                code: "79-101",
                name: "Interpretation and Argument",
                instructor: "Peter Mayshle",
                units: "9",

                hoursPerWeek: "4-6",
                difficulty: "Easy",
                description: `To be completed`
            },
            {
                code: "39-101",
                name: "CIT First Year Seminar",
                instructor: "Kaz Shindle & Alaine Allen",
                units: "1",

                hoursPerWeek: "1",
                difficulty: "Very Easy",
                description: `To be completed`
            }
        ]
    }
];



const departmentNames = {
    "18": "Electrical & Computer Engineering",
    "21": "Mathematics",
    "79": "History & Humanities",
    "39": "Engineering",
    "15": "Computer Science",
    "24": "Mechanical Engineering",
    "33": "Physics",
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
    const [expandedCourses, setExpandedCourses] = useState(new Set());

    const toggleCourse = (code) => {
        setExpandedCourses(prev => {
            const next = new Set(prev);
            if (next.has(code)) {
                next.delete(code);
            } else {
                next.add(code);
            }
            return next;
        });
    };

    const scrollToCourse = (code) => {
        // First expand the course if not already
        setExpandedCourses(prev => {
            const next = new Set(prev);
            if (!next.has(code)) next.add(code);
            return next;
        });

        // Then scroll to it after a short delay
        setTimeout(() => {
            const element = document.getElementById(code);
            if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }, 100);
    };

    const allCourseCodes = courses.flatMap(sem => sem.items.map(c => c.code));
    const isAllExpanded = allCourseCodes.every(code => expandedCourses.has(code));

    const toggleAll = () => {
        if (isAllExpanded) {
            setExpandedCourses(new Set());
        } else {
            setExpandedCourses(new Set(allCourseCodes));
        }
    };

    const scrollToSemester = (semesterName) => {
        const id = semesterName.replace(/\s+/g, '-');
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <PageLayout>
            <Helmet>
                <title>Coursework & Grades | Darren Pinto</title>
                <meta name="description" content="A list of my computer science and engineering coursework at CMU, including reviews and project links." />
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
                        Use the unified navigation panel below to filter by semester or department.
                    </p>
                </div>
                <div className="course-controls animate-blur-fade delay-200">
                    <div className="control-header">
                        <h2>Navigation</h2>
                        <button onClick={toggleAll} className={`expand-toggle ${isAllExpanded ? 'active' : ''}`}>
                            {isAllExpanded ? "Collapse All" : "Expand All"}
                        </button>
                    </div>

                    <div className="controls-section">
                        <span className="control-label">Jump to Semester</span>
                        <div className="semester-pills">
                            {courses.map(sem => (
                                <button key={sem.semester} onClick={() => scrollToSemester(sem.semester)} className="nav-pill">
                                    {sem.semester}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="controls-section">
                        <span className="control-label">Browse by Department</span>
                        <div className="dept-grid-compact">
                            {Object.keys(coursesForIndex).sort().map(dept => (
                                <div key={dept} className="dept-compact-group">
                                    <span className="dept-label">{dept}</span>
                                    <div className="dept-links">
                                        {coursesForIndex[dept].sort((a, b) => getSemesterValue(a.semester) - getSemesterValue(b.semester)).map(course => (
                                            <a key={course.code} onClick={() => scrollToCourse(course.code)} className="compact-link">
                                                {course.code}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="course-reviews animate-blur-fade delay-350">
                    {courses.map((semester) => (
                        <SemesterGroup key={semester.semester} semester={semester} expandedCourses={expandedCourses} toggleCourse={toggleCourse} />
                    ))}
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.7, marginTop: '3rem', textAlign: 'center' }}>
                    Last updated: December 2025
                </p>
            </main>
            <Footer />
        </PageLayout>
    );
}

function SemesterGroup({ semester, expandedCourses, toggleCourse }) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const totalUnits = semester.items.reduce((acc, curr) => acc + parseInt(curr.units || 0), 0);
    const semesterId = semester.semester.replace(/\s+/g, '-');

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div id={semesterId} ref={sectionRef} className="semester-section">
            <h2 className="semester-title">{semester.semester}</h2>
            <div className={`course-list ${isVisible ? 'visible' : ''}`}>
                {semester.items.map((course, index) => (
                    <FadeIn key={course.code} delay={index < 8 ? index * 0.05 : 0} visible={isVisible}>
                        <div
                            id={course.code}
                            className={`course-card ${expandedCourses.has(course.code) ? 'expanded' : ''}`}
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
                                    <span className="course-units">{course.units} units</span>
                                    <span className="course-expand-icon">
                                        {expandedCourses.has(course.code) ? '−' : '+'}
                                    </span>
                                </div>
                            </div>
                            <div className={`course-expand-wrapper ${expandedCourses.has(course.code) ? 'open' : ''}`}>
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

            <div className={`semester-footer ${isVisible ? 'visible' : ''}`}>
                <div className="semester-stats">
                    <span className="total-units">Total Units: {totalUnits}</span>
                </div>
                {semester.reflection && (
                    <div className="semester-reflection">
                        <p>{semester.reflection}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseReviews;
