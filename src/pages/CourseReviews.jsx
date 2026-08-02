import { useState, useRef, useEffect, useMemo } from 'react';
import PageLayout from '../components/PageLayout';
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
        reflection: `I feel as though the course schedule I took was perfect for my first semester at CMU. The workload wasn't extremely demanding, which allowed me to become involved in out-of-the-classroom activities like ScottyLabs, pickleball, and hackathons. My Tuesdays and Thursdays were mostly free and were the days I predominantly spent getting ahead for the week.

Thursday, in particular, would be quite brutal as 21-127 HW and 18-100 labs were due that night. The 21-127 HW alone would take me 8+ hours to conceptualize, solve, and LaTeX, so I needed to plan around this.`,
        items: [
            {
                code: "21-241",
                name: "Matrices and Linear Transformations",
                instructor: "Riley Thornton",
                units: "11",
                hoursPerWeek: "6-8",
                difficulty: "Medium",
                description: `Going into this course, I had lacked any (rigorous) introduction to linear algebra. With this being my first 'non-proof-based' math course, I was quite surprised at the structure of the course. The lectures would mostly consist of the professor writing out formal proofs towards theorems. Although this helped me gain a more intuitive understanding of the topics, I feel as though this was an interesting structure for an application-oriented math course.

Lectures would have sparse turnouts, and sometimes the professor would have to start class with <5 people in the lecture hall. My recitation TA for this course was fantastic and undoubtedly helped me gain deeper intuition for the course content.`
            },
            {
                code: "18-100",
                name: "Introduction to Electrical and Computer Engineering",
                instructor: "Jian-Gang (Jimmy) Zhu",
                units: "12",
                hoursPerWeek: "6-8",
                difficulty: "Easy",
                description: `I feel as though this course is quite effective in what it seeks out to do: provide an overview of ECE. At the cost of doing this, there is a significant amount of 'skimming' topics to ensure that the class covers all the topics.

The labs were quite enjoyable and we got to keep a ton of EE-related circuit components at the end of the semester! Jimmy is a very accommodating professor—after our exam 2 median was <70, he even offered an optional retake for students to replace that score if they desired.`
            },
            {
                code: "21-127",
                name: "Concepts of Mathematics",
                instructor: "Gregory Johnson",
                units: "12",
                hoursPerWeek: "12-15",
                difficulty: "Hard",
                description: `I had previously taken a discrete math course at my local community college during high school (senior summer); however, that course greatly lacked the rigor at which Greggo taught this course. I thoroughly enjoyed this course as it forced me to think differently.

The weekly homeworks conditioned me to grapple with difficult problems and proofs (would take me all of Thursday to complete). The exams (~median 75) were easier than the homeworks; however, the final was quite brutal (median was a 68).`,
                favorite: true
            },
            {
                code: "76-101",
                name: "Interpretation and Argument",
                instructor: "Peter Mayshle",
                units: "9",
                hoursPerWeek: "4-6",
                difficulty: "Easy",
                description: `The core material covered in this class was very similar to my high school AP Lang course as we explored rhetoric through analyzing text.

I had this course at 8 am so attendance for the class in general was not great, but the professor was very accommodating and nice!`
            },
            {
                code: "39-101",
                name: "CIT First Year Seminar",
                instructor: "Kaz Shindle & Alaine Allen",
                units: "1",
                hoursPerWeek: "1",
                difficulty: "Very Easy",
                description: `The course offered the chance to learn more about CMU's offerings within and beyond the college of engineering. Homework in this class was very minimal—a completion-based reflection (~250 words) was the only assignment every week.

I felt as though small group sessions were a good way to connect with an upperclassman in engineering, but I already knew my TA from o-week!`
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

const STORAGE_KEY = 'coursesExpandAll';

const allCourses = courses.flatMap((sem) =>
    sem.items.map((course) => ({ ...course, semester: sem.semester }))
);
const allCodes = allCourses.map((c) => c.code);

// department index for the mono sidebar
const departments = [...new Set(allCourses.map((c) => getDepartment(c.code)))]
    .sort()
    .map((name) => ({
        name,
        codes: allCourses.filter((c) => getDepartment(c.code) === name).map((c) => c.code),
    }));

const prefersReducedMotion = () =>
    typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function scrollToId(id) {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 92;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

function StarIcon({ label }) {
    return (
        <svg
            className="course-mark"
            viewBox="0 0 24 24"
            fill="currentColor"
            role={label ? 'img' : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : 'true'}
        >
            {label && <title>{label}</title>}
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );
}

function HeartIcon({ label }) {
    return (
        <svg
            className="course-mark"
            viewBox="0 0 24 24"
            fill="currentColor"
            role={label ? 'img' : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : 'true'}
        >
            {label && <title>{label}</title>}
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );
}

function CourseReviews() {
    const [expandedCourses, setExpandedCourses] = useState(() => {
        try {
            if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === 'true') {
                return new Set(allCodes);
            }
        } catch { /* ignore */ }
        return new Set();
    });
    const [activeSemester, setActiveSemester] = useState(courses[0]?.semester || '');

    const toggleCourse = (code) => {
        setExpandedCourses((prev) => {
            const next = new Set(prev);
            if (next.has(code)) next.delete(code);
            else next.add(code);
            return next;
        });
        // an individual toggle invalidates the remembered expand-all state,
        // otherwise a collapsed row silently re-expands on the next visit
        try { sessionStorage.setItem(STORAGE_KEY, 'false'); } catch { /* ignore */ }
    };

    const isAllExpanded = allCodes.every((code) => expandedCourses.has(code));

    const toggleAll = () => {
        if (isAllExpanded) {
            setExpandedCourses(new Set());
            try { sessionStorage.setItem(STORAGE_KEY, 'false'); } catch { /* ignore */ }
        } else {
            setExpandedCourses(new Set(allCodes));
            try { sessionStorage.setItem(STORAGE_KEY, 'true'); } catch { /* ignore */ }
        }
    };

    // open a course from a sidebar code chip, then scroll to it once the row
    // has actually grown (two frames: state commit, then layout)
    const jumpToCourse = (code) => {
        setExpandedCourses((prev) => new Set(prev).add(code));
        try { sessionStorage.setItem(STORAGE_KEY, 'false'); } catch { /* ignore */ }
        requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(code)));
    };

    // which semester is in view — drives the sidebar index highlight
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSemester(entry.target.getAttribute('data-semester'));
                    }
                });
            },
            { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
        );

        courses.forEach((sem) => {
            const el = document.getElementById(sem.semester.replace(/\s+/g, '-'));
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <PageLayout>
            <Helmet>
                <title>Course Reviews | Darren Pinto</title>
                <meta name="description" content="A list of my computer science and engineering coursework at CMU, including reviews and project links." />
                <link rel="canonical" href="https://darrenpinto.me/courses" />
            </Helmet>
            <main id="main" className="container">
                <div className="courses-head animate-blur-fade">
                    <h1>Course Reviews<span className="hero-tail">.</span></h1>
                    <p className="page-sub">
                        My thoughts and experiences with courses at Carnegie Mellon University. The abundance of
                        course reviews by CMU students and alumni (Fan Pu in particular) compelled me to create my
                        own. Each review offers a perspective on how the course benefited me.
                    </p>
                    <div className="legend-row">
                        <span className="legend-item"><StarIcon />Favorite of the semester</span>
                        <span className="legend-item"><HeartIcon />Transformative</span>
                    </div>
                </div>

                <div className="courses-layout">
                    <aside className="courses-index animate-blur-fade delay-100" aria-label="Course index">
                        <div className="rail-block">
                            <h2 className="log-label">Semesters</h2>
                            <div className="index-list">
                                {courses.map((sem) => (
                                    <button
                                        key={sem.semester}
                                        type="button"
                                        className={`index-row ${activeSemester === sem.semester ? 'active' : ''}`}
                                        onClick={() => scrollToId(sem.semester.replace(/\s+/g, '-'))}
                                    >
                                        <span>{sem.semester}</span>
                                        <span className="index-count">{String(sem.items.length).padStart(2, '0')}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rail-block">
                            <h2 className="log-label">Departments</h2>
                            <div className="dept-group">
                                {departments.map((dept) => (
                                    <div className="dept" key={dept.name}>
                                        <div className="dept-name">{dept.name}</div>
                                        <div className="dept-codes">
                                            {dept.codes.map((code) => (
                                                <button
                                                    key={code}
                                                    type="button"
                                                    className="code-chip"
                                                    onClick={() => jumpToCourse(code)}
                                                    aria-label={`Jump to ${code}`}
                                                >
                                                    {code}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <div className="animate-blur-fade delay-200">
                        {courses.map((semester, i) => (
                            <SemesterBlock
                                key={semester.semester}
                                semester={semester}
                                expandedCourses={expandedCourses}
                                toggleCourse={toggleCourse}
                                showExpandAll={i === 0}
                                isAllExpanded={isAllExpanded}
                                onToggleAll={toggleAll}
                                totalCourses={allCodes.length}
                            />
                        ))}
                    </div>
                </div>

                <p className="page-note">Last updated: March 2026</p>
            </main>
        </PageLayout>
    );
}

function SemesterBlock({ semester, expandedCourses, toggleCourse, showExpandAll, isAllExpanded, onToggleAll, totalCourses }) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const semesterId = semester.semester.replace(/\s+/g, '-');
    const totalUnits = useMemo(
        () => semester.items.reduce((acc, c) => acc + parseInt(c.units || 0, 10), 0),
        [semester.items]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.05 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id={semesterId}
            data-semester={semester.semester}
            ref={sectionRef}
            className="semester-block"
        >
            <div className="semester-head">
                <h2 className="semester-title">{semester.semester}</h2>
                {showExpandAll ? (
                    // the control spans every semester, so it says so
                    <button
                        type="button"
                        className="expand-all"
                        onClick={onToggleAll}
                        aria-label={`${isAllExpanded ? 'Collapse' : 'Expand'} all ${totalCourses} course reviews`}
                    >
                        <span aria-hidden="true">{isAllExpanded ? '−' : '+'}</span>
                        {isAllExpanded ? 'Collapse all' : 'Expand all'} ({totalCourses})
                    </button>
                ) : (
                    <span className="units-pill">{totalUnits} units</span>
                )}
            </div>

            <div className={`ledger fade-in-section ${isVisible ? 'is-visible' : ''}`}>
                {[...semester.items]
                    .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0))
                    .map((course) => {
                        const open = expandedCourses.has(course.code);
                        return (
                            <div id={course.code} className={`course-row ${open ? 'expanded' : ''}`} key={course.code}>
                                <button
                                    type="button"
                                    className="course-head"
                                    onClick={() => toggleCourse(course.code)}
                                    aria-expanded={open}
                                    aria-controls={`${course.code}-review`}
                                    aria-label={[
                                        `${course.code} ${course.name}`,
                                        course.favorite && 'favorite of the semester',
                                        course.transformative && 'transformative',
                                        `${course.instructor}`,
                                        `${course.units} ${parseInt(course.units, 10) === 1 ? 'unit' : 'units'}`,
                                        `${open ? 'collapse' : 'expand'} review`,
                                    ].filter(Boolean).join(' — ')}
                                >
                                    <span className="course-code">{course.code}</span>
                                    <span className="course-info">
                                        <span className="course-name-row">
                                            <span className="course-name">{course.name}</span>
                                            {course.favorite && <StarIcon />}
                                            {course.transformative && <HeartIcon />}
                                        </span>
                                        <span className="course-instructor">{course.instructor}</span>
                                    </span>
                                    <span className="course-meta">
                                        <span className="units-pill">
                                            {course.units} {parseInt(course.units, 10) === 1 ? 'unit' : 'units'}
                                        </span>
                                        <span className="row-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
                                    </span>
                                </button>

                                <div
                                    id={`${course.code}-review`}
                                    className={`course-expand ${open ? 'open' : ''}`}
                                    aria-hidden={!open}
                                >
                                    <div className="course-expand-inner">
                                        <div className="course-review">
                                            <div className="course-review-body">
                                                {course.description.split(/\n\n+/).map((para, i) => (
                                                    <p key={i}>{para.trim()}</p>
                                                ))}
                                                <div className="course-stats">
                                                    <span>Hours/week <strong>{course.hoursPerWeek}</strong></span>
                                                    <span>Difficulty <strong>{course.difficulty}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {semester.reflection && (
                <div className={`semester-review fade-in-section ${isVisible ? 'is-visible' : ''}`}>
                    <span className="log-label">Semester review · {totalUnits} units</span>
                    {semester.reflection.split(/\n\n+/).map((para, i) => (
                        <p key={i} className="review-text">{para.trim()}</p>
                    ))}
                </div>
            )}
        </section>
    );
}

export default CourseReviews;
