// Site content. The home page renders every section below in order; empty or
// null fields are skipped, so an entry can be filled in incrementally.

export const profile = {
    name: "Darren Pinto",
    affiliation: "Electrical & Computer Engineering · Carnegie Mellon University",
    location: "Pittsburgh, PA",
    email: "pintodarren999@gmail.com",
    links: {
        github: "https://github.com/darrenpintoo",
        linkedin: "https://www.linkedin.com/in/darrpinto",
        // Drop a PDF in /public and set this (e.g. "/cv.pdf") to show a CV
        // link in the header, hero, and footer.
        cv: null,
        scholar: null,
    },
    skills: {
        languages: ["C++", "Python", "Java", "C", "MATLAB", "Lua", "JavaScript", "TypeScript"],
        frameworks: ["ROS", "NumPy", "OpenCV", "PyTorch", "Kubernetes", "Flask"],
        tools: ["Git", "Docker", "Azure", "Linux", "Bash", "Altium Designer", "Onshape"],
    },
};

// Dated one-liners, newest first. `href` may be internal ("/blog/...") or external.
export const news = [
    { date: "Summer 2026", text: "Internship at IBM's Silicon Valley Lab" },
    { date: "Feb 2026", text: "1st place (Product Track) and People's Choice at ProdHacks @ CMU", href: "/blog/prodhacks-2026-cmu" },
    { date: "Jan 2026", text: "Advanced-track win at ACM@CMU's Algorithms with a Purpose", href: "/blog/algorithms-purpose-2026-acm-cmu" },
    { date: "Jan 2026", text: "Won NexHacks 2026", href: "/blog/winning-nexhacks-2026" },
    { date: "Sep 2025", text: "Joined the Biorobotics Lab at the CMU Robotics Institute" },
];

export const research = [
    {
        title: "Reinforcement learning for modular robot manipulation",
        role: "Undergraduate Researcher",
        org: "Biorobotics Lab, CMU Robotics Institute",
        orgUrl: "https://biorobotics.org/",
        // Name the PI or PhD mentor you work with — PhD committees look for it.
        advisor: null,
        date: "Sep 2025 – Present",
        image: "/images/previews/biorobotics-preview.jpg",
        description: "Developing reinforcement-learning approaches to vertical manipulation on modular robots in NVIDIA Isaac Sim, and integrating Intel RealSense depth sensing with ROS for perception in robot-learning experiments.",
        tags: ["Reinforcement learning", "Isaac Sim", "ROS", "RealSense"],
    },
];

export const experience = [
    {
        role: "Intern",
        org: "IBM Silicon Valley Lab",
        orgUrl: "https://www.ibm.com/",
        location: "San Jose, CA",
        date: "Summer 2026",
        summary: null,
    },
    {
        role: "Research & Development Intern",
        org: "Cadre Research",
        orgUrl: "https://www.cadreforensics.com/",
        location: "Evanston, IL",
        date: "Jun – Aug 2025",
        summary: "Embedded systems for 3D virtual microscopy: low-power (<2 mA) ESP32 PCBs with duplex IR comms and RFID tray identification, time-deterministic stepper control in C++, and an Azure/KEDA HPC prototype that sped up comparisons by ~30%.",
    },
    {
        role: "Software Lead & Team Captain",
        org: "Not Your Average Nerds (FIRST Tech Challenge)",
        orgUrl: "https://www.firstinspires.org/robotics/ftc",
        location: "Mundelein, IL",
        date: "2021 – 2025",
        summary: "Led a World Championship Finalist team. Built a control-theory library with state-space subsystem models and an inverse point projection from 2D vision to 3D; Control Award Finalist at the World Championship.",
    },
];

export const projects = [
    {
        title: "SLAM in one week",
        subtitle: "Build18 · Carnegie Mellon",
        date: "Jan 2026",
        image: "/build-18-thumbnail.png",
        description: "Implemented SLAM in a week for a robotics project at CMU's Build18 showcase.",
        tags: ["Robotics", "SLAM"],
        links: [{ label: "Write-up", href: "/blog/implementing-slam-in-1-week" }],
    },
    {
        title: "Find the Toons",
        subtitle: "Cartoon Creation Club · Roblox",
        date: "2024 – Present",
        image: "/images/previews/roblox-preview.jpg",
        stats: "6M+ sessions · 175k+ players · Top 500 on Roblox",
        description: "Two Roblox games with scalable data persistence (zero data loss across 2M+ monthly users), grown to a 175k-player community through data-driven updates.",
        tags: ["Luau", "Roblox Studio"],
        links: [{ label: "Play", href: "https://www.roblox.com/games/114162328499203/Find-the-Toons" }],
    },
    {
        title: "OptiBox",
        subtitle: "High school capstone",
        date: "2024 – 2025",
        image: null,
        stats: "~20% less packaging volume",
        description: "LiDAR-based sizing of the smallest cardboard box for a measured payload, with a real-time Raspberry Pi dashboard for visualization and control.",
        tags: ["Python", "C++", "Flask", "Raspberry Pi", "LiDAR"],
    },
];

export const honors = [
    { date: "Feb 2026", title: "1st Place, Product Track & People's Choice Award", event: "ProdHacks 2026 (BTG @ CMU)" },
    { date: "Jan 2026", title: "Winner, Advanced Track", event: "Algorithms with a Purpose (ACM@CMU)" },
    { date: "Jan 2026", title: "Top 10", event: "Databricks × UN Datathon @ CMU" },
    { date: "Jan 2026", title: "Winner", event: "NexHacks 2026" },
    { date: "2021 – 25", title: "Control Award Finalist & World Championship Finalist", event: "FIRST Tech Challenge" },
    { date: "2021 – 25", title: "3× Illinois State Champion", event: "FIRST Tech Challenge" },
];

export const education = [
    {
        school: "Carnegie Mellon University",
        degree: "B.S. Electrical & Computer Engineering",
        date: "2025 – 2029",
        detail: "Coursework: Concepts of Mathematics, Matrices & Linear Transformations, Principles of Imperative Computation, Vector Calculus, Intro to ECE.",
        link: { label: "Course reviews", href: "/courses" },
    },
    {
        school: "Carmel Catholic High School",
        degree: "Valedictorian (1/263)",
        date: "2025",
    },
];
