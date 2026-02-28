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
            },
            {
                code: "76-270",
                name: "Writing for the Professions",
                instructor: "Andrew Gordon",
                units: "12",
                hoursPerWeek: "TBD",
                difficulty: "TBD",
                description: "Currently taking this course."

            }
        ]
    },
    {
        semester: "Fall 2025",
        reflection: "I feel as though the course schedule I took was perfect for my first semester at CMU. The workload wasn't extremely demanding, which allowed me to become involved in out of the classroom activities like ScottyLabs, pickleball, and hackathons. My Tuesdays and Thursdays were mostly free and would be the day that I predominantly spent getting ahead for the week. Thursday, in particular, would be quite brutal as 21-127 HW and 18-100 labs were due that night. The 21-127 HW alone would take me 8+ hours to conceptual, solve, and latex, so I needed to plan around this. ",
        items: [
            {
                code: "21-241",
                name: "Matrices and Linear Transformations",
                instructor: "Riley Thornton",
                units: "11",
                hoursPerWeek: "6-8",
                difficulty: "Medium",
                description: `Going into this course, I had lacked any (rigorous) introduction to linear algebra. With this being my first \'non-proof-based\' math course, I was quite surprised at the structure of the course. The lectures would mostly consist of the professor writing out formal proofs towards theorems. Although this helped me gain a more intutive understanding of the topics, I feel as though this was an interesting structure for an application-oriented math course. Lectures would have sparse turnouts, and sometimes the professor would have to start class with <5 people in the lecture hall. My recitation TA for this course was fantastic and undoubtably helped me gain deeper intution for the course content.`
            },
            {
                code: "18-100",
                name: "Introduction to Electrical and Computer Engineering",
                instructor: "Jian-Gang (Jimmy) Zhu",
                units: "12",
                hoursPerWeek: "6-8",
                difficulty: "Easy",
                description: `I feel as though this course is quite effective in what it seeks out to do: provide an overview of ECE. At the cost of doing this, there is a signifcant amount of \'skimming\' topics to ensure that the class covers all the topics. The labs were quite enjoyable and we got to keep a ton of EE-related circuit components at the end of the semester! Jimmy is a very accomidating professor, after our exam 2 median was <70, he even offered an optional retake for students to replace that score if they desired.`
            },
            {
                code: "21-127",
                name: "Concepts of Mathematics",
                instructor: "Gregory Johnson",
                units: "12",
                hoursPerWeek: "12-15",
                difficulty: "Hard",
                description: `I had previously taken a discrete math course at my local community college during high school (seniro summer), however that course greatly lacked the rigor at which greggo taught this course. I thoroughly enjoyed this course as it forced me to think differently. The weekly homeworks for this course conditioned me to grapple with difficult programs and proofs (would take me all of Thursday to complete). The exams (~median 75) were easier than the homeworks, however, the final was quite brutal (median was a 68).`,
                favorite: true
            },
            {
                code: "76-101",
                name: "Interpretation and Argument",
                instructor: "Peter Mayshle",
                units: "9",
                hoursPerWeek: "4-6",
                difficulty: "Easy",
                description: `The core material covered in this class was very similar to my high school AP Lang course as we explored rhetoric through analyzing text. I had this course at 8 am so attendance for the class in general was not great, but the professor was very accomodating and nice!`
            },
            {
                code: "39-101",
                name: "CIT First Year Seminar",
                instructor: "Kaz Shindle & Alaine Allen",
                units: "1",
                hoursPerWeek: "1",
                difficulty: "Very Easy",
                description: `The course offered the chance to learn more about CMU's offering within and beyond the college of engineering. Homework in this class was very minimal as a completion-based reflection (~250 words) was the only assignment every week. I felt as though small group sessions were a good way to connect with an upperclassmen in engineering, but I already knew my TA from o-week! `
            }
        ]
    }
];

const departmentNames = {
    "18": "Electrical & Computer Engineering",
    "21": "Mathematics",
    "76": "English",
    "39": "Engineering",
    "15": "Computer Science",
    "24": "Mechanical Engineering",
    "33": "Physics",
};

const getDepartment = (code) => {
    const prefix = code.split('-')[0];
    return departmentNames[prefix] || "Other";
};

// Flatten courses for search/index
const allCoursesList = courses.flatMap(sem =>
    sem.items.map(course => ({ ...course, semester: sem.semester }))
);

function CourseReviews() {
    const [expandedCourses, setExpandedCourses] = useState(new Set());
    const [activeSemester, setActiveSemester] = useState("");

    // Toggle logic
    const toggleCourse = (code) => {
        setExpandedCourses(prev => {
            const next = new Set(prev);
            if (next.has(code)) next.delete(code);
            else next.add(code);
            return next;
        });
    };

    const toggleAll = () => {
        const allCodes = allCoursesList.map(c => c.code);
        const isAllExpanded = allCodes.every(code => expandedCourses.has(code));
        if (isAllExpanded) setExpandedCourses(new Set());
        else setExpandedCourses(new Set(allCodes));
    };

    const isAllExpanded = allCoursesList.every(c => expandedCourses.has(c.code));

    // Scroll helpers
    const scrollToId = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            // Also explicitly set active to avoid jitter during scroll
            if (!id.includes('-')) setActiveSemester(""); // Basic heuristic
            else if (id.includes(' ')) setActiveSemester(id);
        }
    };

    const scrollToCourse = (code) => {
        setExpandedCourses(prev => new Set(prev).add(code));
        setTimeout(() => scrollToId(code), 100);
    };

    // ScrollSpy Logic
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Use the data-semester attribute for stable ID tracking
                        setActiveSemester(entry.target.getAttribute('data-semester'));
                    }
                });
            },
            {
                rootMargin: "-20% 0px -60% 0px", // Trigger when element is near top
                threshold: 0
            }
        );

        courses.forEach(sem => {
            const id = sem.semester.replace(/\s+/g, '-');
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Department grouping
    const departments = [...new Set(allCoursesList.map(c => getDepartment(c.code)))].sort();


    return (
        <PageLayout>
            <Helmet>
                <title>Coursework & Grades | Darren Pinto</title>
                <meta name="description" content="A list of my computer science and engineering coursework at CMU, including reviews and project links." />
                <link rel="canonical" href="https://darrenpinto.me/courses" />
            </Helmet>
            <main className="container">
                <div className="animate-blur-fade page-header-flex">
                    <div>
                        <h1>CMU Course Reviews</h1>
                        <p className="subtitle" style={{ marginBottom: 0 }}>
                            My thoughts and experiences with courses at Carnegie Mellon University. I feel as though the abundance of course reviews on other websites of CMU students/alumna (Fan Pu in particular) has compelled me to create one of my own.
                        </p>
                        <p className="subtitle" style={{ marginBottom: 0 }}>
                            In each of the reflection/reviews I attempt to offer a perspective of how I felt the course benefited me.
                        </p>
                        <div className="course-legend">
                            <span className="legend-item">
                                <svg className="legend-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <span className="legend-text" aria-label="Favorite course of the semester">Favorite course of the semester</span>
                            </span>
                            <span className="legend-item">
                                <svg className="legend-icon legend-icon-transformative" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span className="legend-text" aria-label="Transformative course">Transformative course</span>
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={toggleAll}
                        className="text-action-btn"
                        aria-label={isAllExpanded ? "Collapse all courses" : "Expand all courses"}
                    >
                        {isAllExpanded ? (
                            <>
                                <span style={{ fontSize: '1.2em' }}>−</span> Collapse All
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: '1.2em' }}>+</span> Expand All
                            </>
                        )}
                    </button>
                </div>

                <div className="course-layout">
                    {/* Sticky Sidebar */}
                    <aside className="course-sidebar animate-blur-fade delay-100">
                        <div className="sidebar-section">
                            <h3 className="sidebar-title">Semesters</h3>
                            <div className="sidebar-nav">
                                {courses.map(sem => (
                                    <button
                                        key={sem.semester}
                                        onClick={() => scrollToId(sem.semester.replace(/\s+/g, '-'))}
                                        className={`sidebar-link ${activeSemester === sem.semester ? 'active' : ''}`}
                                    >
                                        {sem.semester}
                                    </button>
                                ))}
                            </div>
                        </div>



                        <div className="sidebar-section sidebar-dept-section">
                            <h3 className="sidebar-title">Departments</h3>
                            <div className="sidebar-nav">
                                {departments.map(dept => (
                                    <div key={dept} style={{ marginBottom: '0.5rem' }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                                            {dept}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {allCoursesList.filter(c => getDepartment(c.code) === dept).map(c => (
                                                <button
                                                    key={c.code}
                                                    onClick={() => scrollToCourse(c.code)}
                                                    aria-label={`Jump to ${c.code}: ${c.name}`}
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        padding: '2px 6px',
                                                        background: 'var(--stat-bg)',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        color: 'var(--accent)'
                                                    }}
                                                >
                                                    {c.code}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </aside>

                    {/* Main Content */}
                    <div className="course-content animate-blur-fade delay-200">
                        {courses.map((semester) => (
                            <SemesterGroup
                                key={semester.semester}
                                semester={semester}
                                expandedCourses={expandedCourses}
                                toggleCourse={toggleCourse}
                            />
                        ))}
                    </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.7, marginTop: '5rem', textAlign: 'center' }}>
                    Last updated: March 2026
                </p>
            </main>
            <Footer />
        </PageLayout >
    );
}

function SemesterGroup({ semester, expandedCourses, toggleCourse }) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
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
        <div
            id={semesterId}
            data-semester={semester.semester}
            ref={sectionRef}
            className="semester-section"
            style={{ scrollMarginTop: '100px' }}
        >
            <h2 className="semester-title">{semester.semester}</h2>
            <div className={`course-list ${isVisible ? 'visible' : ''}`}>
                {[...semester.items].sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0)).map((course, index) => (
                    <FadeIn key={course.code} delay={index < 8 ? index * 0.05 : 0} visible={isVisible}>
                        <div
                            id={course.code}
                            className={`course-card ${expandedCourses.has(course.code) ? 'expanded' : ''}`}
                            onClick={() => toggleCourse(course.code)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCourse(course.code); } }}
                            role="button"
                            tabIndex={0}
                            aria-expanded={expandedCourses.has(course.code)}
                        >
                            <div className="course-header">
                                <div className="course-info">
                                    <div className="course-title-row">
                                        <span className="course-code">{course.code}</span>
                                        <span className="course-name">{course.name}</span>
                                        {course.favorite && (
                                            <svg className="course-favorite" viewBox="0 0 24 24" fill="currentColor" aria-label="Favorite course of the semester">
                                                <title>Favorite course of the semester</title>
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        )}
                                        {course.transformative && (
                                            <svg className="course-transformative" viewBox="0 0 24 24" fill="currentColor" aria-label="Transformative course">
                                                <title>Transformative course</title>
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        )}
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
                <div className="semester-review-card">
                    <div className="review-header">
                        <span className="review-label">Semester Review</span>
                        <span className="review-units">{semester.items.reduce((acc, curr) => acc + parseInt(curr.units || 0), 0)} units</span>
                    </div>
                    {semester.reflection && (
                        <p className="review-text">{semester.reflection}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseReviews;
