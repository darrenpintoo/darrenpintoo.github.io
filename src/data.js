export const profile = {
    name: "Darren Pinto",
    tagline: "Engineer & Researcher",
    contact: {
        email: "pintodarren999@gmail.com",
        github: "github.com/darrenpintoo",
        linkedin: "linkedin.com/in/darrpinto",
    },
    education: [
        {
            university: "Carnegie Mellon University",
            location: "Pittsburgh, PA",
            degree: "B.S. in Electrical and Computer Engineering",
            date: "Aug 2025 - May 2029",
            courses: [
                "Intro to ECE",
                "Matrices & Linear Transformations",
                "Concepts of Math",
            ],
        },
        {
            university: "Carmel Catholic High School",
            location: "Mundelein, IL",
            degree: "Valedictorian (Rank 1/263)",
            date: "May 2025",
        },
    ],
    skills: {
        languages: [
            "C++",
            "Python",
            "Java",
            "C",
            "MATLAB",
            "Lua",
            "JavaScript",
            "TypeScript",
        ],
        frameworks: [
            "ROS",
            "NumPy",
            "OpenCV",
            "PyTorch",
            "Kubernetes",
            "Flask",
        ],
        tools: [
            "Git",
            "Docker",
            "Azure",
            "Linux",
            "Bash",
            "Altium Designer",
            "Onshape",
        ],
    },
};

// Short dated updates for the About-page news log (newest first).
// ISO year-month; rendered as a 2026.02 readout by logDate().
export const news = [
    { date: "2026-02", text: "1st place at ProdHacks @ CMU" },
    { date: "2026-01", text: "Advanced-track win at ACM's Algorithms with a Purpose" },
    { date: "2026-01", text: "Won NexHacks 2026" },
    { date: "2025-09", text: "Joined the CMU Biorobotics Lab" },
];

export const experiences = [
    {
        role: "Undergraduate Student Researcher",
        company: "Biorobotics Lab — CMU Robotics Institute",
        url: "https://biorobotics.org/",
        location: "Pittsburgh, PA",
        date: "Sep 2025 – Present",
        summary: "Reinforcement learning for modular robot manipulation in NVIDIA IsaacSim; depth perception with Intel RealSense and ROS.",
        description: [
            "Integrating Intel RealSense Depth camera w/ ROS for robotic perception in reinforcement learning.",
            "Researching reinforcement learning solutions for vertical manipulation on modular robots w/ NVIDIA IsaacSim.",
        ],
    },
    {
        role: "Research & Development Intern",
        company: "Cadre Research (Cadre Forensics)",
        url: "https://www.cadreforensics.com/",
        location: "Evanston, IL",
        date: "Jun 2025 – Aug 2025",
        summary: "Embedded systems for 3D virtual microscopy — low-power ESP32 PCBs, deterministic stepper control in C++, and an Azure HPC prototype that sped comparisons ~30%.",
        description: [
            "Conceptualized & developed automated motor rotation system for 3D Virtual Microscopy bullet scanning.",
            "Designed low-power ESP32 PCBs (<2mA) with wireless duplex IR comms and ISO 15693 RFID tray identification.",
            "Implemented time-deterministic stepper motor control in C++ to minimize bullet slippage.",
            "Developed an HPC prototype using Azure and KEDA, accelerating comparisons by ~30%.",
        ],
    },
    {
        role: "Software Lead & Team Captain",
        company: "Not Your Average Nerds Robotics (FTC)",
        url: "https://www.firstinspires.org/robotics/ftc",
        location: "Mundelein, IL",
        date: "Aug 2021 – May 2025",
        summary: "Led a World Championship Finalist team; Control Award Finalist for custom control-theory software libraries.",
        description: [
            "Led development of a library for intuitive control theory, optimizing I2C/UART communication.",
            "Designed physics-based subsystem modeling using state-space representation.",
            "Created an inverse-point-projection algorithm to translate 2D vision data to 3D.",
            "Showcased software to 15k+ industry professionals at Rockwell Industrial Automation Fair.",
            "Achievements: Control Award Finalist (World Championship), 3x Illinois State Champion.",
        ],
    }
];

export const projects = [
    {
        title: "Cartoon Creation Club",
        subtitle: "Roblox Game",
        tech: ["Luau", "Roblox Studio"],
        date: "Sep 2024 – Present",
        stats: "6M+ sessions · 175k+ players · Top 500 on Roblox",
        blurb: "Two Roblox games with scalable data persistence — zero data loss across 2M+ monthly users — grown through data-driven updates.",
        link: { label: "Play", href: "https://www.roblox.com/games/114162328499203/Find-the-Toons" },
        description: [
            "Released 2 games with 6M+ sessions and high monetary conversion.",
            "Built scalable data persistence with 0 data loss for 2M+ monthly users.",
            "Cultivated a community of 175k+ players through data-driven updates.",
            "Top 500 game on Roblox (Peak: 111k active players).",
        ],
    },
    {
        title: "OptiBox",
        subtitle: "High School Capstone",
        tech: ["Python", "C++", "Flask", "Raspberry Pi", "LiDAR"],
        date: "Aug 2024 – May 2025",
        stats: "~20% packaging volume reduction",
        blurb: "LiDAR-driven box sizing for measured payloads, with a real-time dashboard on Raspberry Pi.",
        description: [
            "Software to optimize cardboard box size for measured payloads using LiDAR (reduced volume by ~20%).",
            "Built a responsive dashboard on Raspberry Pi for real-time visualization and control.",
        ],
    },
];
